import { createBrowserClient } from '@supabase/ssr'

// Client-side Supabase client
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables')
    throw new Error('Missing Supabase environment variables')
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}

// Types based on our database schema
export interface Business {
  id: string
  name: string
  category: string
  year: number
  founder: string
  phone?: string
  email?: string
  education: string
  location: string
  founded: string
  stage: string
  team_size: string
  achievements: string
  description: string
  social_media: {
    website?: string
    instagram?: string
    linkedin?: string
  }
  image_url?: string
  created_at: string
}

export interface CommitteeMember {
  id: string
  name: string
  position: string
  year: number
  image_url?: string
  created_at: string
}

export interface GalleryImage {
  id: string
  url: string
  caption?: string
  created_at: string
} 

export interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  cover_image_url?: string
  author?: string
  published: boolean
  published_at?: string
  created_at: string
}