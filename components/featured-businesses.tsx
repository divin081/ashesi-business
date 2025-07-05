'use client'

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"

export default function FeaturedBusinesses() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= featuredBusinesses.length ? 0 : prevIndex + 1
    )
  }
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? featuredBusinesses.length - 1 : prevIndex - 1
    )
  }
  
  // Auto-slide every 3 seconds by clicking the next button
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        // Simulate clicking the next button
        if (nextButtonRef.current) {
          nextButtonRef.current.click()
        }
      }, 3000)
    }
    
    // Clean up the interval when component unmounts
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPaused])
  
  // Show 3 businesses at a time on larger screens
  const visibleBusinesses = featuredBusinesses.slice(
    currentIndex, 
    currentIndex + 3
  ).concat(
    currentIndex + 3 > featuredBusinesses.length 
      ? featuredBusinesses.slice(0, 3 - (featuredBusinesses.length - currentIndex)) 
      : []
  )
  
  return (
    <section className="container px-4 md:px-6 py-12">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
        <div className="space-y-2">
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Featured Businesses</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Student Ventures at Ashesi
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Discover innovative businesses founded by Ashesi students, showcasing creativity and entrepreneurial spirit.
          </p>
        </div>
      </div>
      
      <div 
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {/* Left navigation button */}
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-white dark:bg-gray-950 shadow-md"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {/* Right navigation button */}
          <Button 
            ref={nextButtonRef}
            variant="outline" 
            size="icon" 
            className="rounded-full absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white dark:bg-gray-950 shadow-md"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {visibleBusinesses.map((business, index) => (
            <Card key={index} className="overflow-hidden backdrop-blur-lg bg-white/80 dark:bg-gray-950/80 border-0 shadow-lg">
              <div className="aspect-video relative">
                <Image
                  src={business.image}
                  alt={business.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">{business.name}</h3>
                <p className="text-sm text-muted-foreground">{business.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {business.category}
                  </span>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">
                    {business.founder}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-6 gap-2">
          {featuredBusinesses.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-primary" : "bg-muted"
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

const featuredBusinesses = [
  {
    name: "EcoPack Solutions",
    description: "Sustainable packaging alternatives made from agricultural waste",
    image: "/placeholder.svg?height=400&width=600",
    category: "Sustainability",
    founder: "Sarah Addo, BBA '22"
  },
  {
    name: "TechTutor",
    description: "Online tutoring platform connecting students with expert tutors",
    image: "/placeholder.svg?height=400&width=600",
    category: "Education",
    founder: "Kwame Mensah, CS '21"
  },
  {
    name: "FarmFresh",
    description: "Direct farm-to-consumer produce delivery service",
    image: "/placeholder.svg?height=400&width=600",
    category: "Agriculture",
    founder: "Abena Osei, BBA '23"
  },
  {
    name: "HealthTrack",
    description: "Mobile app for managing chronic health conditions",
    image: "/placeholder.svg?height=400&width=600",
    category: "Healthcare",
    founder: "David Kofi, MIS '22"
  },
  {
    name: "ArtisanHub",
    description: "Marketplace for Ghanaian artisans to sell their crafts globally",
    image: "/placeholder.svg?height=400&width=600",
    category: "E-commerce",
    founder: "Grace Ayew, BBA '21"
  },
  {
    name: "CleanEnergy Solutions",
    description: "Affordable solar solutions for rural communities",
    image: "/placeholder.svg?height=400&width=600",
    category: "Energy",
    founder: "Emmanuel Boateng, Engineering '22"
  }
] 