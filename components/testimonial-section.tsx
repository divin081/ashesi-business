'use client'

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TestimonialSection() {
  return (
    <section className="container px-4 md:px-6 py-12">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Testimonials</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Student Business Success Stories</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Hear from students, alumni, and employers about the impact of Ashesi's entrepreneurship ecosystem.
          </p>
        </div>
      </div>

      <Tabs defaultValue="students" className="w-full mt-8">
        <TabsList className="grid w-full max-w-md grid-cols-3 mx-auto">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="alumni">Alumni</TabsTrigger>
          <TabsTrigger value="employers">Employers</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentTestimonials.map((testimonial, index) => (
              <Card key={index} className="backdrop-blur-lg bg-white/80 dark:bg-gray-950/80 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full overflow-hidden h-12 w-12">
                        <Image
                          src="/placeholder.svg?height=100&width=100"
                          alt={testimonial.name}
                          width={100}
                          height={100}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.program}</p>
                      </div>
                    </div>
                    <p className="text-sm italic">"{testimonial.quote}"</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alumni" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alumniTestimonials.map((testimonial, index) => (
              <Card key={index} className="backdrop-blur-lg bg-white/80 dark:bg-gray-950/80 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full overflow-hidden h-12 w-12">
                        <Image
                          src="/placeholder.svg?height=100&width=100"
                          alt={testimonial.name}
                          width={100}
                          height={100}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                      </div>
                    </div>
                    <p className="text-sm italic">"{testimonial.quote}"</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="employers" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employerTestimonials.map((testimonial, index) => (
              <Card key={index} className="backdrop-blur-lg bg-white/80 dark:bg-gray-950/80 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full overflow-hidden h-12 w-12">
                        <Image
                          src="/placeholder.svg?height=100&width=100"
                          alt={testimonial.name}
                          width={100}
                          height={100}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                      </div>
                    </div>
                    <p className="text-sm italic">"{testimonial.quote}"</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}

const studentTestimonials = [
  {
    name: "Kofi Mensah",
    program: "BBA, 3rd Year",
    quote:
      "Starting my tech startup during my sophomore year at Ashesi has been transformative. The Entrepreneurship Committee provided seed funding and mentorship that helped me refine my business model. Now my app has over 5,000 users and I'm working with the Venture Incubator to scale.",
  },
  {
    name: "Ama Darko",
    program: "Computer Science, 4th Year",
    quote:
      "The Ashesi Entrepreneur Centre's workshops on business development and pitch preparation were invaluable. With their support, I secured $15,000 in funding for my sustainable fashion platform. The mentorship from industry experts has been a game-changer for my business journey.",
  },
  {
    name: "David Osei",
    program: "Business Administration, 2nd Year",
    quote:
      "I launched my food delivery service with just $500 from the Entrepreneurship Committee's micro-grant program. The networking events they organized helped me connect with suppliers and potential investors. My business now serves over 200 customers weekly and I'm planning to expand to other campuses.",
  },
]

const alumniTestimonials = [
  {
    name: "Grace Ayew",
    position: "Founder & CEO, TechStart Ghana",
    quote:
      "My journey as an entrepreneur began at Ashesi when I participated in the Venture Incubator program. The seed funding and mentorship I received were crucial in launching my tech company. Today, TechStart Ghana has raised over $500,000 in venture capital and employs 15 people, including 5 Ashesi graduates.",
  },
  {
    name: "Emmanuel Boateng",
    position: "Founder & CEO, EcoVentures",
    quote:
      "The Ashesi Entrepreneur Centre provided the foundation for my sustainable business. Their mentorship program connected me with industry leaders who guided me through the challenges of starting a green technology company. The skills and network I developed at Ashesi continue to benefit my business today.",
  },
  {
    name: "Fatima Ibrahim",
    position: "Founder, EduTech Solutions",
    quote:
      "I started my educational technology company right after graduation with support from the Ashesi Entrepreneurship Committee. The seed funding and business development workshops were instrumental in helping me validate my idea and build a viable product. Now, EduTech Solutions serves over 20 schools across Ghana.",
  },
]

const employerTestimonials = [
  {
    name: "Dr. James Kwarteng",
    company: "CEO, Horizon Innovations",
    quote:
      "We've partnered with several Ashesi student startups through our accelerator program, and we're consistently impressed by their innovative solutions and entrepreneurial mindset. The Ashesi Entrepreneur Centre's focus on practical business skills produces graduates who can hit the ground running.",
  },
  {
    name: "Sarah Mensah",
    company: "Investment Director, African Tech Ventures",
    quote:
      "As an investor, I've seen firsthand the quality of ventures coming out of Ashesi's entrepreneurship ecosystem. The student businesses we've funded demonstrate strong market understanding, ethical leadership, and scalability potential. The university's support system for entrepreneurs is truly exceptional.",
  },
  {
    name: "Robert Ansah",
    company: "Managing Partner, Ansah Consulting",
    quote:
      "We've mentored several Ashesi student entrepreneurs through the Entrepreneurship Committee's mentorship program. Their ability to identify market opportunities and develop innovative solutions is remarkable. The university's commitment to supporting student businesses creates a pipeline of promising ventures for investors like us.",
  },
]

