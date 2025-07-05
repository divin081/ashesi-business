'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { useEffect, useState } from "react"

interface Business {
  id: string
  name: string
  description: string
  image_url: string
  category: string
  year: number
  founder: string
  education: string
  location: string
  founded: string
  stage: string
  team_size: number
  achievements: string
}

export default function FeaturedBusiness() {
  const [business, setBusiness] = useState<Business | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedBusiness = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (error) throw error
        setBusiness(data)
      } catch (error) {
        console.error('Error fetching featured business:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedBusiness()
  }, [])

  if (isLoading) {
    return (
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Loading...</h2>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!business) {
    return null
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Business</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Check out our latest featured student business
            </p>
          </div>
          <Card className="w-full max-w-3xl">
            <CardHeader>
              <CardTitle>{business.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
                    <img
                      src={business.image_url}
                      alt={business.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Category: {business.category}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Founded: {business.founded}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location: {business.location}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-500 dark:text-gray-400">{business.description}</p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Founder: {business.founder}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Education: {business.education}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Stage: {business.stage}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Team Size: {business.team_size}</p>
                  </div>
                  <div className="flex justify-end">
                    <Link href={`/business/${business.id}`}>
                      <Button>Learn More</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
} 