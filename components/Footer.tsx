import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold gradient-text mb-4">MINNESOTA.CEO</h3>
            <p className="text-gray-400 mb-4">
              Showcasing the voices and visions of Minnesota&apos;s most influential leaders through exclusive video interviews.
            </p>
            <p className="text-sm text-gray-500">
              A project by EVERJUST COMPANY
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary-purple transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/app" className="text-gray-400 hover:text-primary-purple transition-colors">
                  Platform Preview
                </Link>
              </li>
              <li>
                <Link href="#nominate" className="text-gray-400 hover:text-primary-purple transition-colors">
                  Nominate a Leader
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-400 hover:text-primary-purple transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-primary-purple transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-primary-purple transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2025 EVERJUST COMPANY. All rights reserved.
            </p>
            <a 
              href="mailto:company@everjust.org"
              className="text-sm text-gray-500 hover:text-primary-purple transition-colors mt-2 md:mt-0"
            >
              company@everjust.org
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
