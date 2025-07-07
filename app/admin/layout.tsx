'use client'

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AdminNavigation } from "@/components/admin-navigation"
import { createClient } from '@/lib/supabase'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication...')
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Session:', session)
        setIsAuthenticated(!!session)
        
        // If not authenticated and not on auth page, set redirect flag
        if (!session && pathname !== "/admin/auth") {
          console.log('Not authenticated, setting redirect flag')
          setShouldRedirect(true)
        } else if (session) {
          console.log('Authenticated, staying on current page')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        // On error, allow access to auth page
        if (pathname !== "/admin/auth") {
          setShouldRedirect(true)
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [pathname, supabase])

  // Handle redirect in separate useEffect
  useEffect(() => {
    if (shouldRedirect) {
      //console.log('Redirecting to /admin/auth')
      router.push("/admin/auth")
      setShouldRedirect(false)
    }
  }, [shouldRedirect, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  // If on auth page, don't show navigation
  if (pathname === "/admin/auth") {
    //console.log('On auth page, showing login form')
    return <>{children}</>
  }

  // If not authenticated, show loading while redirecting
  if (!isAuthenticated) {
    //console.log('Not authenticated, showing redirect message')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Redirecting to login...</div>
      </div>
    )
  }

  //console.log('Showing admin layout with navigation')
  return (
    <div className="flex min-h-screen">
      <AdminNavigation />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
} 