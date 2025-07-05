"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { LinkedinIcon, TwitterIcon } from "lucide-react"

interface CommitteeMember {
  id: string
  name: string
  position: string
  image_url: string
  created_at: string
}

export default function CommitteePage() {
  const [members, setMembers] = useState<CommitteeMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <span className="inline-block px-4 py-2 bg-gray-50 rounded-full text-gray-900 text-sm font-medium mb-4">
          Committee Members
        </span>
        <h1 className="text-[64px] font-bold leading-tight mb-6">
          Meet Our Team
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
          Dedicated individuals working to foster and support entrepreneurial initiatives at Ashesi University.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.id} className="group relative aspect-[3/4] overflow-hidden rounded-lg">
            {/* Front side - Black and white image */}
            <div className="absolute inset-0 transition-transform duration-700 group-hover:[transform:rotateY(180deg)]">
              <div className="h-full w-full">
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="h-full w-full object-cover grayscale transition-all duration-700"
                />
              </div>
            </div>

            {/* Back side - Member Info */}
            <div 
              className="absolute inset-0 [transform:rotateY(-180deg)] [backface-visibility:hidden] transition-transform duration-700 group-hover:[transform:rotateY(0deg)]"
              style={{ 
                backgroundImage: `url(${member.image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="flex h-full w-full flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-lg text-gray-200 mb-4">{member.position}</p>
                <div className="flex gap-4">
                  <a href="#" className="text-white hover:text-gray-200 transition-colors">
                    <LinkedinIcon className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-white hover:text-gray-200 transition-colors">
                    <TwitterIcon className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 