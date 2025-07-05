export interface GalleryImage {
  id: string
  src: string
  alt: string
  title: string
  description: string
}

export const galleryImages: GalleryImage[] = [
  {
    id: "1",
    src: "/images/gallery/image1.jpg",
    alt: "Student Entrepreneurs Showcase",
    title: "Business Fair 2024",
    description: "Annual showcase of student businesses at Ashesi University"
  },
  {
    id: "2",
    src: "/images/gallery/image2.jpg",
    alt: "Startup Pitch Competition",
    title: "Pitch Competition Finals",
    description: "Students presenting their business ideas to industry experts"
  },
  {
    id: "3",
    src: "/images/gallery/image3.jpg",
    alt: "Business Workshop",
    title: "Entrepreneurship Workshop",
    description: "Interactive session on business development and strategy"
  }
] 