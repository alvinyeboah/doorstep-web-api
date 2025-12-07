import { Button } from "@/components/ui/button"

export function RestaurantSection() {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Everything you crave, delivered.
            </h2>
            <h3 className="text-xl font-semibold text-foreground mb-4">Your favorite local restaurants</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Get a slice of pizza or the whole pie delivered, or pick up house lo mein from the Chinese takeout spot
              you've been meaning to try.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">Find restaurants</Button>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=500&fit=crop&q=80"
              alt="People enjoying food at a picnic"
              className="rounded-lg w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
