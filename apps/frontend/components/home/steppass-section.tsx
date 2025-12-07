import { Button } from "@/components/ui/button"

export function StepPassSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=500&fit=crop&q=80"
              alt="Food spread on table"
              className="rounded-lg w-full h-auto object-cover"
            />
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              StepPass is delivery for less
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Members get a $0 delivery fee on StepPass orders, 5% back on pickup orders, and so much more. Plus, it's
              free for 30 days.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">Get StepPass</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
