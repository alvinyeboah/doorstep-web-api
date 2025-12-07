"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function HeroSection() {
  const [address, setAddress] = useState("")

  return (
    <section className="relative min-h-[700px] bg-gradient-to-br from-amber-50 via-white to-blue-50 overflow-hidden pt-20">

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[700px] px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left content */}
          <div className="text-left space-y-8">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
              <span className="text-sm font-semibold text-primary">Campus Food Delivery</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Everything you crave,
              <span className="block text-primary">delivered.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg">
              Your favorite campus restaurants and stores, delivered right to your dorm in minutes.
            </p>

            {/* Address input */}
            <div className="max-w-lg">
              <div className="flex items-center gap-2 bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
                <Input
                  type="text"
                  placeholder="Enter your delivery address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground text-base px-4"
                />
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-12 font-semibold whitespace-nowrap">
                  Find Food
                </Button>
              </div>
              <Link href="/login" className="inline-block mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sign in for saved addresses
              </Link>
            </div>
          </div>

          {/* Right image */}
          <div className="relative hidden lg:block">
            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=500&fit=crop&q=90"
                alt="Delicious food"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop&q=80"
                    alt="Restaurant"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">Campus Eats</div>
                  <div className="text-sm text-muted-foreground">15-20 min • $0 delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
