import Link from "next/link"
import { Button } from "@/components/ui/button"

export function OpportunitySection() {
  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Become a Stepper - Dark theme card */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[2.5rem] overflow-hidden relative">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 relative">
            <div className="p-12 lg:p-16 flex flex-col justify-center space-y-8">
              <div className="inline-block px-5 py-2.5 bg-primary/20 rounded-full w-fit border border-primary/30">
                <span className="text-sm font-bold text-primary tracking-wide">EARN MONEY</span>
              </div>
              <h3 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Earn on<br />
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  your schedule
                </span>
              </h3>
              <p className="text-xl text-gray-300 leading-relaxed">
                Deliver for your campus community and get paid weekly. Work when you want, earn what you need.
              </p>
              <div className="space-y-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 h-14 text-base font-semibold shadow-lg hover:shadow-primary/50 transition-all hover:scale-105">
                    Become a Stepper
                  </Button>
                </Link>
                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white">Flexible hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white">Weekly pay</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-full min-h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop&q=90"
                alt="Delivery driver"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-900/50" />
            </div>
          </div>
        </div>

        {/* Grow your business */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&h=600&fit=crop&q=90"
                alt="Restaurant partner"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <h3 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Grow your business
            </h3>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Reach hungry students and expand your sales. Join the leading campus food delivery platform.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-14 text-base font-semibold">
                Become a partner
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
