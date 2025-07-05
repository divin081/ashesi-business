'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative">
      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Discover Student
              <br />
              Businesses at <span className="relative inline-block">
                <span className="relative z-10">Ashesi University</span>
                <span className="absolute inset-x-0 bottom-2 h-6 bg-[#FFB6C1]/50 -rotate-2"></span>
              </span>.
            </h1>
            <p className="mx-auto max-w-[700px] text-lg md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Explore innovative ventures and startups founded by Ashesi University students, showcasing the entrepreneurial spirit and creativity of our student body.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link href="/business">
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
                View All Businesses
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

