import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white pt-32 pb-20 px-6 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-orange-50 to-transparent rounded-full translate-y-1/2 -translate-x-1/3 opacity-60" />
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-8 relative">
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 rounded-full mb-4 border border-gray-200">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-gray-700 tracking-wide">ABOUT DOORSTEP</span>
            </div>
          </FadeIn>
          <ScrollReveal delay={0.2}>
            <h1 className="text-6xl md:text-7xl font-bold text-foreground leading-[1.1]">
              Transforming<br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-orange-500 to-secondary bg-clip-text text-transparent">
                  campus life
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10C77.3333 3.33333 227.2 -2.4 298 6" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgb(249 115 22)" />
                      <stop offset="100%" stopColor="rgb(236 72 153)" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>
          </ScrollReveal>
          <FadeIn delay={0.4}>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Building the future of campus commerce, connecting students with their favorite local spots while creating flexible earning opportunities.
            </p>
          </FadeIn>
          <FadeIn delay={0.5}>
            <div className="flex items-center justify-center gap-8 pt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold text-foreground">50K+</div>
                  <div className="text-gray-500">Students</div>
                </div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold text-foreground">200+</div>
                  <div className="text-gray-500">Partners</div>
                </div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold text-foreground">1M+</div>
                  <div className="text-gray-500">Deliveries</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-foreground">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  DoorStep started with a simple idea: make campus life easier. We saw students struggling to balance academics, work, and getting the essentials they need. We saw local businesses wanting to reach more students. And we saw an opportunity to create meaningful work for our peers.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Today, we're proud to serve thousands of students across campuses, partnering with local restaurants and stores to bring convenience to every dorm room, library, and study spot.
                </p>
              </div>
            </ScrollReveal>
            <FadeIn delay={0.2}>
              <div className="relative">
                <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl group">
                  <img
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop&q=90"
                    alt="Students on campus"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <ScrollReveal>
              <h2 className="text-4xl font-bold text-foreground mb-4">Our Values</h2>
            </ScrollReveal>
            <FadeIn delay={0.2}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything we do is guided by these core principles
              </p>
            </FadeIn>
          </div>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Student-First",
                description: "Every decision we make prioritizes the student experience, from pricing to delivery speed to customer support.",
                image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&q=80"
              },
              {
                title: "Community-Driven",
                description: "We're not just a platform—we're part of the campus community, supporting local businesses and creating opportunities.",
                image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop&q=80"
              },
              {
                title: "Innovation",
                description: "We're constantly evolving, using technology to make campus life more convenient and connected than ever before.",
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop&q=80"
              }
            ].map((value) => (
              <StaggerItem key={value.title}>
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group h-full">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={value.image}
                      alt={value.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-foreground mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <StaggerContainer className="grid md:grid-cols-4 gap-8 text-center" staggerDelay={0.15}>
            {[
              { value: "50K+", label: "Students Served" },
              { value: "200+", label: "Campus Partners" },
              { value: "1M+", label: "Deliveries Made" },
              { value: "15 min", label: "Avg. Delivery Time" }
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="space-y-2">
                  <div className="text-5xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-lg text-muted-foreground">{stat.label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Join the DoorStep community</h2>
          </ScrollReveal>
          <FadeIn delay={0.2}>
            <p className="text-xl text-muted-foreground">
              Whether you're ordering, delivering, or partnering with us—let's build something great together.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup">
                <Button className="bg-foreground text-white hover:bg-foreground/90 rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  Get Started
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
      </section>
    </main>
  )
}
