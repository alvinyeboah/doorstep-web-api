import { HeroSection } from "@/components/home/hero-section"
import { CtaCardsSection } from "@/components/home/cta-cards-section"
import { RestaurantSection } from "@/components/home/restaurant-section"
import { GrocerySection } from "@/components/home/grocery-section"
import { ConvenienceSection } from "@/components/home/convenience-section"
import { StepPassSection } from "@/components/home/steppass-section"
import { OpportunitySection } from "@/components/home/opportunity-section"

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CtaCardsSection />
      <RestaurantSection />
      <GrocerySection />
      <ConvenienceSection />
      <StepPassSection />
      <OpportunitySection />
    </main>
  )
}
