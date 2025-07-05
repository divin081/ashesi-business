"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, Facebook, Twitter, Instagram, Linkedin, ExternalLink, X, MapPin, Calendar, GraduationCap, Briefcase, Users, Award, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from '@/lib/supabase'
import { toast } from "sonner"
import { Business } from "@/lib/supabase"

export default function BusinessPage() {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  
  const fetchBusinesses = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      if (!data) {
        console.error('No data returned from Supabase')
        throw new Error('No data returned')
      }

      setBusinesses(data)
    } catch (error) {
      console.error('Error fetching businesses:', error)
      toast.error('Failed to load businesses')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBusinesses()
  }, [])

  // Filter businesses based on search query and category
  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          business.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || business.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  // Get unique categories for filter
  const categories = ["all", ...new Set(businesses.map(business => business.category))]

  const openBusinessModal = (business: Business) => {
    setSelectedBusiness(business)
  }
  
  const closeBusinessModal = () => {
    setSelectedBusiness(null)
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

  return (
    <div className="flex flex-col gap-8 py-12">
      {/* Hero Section */}
      <section className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Student Businesses</div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Discover Ashesi Student Ventures
            </h1>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Explore innovative businesses founded by Ashesi students, showcasing creativity and entrepreneurial spirit.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <div className="relative w-full md:w-1/2">
            <Input
              type="text"
              placeholder="Search businesses..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Business Cards Grid */}
      <section className="container px-4 md:px-6">
        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">No businesses found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <Card
                key={business.id} 
                className="overflow-hidden backdrop-blur-lg bg-white/80 dark:bg-gray-950/80 border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
                onClick={() => openBusinessModal(business)}
              >
                <div className="aspect-video relative">
                  <Image
                    src={business.image_url || '/placeholder.svg'}
                    alt={business.name}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-2 right-2" style={{ backgroundColor: '#8B1111', color: 'white' }}>
                    {business.category}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle>{business.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline">{business.year}</Badge>
                    <Badge variant="outline">{business.founder}</Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    {business.social_media?.website && (
                      <Link href={business.social_media.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Globe className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    {business.social_media?.instagram && (
                      <Link href={business.social_media.instagram} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Instagram className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    {business.social_media?.linkedin && (
                      <Link href={business.social_media.linkedin} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Linkedin className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Business Detail Modal */}
      <Dialog open={!!selectedBusiness} onOpenChange={(open) => !open && closeBusinessModal()}>
        <DialogContent className="max-w-4xl p-0 h-[85vh] flex flex-col">
          {selectedBusiness && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Modal Header with Close Button */}
              <DialogHeader className="p-4 border-b flex-shrink-0">
                <DialogTitle className="text-2xl font-bold">{selectedBusiness.name}</DialogTitle>
              </DialogHeader>
              
              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                  {/* Left Column - Image and Basic Info */}
                  <div className="md:col-span-1 space-y-6">
                    <div className="aspect-square relative rounded-lg overflow-hidden">
                      <Image
                        src={selectedBusiness.image_url || '/placeholder.svg'}
                        alt={selectedBusiness.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-[#8B1111] text-white">{selectedBusiness.category}</Badge>
                        <Badge variant="outline">{selectedBusiness.year}</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Founder
                        </h3>
                        <p>{selectedBusiness.founder}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Education
                        </h3>
                        <p>{selectedBusiness.education}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location
                        </h3>
                        <p>{selectedBusiness.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Description and Details */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">About</h3>
                      <p className="text-muted-foreground">{selectedBusiness.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">Business Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Founded
                          </h4>
                          <p>{selectedBusiness.founded}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Business Stage
                          </h4>
                          <p>{selectedBusiness.stage}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Team Size
                          </h4>
                          <p>{selectedBusiness.team_size}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Achievements
                          </h4>
                          <p>{selectedBusiness.achievements}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">Connect</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedBusiness.social_media?.website && (
                          <Link href={selectedBusiness.social_media.website} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="gap-2" style={{ borderColor: '#8B1111', color: '#8B1111' }}>
                              <Globe className="h-4 w-4" />
                              Website
                            </Button>
                          </Link>
                        )}
                        {selectedBusiness.social_media?.instagram && (
                          <Link href={selectedBusiness.social_media.instagram} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="gap-2" style={{ borderColor: '#8B1111', color: '#8B1111' }}>
                              <Instagram className="h-4 w-4" />
                              Instagram
                            </Button>
                          </Link>
                        )}
                        {selectedBusiness.social_media?.linkedin && (
                          <Link href={selectedBusiness.social_media.linkedin} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="gap-2" style={{ borderColor: '#8B1111', color: '#8B1111' }}>
                              <Linkedin className="h-4 w-4" />
                              LinkedIn
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Sample business data
const businesses = [
  {
    id: 1,
    name: "EcoPack Solutions",
    description: "Sustainable packaging alternatives made from agricultural waste. Our innovative approach to packaging reduces environmental impact while providing cost-effective solutions for businesses. We've developed proprietary technology that transforms agricultural byproducts into durable, biodegradable packaging materials.",
    image: "/placeholder.svg?height=400&width=600",
    category: "Sustainability",
    year: "2022",
    founder: "Sarah Addo, BBA '22",
    education: "Bachelor of Business Administration, Ashesi University",
    location: "Accra, Ghana",
    founded: "January 2022",
    stage: "Early Stage",
    teamSize: "5 employees",
    achievements: "Winner of Ashesi Startup Challenge 2022, Featured in Ghana Business News",
    website: "https://example.com/ecopack",
    facebook: "https://facebook.com/ecopack",
    twitter: "https://twitter.com/ecopack",
    instagram: "https://instagram.com/ecopack",
    linkedin: "https://linkedin.com/company/ecopack"
  },
  {
    id: 2,
    name: "TechTutor",
    description: "Online tutoring platform connecting students with expert tutors. Our platform makes quality education accessible to students across Africa, offering personalized learning experiences in various subjects. We use AI to match students with the best tutors based on their learning style and needs.",
    image: "/placeholder.svg?height=400&width=600",
    category: "Education",
    year: "2021",
    founder: "Kwame Mensah, CS '21",
    education: "Bachelor of Science in Computer Science, Ashesi University",
    location: "Accra, Ghana",
    founded: "June 2021",
    stage: "Growth Stage",
    teamSize: "12 employees",
    achievements: "10,000+ active users, Featured in TechCrunch Africa",
    website: "https://example.com/techtutor",
    facebook: "https://facebook.com/techtutor",
    twitter: "https://twitter.com/techtutor",
    instagram: "https://instagram.com/techtutor",
    linkedin: "https://linkedin.com/company/techtutor"
  },
  {
    id: 3,
    name: "FarmFresh",
    description: "Direct farm-to-consumer produce delivery service. We connect local farmers with urban consumers, ensuring fresh produce reaches customers while farmers receive fair prices. Our platform includes real-time tracking, quality assurance, and sustainable packaging options.",
    image: "/placeholder.svg?height=400&width=600",
    category: "Agriculture",
    year: "2023",
    founder: "Abena Osei, BBA '23",
    education: "Bachelor of Business Administration, Ashesi University",
    location: "Kumasi, Ghana",
    founded: "March 2023",
    stage: "Early Stage",
    teamSize: "8 employees",
    achievements: "Partnered with 50+ local farms, Featured in Ghana Food Network",
    website: "https://example.com/farmfresh",
    facebook: "https://facebook.com/farmfresh",
    twitter: "https://twitter.com/farmfresh",
    instagram: "https://instagram.com/farmfresh",
    linkedin: "https://linkedin.com/company/farmfresh"
  },
  {
    id: 4,
    name: "HealthTrack",
    description: "Mobile app for managing chronic health conditions. Our comprehensive health management platform helps patients track symptoms, medications, and appointments while connecting them with healthcare providers. The app includes features for medication reminders, symptom tracking, and telemedicine consultations.",
    image: "/placeholder.svg?height=400&width=600",
    category: "Healthcare",
    year: "2022",
    founder: "David Kofi, MIS '22",
    education: "Bachelor of Science in Management Information Systems, Ashesi University",
    location: "Accra, Ghana",
    founded: "September 2022",
    stage: "Growth Stage",
    teamSize: "15 employees",
    achievements: "20,000+ downloads, Partnered with 5 major hospitals",
    website: "https://example.com/healthtrack",
    facebook: "https://facebook.com/healthtrack",
    twitter: "https://twitter.com/healthtrack",
    instagram: "https://instagram.com/healthtrack",
    linkedin: "https://linkedin.com/company/healthtrack"
  },
  {
    id: 5,
    name: "ArtisanHub",
    description: "Marketplace for Ghanaian artisans to sell their crafts globally. Our platform connects traditional artisans with international buyers, preserving cultural heritage while creating economic opportunities. We handle logistics, quality control, and marketing to help artisans reach a global audience.",
    image: "/placeholder.svg?height=400&width=600",
    category: "E-commerce",
    year: "2021",
    founder: "Grace Ayew, BBA '21",
    education: "Bachelor of Business Administration, Ashesi University",
    location: "Cape Coast, Ghana",
    founded: "April 2021",
    stage: "Growth Stage",
    teamSize: "10 employees",
    achievements: "Featured in Vogue Africa, 1,000+ artisans onboarded",
    website: "https://example.com/artisanhub",
    facebook: "https://facebook.com/artisanhub",
    twitter: "https://twitter.com/artisanhub",
    instagram: "https://instagram.com/artisanhub",
    linkedin: "https://linkedin.com/company/artisanhub"
  },
  {
    id: 6,
    name: "CleanEnergy Solutions",
    description: "Affordable solar solutions for rural communities. We design and distribute solar-powered products specifically for off-grid communities, including home lighting systems, water pumps, and small appliances. Our pay-as-you-go model makes clean energy accessible to low-income households.",
    image: "/placeholder.svg?height=400&width=600",
    category: "Energy",
    year: "2022",
    founder: "Emmanuel Boateng, Engineering '22",
    education: "Bachelor of Science in Engineering, Ashesi University",
    location: "Tamale, Ghana",
    founded: "July 2022",
    stage: "Early Stage",
    teamSize: "7 employees",
    achievements: "5,000+ households served, Winner of Ghana Energy Innovation Award",
    website: "https://example.com/cleanenergy",
    facebook: "https://facebook.com/cleanenergy",
    twitter: "https://twitter.com/cleanenergy",
    instagram: "https://instagram.com/cleanenergy",
    linkedin: "https://linkedin.com/company/cleanenergy"
  },
  {
    id: 7,
    name: "EduTech Africa",
    description: "Digital learning platform for African students. Our comprehensive e-learning platform offers courses in STEM subjects, business skills, and languages, tailored to African curricula. We use gamification and adaptive learning to engage students and improve educational outcomes.",
    image: "/placeholder.svg?height=400&width=600",
    category: "Education",
    year: "2023",
    founder: "Nana Addo, CS '23",
    education: "Bachelor of Science in Computer Science, Ashesi University",
    location: "Accra, Ghana",
    founded: "January 2023",
    stage: "Early Stage",
    teamSize: "6 employees",
    achievements: "Partnered with 10 schools, 5,000+ student users",
    website: "https://example.com/edutech",
    facebook: "https://facebook.com/edutech",
    twitter: "https://twitter.com/edutech",
    instagram: "https://instagram.com/edutech",
    linkedin: "https://linkedin.com/company/edutech"
  },
  {
    id: 8,
    name: "GreenWaste",
    description: "Waste management and recycling solutions for urban areas. Our innovative approach to waste management includes smart bins, collection services, and recycling facilities. We've developed a mobile app that helps users track their waste generation and earn rewards for recycling.",
    image: "/placeholder.svg?height=400&width=600",
    category: "Sustainability",
    year: "2021",
    founder: "Kofi Mensah, BBA '21",
    education: "Bachelor of Business Administration, Ashesi University",
    location: "Accra, Ghana",
    founded: "August 2021",
    stage: "Growth Stage",
    teamSize: "14 employees",
    achievements: "Processed 100+ tons of waste, Featured in Ghana Environmental Report",
    website: "https://example.com/greenwaste",
    facebook: "https://facebook.com/greenwaste",
    twitter: "https://twitter.com/greenwaste",
    instagram: "https://instagram.com/greenwaste",
    linkedin: "https://linkedin.com/company/greenwaste"
  },
  {
    id: 9,
    name: "AgriTech Solutions",
    description: "Technology solutions for farmers to improve crop yields. Our platform combines IoT sensors, data analytics, and mobile apps to help farmers monitor soil conditions, weather patterns, and crop health. We provide actionable insights to optimize irrigation, fertilization, and pest control.",
    image: "/placeholder.svg?height=400&width=600",
    category: "Agriculture",
    year: "2022",
    founder: "Ama Sarpong, MIS '22",
    education: "Bachelor of Science in Management Information Systems, Ashesi University",
    location: "Kumasi, Ghana",
    founded: "May 2022",
    stage: "Early Stage",
    teamSize: "9 employees",
    achievements: "Supported 200+ farmers, 30% average yield increase reported",
    website: "https://example.com/agritech",
    facebook: "https://facebook.com/agritech",
    twitter: "https://twitter.com/agritech",
    instagram: "https://instagram.com/agritech",
    linkedin: "https://linkedin.com/company/agritech"
  }
]

