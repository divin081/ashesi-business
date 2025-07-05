'use client'

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AdminNavigation } from "@/components/admin-navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check authentication on mount
    const authStatus = localStorage.getItem("isAuthenticated")
    const isAuth = authStatus === "true"
    setIsAuthenticated(isAuth)

    // Only redirect if not authenticated and not on login page
    if (!isAuth && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, []) // Remove pathname and router from dependencies

  // If on login page, don't show navigation
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      <AdminNavigation />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
} 