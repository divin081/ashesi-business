import { NextResponse } from "next/server"
import { createServerComponentClient } from "@/lib/supabase-server"

export async function POST(req: Request) {
  const supabase = createServerComponentClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const {
    title,
    slug,
    excerpt,
    content,
    cover_image_url,
    author,
    published,
    published_at,
  } = body

  if (!title || !slug || !content) {
    return NextResponse.json({ error: "title, slug and content are required" }, { status: 400 })
  }

  const { data, error } = await supabase.from("posts").insert({
    title,
    slug,
    excerpt: excerpt || null,
    content,
    cover_image_url: cover_image_url || null,
    author: author || null,
    published: !!published,
    published_at: published ? (published_at || new Date().toISOString()) : null,
  }).select("id").single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ id: data.id }, { status: 201 })
}


