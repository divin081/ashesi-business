'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Business } from "@/lib/supabase"

export default function BusinessCarousel({ businesses }: { businesses: Business[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prevIndex) => (prevIndex + 3) % businesses.length)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [businesses.length, isPaused])

  // Get current visible businesses (3 at a time)
  const visibleBusinesses = businesses.slice(currentIndex, currentIndex + 3)
  // If we don't have enough businesses to show, take from the beginning
  if (visibleBusinesses.length < 3) {
    visibleBusinesses.push(...businesses.slice(0, 3 - visibleBusinesses.length))
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
        <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm mb-2">Business</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Businesses</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover innovative ventures created by Ashesi's brightest entrepreneurs
          </p>
        </div>

        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {visibleBusinesses.map((business) => (
            <Link 
              href={`/business/${business.id}`}
              key={business.id}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
                <CardContent className="p-6">
                  <div className="aspect-[16/9] relative overflow-hidden rounded-lg mb-6">
                    <Image
                      src={business.image_url ?? "/placeholder.png"}
                      alt={business.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 hover:scale-110"
                      quality={95}
                      priority={true}
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{business.name}</h3>
                  <p className="text-base text-gray-600 mb-3">{business.category}</p>
                  <p className="text-base text-gray-500 line-clamp-3">{business.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: Math.ceil(businesses.length / 3) }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                Math.floor(currentIndex / 3) === index ? 'w-6 bg-primary' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(index * 3)}
            />
          ))}
        </div>
      </div>
    </section>
  )
} 