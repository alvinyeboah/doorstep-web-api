import Link from "next/link"
import { Button } from "@/components/ui/button"

export function StepPassSection() {
  return (
    <section className="py-32 px-6 bg-gradient-to-br from-secondary/10 via-secondary/5 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="relative order-2 lg:order-1 h-full min-h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&h=600&fit=crop&q=90"
                alt="Food spread"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-transparent" />
            </div>
            <div className="p-12 lg:p-16 flex flex-col justify-center space-y-8 order-1 lg:order-2">
              <div className="inline-block px-5 py-2.5 bg-secondary/10 rounded-full w-fit">
                <span className="text-sm font-bold text-secondary tracking-wide">MEMBERSHIP</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                StepPass is<br />
                <span className="bg-gradient-to-r from-secondary to-orange-500 bg-clip-text text-transparent">
                  delivery for less
                </span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Save on every order with $0 delivery fees and exclusive perks. Try it free for 30 days.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-10 h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    Get StepPass
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>30-day free trial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
