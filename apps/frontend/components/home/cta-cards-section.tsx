import Link from "next/link"
import { Button } from "@/components/ui/button"

const cards = [
  {
    title: "Become a Stepper",
    description: "Earn money on your schedule. Deliver for your campus community and get paid weekly.",
    cta: "Start earning",
    href: "/signup",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop&q=80",
  },
  {
    title: "Become a Partner",
    description: "Grow your business and reach new customers. Join thousands of campus merchants.",
    cta: "Partner with us",
    href: "/signup",
    image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&h=400&fit=crop&q=80",
  },
  {
    title: "Try DoorStep",
    description: "Get $0 delivery fees on your first order. Experience the best campus food delivery.",
    cta: "Order now",
    href: "/signup",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop&q=80",
  },
]

export function CtaCardsSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link key={card.title} href={card.href} className="group">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-3">{card.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{card.description}</p>
                  <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-transparent p-0 h-auto font-semibold">
                    {card.cta} →
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
