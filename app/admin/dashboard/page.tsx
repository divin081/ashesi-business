"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Image, Users, BookOpen, Calendar, Award } from "lucide-react"
import { createClient } from '@/lib/supabase'
import Link from "next/link"

interface DashboardStats {
  businesses: number
  committeeMembers: number
  galleryImages: number
  recentBusinesses: number
  publishedPosts: number
}

export default function DashboardPage() {
  const [adminName, setAdminName] = useState("Admin")
  const [stats, setStats] = useState<DashboardStats>({
    businesses: 0,
    committeeMembers: 0,
    galleryImages: 0,
    recentBusinesses: 0,
    publishedPosts: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClient()
        
        // Fetch businesses count
        const { count: businessesCount } = await supabase
          .from('businesses')
          .select('*', { count: 'exact', head: true })

        // Fetch committee members count
        const { count: committeeCount } = await supabase
          .from('committee_members')
          .select('*', { count: 'exact', head: true })

        // Fetch gallery images count
        const { count: galleryCount } = await supabase
          .from('gallery_images')
          .select('*', { count: 'exact', head: true })

        // Fetch recent businesses (last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        
        const { count: recentBusinessesCount } = await supabase
          .from('businesses')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', thirtyDaysAgo.toISOString())

        // Fetch published posts count
        const { count: publishedPostsCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('published', true)

        setStats({
          businesses: businessesCount || 0,
          committeeMembers: committeeCount || 0,
          galleryImages: galleryCount || 0,
          recentBusinesses: recentBusinessesCount || 0,
          publishedPosts: publishedPostsCount || 0
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6 p-8 pt-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-xl text-muted-foreground">
          Welcome back, <span className="text-primary font-semibold">{adminName}</span>
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.businesses}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.recentBusinesses} added this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Committee Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.committeeMembers}
            </div>
            <p className="text-xs text-muted-foreground">
              Active committee members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gallery Images</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.galleryImages}
            </div>
            <p className="text-xs text-muted-foreground">
              Total images in gallery
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.publishedPosts}
            </div>
            <p className="text-xs text-muted-foreground">
              Visible on the public blog
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid mt-12 gap-6 md:grid-cols-3">
        <Link href="/admin/business" className="block">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Business Management</h3>
                <p className="text-muted-foreground">
                 Manage all business listings and their information from the business section.
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/admin/gallery" className="block">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Gallery Management</h3>
                <p className="text-muted-foreground">
                  Add new images, remove existing ones, and manage image information in the gallery section.
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/admin/committee" className="block">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Committee Management</h3>
                <p className="text-muted-foreground">
                  Manage committee members, add new members, and update committee information.
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}

