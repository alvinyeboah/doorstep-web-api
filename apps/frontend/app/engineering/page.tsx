import Link from "next/link"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container"

const featuredPost = {
  title: "Building Real-Time Delivery Tracking with WebSockets and React",
  excerpt: "A deep dive into how we built our real-time tracking system to give students accurate ETAs and live location updates.",
  image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop&q=90",
  category: "Engineering",
  date: "December 3, 2025",
  readTime: "10 min read",
  author: "Alex Chen",
  href: "#"
}

const engineeringPosts = [
  {
    title: "Scaling Our Backend to Handle 100K+ Concurrent Orders",
    excerpt: "How we optimized our microservices architecture and database queries to handle massive growth during peak hours.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop&q=80",
    category: "Infrastructure",
    date: "November 25, 2025",
    readTime: "12 min read",
    author: "Sarah Johnson",
    href: "#"
  },
  {
    title: "Machine Learning for Smart Route Optimization",
    excerpt: "Exploring how we use ML algorithms to optimize delivery routes and reduce delivery times by 30%.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop&q=80",
    category: "Machine Learning",
    date: "November 18, 2025",
    readTime: "15 min read",
    author: "Marcus Rodriguez",
    href: "#"
  },
  {
    title: "Our Migration from REST to GraphQL: Lessons Learned",
    excerpt: "Why we made the switch, the challenges we faced, and how it improved our mobile app performance.",
    image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=600&h=400&fit=crop&q=80",
    category: "API Design",
    date: "November 10, 2025",
    readTime: "8 min read",
    author: "Emily Park",
    href: "#"
  },
  {
    title: "Testing at Scale: Our CI/CD Pipeline Evolution",
    excerpt: "From manual testing to automated deployment pipelines—how we ship code faster while maintaining quality.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&q=80",
    category: "DevOps",
    date: "October 28, 2025",
    readTime: "9 min read",
    author: "David Kim",
    href: "#"
  },
  {
    title: "Building a Design System for Rapid Feature Development",
    excerpt: "How our React component library and design tokens accelerated development across web and mobile.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop&q=80",
    category: "Frontend",
    date: "October 15, 2025",
    readTime: "7 min read",
    author: "Lisa Zhang",
    href: "#"
  },
  {
    title: "Data Privacy by Design: Our Security Architecture",
    excerpt: "A comprehensive look at how we protect student data with end-to-end encryption and zero-trust principles.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop&q=80",
    category: "Security",
    date: "October 5, 2025",
    readTime: "11 min read",
    author: "James Wilson",
    href: "#"
  }
]

export default function EngineeringBlogPage() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="text-center space-y-4">
          <FadeIn delay={0.1}>
            <div className="inline-block px-4 py-2 bg-secondary/10 rounded-full mb-2">
              <span className="text-sm font-semibold text-secondary">Engineering Blog</span>
            </div>
          </FadeIn>
          <ScrollReveal delay={0.2}>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">Building DoorStep</h1>
          </ScrollReveal>
          <FadeIn delay={0.3}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Technical insights and innovations from our engineering team
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
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-12 flex flex-col justify-center">
                <div className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-sm font-semibold rounded-full mb-4 w-fit">
                  Featured
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 group-hover:text-secondary transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{featuredPost.author}</span>
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
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
          {engineeringPosts.map((post) => (
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
                    <span className="px-3 py-1 bg-secondary/10 text-secondary font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-secondary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground pt-2">
                    <span className="font-medium text-foreground">{post.author}</span>
                    <div className="flex items-center gap-2">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
        </FadeIn>
      </div>
    </main>
  )
}
