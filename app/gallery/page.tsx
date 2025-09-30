"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import Masonry from "@/components/masonry"

interface GalleryImage {
  id: string
  url: string
  caption: string
  created_at: string
  Height: number
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchImages = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setImages(data || [])
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <section className="container px-4 md:px-6 mb-8 md:mb-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Gallery</div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Explore Our Visual Stories
            </h1>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Browse through our collection of innovative products and services created by Ashesi student entrepreneurs
            </p>
          </div>
        </div>
      </section>



      {/* Masonry Layout */}
      <div className="w-full min-h-[600px]"> {/* Dynamic height container for masonry */}
        <Masonry
          items={images.map((image) => ({
            id: image.id,
            img: image.url,
            url: image.url, // Add url for click functionality
            height: image.Height || 300, // Provide fallback height
          }))}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover={true}
          hoverScale={0.95}
          blurToFocus={true}
          colorShiftOnHover={false}
        />
      </div>
    </div>
  )
}

