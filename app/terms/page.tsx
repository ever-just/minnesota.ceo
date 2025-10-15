import Link from 'next/link'
import EnhancedNavigation from '@/components/EnhancedNavigation'
import EnhancedFooter from '@/components/EnhancedFooter'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-primary-black text-white">
      <EnhancedNavigation />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 gradient-text">Terms of Use</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              <strong>Effective Date:</strong> October 15, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-purple mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300 mb-4">
                By accessing and using MINNESOTA.CEO (the &ldquo;Website&rdquo;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use this Website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-purple mb-4">2. Use License</h2>
              <p className="text-gray-300 mb-4">
                Permission is granted to temporarily view and interact with the materials on MINNESOTA.CEO for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Modify or copy the materials without permission</li>
                <li>Use the materials for any commercial purpose or public display</li>
                <li>Attempt to reverse engineer any software on the Website</li>
                <li>Remove any copyright or proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-purple mb-4">3. Content and Conduct</h2>
              <p className="text-gray-300 mb-4">When using our services, you agree to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Provide accurate and truthful information</li>
                <li>Not submit false or misleading nominations</li>
                <li>Respect the privacy and rights of featured leaders</li>
                <li>Not use the platform for any unlawful purposes</li>
                <li>Not attempt to gain unauthorized access to our systems</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-purple mb-4">4. Video Content</h2>
              <p className="text-gray-300 mb-4">
                All video interviews and related content on MINNESOTA.CEO are the exclusive property of EVERJUST COMPANY. You may not:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Download, redistribute, or republish any video content</li>
                <li>Use video content for commercial purposes</li>
                <li>Create derivative works from our content</li>
                <li>Claim ownership of any content on the platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-purple mb-4">5. User Submissions</h2>
              <p className="text-gray-300 mb-4">
                By submitting nominations or other content to MINNESOTA.CEO, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and publish such content for the purposes of operating and promoting our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-purple mb-4">6. Privacy</h2>
              <p className="text-gray-300 mb-4">
                Your use of our Website is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-purple mb-4">7. Disclaimers</h2>
              <p className="text-gray-300 mb-4">
                The information on MINNESOTA.CEO is provided on an &ldquo;as is&rdquo; basis. To the fullest extent permitted by law, we:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Make no warranties, expressed or implied</li>
                <li>Disclaim and negate all other warranties</li>
                <li>Do not warrant that the Website will be uninterrupted or error-free</li>
                <li>Do not warrant the accuracy or completeness of information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-purple mb-4">8. Limitations of Liability</h2>
              <p className="text-gray-300 mb-4">
                In no event shall EVERJUST COMPANY or its suppliers be liable for any damages arising out of the use or inability to use the materials on MINNESOTA.CEO, even if we have been notified of the possibility of such damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-purple mb-4">9. Intellectual Property</h2>
              <p className="text-gray-300 mb-4">
                All content on MINNESOTA.CEO, including text, graphics, logos, images, video clips, and software, is the property of EVERJUST COMPANY or its content suppliers and is protected by international copyright laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-purple mb-4">10. Termination</h2>
              <p className="text-gray-300 mb-4">
                We reserve the right to terminate or suspend access to our Website immediately, without prior notice or liability, for any reason whatsoever, including breach of these Terms of Use.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-purple mb-4">11. Governing Law</h2>
              <p className="text-gray-300 mb-4">
                These terms and conditions are governed by and construed in accordance with the laws of Minnesota, United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that State.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-purple mb-4">12. Changes to Terms</h2>
              <p className="text-gray-300 mb-4">
                EVERJUST COMPANY reserves the right to revise these terms of use at any time without notice. By using this Website, you agree to be bound by the current version of these Terms of Use.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-purple mb-4">13. Contact Information</h2>
              <p className="text-gray-300 mb-4">
                If you have any questions regarding these Terms of Use, please contact us at:
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
