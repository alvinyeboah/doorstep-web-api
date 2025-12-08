import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import { FadeIn } from "@/components/animations/fade-in"

export default function BusinessPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-white to-secondary/5 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <FadeIn delay={0.1}>
                <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                  <span className="text-sm font-semibold text-primary">DoorStep for Business</span>
                </div>
              </FadeIn>
              <ScrollReveal delay={0.2}>
                <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                  Reach thousands of
                  <span className="block bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">hungry students</span>
                </h1>
              </ScrollReveal>
              <FadeIn delay={0.3}>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Partner with DoorStep to grow your revenue, expand your reach, and become a campus favorite. Zero upfront costs, no long-term commitments.
                </p>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="flex flex-wrap items-center gap-4">
                  <Link href="/signup">
                    <Button className="bg-foreground text-white hover:bg-foreground/90 rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                      Become a Partner
                    </Button>
                  </Link>
                  <Link href="/help">
                    <Button variant="outline" className="rounded-full px-8 py-6 text-lg font-semibold border-2 hover:border-foreground transition-all hover:scale-105">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </FadeIn>
            </div>
            <FadeIn delay={0.3} className="relative">
              <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop&q=90"
                  alt="Restaurant kitchen"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Join successful campus businesses</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Restaurants and stores on DoorStep see significant growth
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "45%", label: "Average revenue increase" },
              { value: "200+", label: "Partner businesses" },
              { value: "15 min", label: "Average delivery time" },
              { value: "50K+", label: "Active customers" }
            ].map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="text-5xl font-bold text-primary">{stat.value}</div>
                <div className="text-lg text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why partner with DoorStep?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to succeed in campus delivery
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Massive Reach",
                description: "Connect with thousands of students looking for food and essentials on campus every day.",
                image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop&q=80"
              },
              {
                title: "Zero Upfront Costs",
                description: "No setup fees, no equipment to buy. Just a simple commission on orders you receive.",
                image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop&q=80"
              },
              {
                title: "Easy Integration",
                description: "Get started in minutes with our simple tablet app. No complex systems to learn.",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&q=80"
              },
              {
                title: "Marketing Support",
                description: "Featured placements, promotional campaigns, and visibility across the platform.",
                image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop&q=80"
              },
              {
                title: "Real-Time Analytics",
                description: "Track sales, popular items, peak hours, and customer feedback through your dashboard.",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&q=80"
              },
              {
                title: "Dedicated Support",
                description: "Your own account manager and 24/7 support to help you maximize success.",
                image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop&q=80"
              }
            ].map((benefit) => (
              <div key={benefit.title} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={benefit.image}
                    alt={benefit.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Getting started is simple</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From signup to your first order in just a few days
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Sign Up", description: "Fill out our simple partner application with your business details." },
              { step: "2", title: "Setup Menu", description: "Upload your menu and photos. We'll help optimize them for maximum appeal." },
              { step: "3", title: "Go Live", description: "We'll review and approve your listing, then you're ready to start receiving orders." },
              { step: "4", title: "Start Selling", description: "Accept orders through our tablet app and watch your revenue grow." }
            ].map((step) => (
              <div key={step.step} className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&q=90"
                  alt="Success story"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                <span className="text-sm font-semibold text-primary">Partner Success Story</span>
              </div>
              <h2 className="text-4xl font-bold text-foreground">
                "DoorStep helped us reach a whole new customer base"
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                "We were skeptical about online delivery at first, but DoorStep made it so easy. Within the first month, we saw a 40% increase in revenue. The student customers keep coming back, and the analytics help us understand what they love. It's been a game-changer for our business."
              </p>
              <div className="space-y-1">
                <div className="font-semibold text-foreground text-lg">Maria Rodriguez</div>
                <div className="text-muted-foreground">Owner, Campus Pizza</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            No hidden fees. No surprises. Just a simple commission structure.
          </p>

          <div className="bg-white rounded-3xl shadow-xl p-12">
            <div className="text-6xl font-bold text-primary mb-4">15%</div>
            <div className="text-2xl font-semibold text-foreground mb-6">Commission per order</div>
            <ul className="space-y-3 text-left max-w-md mx-auto mb-8">
              {[
                "No setup fees",
                "No monthly fees",
                "No equipment costs",
                "No long-term contracts",
                "Free marketing support",
                "24/7 partner support"
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Ready to grow your business?</h2>
          <p className="text-xl text-muted-foreground">
            Join hundreds of successful campus businesses on DoorStep today.
          </p>
          <Link href="/signup">
            <Button className="bg-foreground text-white hover:bg-foreground/90 rounded-full px-10 py-6 text-lg font-semibold shadow-lg">
              Become a Partner
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
