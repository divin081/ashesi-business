"use client"

import { useState } from "react"
import { FileEdit, Plus, Save, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export default function ContentEditor() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null)

  const handleSave = () => {
    toast({
      title: "Content saved",
      description: "Your changes have been saved successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Content Management</h2>
          <p className="text-muted-foreground">Edit and manage website content</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Page
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <Card className="col-span-1 md:col-span-1">
          <CardHeader>
            <CardTitle>Pages</CardTitle>
            <CardDescription>Select a page to edit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pages.map((page) => (
                <Button
                  key={page.id}
                  variant={selectedPage === page.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedPage(page.id)}
                >
                  <FileEdit className="mr-2 h-4 w-4" />
                  {page.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-4">
          <CardHeader>
            <CardTitle>Edit Content</CardTitle>
            <CardDescription>
              {selectedPage
                ? `Editing: ${pages.find((p) => p.id === selectedPage)?.title}`
                : "Select a page to edit its content"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedPage ? (
              <Tabs defaultValue="content">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Page Title</Label>
                    <Input id="title" defaultValue={pages.find((p) => p.id === selectedPage)?.title} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" rows={15} defaultValue={pages.find((p) => p.id === selectedPage)?.content} />
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta-title">Meta Title</Label>
                    <Input id="meta-title" defaultValue={pages.find((p) => p.id === selectedPage)?.title} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta-description">Meta Description</Label>
                    <Textarea
                      id="meta-description"
                      rows={4}
                      defaultValue="Ashesi Business offers world-class education that combines academic excellence, ethical leadership, and practical experience."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      defaultValue="business school, africa, education, leadership, entrepreneurship"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Page Status</Label>
                    <Select defaultValue="published">
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url">URL Slug</Label>
                    <Input id="url" defaultValue={pages.find((p) => p.id === selectedPage)?.slug} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parent">Parent Page</Label>
                    <Select defaultValue="none">
                      <SelectTrigger id="parent">
                        <SelectValue placeholder="Select parent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {pages.map((page) => (
                          <SelectItem key={page.id} value={page.id}>
                            {page.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex h-[400px] items-center justify-center text-muted-foreground">
                Select a page from the sidebar to edit its content
              </div>
            )}
          </CardContent>
          {selectedPage && (
            <CardFooter className="flex justify-between">
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete Page
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}

const pages = [
  {
    id: "home",
    title: "Home Page",
    slug: "/",
    content:
      "# Welcome to Ashesi Business\n\nAshesi Business is dedicated to developing ethical, innovative, and entrepreneurial business leaders who will transform Africa. Our programs combine rigorous academic training with practical experience and a strong emphasis on ethics and leadership.\n\n## Our Programs\n\n- Bachelor of Business Administration\n- MBA Program\n- Executive Education\n- Entrepreneurship Center",
  },
  {
    id: "business",
    title: "Business Programs",
    slug: "/business",
    content:
      "# Our Business Programs\n\nAshesi Business offers comprehensive programs designed to prepare students for leadership roles in a rapidly evolving global economy. Our curriculum combines theoretical knowledge with practical skills and ethical leadership principles.\n\n## Undergraduate Programs\n\n- Bachelor of Business Administration\n- Bachelor of Accounting\n- Bachelor of Marketing\n\n## Graduate Programs\n\n- Master of Business Administration (MBA)\n- Master of Finance\n- Master of Marketing\n\n## Executive Programs\n\n- Executive MBA\n- Leadership Development Program\n- Digital Transformation Certificate",
  },
  {
    id: "gallery",
    title: "Gallery",
    slug: "/gallery",
    content:
      "# Ashesi Business in Pictures\n\nExplore our campus, events, and community through our photo gallery.\n\n## Categories\n\n- Campus\n- Events\n- Students\n- Faculty",
  },
  {
    id: "about",
    title: "About Us",
    slug: "/about",
    content:
      "# About Ashesi Business\n\nAshesi Business is a leading business school in Africa, dedicated to developing ethical, innovative, and entrepreneurial business leaders who will transform the continent.\n\n## Our Mission\n\nTo educate a new generation of ethical, entrepreneurial leaders in Africa.\n\n## Our Vision\n\nAn African renaissance driven by a new generation of ethical, entrepreneurial leaders.",
  },
  {
    id: "contact",
    title: "Contact Us",
    slug: "/contact",
    content:
      "# Contact Ashesi Business\n\n## Address\n\n1 University Avenue\nBerekuso, Eastern Region\nGhana\n\n## Phone\n\n+233 12 345 6789\n\n## Email\n\ninfo@ashesi.edu.gh",
  },
]

