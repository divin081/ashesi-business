"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

interface GalleryImage {
  id: string
  url: string
  caption: string
  created_at: string
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
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <span className="inline-block px-4 py-2 bg-gray-50 rounded-full text-gray-900 text-sm font-medium mb-4">
          Student Businesses
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-[64px] font-bold leading-tight mb-6">
          Discover Ashesi Student Ventures
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-16">
        Explore our collection of memorable moments and achievements at Ashesi University
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="group relative aspect-[3/4] overflow-hidden rounded-lg">
            {/* Front side - Black and white image */}
            <div className="absolute inset-0 transition-transform duration-700 group-hover:[transform:rotateY(180deg)]">
              <div className="h-full w-full">
                <img
                  src={image.url}
                  alt={image.caption}
                  className="h-full w-full object-cover grayscale transition-all duration-700"
                />
              </div>
            </div>

            {/* Back side - Description */}
            <div 
              className="absolute inset-0 [transform:rotateY(-180deg)] [backface-visibility:hidden] transition-transform duration-700 group-hover:[transform:rotateY(0deg)]"
              style={{ 
                backgroundImage: `url(${image.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="flex h-full w-full flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                <h3 className="text-xl font-bold text-white mb-2">{image.caption}</h3>
                <p className="text-sm text-gray-200">
                  {new Date(image.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

