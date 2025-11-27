import Link from "next/link"
import { ArrowRight } from "lucide-react"

const cards = [
  {
    title: "Become a Stepper",
    description: "As a delivery driver, make money and work on your schedule. Sign up in minutes.",
    cta: "Start earning",
    href: "/stepper",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    title: "Become a Merchant",
    description: "Attract new customers and grow sales, starting with 0% commissions for up to 30 days.",
    cta: "Sign up for DoorStep",
    href: "/merchant",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    title: "Get the best DoorStep experience",
    description: "Experience the best your campus has to offer, all in one app.",
    cta: "Get the app",
    href: "/app",
    image: "/placeholder.svg?height=120&width=120",
  },
]

export function CtaCardsSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div key={card.title} className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-32 h-32 rounded-full bg-sky-100 flex items-center justify-center overflow-hidden">
                  <img src={card.image || "/placeholder.svg"} alt={card.title} className="w-24 h-24 object-contain" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{card.title}</h3>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed max-w-xs mx-auto">{card.description}</p>
              <Link href={card.href} className="inline-flex items-center text-primary font-semibold hover:underline">
                {card.cta}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
