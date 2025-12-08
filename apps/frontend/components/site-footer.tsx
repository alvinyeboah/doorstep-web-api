import Link from "next/link"
import Image from "next/image"

const footerSections = {
  product: [
    { label: "How DoorStep Works", href: "/how-it-works" },
    { label: "Features", href: "/features" },
    { label: "Security", href: "/security" },
    { label: "Pricing", href: "/pricing" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Blog", href: "/blog" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "API Documentation", href: "/docs" },
    { label: "Status", href: "/status" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "GDPR", href: "/gdpr" },
  ],
}

const socialLinks = [
  {
    name: "Twitter",
    href: "#",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 00-2.825-.775 10 10 0 012.825-.775c.526.13 1.04.33 1.527.6a9.817 9.817 0 006.49 3.258 4.051 4.051 0 00-1.77-1.646c-.007.136-.03.015-.272-.022-.408a10.003 10.003 0 003.278-3.089 3.918 3.918 0 00-1.612-1.113 4.817 4.817 0 00-2.59-4.362c-.358-.15-.735-.224-1.112-.224a10.011 10.011 0 00-3.272 3.089 10.003 10.003 0 00-3.28-3.089 10.005 10.005 0 00-3.278 3.089 3.98 3.98 0 00-1.612 1.113 10.005 10.005 0 002.588 4.399c.317.135.645.23.978.295a3.937 3.937 0 001.77 1.646 10.005 10.005 0 003.278 3.089 10.003 10.003 0 002.828-.775 10.011 10.011 0 003.272-3.089 10.005 10.005 0 002.588-4.399z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.852 0-1.061.743-1.815 1.418-1.815a1.907 1.907 0 012.269 1.816v2.508h-1.718v3.098h1.718v8.019h3.554v-8.019c.004-3.919 2.267-5.984 5.418-5.984 1.444 0 2.624.269 3.438.555v3.448z" />
        <path d="M7.877 20.452H11.33v-8.019H7.877v8.019z" />
        <path d="M9.603 9.756a2.011 2.011 0 100-4.023 2.011 2.011 0 000 4.023z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "#",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-2.845h-3.047c-.38 0-.75-.197-.957-.537-.747-.363-1.104-.057-.25-.574-1.582-1.892-1.611-.04-.417-.12-.806-.25-1.358-.337-1.288.231-2.003.913-2.003 2.173v1.113h-1.703c-.004.073-.236.804-.236 1.413 0 2.173 1.362 2.173 3.475v2.845h-3.025c-.025.293-.168 2.033-.168 2.644 0 .612.042 1.776.245 1.758 1.384-.002.29-.019 1.016-.019 1.257v2.515c.257.18.466.75.257 1.367zm-14.352-.257c0 .608-.007.917-.025 1.333v5.073c0 .414-.007.721-.025 1.333v-8.406c0-.414.007-.721.025-1.333.025-1.758 0-1.942.534-3.442 1.892-3.442 1.054 0 1.515.447 1.892 1.083v2.316c-.333-.18-.69-.272-1.083-.272-1.083 0-1.531.761-1.531 2.198 0 1.198.752 2.198 2.069 2.198 1.258 0 1.828-.259 2.813-.773 0 1.023.775 1.877 2.069 2.083 1.258.333 1.828-.259 2.813-.773v4.083c0 .414.007.721.025 1.333.025 1.758 0 1.942-.534 3.442-1.892 3.442-1.054 0-1.515-.447-1.892-1.083v-2.316c.333.18.69.272 1.083.272 1.083 0 1.531-.761 1.531-2.198 0-1.198-.752-2.198-2.069-2.198-1.258 0-1.828.259-2.813.773z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.854.219 2.515.625 3.19 1.258.217.126.689.656 1.258 1.19 1.754 1.857 4.489 2.083 5.855.196 2.364-.165 3.494-.775 3.494-.775.169-.032.307-.4.415-.608-.148-.219-.365-.488-.697-.737-.432-.337-.517-.594-.517-.594-.18-.127-.352-.175-.402-.057-.233.075-.281.395a6.215 6.215 0 01-.884 2.835c-.604 2.637-2.374 5.374-4.633 5.974-2.259.604-5.29-1.18-7.549-2.684a6.216 6.216 0 01-3.36-5.975c-.594-2.637.057-5.381.604-5.974.13-.33.273-.608.517-.884.369.348.702.348 1.052-.084 1.347-.11 4.331-.52 5.855-.266 2.234-.259 4.083-.604 5.855-.266 1.48-.352 3.317-.604 4.463-.266z" />
        <path d="M15.53 8.25a2.25 2.25 0 112.5-2.25 2.25 2.25 0 01-2.5 2.25z" />
        <circle cx="12" cy="12" r="2.25" />
      </svg>
    ),
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-16">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center mb-6">
                <div className="relative">
                  <Image
                    src="/logos/logo-nobackground.jpeg"
                    alt="DoorStep"
                    width={160}
                    height={50}
                    className="h-12 w-auto"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-lg blur-md"></div>
                </div>
              </Link>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-sm">
                Campus food delivery made simple. Order from your favorite campus restaurants and get them delivered by fellow students.
              </p>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 group"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>

              {/* App Store Buttons */}
              <div className="flex flex-col space-y-3 mt-8">
                <button className="group relative bg-black text-white px-4 py-2.5 rounded-xl flex items-center justify-center space-x-3 hover:bg-gray-800 transition-colors duration-200 shadow-sm hover:shadow-md">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 3.31l1.41 1.41c1.65-.92 3.49-2.1 5.16-3.37l1.41 1.41c-.85 1.34-2.06 2.21-3.29 3.05zm0-15c.82-1.24 1.71-2.45 3.05-3.31l-1.41-1.41c-1.65.92-3.49 2.1-5.16 3.37l-1.41-1.41c.85-1.34 2.06-2.21 3.29-3.05z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs opacity-80">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </button>

                <button className="group relative bg-black text-white px-4 py-2.5 rounded-xl flex items-center justify-center space-x-3 hover:bg-gray-800 transition-colors duration-200 shadow-sm hover:shadow-md">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186 3.609 1.814zm.315 11.609v-7.782L11.513 12.03 3.924 13.423zm7.844 11.609h7.832v-7.782L12.452 12.03l-7.622 1.393z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs opacity-80">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Footer Sections */}
            {Object.entries(footerSections).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  {title}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">10K+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Partner Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">1M+</div>
              <div className="text-sm text-gray-600">Meals Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-600">University Campuses</div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>© 2025 DoorStep. All rights reserved.</span>
              <span className="text-gray-400">•</span>
              <Link href="/privacy" className="hover:text-emerald-600 transition-colors duration-200">
                Privacy
              </Link>
              <span className="text-gray-400">•</span>
              <Link href="/terms" className="hover:text-emerald-600 transition-colors duration-200">
                Terms
              </Link>
            </div>
            <div className="text-sm text-gray-600">
              Made for students, by students
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}