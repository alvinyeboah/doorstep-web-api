import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-white to-blue-50 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-sm font-semibold text-primary">About DoorStep</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Transforming campus life,
            <span className="block text-primary">one delivery at a time</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're building the future of campus commerce, connecting students with their favorite local spots while creating flexible earning opportunities.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-foreground">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                DoorStep started with a simple idea: make campus life easier. We saw students struggling to balance academics, work, and getting the essentials they need. We saw local businesses wanting to reach more students. And we saw an opportunity to create meaningful work for our peers.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Today, we're proud to serve thousands of students across campuses, partnering with local restaurants and stores to bring convenience to every dorm room, library, and study spot.
              </p>
            </div>
            <div className="relative">
              <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop&q=90"
                  alt="Students on campus"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything we do is guided by these core principles
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
              <div key={value.title} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={value.image}
                    alt={value.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50K+", label: "Students Served" },
              { value: "200+", label: "Campus Partners" },
              { value: "1M+", label: "Deliveries Made" },
              { value: "15 min", label: "Avg. Delivery Time" }
            ].map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="text-5xl font-bold text-primary">{stat.value}</div>
                <div className="text-lg text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Join the DoorStep community</h2>
          <p className="text-xl text-muted-foreground">
            Whether you're ordering, delivering, or partnering with us—let's build something great together.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup">
              <Button className="bg-foreground text-white hover:bg-foreground/90 rounded-full px-8 py-6 text-lg font-semibold shadow-lg">
                Get Started
              </Button>
            </Link>
            <Link href="/help">
              <Button variant="outline" className="rounded-full px-8 py-6 text-lg font-semibold border-2">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
