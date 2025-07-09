import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-muted/50">
      <div className="container grid gap-8 px-4 py-10 md:px-6 md:grid-cols-3">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Ashesi Business</h3>
          <p className="text-sm text-muted-foreground">
            Empowering future business leaders in Africa through education, innovation, and ethical leadership.
          </p>
          <div className="flex space-x-4 items-center">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
        <div className="space-y-4 flex flex-col items-center">
          
          
        </div>
        <div id="contact" className="space-y-4">
          <h3 className="text-lg font-medium">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="text-muted-foreground">
              1 University Avenue
              <br />
              Berekuso, Eastern Region
              <br />
              Ghana
            </li>
            <li>
              <Link href="tel:+233123456789" className="text-muted-foreground hover:text-foreground">
                +233 12 345 6789
              </Link>
            </li>
            <li>
              <Link href="mailto:info@ashesi.edu.gh" className="text-muted-foreground hover:text-foreground">
                ascenterpreneurship@ashesi.edu.gh
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container flex flex-col items-center justify-center gap-2 px-4 py-6 text-center text-sm text-muted-foreground md:px-6">
          <p>© {new Date().getFullYear()} Ashesi Enterpreneurship Committee. Powered by Divine.</p>
        </div>
      </div>
    </footer>
  )
}

