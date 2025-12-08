import Link from "next/link"
import { Button } from "@/components/ui/button"

export function StepPassSection() {
  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&h=600&fit=crop&q=90"
                alt="Food spread"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              StepPass is delivery for less
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Save on every order with $0 delivery fees and exclusive perks. Try it free for 30 days.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8 h-14 text-base font-semibold">
                Get StepPass
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
