import { Button } from "@/components/ui/button"

export function OpportunitySection() {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-16">
          Unlocking opportunity for Steppers and businesses
        </h2>

        {/* Become a Stepper */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              Sign up to step and get paid
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Deliver with the #1 Food and Drink App on campus. As a delivery driver, you'll make money and work on your
              schedule. Sign up in minutes.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">Become a Stepper</Button>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=500&fit=crop&q=80"
              alt="Delivery driver"
              className="rounded-lg w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Grow your business */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&h=500&fit=crop&q=80"
              alt="Restaurant partner"
              className="rounded-lg w-full h-auto object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              Grow your business with DoorStep
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Reach new customers and grow your sales with delivery and pickup. Our platform gives you the tools to
              manage orders and connect with hungry students.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">Get started</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
