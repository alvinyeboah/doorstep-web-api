"use client"

import { useState } from "react"
import { MapPin, ArrowRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SiteHeader } from "@/components/site-header"

export function HeroSection() {
  const [address, setAddress] = useState("")

  return (
    <section className="relative min-h-[600px] bg-primary overflow-hidden">
      <SiteHeader />

      {/* Background food images */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=600&fit=crop&q=80"
          alt=""
          className="absolute left-0 top-0 h-full w-1/4 object-cover opacity-90"
        />
        <img
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=600&fit=crop&q=80"
          alt=""
          className="absolute right-0 top-0 h-full w-1/4 object-cover opacity-90"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[600px] px-6 pt-20">
        {/* Phone mockup */}
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="relative">
            <div className="w-48 h-96 bg-foreground rounded-3xl p-2 shadow-2xl">
              <div className="w-full h-full bg-primary rounded-2xl flex flex-col items-center justify-center gap-4 p-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h18v18H3zM3 9h18M9 21V9"
                    />
                  </svg>
                </div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                </div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            $0 DELIVERY FEE ON FIRST ORDER
          </h1>
          <p className="text-white/80 text-sm mb-8">Other fees apply</p>

          {/* Address input */}
          <div className="relative max-w-md mx-auto mb-4">
            <div className="flex items-center bg-white rounded-full overflow-hidden shadow-lg">
              <MapPin className="h-5 w-5 text-muted-foreground ml-4" />
              <Input
                type="text"
                placeholder="Enter delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
              />
              <Button size="icon" className="rounded-full bg-primary hover:bg-primary/90 m-1 h-10 w-10">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Sign in link */}
          <Button variant="outline" className="bg-white text-foreground hover:bg-white/90 rounded-full px-6">
            <User className="h-4 w-4 mr-2" />
            Sign in for saved address
          </Button>
        </div>
      </div>
    </section>
  )
}
