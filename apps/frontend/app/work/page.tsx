import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import { FadeIn } from "@/components/animations/fade-in"

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary/5 via-white to-primary/5 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <FadeIn delay={0.1}>
                <div className="inline-block px-4 py-2 bg-secondary/10 rounded-full">
                  <span className="text-sm font-semibold text-secondary">DoorStep for Work</span>
                </div>
              </FadeIn>
              <ScrollReveal delay={0.2}>
                <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                  Simplify team meals
                  <span className="block bg-gradient-to-r from-secondary to-blue-600 bg-clip-text text-transparent">and campus events</span>
                </h1>
              </ScrollReveal>
              <FadeIn delay={0.3}>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  From department meetings to campus events, DoorStep makes it easy to feed your team. Manage expenses, track orders, and delight everyone with seamless group ordering.
                </p>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="flex flex-wrap items-center gap-4">
                  <Link href="/signup">
                    <Button className="bg-foreground text-white hover:bg-foreground/90 rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/help">
                    <Button variant="outline" className="rounded-full px-8 py-6 text-lg font-semibold border-2 hover:border-foreground transition-all hover:scale-105">
                      Contact Sales
                    </Button>
                  </Link>
                </div>
              </FadeIn>
            </div>
            <FadeIn delay={0.3} className="relative">
              <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&q=90"
                  alt="Team meeting with food"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Perfect for every occasion</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether it's a small team meeting or a large campus event, we've got you covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Department Meetings",
                description: "Keep your team focused and energized with convenient meal delivery for meetings and work sessions.",
                image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&h=400&fit=crop&q=80"
              },
              {
                title: "Campus Events",
                description: "From orientations to conferences, easily manage food for events of any size with group ordering.",
                image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop&q=80"
              },
              {
                title: "Study Sessions",
                description: "Support student success with easy meal coordination for tutoring centers and study groups.",
                image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&q=80"
              },
              {
                title: "Staff Appreciation",
                description: "Show your team you care with regular meal benefits and special occasion catering.",
                image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop&q=80"
              },
              {
                title: "Late Night Work",
                description: "Support teams working late hours with quick access to food when campus dining is closed.",
                image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop&q=80"
              },
              {
                title: "Client Meetings",
                description: "Impress visitors and prospects with professional catering delivered right to your campus office.",
                image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&h=400&fit=crop&q=80"
              }
            ].map((useCase) => (
              <div key={useCase.title} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={useCase.image}
                    alt={useCase.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-3">{useCase.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{useCase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Built for organizations</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enterprise features designed to make team ordering simple and efficient
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                title: "Centralized Billing",
                description: "One invoice for all orders. Simplified expense tracking and reporting for your finance team.",
                icon: "💳"
              },
              {
                title: "Group Ordering",
                description: "Let everyone choose what they want. Collect orders from your team and deliver everything at once.",
                icon: "👥"
              },
              {
                title: "Scheduled Delivery",
                description: "Plan ahead with scheduled orders. Set up recurring deliveries for regular team meetings.",
                icon: "📅"
              },
              {
                title: "Expense Management",
                description: "Set budgets, track spending, and export detailed reports for accounting and reimbursements.",
                icon: "📊"
              },
              {
                title: "Dietary Preferences",
                description: "Easily accommodate dietary restrictions and preferences with filters and special instructions.",
                icon: "🥗"
              },
              {
                title: "Dedicated Support",
                description: "Your own account manager and priority support for urgent needs and special requests.",
                icon: "🎯"
              }
            ].map((feature) => (
              <div key={feature.title} className="flex gap-6">
                <div className="text-5xl flex-shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Simple setup, easy ordering</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get your team started in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Create Account", description: "Sign up your organization and add team members with custom permissions." },
              { step: "2", title: "Set Budget", description: "Configure spending limits and billing preferences for your department." },
              { step: "3", title: "Place Order", description: "Choose individual or group ordering. Select from hundreds of campus restaurants." },
              { step: "4", title: "Track & Report", description: "Monitor orders in real-time and export detailed expense reports." }
            ].map((step) => (
              <div key={step.step} className="text-center space-y-4">
                <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-secondary/10 rounded-full">
                <span className="text-sm font-semibold text-secondary">Customer Story</span>
              </div>
              <h2 className="text-4xl font-bold text-foreground">
                "DoorStep transformed how we handle team meals"
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                "Before DoorStep for Work, coordinating team lunches was a nightmare. Now, everyone can order exactly what they want, we stay within budget, and I get detailed expense reports automatically. It saves us hours every week and keeps the team happy."
              </p>
              <div className="space-y-1">
                <div className="font-semibold text-foreground text-lg">Dr. Jennifer Lee</div>
                <div className="text-muted-foreground">Department Chair, Computer Science</div>
                <div className="text-muted-foreground">State University</div>
              </div>
            </div>
            <div className="relative">
              <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop&q=90"
                  alt="Team collaboration"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Flexible pricing for every team size</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Custom pricing based on your organization's needs
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "Free",
                description: "Perfect for small teams",
                features: ["Up to 10 members", "Standard delivery", "Basic reporting", "Email support"]
              },
              {
                name: "Professional",
                price: "Custom",
                description: "For growing departments",
                features: ["Unlimited members", "Scheduled delivery", "Advanced analytics", "Priority support", "Dedicated account manager"]
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large organizations",
                features: ["Everything in Professional", "Custom integrations", "Volume discounts", "SLA guarantees", "On-campus training"]
              }
            ].map((plan) => (
              <div key={plan.name} className="bg-white rounded-3xl shadow-lg p-8 text-left">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-primary mb-2">{plan.price}</div>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Ready to simplify team meals?</h2>
          <p className="text-xl text-muted-foreground">
            Join departments and organizations across campus using DoorStep for Work.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup">
              <Button className="bg-foreground text-white hover:bg-foreground/90 rounded-full px-10 py-6 text-lg font-semibold shadow-lg">
                Get Started Free
              </Button>
            </Link>
            <Link href="/help">
              <Button variant="outline" className="rounded-full px-10 py-6 text-lg font-semibold border-2">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
