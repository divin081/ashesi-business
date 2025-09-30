"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import type { Post } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image_url: "",
    author: "",
    published: false,
  })

  const supabase = createClient()

  const loadPosts = async () => {
    setIsLoading(true)
    const { data } = await supabase
      .from("posts")
      .select("id, title, slug, excerpt, author, published, published_at, created_at")
      .order("created_at", { ascending: false })
    setPosts((data || []) as Post[])
    setIsLoading(false)
  }

  useEffect(() => {
    loadPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreate = async () => {
    const { error } = await supabase.from("posts").insert({
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      cover_image_url: form.cover_image_url || null,
      author: form.author || null,
      published: form.published,
      published_at: form.published ? new Date().toISOString() : null,
    })
    if (!error) {
      setForm({ title: "", slug: "", excerpt: "", content: "", cover_image_url: "", author: "", published: false })
      loadPosts()
    }
  }

  const handleDelete = async (id: string) => {
    await supabase.from("posts").delete().eq("id", id)
    loadPosts()
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Manage Blog</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
          </div>
          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea id="excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" className="min-h-[160px]" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cover">Cover Image URL</Label>
              <Input id="cover" value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input id="author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="published" checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
            <Label htmlFor="published">Published</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreate}>Create Post</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : posts.length === 0 ? (
            <div className="text-sm text-muted-foreground">No posts yet.</div>
          ) : (
            <div className="space-y-2">
              {posts.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-md border p-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{p.title}</div>
                    <div className="truncate text-xs text-muted-foreground">/{p.slug}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" asChild>
                      <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer">View</a>
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(p.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


