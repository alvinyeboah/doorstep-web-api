import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-foreground tracking-tight">DoorStep</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-foreground hover:bg-foreground/5 font-medium"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-foreground text-white hover:bg-foreground/90 rounded-full px-6 font-semibold shadow-sm">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
