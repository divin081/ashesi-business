import { notFound } from "next/navigation"
import Image from "next/image"
import { createServerComponentClient } from "@/lib/supabase-server"
import type { Post } from "@/lib/supabase"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const supabase = createServerComponentClient()

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, content, cover_image_url, author, published, published_at, created_at")
    .eq("slug", slug)
    .eq("published", true)
    .single<Post>()

  if (error || !data) return notFound()

  const post = data

  return (
    <article className="container mx-auto px-6 py-12 prose prose-neutral dark:prose-invert max-w-3xl">
      <header className="mb-6">
        <h1 className="mb-2 text-4xl font-bold leading-tight">{post.title}</h1>
        <p className="text-muted-foreground">
          {post.author ? <span className="mr-2">By {post.author}</span> : null}
          {post.published_at ? (
            <time dateTime={post.published_at}>{new Date(post.published_at).toLocaleDateString()}</time>
          ) : null}
        </p>
      </header>

      {post.cover_image_url ? (
        <div className="my-6">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            width={1200}
            height={600}
            className="h-auto w-full rounded-md object-cover"
            priority
          />
        </div>
      ) : null}

      <section>
        {/* Content assumed to be markdown/plaintext for now */}
        <div className="whitespace-pre-wrap leading-relaxed">{post.content}</div>
      </section>
    </article>
  )
}


