'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import EnhancedNavigation from '@/components/EnhancedNavigation'
import WaitlistForm from '@/components/WaitlistForm'
import NominationForm from '@/components/NominationForm'
import EnhancedFooter from '@/components/EnhancedFooter'

export default function AppPreviewPage() {
  // Track page view
  useEffect(() => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'page_view', pagePath: '/app' }),
    }).catch(() => {})
  }, [])

  const mockVideos = [
    { id: 1, title: 'Governor Tim Walz', category: 'Government Officials', thumbnail: '🏛️', duration: '45:23' },
    { id: 2, title: 'CEO of Best Buy', category: 'Business Leaders', thumbnail: '💼', duration: '38:15' },
    { id: 3, title: 'University of Minnesota President', category: 'Education Leaders', thumbnail: '🎓', duration: '42:07' },
    { id: 4, title: 'Mayo Clinic Leadership', category: 'Healthcare Leaders', thumbnail: '🏥', duration: '50:12' },
    { id: 5, title: 'Target Corporation Executive', category: 'Business Leaders', thumbnail: '🎯', duration: '35:45' },
    { id: 6, title: 'Minneapolis Mayor', category: 'Government Officials', thumbnail: '🏛️', duration: '40:30' },
    { id: 7, title: 'Tech Startup Founder', category: 'Tech & Startup Founders', thumbnail: '💻', duration: '33:18' },
    { id: 8, title: 'Non-Profit Director', category: 'Non-Profit Directors', thumbnail: '❤️', duration: '37:22' },
    { id: 9, title: 'Religious Leader', category: 'Religious Leaders', thumbnail: '⛪', duration: '41:55' },
  ]

  return (
    <div className="min-h-screen bg-primary-black text-white">
      <EnhancedNavigation />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-primary-purple/20 rounded-full mb-6">
            <span className="text-primary-purple font-semibold">Coming November 1st, 2025</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-up">
            <span className="gradient-text">app.minnesota.ceo</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-up">
            Your exclusive gateway to Minnesota&apos;s leadership stories. A YouTube-style platform dedicated solely to in-depth video interviews with our state&apos;s most influential leaders.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up">
            <WaitlistForm source="app" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center gradient-text">Platform Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="glass-effect rounded-xl p-6 hover-glow animate-fade-up">
              <div className="text-3xl mb-4">📹</div>
              <h3 className="text-xl font-semibold mb-3 text-primary-purple">HD Video Interviews</h3>
              <p className="text-gray-300">
                Professional-quality video interviews with clear audio and multiple camera angles
              </p>
            </div>

            <div className="glass-effect rounded-xl p-6 hover-glow animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-3 text-primary-purple">Smart Search & Filter</h3>
              <p className="text-gray-300">
                Find leaders by category, organization, topic, or search for specific insights
              </p>
            </div>

            <div className="glass-effect rounded-xl p-6 hover-glow animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-3 text-primary-purple">Mobile Optimized</h3>
              <p className="text-gray-300">
                Watch interviews anywhere with our responsive design and mobile app (coming soon)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Grid Preview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center gradient-text">Preview: Upcoming Interviews</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockVideos.map((video) => (
              <div
                key={video.id}
                className="group glass-effect rounded-xl overflow-hidden hover-glow cursor-pointer animate-fade-up"
              >
                <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center relative">
                  <span className="text-6xl opacity-50">{video.thumbnail}</span>
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-white">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                    {video.duration}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-2 group-hover:text-primary-purple transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-400">{video.category}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-6">
              These are just a preview. Full platform launches November 1st, 2025
            </p>
            <NominationForm />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-black/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-up">
              <div className="text-3xl md:text-4xl font-bold text-primary-purple mb-2">100+</div>
              <p className="text-gray-400">Leaders to Interview</p>
            </div>
            <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl md:text-4xl font-bold text-primary-purple mb-2">10</div>
              <p className="text-gray-400">Categories</p>
            </div>
            <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl md:text-4xl font-bold text-primary-purple mb-2">HD</div>
              <p className="text-gray-400">Video Quality</p>
            </div>
            <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-3xl md:text-4xl font-bold text-primary-purple mb-2">Free</div>
              <p className="text-gray-400">Access</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-up">
            Be First to Watch
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-up">
            Join the waitlist to get early access to exclusive interviews with Minnesota&apos;s most influential leaders.
          </p>
          <div className="animate-fade-up">
            <WaitlistForm source="app-footer" />
          </div>
          
          <Link 
            href="/"
            className="inline-block mt-8 text-gray-400 hover:text-primary-purple transition-colors"
          >
            ← Back to main site
          </Link>
        </div>
      </section>

      <EnhancedFooter />
    </div>
  )
}
