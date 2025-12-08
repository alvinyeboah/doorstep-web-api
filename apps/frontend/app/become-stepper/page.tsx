import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import { FadeIn } from "@/components/animations/fade-in"

export default function BecomeStepperPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-primary to-secondary pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(30deg, rgba(255,255,255,.1) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,.1) 87.5%, rgba(255,255,255,.1)), linear-gradient(150deg, rgba(255,255,255,.1) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,.1) 87.5%, rgba(255,255,255,.1)), linear-gradient(30deg, rgba(255,255,255,.1) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,.1) 87.5%, rgba(255,255,255,.1)), linear-gradient(150deg, rgba(255,255,255,.1) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,.1) 87.5%, rgba(255,255,255,.1))',
            backgroundSize: '80px 140px',
            backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <FadeIn delay={0.1}>
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                  <span className="text-sm font-bold text-white tracking-wider">FLEXIBLE EARNINGS</span>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              </FadeIn>
              <ScrollReveal delay={0.2}>
                <h1 className="text-6xl md:text-7xl font-bold text-white leading-[1.1]">
                  Become a<br />
                  <span className="relative inline-block">
                    Stepper
                    <div className="absolute -bottom-3 left-0 w-full h-1 bg-white/50 rounded-full" />
                  </span>
                </h1>
              </ScrollReveal>
              <FadeIn delay={0.3}>
                <p className="text-2xl text-white/90 leading-relaxed font-light">
                  Join thousands of students earning flexible income delivering food and essentials around campus.
                </p>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <Link href="/signup">
                      <Button className="bg-white text-primary hover:bg-gray-50 rounded-full px-10 py-7 text-lg font-bold shadow-2xl hover:shadow-white/20 transition-all hover:scale-105">
                        Start Earning Today
                      </Button>
                    </Link>
                    <Link href="/login" className="text-white font-semibold hover:underline px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
                      Already signed up? Sign in
                    </Link>
                  </div>
                  <div className="flex gap-8 text-white/90">
                    <div className="flex flex-col">
                      <div className="text-3xl font-bold">$15-25</div>
                      <div className="text-sm font-medium text-white/70">Per hour</div>
                    </div>
                    <div className="w-px bg-white/30" />
                    <div className="flex flex-col">
                      <div className="text-3xl font-bold">Weekly</div>
                      <div className="text-sm font-medium text-white/70">Payouts</div>
                    </div>
                    <div className="w-px bg-white/30" />
                    <div className="flex flex-col">
                      <div className="text-3xl font-bold">100%</div>
                      <div className="text-sm font-medium text-white/70">Keep tips</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
            <FadeIn delay={0.3} className="relative">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl rounded-[3rem] transform rotate-6" />
                <div className="relative w-full h-[550px] rounded-[3rem] overflow-hidden shadow-2xl group border-4 border-white/20">
                  <img
                    src="https://images.unsplash.com/photo-1607013407627-6ee81fa44aea?w=800&h=600&fit=crop&q=90"
                    alt="Delivery person on campus"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Earnings Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">How much can you earn?</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Your earnings depend on how often you work. Here's what Steppers typically make:
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { hours: "10 hrs/week", earnings: "$150-200", description: "Perfect for casual earnings" },
              { hours: "20 hrs/week", earnings: "$300-400", description: "Great side income" },
              { hours: "30+ hrs/week", earnings: "$500+", description: "Serious earning potential" }
            ].map((tier) => (
              <div key={tier.hours} className="bg-white rounded-3xl p-8 shadow-lg">
                <div className="text-sm font-semibold text-primary mb-2">{tier.hours}</div>
                <div className="text-4xl font-bold text-foreground mb-2">{tier.earnings}</div>
                <div className="text-muted-foreground">{tier.description}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-8">
            * Earnings are estimates and may vary based on location, time of day, and demand.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why become a Stepper?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              More than just a job—it's the most flexible way to earn on campus
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Total Flexibility",
                description: "Work only when you want. No schedules, no commitments. Perfect for fitting around classes and study time.",
                image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop&q=80"
              },
              {
                title: "Weekly Payouts",
                description: "Get paid weekly via direct deposit. Track your earnings in real-time through the Stepper app.",
                image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&h=400&fit=crop&q=80"
              },
              {
                title: "Stay Active",
                description: "Earn money while staying active around campus. Bike, walk, or use your preferred mode of transport.",
                image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&h=400&fit=crop&q=80"
              },
              {
                title: "Meet People",
                description: "Connect with fellow students and become part of the campus community while you earn.",
                image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop&q=80"
              },
              {
                title: "Keep 100% of Tips",
                description: "All tips go directly to you. Customers love showing appreciation for great service.",
                image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&h=400&fit=crop&q=80"
              },
              {
                title: "24/7 Support",
                description: "Our support team is always here to help with any questions or issues you encounter.",
                image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop&q=80"
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
            <h2 className="text-4xl font-bold text-foreground mb-4">How it works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Getting started is easy. Start earning in just a few steps.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Sign Up", description: "Create your account in minutes with just your school email and basic info." },
              { step: "2", title: "Get Approved", description: "We'll verify your student status and complete a quick background check." },
              { step: "3", title: "Go Online", description: "Download the Stepper app and toggle online when you're ready to accept orders." },
              { step: "4", title: "Start Earning", description: "Pick up orders, deliver to students, and earn money on your schedule." }
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

      {/* Requirements */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Requirements</h2>
            <p className="text-lg text-muted-foreground">
              Make sure you meet these basic requirements before signing up
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
            <ul className="space-y-4">
              {[
                "Must be currently enrolled as a student",
                "At least 18 years old",
                "Have a smartphone (iOS or Android)",
                "Valid government-issued ID",
                "Ability to bike, walk, or use campus-approved transportation",
                "Pass a background check"
              ].map((requirement) => (
                <li key={requirement} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-foreground text-lg">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Ready to start earning?</h2>
          <p className="text-xl text-muted-foreground">
            Join the DoorStep community and start making money on your schedule today.
          </p>
          <Link href="/signup">
            <Button className="bg-foreground text-white hover:bg-foreground/90 rounded-full px-10 py-6 text-lg font-semibold shadow-lg">
              Become a Stepper
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
