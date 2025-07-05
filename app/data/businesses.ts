export interface Business {
  id: string
  name: string
  category: string
  year: string
  founder: string
  education: string
  location: string
  founded: string
  stage: string
  teamSize: string
  achievements: string
  description: string
  image: string
  socialMedia: {
    website?: string
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
}

export const businesses: Business[] = [
  {
    id: "1",
    name: "EcoTech Solutions",
    category: "Sustainability",
    year: "2024",
    founder: "John Doe - Class of 2024",
    education: "BSc. Computer Science",
    location: "Berekuso",
    founded: "2023",
    stage: "Early Stage",
    teamSize: "5",
    achievements: "Winner of Ashesi Venture Accelerator 2023",
    description: "Innovative solutions for environmental sustainability through technology",
    image: "/images/business1.jpg",
    socialMedia: {
      website: "https://example.com",
      linkedin: "https://linkedin.com/company/ecotech"
    }
  },
  {
    id: "2",
    name: "EduLearn",
    category: "Education",
    year: "2023",
    founder: "Jane Smith - Class of 2023",
    education: "BSc. Business Administration",
    location: "Accra",
    founded: "2022",
    stage: "Growth",
    teamSize: "8",
    achievements: "Featured in TechCrunch, 10k+ active users",
    description: "Digital platform revolutionizing education in Africa",
    image: "/images/business2.jpg",
    socialMedia: {
      website: "https://edulearn.com",
      facebook: "https://facebook.com/edulearn",
      twitter: "https://twitter.com/edulearn"
    }
  }
] 