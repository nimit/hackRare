import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-gray-50 border-t py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-blue-600 text-xl font-bold mb-4">CURE NET</h3>
            <p className="text-gray-600 mb-4 max-w-md">
              Clinical Unified Research Network - Connecting patients with rare diseases to clinical trials and research
              opportunities.
            </p>
          </div>

          <div className="col-span-1">
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/data-policy" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Data Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6">
          <p className="text-center text-gray-500 text-sm">&copy; {currentYear} CURE NET. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

