import Link from 'next/link'
import EnhancedNavigation from '@/components/EnhancedNavigation'
import EnhancedFooter from '@/components/EnhancedFooter'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-primary-black text-white">
      <EnhancedNavigation />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 gradient-text">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              <strong>Effective Date:</strong> October 15, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-purple mb-4">1. Information We Collect</h2>
              <p className="text-gray-300 mb-4">
                MINNESOTA.CEO (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), operated by EVERJUST COMPANY, collects the following types of information:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Email addresses when you join our waitlist</li>
                <li>Contact information when you submit nominations</li>
                <li>Usage data and analytics about how you interact with our website</li>
                <li>IP addresses and browser information for security and analytics</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-purple mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-300 mb-4">We use the collected information to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Send updates about our platform launch and new content</li>
                <li>Process and review leader nominations</li>
                <li>Improve our website and user experience</li>
                <li>Communicate with you about our services</li>
                <li>Ensure the security of our platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-purple mb-4">3. Information Sharing</h2>
              <p className="text-gray-300 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share information:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>With service providers who assist in our operations (e.g., email services)</li>
                <li>When required by law or to protect our rights</li>
                <li>With your consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-purple mb-4">4. Data Security</h2>
              <p className="text-gray-300 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-purple mb-4">5. Your Rights</h2>
              <p className="text-gray-300 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-purple mb-4">6. Cookies</h2>
              <p className="text-gray-300 mb-4">
                We use cookies and similar tracking technologies to improve your browsing experience and analyze website traffic. You can control cookies through your browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-purple mb-4">7. Children&apos;s Privacy</h2>
              <p className="text-gray-300 mb-4">
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-purple mb-4">8. Changes to This Policy</h2>
              <p className="text-gray-300 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the effective date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-purple mb-4">9. Contact Us</h2>
              <p className="text-gray-300 mb-4">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-300">
                EVERJUST COMPANY<br />
                Email: <a href="mailto:company@everjust.org" className="text-primary-purple hover:text-dark-purple">company@everjust.org</a><br />
                Website: <a href="https://minnesota.ceo" className="text-primary-purple hover:text-dark-purple">https://minnesota.ceo</a>
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <Link 
              href="/"
              className="text-gray-400 hover:text-primary-purple transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <EnhancedFooter />
    </div>
  )
}
