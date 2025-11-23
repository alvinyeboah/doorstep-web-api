import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            DoorStep
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Campus Food Delivery Made Easy
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Order food from your favorite campus vendors and get it delivered right to your doorstep by fellow students.
          </p>

          <div className="flex justify-center space-x-4">
            <Link
              href="/login"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-8 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold mb-2">For Vendors</h3>
            <p className="text-gray-600">
              Manage your menu, track orders, and grow your business on campus
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🛵</div>
            <h3 className="text-xl font-semibold mb-2">For Steppers</h3>
            <p className="text-gray-600">
              Earn money delivering food to students while on campus
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🍔</div>
            <h3 className="text-xl font-semibold mb-2">For Students</h3>
            <p className="text-gray-600">
              Order delicious food from campus vendors, delivered fast
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
