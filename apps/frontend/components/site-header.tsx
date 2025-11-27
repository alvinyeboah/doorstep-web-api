import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
      <Link href="/" className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span className="text-xl font-bold text-white tracking-tight">DOORSTEP</span>
      </Link>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full px-6"
        >
          Sign In
        </Button>
        <Button variant="outline" className="bg-white border-white text-foreground hover:bg-white/90 rounded-full px-6">
          Sign Up
        </Button>
      </div>
    </header>
  )
}
