'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient, BusinessRegistration } from "@/lib/supabase"
import { toast } from "sonner"

export default function RegistrationPage() {
  const [registrations, setRegistrations] = useState<BusinessRegistration[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchRegistrations()
  }, [])

  async function fetchRegistrations() {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("business_registrations")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setRegistrations(data || [])
    } catch (error) {
      console.error("Error fetching registrations:", error)
      toast.error("Failed to load registrations")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleApproveRegistration(registration: BusinessRegistration) {
    if (!confirm("Approve this business and publish it?")) return

    setIsLoading(true)
    try {
      const supabase = createClient()

      const parsedYear = registration.year
        ? parseInt(registration.year, 10)
        : new Date().getFullYear()

      const { error: insertError } = await supabase.from("businesses").insert([
        {
          name: registration.name,
          category: registration.category ?? "",
          year: parsedYear,
          founder: registration.founder,
          phone: registration.phone ?? "",
          email: registration.email,
          education: registration.education ?? "",
          location: registration.location ?? "",
          founded: registration.founded ?? "",
          stage: registration.stage ?? "",
          team_size: registration.team_size ?? "",
          achievements: registration.achievements ?? "",
          description: registration.description ?? "",
          image_url: registration.image_url ?? "",
          social_media: registration.social_media ?? {},
        },
      ])

      if (insertError) throw insertError

      const { error: updateError } = await supabase
        .from("business_registrations")
        .update({ status: "approved" })
        .eq("id", registration.id)

      if (updateError) throw updateError

      // Fire-and-forget email notification to the registrant (approved)
      try {
        await fetch("/api/registration/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: registration.email,
            businessName: registration.name,
            founder: registration.founder,
            status: "approved",
          }),
        })
      } catch (emailError) {
        console.error("Failed to send approval email:", emailError)
      }

      toast.success("Business approved and published")
      fetchRegistrations()
    } catch (error) {
      console.error("Error approving registration:", error)
      toast.error("Failed to approve registration")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeclineRegistration(id: string) {
    if (!confirm("Decline this registration?")) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("business_registrations")
        .update({ status: "rejected" })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      // Fire-and-forget rejection email if we have the row
      if (data?.email && data?.name) {
        try {
          await fetch("/api/registration/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: data.email,
              businessName: data.name,
              founder: data.founder,
              status: "rejected",
            }),
          })
        } catch (emailError) {
          console.error("Failed to send rejection email:", emailError)
        }
      }

      toast.success("Registration declined")
      fetchRegistrations()
    } catch (error) {
      console.error("Error declining registration:", error)
      toast.error("Failed to decline registration")
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  const pending = registrations.filter((r) => r.status === "pending")
  const history = registrations.filter((r) => r.status !== "pending")

  return (
    <div className="space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Business Registrations</h2>
      </div>

      {/* Pending registrations */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold tracking-tight">Pending</h3>
        {pending.length === 0 ? (
          <div className="text-muted-foreground">No pending registrations.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pending.map((registration) => (
              <Card key={registration.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold">
                    {registration.name}
                  </CardTitle>
                  {registration.category && (
                    <Badge className="mt-1 w-fit">{registration.category}</Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">
                    <strong>Founder:</strong> {registration.founder}
                  </p>
                  <p className="text-sm">
                    <strong>Email:</strong> {registration.email}
                  </p>
                  {registration.phone && (
                    <p className="text-sm">
                      <strong>Phone:</strong> {registration.phone}
                    </p>
                  )}
                  {registration.year && (
                    <p className="text-sm">
                      <strong>Year Group:</strong> {registration.year}
                    </p>
                  )}
                  {registration.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {registration.description}
                    </p>
                  )}
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => handleDeclineRegistration(registration.id)}
                    >
                      Decline
                    </Button>
                    <Button onClick={() => handleApproveRegistration(registration)}>
                      Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Registration history */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold tracking-tight">History</h3>
        {history.length === 0 ? (
          <div className="text-muted-foreground">No past registrations yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Founder</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((registration) => (
                <TableRow key={registration.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{registration.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {registration.category}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{registration.founder}</TableCell>
                  <TableCell>{registration.email}</TableCell>
                  <TableCell>{registration.phone || "-"}</TableCell>
                  <TableCell>{registration.year || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        registration.status === "approved" ? "default" : "secondary"
                      }
                      className="capitalize"
                    >
                      {registration.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  )
}


