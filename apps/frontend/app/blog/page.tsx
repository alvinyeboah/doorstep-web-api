import Link from "next/link"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container"

const featuredPost = {
  title: "Introducing DoorStep Premium: Your All-Access Pass to Campus",
  excerpt: "We're excited to announce DoorStep Premium, a new membership program designed to make campus life even more convenient and affordable.",
  image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop&q=90",
  category: "Product Updates",
  date: "December 5, 2025",
  readTime: "5 min read",
  href: "#"
}

const blogPosts = [
  {
    title: "How DoorStep is Supporting Local Campus Businesses",
    excerpt: "Discover how our platform is helping small businesses thrive while keeping students connected to their favorite local spots.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&q=80",
    category: "Community",
    date: "November 28, 2025",
    readTime: "4 min read",
    href: "#"
  },
  {
    title: "5 Ways Students Are Using DoorStep Beyond Food Delivery",
    excerpt: "From late-night study snacks to dorm room essentials, see how students are making the most of our platform.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&q=80",
    category: "Student Life",
    date: "November 20, 2025",
    readTime: "3 min read",
    href: "#"
  },
  {
    title: "Expanding to 50 New Campuses This Semester",
    excerpt: "We're growing! Learn about our expansion plans and see if DoorStep is coming to a campus near you.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=400&fit=crop&q=80",
    category: "Company News",
    date: "November 15, 2025",
    readTime: "4 min read",
    href: "#"
  },
  {
    title: "Behind the Scenes: A Day in the Life of a DoorStep Stepper",
    excerpt: "Meet Sarah, a junior at State University, who shares her experience earning flexible income as a DoorStep delivery partner.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&q=80",
    category: "Stepper Stories",
    date: "November 8, 2025",
    readTime: "6 min read",
    href: "#"
  },
  {
    title: "Sustainability Initiatives: Our Commitment to Green Delivery",
    excerpt: "Learn about our eco-friendly packaging program and carbon offset initiatives making campus delivery more sustainable.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&q=80",
    category: "Sustainability",
    date: "October 30, 2025",
    readTime: "5 min read",
    href: "#"
  },
  {
    title: "DoorStep Year in Review: 2025 Highlights",
    excerpt: "From record deliveries to new partnerships, celebrate the milestones that made this year unforgettable.",
    image: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=600&h=400&fit=crop&q=80",
    category: "Year in Review",
    date: "October 25, 2025",
    readTime: "7 min read",
    href: "#"
  }
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="text-center space-y-4">
          <FadeIn delay={0.1}>
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-2">
              <span className="text-sm font-semibold text-primary">Company Blog</span>
            </div>
          </FadeIn>
          <ScrollReveal delay={0.2}>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">Stories from DoorStep</h1>
          </ScrollReveal>
          <FadeIn delay={0.3}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Updates, insights, and stories from our team and community
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Featured Post */}
        <FadeIn>
          <Link href={featuredPost.href} className="block group">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-12 flex flex-col justify-center">
                  <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4 w-fit">
                    Featured
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{featuredPost.date}</span>
                    <span>•</span>
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </FadeIn>

        {/* Blog Posts Grid */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
          {blogPosts.map((post) => (
            <StaggerItem key={post.title}>
              <Link href={post.href} className="group block h-full">
                <article className="h-full bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </main>
  )
}
