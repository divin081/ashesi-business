import { NextResponse } from "next/server"
import { createServerComponentClient } from "@/lib/supabase-server"

interface Params {
  params: Promise<{ id: string }>
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params
  const supabase = createServerComponentClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const update: Record<string, any> = {}

  for (const key of [
    "title",
    "slug",
    "excerpt",
    "content",
    "cover_image_url",
    "author",
    "published",
    "published_at",
  ]) {
    if (key in body) update[key] = body[key]
  }

  if ("published" in update && update.published === true && !update.published_at) {
    update.published_at = new Date().toISOString()
  }

  const { error } = await supabase.from("posts").update(update).eq("id", id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = createServerComponentClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { error } = await supabase.from("posts").delete().eq("id", id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}


