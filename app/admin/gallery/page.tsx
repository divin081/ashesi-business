"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Pencil, Trash } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"

interface GalleryImage {
  id: string
  url: string
  caption: string
  Height: number
  created_at: string
}

interface FormData {
  url: string
  caption: string
  Height: number
}

export default function GalleryPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<FormData>({
    url: '',
    caption: '',
    Height: 300,
  })

  const fetchImages = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setImages(data || [])
    } catch (error) {
      console.error('Error fetching images:', error)
      toast.error('Failed to load images')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const imageData = {
        url: formData.url,
        caption: formData.caption,
        Height: formData.Height,
        updated_at: new Date().toISOString()
      }

      if (selectedImage) {
        // Update existing image
        const { error } = await supabase
          .from('gallery_images')
          .update(imageData)
          .eq('id', selectedImage.id)

        if (error) throw error
        toast.success('Image updated successfully')
      } else {
        // Create new image
        const { data, error } = await supabase
          .from('gallery_images')
          .insert([{ ...imageData, created_at: new Date().toISOString() }])
          .select()

        if (error) throw error
        if (!data) throw new Error('No data returned from insert')
        toast.success('Image added successfully')
      }

      setIsAddModalOpen(false)
      setSelectedImage(null)
      resetForm()
      fetchImages()
    } catch (error) {
      console.error('Error saving image:', error)
      toast.error(selectedImage ? 'Failed to update image' : 'Failed to add image')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Image deleted successfully')
      setIsDeleteModalOpen(false)
      setImageToDelete(null)
      fetchImages()
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('Failed to delete image')
    }
  }

  function resetForm() {
    setFormData({
      url: '',
      caption: '',
      Height: 300,
    })
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gallery Management</h2>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-primary text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Image
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="group relative aspect-[3/4] overflow-hidden rounded-lg">
            {/* Front side - Black and white image */}
            <div className="absolute inset-0 transition-transform duration-700 group-hover:[transform:rotateY(180deg)]">
              <div className="h-full w-full">
                <img
                  src={image.url}
                  alt={image.caption}
                  className="h-full w-full object-cover grayscale transition-all duration-700"
                />
              </div>
            </div>

            {/* Back side - Description */}
            <div 
              className="absolute inset-0 [transform:rotateY(-180deg)] [backface-visibility:hidden] transition-transform duration-700 group-hover:[transform:rotateY(0deg)]"
              style={{ 
                backgroundImage: `url(${image.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="flex h-full w-full flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                <div className="flex justify-end gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/20 hover:bg-white/40"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedImage(image);
                      setFormData({
                        url: image.url,
                        caption: image.caption,
                        Height: image.Height || 300
                      });
                      setIsAddModalOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="bg-white/20 hover:bg-red-500/40"
                    onClick={(e) => {
                      e.preventDefault();
                      setImageToDelete(image.id);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{image.caption}</h3>
                <p className="text-sm text-gray-200">
                  {new Date(image.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={(open) => {
        setIsAddModalOpen(open)
        if (!open) {
          setSelectedImage(null)
          resetForm()
        }
      }}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedImage ? 'Edit Image' : 'Add New Image'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Image URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Input
                  id="caption"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Height">Height (px)</Label>
                <Input
                  id="Height"
                  type="number"
                  min="100"
                  max="1000"
                  value={formData.Height}
                  onChange={(e) => setFormData({ ...formData, Height: Number(e.target.value) })}
                  required
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

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete this image? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => imageToDelete && handleDelete(imageToDelete)}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 