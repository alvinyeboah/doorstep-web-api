import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
      <Link href="/" className="flex items-center">
        <span className="text-2xl font-bold text-white tracking-tight">DoorStep</span>
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/login">
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full px-6"
          >
            Sign In
          </Button>
        </Link>
        <Link href="/signup">
          <Button variant="outline" className="bg-white border-white text-foreground hover:bg-white/90 rounded-full px-6">
            Sign Up
          </Button>
        </Link>
      </div>
    </header>
  )
}
