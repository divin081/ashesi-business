"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Save, Trash, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

export default function GalleryManager() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  const filteredImages =
    selectedCategory === "all" ? galleryImages : galleryImages.filter((img) => img.category === selectedCategory)

  const handleUpload = () => {
    toast({
      title: "Upload successful",
      description: "Your image has been uploaded to the gallery.",
    })
  }

  const handleSave = () => {
    toast({
      title: "Changes saved",
      description: "Your changes to the image have been saved.",
    })
    setSelectedImage(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gallery Management</h2>
          <p className="text-muted-foreground">Manage images in the website gallery</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Images
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Images</DialogTitle>
              <DialogDescription>
                Upload new images to the gallery. You can upload multiple images at once.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select defaultValue="campus">
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="campus">Campus</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="files">Images</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">Drag and drop files here or click to browse</p>
                  <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, GIF (Max size: 5MB)</p>
                  <Input id="files" type="file" multiple className="hidden" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpload}>Upload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gallery Images</CardTitle>
              <CardDescription>
                {filteredImages.length} images in{" "}
                {selectedCategory === "all" ? "all categories" : `the ${selectedCategory} category`}
              </CardDescription>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="campus">Campus</SelectItem>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="students">Students</SelectItem>
                <SelectItem value="faculty">Faculty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="outline" className="text-white border-white hover:bg-white/20">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
            <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/50">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Image Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
            <DialogDescription>Update image details and metadata</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4 md:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              {selectedImage && (
                <Image
                  src={selectedImage.src || "/placeholder.svg"}
                  alt={selectedImage.alt}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" defaultValue={selectedImage?.title} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-alt">Alt Text</Label>
                <Input id="edit-alt" defaultValue={selectedImage?.alt} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" rows={4} defaultValue={selectedImage?.description} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select defaultValue={selectedImage?.category}>
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="campus">Campus</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button variant="destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete Image
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface GalleryImage {
  id: number
  src: string
  alt: string
  title: string
  description: string
  category: string
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "/placeholder.svg?height=600&width=600",
    alt: "Ashesi Business School Building",
    title: "Business School Building",
    description: "Our state-of-the-art business school building, designed to facilitate collaborative learning.",
    category: "campus",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=600&width=600",
    alt: "Campus Library",
    title: "Business Library",
    description: "Our comprehensive business library houses thousands of books, journals, and digital resources.",
    category: "campus",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=600&width=600",
    alt: "Student Lounge",
    title: "Student Lounge",
    description: "A comfortable space for students to relax, collaborate, and network between classes.",
    category: "campus",
  },
  {
    id: 4,
    src: "/placeholder.svg?height=600&width=600",
    alt: "Business Conference",
    title: "Annual Business Conference",
    description: "Our annual business conference brings together industry leaders, alumni, and students.",
    category: "events",
  },
  {
    id: 5,
    src: "/placeholder.svg?height=600&width=600",
    alt: "Entrepreneurship Fair",
    title: "Entrepreneurship Fair",
    description: "Students showcase their business ideas and innovations at our entrepreneurship fair.",
    category: "events",
  },
  {
    id: 6,
    src: "/placeholder.svg?height=600&width=600",
    alt: "Guest Lecture",
    title: "Executive Guest Lecture",
    description: "A prominent business leader shares insights with our students during a guest lecture.",
    category: "events",
  },
  {
    id: 7,
    src: "/placeholder.svg?height=600&width=600",
    alt: "Students in Class",
    title: "Collaborative Learning",
    description: "Students engage in collaborative problem-solving during a business strategy class.",
    category: "students",
  },
  {
    id: 8,
    src: "/placeholder.svg?height=600&width=600",
    alt: "Student Presentation",
    title: "Student Presentation",
    description: "A student presents her business plan to classmates and faculty members.",
    category: "students",
  },
  {
    id: 9,
    src: "/placeholder.svg?height=600&width=600",
    alt: "Professor Teaching",
    title: "Interactive Teaching",
    description: "Our faculty members employ interactive teaching methods to engage students in the learning process.",
    category: "faculty",
  },
  {
    id: 10,
    src: "/placeholder.svg?height=600&width=600",
    alt: "Faculty Research",
    title: "Faculty Research",
    description: "Our professors conduct cutting-edge research that contributes to business knowledge and practice.",
    category: "faculty",
  },
]

