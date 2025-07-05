'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import Link from "next/link"

interface Business {
  id: string
  name: string
  category: string
  image_url: string
}

export function AnimatedHero() {
  const [text, setText] = useState('')
  const [showCarousel, setShowCarousel] = useState(false)
  const fullText = 'Discover Student\nBusinesses at '

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setShowCarousel(true)
        }, 1000)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-[80vh] md:h-screen w-full">
      <AnimatePresence>
        {!showCarousel ? (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center px-4"
          >
            <div className="text-center space-y-4 max-w-[90%] md:max-w-[80%] lg:max-w-[1200px]">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight whitespace-pre-line">
                {text}
                <span className="relative inline-block">
                  Ashesi University
                  <span className="absolute inset-0 bg-[#ffd6e0] -z-10 transform skew-x-12" />
                </span>
                <span className="text-black">.</span>
                <span className="animate-pulse">|</span>
              </h1>
            </div>
          </motion.div>
        ) : (
          <BusinessCarousel />
        )}
      </AnimatePresence>
    </div>
  )
}

function BusinessCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [businesses, setBusinesses] = useState<Business[]>([])

  useEffect(() => {
    const fetchBusinesses = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('businesses').select('*')
      if (data) setBusinesses(data)
    }
    fetchBusinesses()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % businesses.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [businesses.length])

  if (businesses.length === 0) return null

  return (
    <div className="relative h-full w-full">
      <div className="absolute right-4 top-4 z-10">
        <Link href="/business">
          <Button variant="default" size="lg" className="text-sm md:text-base">
            View All Businesses
          </Button>
        </Link>
      </div>
      <div className="flex items-center justify-center h-full px-4">
        <div className="relative w-full max-w-4xl h-[60vh] md:h-96">
          {businesses.map((business, index) => (
            <motion.div
              key={index}
              className="absolute w-full h-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: index === currentIndex ? 1 : 0,
                scale: index === currentIndex ? 1 : 0.8,
              }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={business.image_url}
                alt={business.name}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                <h3 className="text-white text-lg md:text-xl font-semibold">{business.name}</h3>
                <p className="text-white/80 text-xs md:text-sm">{business.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {businesses.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-primary' : 'bg-muted'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
} 