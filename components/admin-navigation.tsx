"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Image, Settings, LogOut, Users, BookOpen } from "lucide-react"
import { createClient } from "@/lib/supabase"

const navigation = [
  {
    name: "Business",
    href: "/admin/business",
    icon: LayoutDashboard
  },
  {
    name: "Gallery",
    href: "/admin/gallery",
    icon: Image
  },
  {
    name: "Committee",
    href: "/admin/committee",
    icon: Users
  },
  {
    name: "Blog",
    href: "/admin/blog",
    icon: BookOpen
  }
]

export function AdminNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin");
  }

  return (
    <div className="flex h-screen w-40 sm:w-64 flex-col border-r bg-background px-4">
      {/* Header with logo/title */}
      <div className="flex h-16 items-center border-b mb-2">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          {/* Optionally add a logo/icon here */}
          <span className="text-lg font-semibold">Admin Dashboard</span>
        </Link>
      </div>
      {/* Navigation links */}
      <nav className="flex-1 flex flex-col gap-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className="block">
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2 rounded-md px-3 py-2 text-base font-medium transition-colors",
                  isActive && "bg-secondary"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>
      {/* Logout button at the bottom */}
      <div className="border-t pt-4 pb-2 mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md px-3 py-2"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}

