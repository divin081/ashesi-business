"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  const navItems = [
    { name: "Business", path: "/business" },
    { name: "Gallery", path: "/gallery" },
    { name: "Enterpreneurship Committee", path: "/committee" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full p-4">
      <div className="container flex h-16 items-center justify-between px-8 rounded-full bg-white shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Image src="/ASC-LOGO.webp" alt="Ashesi Logo" width={60} height={60} className="object-contain" />
            <span className="text-xl font-bold">Business</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary/80",
                isActive(item.path) ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetTitle className="sr-only">Main Menu</SheetTitle>
            <div className="flex flex-col gap-6 py-6">
              <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center gap-1">
                  <Image src="/ashesilogo.webp" alt="Ashesi Logo" width={32} height={32} className="object-contain" />
                  <span className="text-xl font-bold">Business</span>
                </div>
              </Link>
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      isActive(item.path) ? "text-primary" : "text-muted-foreground",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
