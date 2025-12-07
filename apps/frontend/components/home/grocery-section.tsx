export function GrocerySection() {
  return (
    <section className="relative py-32 px-6">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1543168256-8133cc8e3ee4?w=1600&h=600&fit=crop&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Get grocery and convenience store essentials
        </h2>
        <h3 className="text-xl font-semibold mb-4">Grocery delivery, exactly how you want it.</h3>
        <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
          Shop from home and fill your cart with fresh produce, frozen entrees, deli delights and more.
        </p>
      </div>
    </section>
  )
}
