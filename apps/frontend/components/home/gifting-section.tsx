import { Button } from "@/components/ui/button"

const giftCards = [
  {
    title: "Beauty essentials from top brands",
    description: "Get all your beauty and self-care needs delivered at home or on-the-go",
    cta: "Shop beauty",
    image: "/placeholder.svg?height=400&width=500",
  },
  {
    title: "Flowers for any occasion",
    description: "Shop hand-picked and thoughtfully-arranged blooms from florists near you.",
    cta: "Send Flowers",
    image: "/placeholder.svg?height=400&width=500",
  },
]

export function GiftingSection() {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
          Helping you with to-dos and gifting
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {giftCards.map((card) => (
            <div key={card.title} className="text-center">
              <div className="relative mb-6 rounded-lg overflow-hidden">
                <img src={card.image || "/placeholder.svg"} alt={card.title} className="w-full h-80 object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{card.title}</h3>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed max-w-sm mx-auto">{card.description}</p>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">{card.cta}</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
