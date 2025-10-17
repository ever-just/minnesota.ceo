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
      body: JSON.stringify({ eventType: 'page_view', pagePath: '/preview' }),
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
    <div className="min-h-screen bg-primary-black text-white overflow-x-hidden">
      <EnhancedNavigation />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 overflow-hidden">
        {/* Background Effects - matching homepage */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(to right, rgb(147 51 234 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(147 51 234 / 0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full backdrop-blur-sm mb-6">
            <span className="text-sm font-medium text-purple-300">Coming November 1st, 2025</span>
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
      <section className="relative py-16 px-4">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(to right, rgb(147 51 234 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(147 51 234 / 0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="container mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Platform Features</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-20 blur group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 h-full">
                <div className="p-3 bg-purple-500/10 rounded-xl w-16 h-16 mb-4 flex items-center justify-center text-3xl">📹</div>
                <h3 className="text-xl font-bold mb-3 text-white">HD Video Interviews</h3>
                <p className="text-gray-400 leading-relaxed">
                  Professional-quality video interviews with clear audio and multiple camera angles
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-20 blur group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 h-full">
                <div className="p-3 bg-purple-500/10 rounded-xl w-16 h-16 mb-4 flex items-center justify-center text-3xl">🔍</div>
                <h3 className="text-xl font-bold mb-3 text-white">Smart Search & Filter</h3>
                <p className="text-gray-400 leading-relaxed">
                  Find leaders by category, organization, topic, or search for specific insights
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-20 blur group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 h-full">
                <div className="p-3 bg-purple-500/10 rounded-xl w-16 h-16 mb-4 flex items-center justify-center text-3xl">📱</div>
                <h3 className="text-xl font-bold mb-3 text-white">Mobile Optimized</h3>
                <p className="text-gray-400 leading-relaxed">
                  Watch interviews anywhere with our responsive design and mobile app (coming soon)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Grid Preview */}
      <section className="relative py-16 px-4">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-black to-black"></div>
        
        <div className="container mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Preview: Upcoming Interviews</span>
          </h2>
          
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
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(to right, rgb(147 51 234 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(147 51 234 / 0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Be First to Watch</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join the waitlist to get early access to exclusive interviews with Minnesota&apos;s most influential leaders.
          </p>
          <div className="mb-8">
            <WaitlistForm source="app-footer" />
          </div>
          
          <Link 
            href="/"
            prefetch={true}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors duration-300"
          >
            <span>←</span>
            <span>Back to main site</span>
          </Link>
        </div>
      </section>

      <EnhancedFooter />
    </div>
  )
}
