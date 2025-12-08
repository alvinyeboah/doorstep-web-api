'use client'

import { useState } from "react"
import Link from "next/link"

const categories = [
  {
    name: "For Customers",
    faqs: [
      {
        question: "How do I place an order?",
        answer: "Simply enter your delivery address on our homepage, browse available restaurants and stores, add items to your cart, and checkout. You can track your order in real-time once placed."
      },
      {
        question: "What are the delivery fees?",
        answer: "Delivery fees vary by distance and demand, typically ranging from $0.99 to $3.99. Your first order gets free delivery! You can also subscribe to DoorStep Premium for unlimited free deliveries."
      },
      {
        question: "How long does delivery take?",
        answer: "Most deliveries arrive within 15-30 minutes, depending on restaurant preparation time and your location on campus. You'll get a real-time estimate when placing your order."
      },
      {
        question: "Can I track my order?",
        answer: "Yes! Once your order is accepted, you can track it in real-time. You'll see when the restaurant is preparing your food and when your Stepper is on the way."
      },
      {
        question: "What if something is wrong with my order?",
        answer: "We're here to help! Contact support immediately through the app or website. We'll work with the restaurant to resolve issues and may offer refunds or credits."
      },
      {
        question: "How do I contact my Stepper?",
        answer: "You can message your Stepper directly through the app once they've picked up your order. This is helpful for special delivery instructions."
      }
    ]
  },
  {
    name: "For Steppers",
    faqs: [
      {
        question: "How much can I earn as a Stepper?",
        answer: "Earnings vary based on when and how often you work. Most Steppers earn $15-25 per hour including tips. You keep 100% of customer tips on top of delivery fees."
      },
      {
        question: "When do I get paid?",
        answer: "Payments are processed weekly via direct deposit every Monday for the previous week's earnings. You can track your earnings in real-time through the Stepper app."
      },
      {
        question: "What are the requirements to become a Stepper?",
        answer: "You must be 18+, currently enrolled as a student, have a valid ID, smartphone, and pass a background check. You'll need your own transportation (bike, walk, etc.)."
      },
      {
        question: "Can I choose when I work?",
        answer: "Absolutely! Toggle online whenever you want to accept orders. There are no schedules or minimum hours required."
      },
      {
        question: "What if I have an issue during delivery?",
        answer: "Contact our 24/7 Stepper support through the app. We're always available to help with navigation issues, order problems, or any concerns."
      },
      {
        question: "Do I need my own bag?",
        answer: "We provide an insulated delivery bag when you sign up. You're responsible for keeping it clean and in good condition."
      }
    ]
  },
  {
    name: "For Partners",
    faqs: [
      {
        question: "How much does it cost to partner with DoorStep?",
        answer: "There are no upfront costs or monthly fees. We charge a 15% commission on orders placed through our platform. You only pay when you make sales."
      },
      {
        question: "How do I update my menu?",
        answer: "You can update your menu, prices, and photos anytime through the Partner Dashboard on your tablet or web browser. Changes go live immediately."
      },
      {
        question: "When do I receive payment?",
        answer: "Payments are deposited weekly via direct deposit. You'll receive payment for all orders from the previous week, minus the commission."
      },
      {
        question: "Can I pause accepting orders?",
        answer: "Yes! You can toggle your availability on/off through the tablet app. This is helpful during busy times or when you need to pause for prep."
      },
      {
        question: "How do I handle order issues?",
        answer: "If there's an issue with an order, contact our partner support team immediately through the tablet app. We'll work with you and the customer to resolve it."
      },
      {
        question: "What marketing support do you provide?",
        answer: "We feature partners in promotional campaigns, send targeted emails to customers, and provide free professional photography for your menu items."
      }
    ]
  }
]

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <main className="min-h-screen bg-white pt-24 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-2">
            <span className="text-sm font-semibold text-primary">Help & Support</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">How can we help you?</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions or reach out to our support team
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-6 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/signup" className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-foreground">Contact Support</div>
                <div className="text-sm text-muted-foreground">Get help from our team</div>
              </div>
            </Link>
            <Link href="/about" className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-foreground">About DoorStep</div>
                <div className="text-sm text-muted-foreground">Learn more about us</div>
              </div>
            </Link>
            <Link href="/blog" className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-foreground">Latest Updates</div>
                <div className="text-sm text-muted-foreground">Read our blog</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground text-center mb-12">Frequently Asked Questions</h2>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category, index) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(index)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeCategory === index
                    ? "bg-foreground text-white shadow-lg"
                    : "bg-gray-100 text-foreground hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="max-w-3xl mx-auto space-y-4">
            {categories[activeCategory].faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-foreground text-lg pr-4">{faq.question}</span>
                  <svg
                    className={`w-6 h-6 text-primary flex-shrink-0 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-foreground">Still have questions?</h2>
          <p className="text-xl text-muted-foreground">
            Our support team is here to help 24/7
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Email Support</h3>
              <p className="text-muted-foreground mb-4">We'll respond within 24 hours</p>
              <a href="mailto:support@doorstep.com" className="text-primary font-semibold hover:underline">
                support@doorstep.com
              </a>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Live Chat</h3>
              <p className="text-muted-foreground mb-4">Chat with us in real-time</p>
              <button className="text-primary font-semibold hover:underline">
                Start a conversation
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
