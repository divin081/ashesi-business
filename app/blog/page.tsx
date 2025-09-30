"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import type { Post } from "@/lib/supabase"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// removed Badge import as hero style no longer uses it

export default function BlogListPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("posts")
          .select("id, title, slug, excerpt, cover_image_url, author, published, published_at, created_at")
          .eq("published", true)
          .order("published_at", { ascending: false })

        if (error) throw error
        setPosts((data || []) as Post[])
      } catch (err) {
        console.error("Error fetching posts", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="container mx-auto px-6 py-12">
      <section className="container px-4 md:px-6 mb-8 md:mb-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Blog</div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Insights, Updates & Stories
            </h1>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Stories about the businesses, and the entrepreneurs. Want to share a story? Contact the committee at:
              <a href="mailto:ascenterpreneurship@ashesi.edu.gh" className="ml-1 text-primary hover:text-primary/80">ascenterpreneurship@ashesi.edu.gh</a>
            </p>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-40 bg-muted animate-pulse" />
              <CardHeader>
                <div className="h-6 w-2/3 bg-muted animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-16 w-full bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-muted-foreground">No posts yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              {post.cover_image_url ? (
                <Link href={`/blog/${post.slug}`}>
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    width={800}
                    height={400}
                    className="h-40 w-full object-cover"
                  />
                </Link>
              ) : null}
              <CardHeader>
                <CardTitle className="line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </CardTitle>
                {post.excerpt ? (
                  <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                ) : null}
              </CardHeader>
              <CardFooter className="text-xs text-muted-foreground">
                {post.author ? <span className="mr-2">By {post.author}</span> : null}
                {post.published_at ? (
                  <time dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString()}
                  </time>
                ) : null}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


