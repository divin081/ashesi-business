"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Image, Settings, LogOut, Users } from "lucide-react"

const navigation = [
  {
    name: "Business",
    href: "/admin/business",
    icon: LayoutDashboard
  },
  {
    name: "Committee",
    href: "/admin/committee",
    icon: Users
  },
  {
    name: "Gallery",
    href: "/admin/gallery",
    icon: Image
  }
]

export function AdminNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/admin/login")
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background px-4">
      <div className="flex h-14 items-center border-b">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="text-lg font-semibold">Admin Dashboard</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  isActive && "bg-secondary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>
      <div className="border-t py-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}

