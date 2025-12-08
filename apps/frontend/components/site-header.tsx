'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ChevronDown, Menu, X } from "lucide-react"

const navigation = {
  company: [
    { label: "About", href: "/about" },
    { label: "Business", href: "/business" },
    { label: "Engineering", href: "/engineering" },
    { label: "Careers", href: "/careers" },
  ],
  solutions: [
    { label: "For Students", href: "/solutions/students" },
    { label: "For Vendors", href: "/solutions/vendors" },
    { label: "For Steppers", href: "/solutions/steppers" },
    { label: "For Campuses", href: "/solutions/campuses" },
  ],
  resources: [
    { label: "Help Center", href: "/help" },
    { label: "Pricing", href: "/pricing" },
    { label: "API Docs", href: "/docs" },
    { label: "Blog", href: "/blog" },
  ],
}

export function SiteHeader() {
  const [companyOpen, setCompanyOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 left-0 right-0 z-50 border-b border-gray-200/50 backdrop-blur-sm bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src="/logos/logo-white.jpeg"
                  alt="DoorStep"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-lg"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg opacity-20 blur-sm"></div>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                DoorStep
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {/* Company Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCompanyOpen(true)}
              onMouseLeave={() => setCompanyOpen(false)}
            >
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200">
                Company
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${companyOpen ? 'rotate-180' : ''}`} />
              </button>
              {companyOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100/50 py-2 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-100">
                    <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Company</p>
                  </div>
                  {navigation.company.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700 transition-all duration-200"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setSolutionsOpen(true)}
              onMouseLeave={() => setSolutionsOpen(false)}
            >
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200">
                Solutions
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${solutionsOpen ? 'rotate-180' : ''}`} />
              </button>
              {solutionsOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100/50 py-2 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                    <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Solutions</p>
                  </div>
                  {navigation.solutions.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-200"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200">
                Resources
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${resourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              {resourcesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100/50 py-2 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                    <p className="text-xs font-medium text-purple-700 uppercase tracking-wide">Resources</p>
                  </div>
                  {navigation.resources.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-200"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing Link */}
            <Link
              href="/pricing"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
            >
              Pricing
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-medium rounded-xl transition-all duration-200"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-xl px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200/50 py-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-1">
              {Object.entries(navigation).map(([category, items]) => (
                <div key={category}>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {category}
                  </div>
                  {items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
              <div className="pt-4 space-y-1">
                <Link
                  href="/pricing"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block mx-3 mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-xl px-6 py-2 text-center shadow-lg transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}