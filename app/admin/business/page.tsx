'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash } from "lucide-react"
import { createClient, Business } from "@/lib/supabase"
import { toast } from "sonner"
import { Textarea } from '@/components/ui/textarea'

interface FormData {
  name: string
  category: string
  year: string
  founder: string
  education: string
  location: string
  founded: string
  stage: string
  team_size: string
  achievements: string
  description: string
  image_url: string
  social_media: {
    website: string
    instagram: string
    linkedin: string
  }
}

export default function BusinessPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    year: '',
    founder: '',
    education: '',
    location: '',
    founded: '',
    stage: '',
    team_size: '',
    achievements: '',
    description: '',
    image_url: '',
    social_media: {
      website: '',
      instagram: '',
      linkedin: ''
    }
  })

  const supabase = createClient()

  useEffect(() => {
    fetchBusinesses()
  }, [])

  async function fetchBusinesses() {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBusinesses(data || [])
    } catch (error) {
      console.error('Error fetching businesses:', error)
      toast.error('Failed to load businesses')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      if (selectedBusiness) {
        // Update existing business
        const { data, error } = await supabase
          .from('businesses')
          .update({
            name: formData.name,
            category: formData.category,
            year: formData.year,
            founder: formData.founder,
            education: formData.education,
            location: formData.location,
            founded: formData.founded,
            stage: formData.stage,
            team_size: formData.team_size,
            achievements: formData.achievements,
            description: formData.description,
            image_url: formData.image_url,
            social_media: {
              website: formData.social_media.website || '',
              instagram: formData.social_media.instagram || '',
              linkedin: formData.social_media.linkedin || ''
            }
          })
          .eq('id', selectedBusiness.id)
          .select()

        if (error) throw error
        toast.success('Business updated successfully')
      } else {
        // Create new business
        const { data, error } = await supabase
          .from('businesses')
          .insert([{
            name: formData.name,
            category: formData.category,
            year: formData.year,
            founder: formData.founder,
            education: formData.education,
            location: formData.location,
            founded: formData.founded,
            stage: formData.stage,
            team_size: formData.team_size,
            achievements: formData.achievements,
            description: formData.description,
            image_url: formData.image_url,
            social_media: {
              website: formData.social_media.website || '',
              instagram: formData.social_media.instagram || '',
              linkedin: formData.social_media.linkedin || ''
            }
          }])
          .select()

        if (error) throw error
        if (!data) throw new Error('No data returned')
        toast.success('Business added successfully')
      }

      setIsAddModalOpen(false)
      setSelectedBusiness(null)
      resetForm()
      fetchBusinesses()
    } catch (error) {
      console.error('Error saving business:', error)
      toast.error(selectedBusiness ? 'Failed to update business' : 'Failed to add business')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this business?')) return

    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Business deleted successfully')
      fetchBusinesses()
    } catch (error) {
      console.error('Error deleting business:', error)
      toast.error('Failed to delete business')
    }
  }

  function resetForm() {
    setFormData({
      name: "",
      category: "",
      year: "",
      founder: "",
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
        linkedin: ""
      }
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    if (id.startsWith('social_media.')) {
      const socialKey = id.split('.')[1]
      setFormData(prev => ({
        ...prev,
        social_media: {
          ...prev.social_media,
          [socialKey]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [id]: value }))
    }
  }

  const handleSocialMediaChange = (field: keyof typeof formData.social_media, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_media: {
        ...prev.social_media,
        [field]: value || undefined
      }
    }))
  }

  const categories = ["Sustainability", "Education", "Agriculture", "Healthcare", "E-commerce", "Energy"]
  const years = ["2022", "2023", "2024", "2025"]
  const stages = ["Idea", "Early Stage", "Growth", "Mature"]

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Business Management</h2>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-primary text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Business
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {businesses.map((business) => (
          <Card key={business.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">{business.name}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedBusiness(business)
                    setFormData({
                      name: business.name,
                      category: business.category,
                      year: business.year.toString(),
                      founder: business.founder,
                      education: business.education || "",
                      location: business.location || "",
                      founded: business.founded || "",
                      stage: business.stage || "",
                      team_size: business.team_size || "",
                      achievements: business.achievements || "",
                      description: business.description,
                      image_url: business.image_url || "",
                      social_media: business.social_media || {}
                    })
                    setIsAddModalOpen(true)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(business.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge>{business.category}</Badge>
                <p className="text-sm text-muted-foreground">{business.description}</p>
                <div className="text-sm">
                  <p><strong>Founder:</strong> {business.founder}</p>
                  <p><strong>Year:</strong> {business.year}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={(open) => {
        setIsAddModalOpen(open)
        if (!open) {
          setSelectedBusiness(null)
          resetForm()
        }
      }}>
        <DialogContent className="max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedBusiness ? 'Edit Business' : 'Add New Business'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="founder">Founder</Label>
                <Input
                  id="founder"
                  value={formData.founder}
                  onChange={(e) => setFormData({ ...formData, founder: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="founded">Founded</Label>
                <Input
                  id="founded"
                  value={formData.founded}
                  onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage">Business Stage</Label>
                <Input
                  id="stage"
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team_size">Team Size</Label>
                <Input
                  id="team_size"
                  value={formData.team_size}
                  onChange={(e) => setFormData({ ...formData, team_size: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="achievements">Achievements</Label>
                <Input
                  id="achievements"
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.social_media.website}
                  onChange={(e) => setFormData({
                    ...formData,
                    social_media: { ...formData.social_media, website: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  type="url"
                  value={formData.social_media.instagram}
                  onChange={(e) => setFormData({
                    ...formData,
                    social_media: { ...formData.social_media, instagram: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={formData.social_media.linkedin}
                  onChange={(e) => setFormData({
                    ...formData,
                    social_media: { ...formData.social_media, linkedin: e.target.value }
                  })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 