"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Award, BookOpen, GraduationCap, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Business } from "@/lib/supabase"
import HeroSection from '@/components/hero-section'
import TestimonialSection from "@/components/testimonial-section"
import BusinessCarousel from "@/components/business-carousel"

export default function HomePage() {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [businesses, setBusinesses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registration, setRegistration] = useState({
    name: "",
    category: "",
    year: "",
    founder: "",
    email: "",
    phone: "",
    education: "",
    location: "",
    founded: "",
    stage: "",
    team_size: "",
    achievements: "",
    description: "",
    image_url: "",
    social_media: {
      website: "",
      instagram: "",
      linkedin: "",
    },
  })

  const fetchBusinesses = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) throw error
      setBusinesses(data || [])
    } catch (error) {
      console.error('Error fetching businesses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBusinesses()
  }, [])

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!registration.email.includes("@ashesi.edu")) {
      toast.error("Please use your @ashesi.edu email address")
      return
    }

    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("business_registrations").insert([
        {
          name: registration.name,
          category: registration.category,
          year: registration.year,
          founder: registration.founder,
          email: registration.email,
          phone: registration.phone,
          education: registration.education,
          location: registration.location,
          founded: registration.founded,
          stage: registration.stage,
          team_size: registration.team_size,
          achievements: registration.achievements,
          description: registration.description,
          image_url: registration.image_url,
          social_media: {
            website: registration.social_media.website || null,
            instagram: registration.social_media.instagram || null,
            linkedin: registration.social_media.linkedin || null,
          },
        },
      ])

      if (error) throw error

      toast.success("Registration submitted! The committee will review your business soon.")
      setIsRegisterOpen(false)
      setRegistration({
        name: "",
        category: "",
        year: "",
        founder: "",
        email: "",
        phone: "",
        education: "",
        location: "",
        founded: "",
        stage: "",
        team_size: "",
        achievements: "",
        description: "",
        image_url: "",
        social_media: {
          website: "",
          instagram: "",
          linkedin: "",
        },
      })
    } catch (error) {
      console.error("Error submitting registration:", error)
      toast.error("Failed to submit registration")
    } finally {
      setIsSubmitting(false)
    }
  }

  //if (isLoading) {
   // return <div>Loading...</div>
  //}

  return (
    <div className="flex flex-col gap-16 pb-16">
      <HeroSection />

      {/* About Section */}
      <section className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">About Businesses in Ashesi University</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Supporting Student Entrepreneurship
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              The Ashesi Entrepreneur Centre and Entrepreneurship Committee work together to nurture student businesses through comprehensive support including seed funding, mentorship from industry experts, business development workshops, and networking opportunities. Our ecosystem has helped launch over 50 student ventures, with many receiving additional funding from external investors.
            </p>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-xl p-6">
            <Image
              src="/ashesilogo.webp"
              fill
              alt="Ashesi Entrepreneur Centre"
              priority
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Featured Businesses Section */}
      <BusinessCarousel businesses={businesses} />

      {/* Stats Section */}
      <section className="bg-muted/50 py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center justify-center space-y-2 text-center">
                <div className="text-3xl font-bold sm:text-4xl md:text-5xl">{stat.value}</div>
                <div className="text-sm font-medium text-muted-foreground md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSection />

      {/* CTA Section */}
      <section className="container px-4 md:px-6">
        <div className="rounded-xl backdrop-blur-lg bg-primary/10 border border-primary/20 p-6 md:p-10 relative overflow-hidden">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Register Your Student Business
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join our growing ecosystem of student entrepreneurs and access funding, mentorship, and resources to help your business thrive.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row ">
                <Button size="lg" onClick={() => setIsRegisterOpen(true)}>
                  Register Now
                </Button>
              </div>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-xl p-1">
              <Image
                src="/ASC-LOGO.webp"
                fill
                alt="Ashesi Student Entrepreneurs"
                className="object-contain absolute inset-0"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Business registration dialog */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register Your Business</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRegistrationSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name">Business Name</Label>
                <Input
                  id="reg-name"
                  value={registration.name}
                  onChange={(e) => setRegistration((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-category">Category</Label>
                <Input
                  id="reg-category"
                  value={registration.category}
                  onChange={(e) => setRegistration((prev) => ({ ...prev, category: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-year">Year Group</Label>
                <Input
                  id="reg-year"
                  type="number"
                  value={registration.year}
                  onChange={(e) => setRegistration((prev) => ({ ...prev, year: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-founder">Founder</Label>
                <Input
                  id="reg-founder"
                  value={registration.founder}
                  onChange={(e) => setRegistration((prev) => ({ ...prev, founder: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Ashesi Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={registration.email}
                  onChange={(e) => setRegistration((prev) => ({ ...prev, email: e.target.value }))}
                  required
                  placeholder="you@ashesi.edu.gh"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-phone">Phone</Label>
                <Input
                  id="reg-phone"
                  type="tel"
                  value={registration.phone}
                  onChange={(e) => setRegistration((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-education">Education</Label>
                <Input
                  id="reg-education"
                  value={registration.education}
                  onChange={(e) => setRegistration((prev) => ({ ...prev, education: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-location">Location</Label>
                <Input
                  id="reg-location"
                  value={registration.location}
                  onChange={(e) => setRegistration((prev) => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-founded">Founded (Year)</Label>
                <Input
                  id="reg-founded"
                  value={registration.founded}
                  onChange={(e) => setRegistration((prev) => ({ ...prev, founded: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-stage">Business Stage</Label>
                <Input
                  id="reg-stage"
                  value={registration.stage}
                  onChange={(e) => setRegistration((prev) => ({ ...prev, stage: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-team-size">Team Size</Label>
                <Input
                  id="reg-team-size"
                  value={registration.team_size}
                  onChange={(e) => setRegistration((prev) => ({ ...prev, team_size: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-achievements">Achievements</Label>
                <Input
                  id="reg-achievements"
                  value={registration.achievements}
                  onChange={(e) => setRegistration((prev) => ({ ...prev, achievements: e.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="reg-image-url">Image URL</Label>
                <Input
                  id="reg-image-url"
                  type="url"
                  value={registration.image_url}
                  onChange={(e) => setRegistration((prev) => ({ ...prev, image_url: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-description">Business Description</Label>
              <Textarea
                id="reg-description"
                value={registration.description}
                onChange={(e) => setRegistration((prev) => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reg-website">Website</Label>
                <Input
                  id="reg-website"
                  type="url"
                  value={registration.social_media.website}
                  onChange={(e) =>
                    setRegistration((prev) => ({
                      ...prev,
                      social_media: { ...prev.social_media, website: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-instagram">Instagram</Label>
                <Input
                  id="reg-instagram"
                  type="url"
                  value={registration.social_media.instagram}
                  onChange={(e) =>
                    setRegistration((prev) => ({
                      ...prev,
                      social_media: { ...prev.social_media, instagram: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-linkedin">LinkedIn</Label>
                <Input
                  id="reg-linkedin"
                  type="url"
                  value={registration.social_media.linkedin}
                  onChange={(e) =>
                    setRegistration((prev) => ({
                      ...prev,
                      social_media: { ...prev.social_media, linkedin: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsRegisterOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Existing business details dialog */}
      <Dialog open={!!selectedBusiness} onOpenChange={() => setSelectedBusiness(null)}>
        <DialogContent className="h-[85vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{selectedBusiness?.name}</DialogTitle>
          </DialogHeader>
          <div className="overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              {selectedBusiness && (
                <div className="grid gap-6">
                  <img
                    src={selectedBusiness.image_url}
                    alt={selectedBusiness.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="grid gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">About the Business</h3>
                      <p className="text-gray-600">{selectedBusiness.description}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Founder</h3>
                      <p className="text-gray-600">{selectedBusiness.founder}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Education</h3>
                      <p className="text-gray-600">{selectedBusiness.education}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Location</h3>
                      <p className="text-gray-600">{selectedBusiness.location}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Founded</h3>
                      <p className="text-gray-600">{selectedBusiness.founded}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Business Stage</h3>
                      <p className="text-gray-600">{selectedBusiness.stage}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Team Size</h3>
                      <p className="text-gray-600">{selectedBusiness.team_size}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Achievements</h3>
                      <p className="text-gray-600">{selectedBusiness.achievements}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Connect</h3>
                      <div className="flex gap-4">
                        {selectedBusiness.social_media?.website && (
                          <a
                            href={selectedBusiness.social_media.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Website
                          </a>
                        )}
                        {selectedBusiness.social_media?.instagram && (
                          <a
                            href={selectedBusiness.social_media.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Instagram
                          </a>
                        )}
                        {selectedBusiness.social_media?.linkedin && (
                          <a
                            href={selectedBusiness.social_media.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const stats = [
  { value: "50+", label: "Student Ventures Launched" },
  { value: "10%", label: "of Ashesi students start businesses within a year of graduation" },
  { value: "$900,000", label: "in funding raised by Ashesi Venture Incubator fellows since 2019" },
  { value: "$1,500,000", label: "in revenue generated by Entrepreneurship Centre startups since 2019" },
]

