import Link from "next/link"

const cards = [
  {
    title: "Become a Stepper",
    description: "As a delivery driver, make money and work on your schedule. Sign up in minutes.",
    cta: "Start earning",
    href: "/signup",
  },
  {
    title: "Become a Merchant",
    description: "Attract new customers and grow sales, starting with 0% commissions for up to 30 days.",
    cta: "Sign up for DoorStep",
    href: "/signup",
  },
  {
    title: "Get the best DoorStep experience",
    description: "Experience the best your campus has to offer, all in one app.",
    cta: "Get the app",
    href: "/signup",
  },
]

export function CtaCardsSection() {
  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div key={card.title} className="bg-white p-8 rounded-xl border border-border hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-foreground mb-3">{card.title}</h3>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{card.description}</p>
              <Link href={card.href} className="text-primary font-semibold hover:underline text-sm">
                {card.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
