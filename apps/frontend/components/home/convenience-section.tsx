import { Button } from "@/components/ui/button"

export function ConvenienceSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Convenience stores at your doorstep
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Stock up on snacks, household essentials, candy, or vitamins — all delivered in under an hour.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">Shop Now</Button>
          </div>
          <div className="relative">
            <img
              src="/placeholder.svg?height=500&width=600"
              alt="Convenience store delivery"
              className="rounded-lg w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
