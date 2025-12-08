import Link from "next/link"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container"

const featuredPost = {
  title: "How Campus Pizza Increased Revenue by 45% with DoorStep",
  excerpt: "Learn how one local restaurant transformed their business by partnering with DoorStep and reaching thousands of new student customers.",
  image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=600&fit=crop&q=90",
  category: "Success Story",
  date: "December 1, 2025",
  readTime: "6 min read",
  restaurant: "Campus Pizza",
  href: "#"
}

const merchantPosts = [
  {
    title: "5 Menu Optimization Tips to Boost Your Online Orders",
    excerpt: "Data-driven strategies to make your menu more appealing to students and increase average order value.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&q=80",
    category: "Best Practices",
    date: "November 22, 2025",
    readTime: "5 min read",
    href: "#"
  },
  {
    title: "Managing Peak Hours: A Guide for Campus Restaurants",
    excerpt: "Proven tactics for handling lunch and late-night rushes while maintaining quality and speed.",
    image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=600&h=400&fit=crop&q=80",
    category: "Operations",
    date: "November 14, 2025",
    readTime: "7 min read",
    href: "#"
  },
  {
    title: "The Power of Photos: How Great Food Photography Drives Sales",
    excerpt: "Why professional menu photos matter and how they can increase your order volume by up to 30%.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=80",
    category: "Marketing",
    date: "November 5, 2025",
    readTime: "4 min read",
    href: "#"
  },
  {
    title: "Meet the Merchant: The Daily Grind Coffee Shop",
    excerpt: "How a small campus coffee shop became the #1 breakfast spot on DoorStep.",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop&q=80",
    category: "Merchant Spotlight",
    date: "October 28, 2025",
    readTime: "6 min read",
    href: "#"
  },
  {
    title: "Leveraging Student Preferences: What Your Analytics Are Telling You",
    excerpt: "Understanding your DoorStep dashboard data to make smarter business decisions.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&q=80",
    category: "Analytics",
    date: "October 18, 2025",
    readTime: "8 min read",
    href: "#"
  },
  {
    title: "Seasonal Menu Planning for Maximum Student Appeal",
    excerpt: "How to adjust your offerings throughout the academic year to match student demand and events.",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=400&fit=crop&q=80",
    category: "Menu Strategy",
    date: "October 10, 2025",
    readTime: "5 min read",
    href: "#"
  }
]

export default function MerchantBlogPage() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-2">
            <span className="text-sm font-semibold text-primary">Merchant Blog</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">Partner Resources</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tips, insights, and success stories for our restaurant and business partners
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Featured Post */}
        <Link href={featuredPost.href} className="block group">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                    Featured
                  </div>
                  <div className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-sm font-semibold rounded-full">
                    {featuredPost.category}
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{featuredPost.restaurant}</span>
                  <span>•</span>
                  <span>{featuredPost.date}</span>
                  <span>•</span>
                  <span>{featuredPost.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {merchantPosts.map((post) => (
            <Link key={post.title} href={post.href} className="group">
              <article className="h-full bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-3 py-1 bg-primary/10 text-primary font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground pt-2">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to grow your business?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of campus merchants reaching thousands of students every day
          </p>
          <Link href="/business">
            <button className="bg-foreground text-white hover:bg-foreground/90 rounded-full px-8 py-4 text-lg font-semibold shadow-lg transition-all">
              Become a Partner
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}
