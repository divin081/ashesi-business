"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Image } from "lucide-react"

export default function DashboardPage() {
  const [adminName, setAdminName] = useState("Admin")

  useEffect(() => {
    // In a real app, this would come from the user's profile
    // For now, we'll use a static name
    setAdminName("Admin")
  }, [])

  return (
    <div className="space-y-6 p-8 pt-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-xl text-muted-foreground">
          Welcome back, <span className="text-primary font-semibold">{adminName}</span>
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Business Management</h3>
              <p className="text-muted-foreground">
                You can add, edit, remove, and delete businesses. Manage all business listings and their information from the business section.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
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
      </div>
    </div>
  )
}

