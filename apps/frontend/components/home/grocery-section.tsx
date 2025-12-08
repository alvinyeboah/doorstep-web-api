import Link from "next/link"
import { Button } from "@/components/ui/button"

export function GrocerySection() {
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1543168256-8133cc8e3ee4?w=1600&h=800&fit=crop&q=90')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white space-y-8">
        <h2 className="text-5xl md:text-6xl font-bold leading-tight">
          Groceries & essentials
        </h2>
        <p className="text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
          Fresh produce, snacks, and everyday essentials delivered in minutes.
        </p>
        <Link href="/signup">
          <Button size="lg" className="bg-white text-foreground hover:bg-white/90 rounded-full px-8 h-14 text-base font-semibold">
            Shop now
          </Button>
        </Link>
      </div>
    </section>
  )
}
