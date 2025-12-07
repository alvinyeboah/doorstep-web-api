import Link from "next/link"
import { Button } from "@/components/ui/button"

export function ConvenienceSection() {
  return (
    <section className="py-32 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Convenience at your doorstep
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Stock up on snacks, drinks, and essentials. Delivered in under an hour from stores near you.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-14 text-base font-semibold">
                Shop convenience
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=800&h=600&fit=crop&q=90"
                alt="Convenience store"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
