import Link from "next/link"
import { Button } from "@/components/ui/button"

export function OpportunitySection() {
  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Become a Stepper */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h3 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Earn on your schedule
            </h3>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Deliver for your campus community and get paid weekly. Work when you want, earn what you need.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-14 text-base font-semibold">
                Become a Stepper
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop&q=90"
                alt="Delivery driver"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Grow your business */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&h=600&fit=crop&q=90"
                alt="Restaurant partner"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <h3 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Grow your business
            </h3>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Reach hungry students and expand your sales. Join the leading campus food delivery platform.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-14 text-base font-semibold">
                Become a partner
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
