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
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <span className="inline-block px-4 py-2 bg-gray-50 rounded-full text-gray-900 text-sm font-medium mb-4">
            Gallery Album
        </span>
        
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-16">
        Browse through our collection of innovative products and services created by Ashesi student entrepreneurs
        </p>
      </div>



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

