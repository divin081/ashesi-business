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

interface CommitteeMember {
  id: string
  name: string
  position: string
  image_url: string
  created_at: string
}

interface FormData {
  name: string
  position: string
  image_url: string
}

export default function CommitteePage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(null)
  const [members, setMembers] = useState<CommitteeMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    position: '',
    image_url: ''
  })

  const fetchMembers = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('committee_members')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMembers(data || [])
    } catch (error) {
      console.error('Error fetching members:', error)
      toast.error('Failed to load members')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const memberData = {
        name: formData.name,
        position: formData.position,
        image_url: formData.image_url,
        updated_at: new Date().toISOString()
      }

      if (selectedMember) {
        // Update existing member
        const { error } = await supabase
          .from('committee_members')
          .update(memberData)
          .eq('id', selectedMember.id)

        if (error) throw error
        toast.success('Member updated successfully')
      } else {
        // Create new member
        const { data, error } = await supabase
          .from('committee_members')
          .insert([{ ...memberData, created_at: new Date().toISOString() }])
          .select()

        if (error) throw error
        if (!data) throw new Error('No data returned from insert')
        toast.success('Member added successfully')
      }

      setIsAddModalOpen(false)
      setSelectedMember(null)
      resetForm()
      fetchMembers()
    } catch (error) {
      console.error('Error saving member:', error)
      toast.error(selectedMember ? 'Failed to update member' : 'Failed to add member')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this member?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('committee_members')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Member deleted successfully')
      fetchMembers()
    } catch (error) {
      console.error('Error deleting member:', error)
      toast.error('Failed to delete member')
    }
  }

  function resetForm() {
    setFormData({
      name: '',
      position: '',
      image_url: ''
    })
  }

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Committee Management</h2>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-primary text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Member
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <Card key={member.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">{member.name}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedMember(member)
                    setFormData({
                      name: member.name,
                      position: member.position,
                      image_url: member.image_url
                    })
                    setIsAddModalOpen(true)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(member.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="aspect-[16/9] relative mb-4 overflow-hidden rounded-lg">
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <p className="text-sm text-muted-foreground">{member.position}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={(open) => {
        setIsAddModalOpen(open)
        if (!open) {
          setSelectedMember(null)
          resetForm()
        }
      }}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMember ? 'Edit Member' : 'Add New Member'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
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