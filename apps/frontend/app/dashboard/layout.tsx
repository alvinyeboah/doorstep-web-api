'use client';

import { useRouter } from 'next/navigation';
import { useSession, signOut } from '@/lib/auth-client';
import Link from 'next/link';
import { AuthGuard } from '@/components/AuthGuard';
import { User } from '@/types';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const getNavLinks = () => {
    if (!session) return [];
    const role = (session.user as unknown as User).role;

    if (role === 'SUPER_ADMIN') {
      return [
        { href: '/dashboard/admin', label: 'Dashboard' },
        { href: '/dashboard/admin/vendors', label: 'Vendors' },
        { href: '/dashboard/admin/orders', label: 'Orders' },
        { href: '/dashboard/admin/revenue', label: 'Revenue' },
      ];
    }

    const commonLinks = [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/dashboard/orders', label: 'Orders' },
    ];

    if (role === 'VENDOR') {
      return [
        ...commonLinks,
        { href: '/dashboard/products', label: 'Products' },
      ];
    } else if (role === 'STEPPER') {
      return [
        ...commonLinks,
        { href: '/dashboard/available-orders', label: 'Available Orders' },
        { href: '/dashboard/wallet', label: 'Wallet' },
      ];
    } else if (role === 'CUSTOMER') {
      return [
        ...commonLinks,
        { href: '/dashboard/browse', label: 'Browse Vendors' },
        { href: '/dashboard/cart', label: 'Cart' },
      ];
    }

    return commonLinks;
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900">
                DoorStep
              </Link>
              <nav className="hidden md:flex space-x-1">
                {getNavLinks().map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{(session.user as unknown as User).role.toLowerCase()}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b">
        <nav className="max-w-7xl mx-auto px-4 py-2 flex overflow-x-auto space-x-2">
          {getNavLinks().map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardContent>{children}</DashboardContent>
    </AuthGuard>
  );
}
