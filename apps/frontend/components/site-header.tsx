'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const navigation = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Company Blog", href: "/blog" },
    { label: "Engineering Blog", href: "/engineering" },
    { label: "Merchant Blog", href: "/merchant-blog" },
  ],
  getStarted: [
    { label: "Become a Stepper", href: "/become-stepper" },
    { label: "DoorStep for Business", href: "/business" },
    { label: "DoorStep for Work", href: "/work" },
  ],
}

export function SiteHeader() {
  const [companyOpen, setCompanyOpen] = useState(false)
  const [getStartedOpen, setGetStartedOpen] = useState(false)

  return (
    <header className="absolute top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/logos/logo-nobackground.jpeg"
              alt="DoorStep"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {/* Company Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCompanyOpen(true)}
              onMouseLeave={() => setCompanyOpen(false)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/5 rounded-lg transition-colors">
                Company
                <ChevronDown className={`h-4 w-4 transition-transform ${companyOpen ? 'rotate-180' : ''}`} />
              </button>
              {companyOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                  {navigation.company.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-3 text-sm text-foreground hover:bg-gray-50 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Get Started Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setGetStartedOpen(true)}
              onMouseLeave={() => setGetStartedOpen(false)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/5 rounded-lg transition-colors">
                Get Started
                <ChevronDown className={`h-4 w-4 transition-transform ${getStartedOpen ? 'rotate-180' : ''}`} />
              </button>
              {getStartedOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                  {navigation.getStarted.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-3 text-sm text-foreground hover:bg-gray-50 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Help Link */}
            <Link
              href="/help"
              className="px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/5 rounded-lg transition-colors"
            >
              Help
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-foreground hover:bg-foreground/5 font-medium">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-foreground text-white hover:bg-foreground/90 rounded-full px-6 font-semibold shadow-sm">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
