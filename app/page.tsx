'use client'

import { useEffect } from 'react'
import EnhancedNavigation from '@/components/EnhancedNavigation'
import CountdownTimer from '@/components/CountdownTimer'
import WaitlistForm from '@/components/WaitlistForm'
import NominationForm from '@/components/NominationForm'
import EnhancedFooter from '@/components/EnhancedFooter'
import ScrollReveal from '@/components/animations/ScrollReveal'
import ParallaxSection from '@/components/animations/ParallaxSection'
import StaggeredList from '@/components/animations/StaggeredList'
import { leaderCategories } from '@/lib/utils'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { trackPageView } from '@/lib/analytics'

export default function HomePage() {
  // Track page view with enhanced analytics
  useEffect(() => {
    trackPageView({ path: '/', title: 'Home' })
  }, [])

  return (
    <div className="min-h-screen bg-primary-black text-white">
      <EnhancedNavigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        <ParallaxSection type="zoom" speed={0.3} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none" />
        </ParallaxSection>
        
        <div className="container mx-auto text-center z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="gradient-text">MINNESOTA.CEO</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Exclusive video interviews with Minnesota&apos;s most influential leaders from business, education, government, and community organizations
          </motion.p>

          <ScrollReveal delay={0.4} animationVariant="fadeUp">
            <div className="mb-12">
              <p className="text-lg text-gray-400 mb-6">Launching November 1st, 2025</p>
              <CountdownTimer />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.6} animationVariant="scale">
            <div className="mb-8">
              <WaitlistForm />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.8} animationVariant="fadeUp">
            <Link
              href="/app"
              className="inline-block px-8 py-4 bg-primary-purple text-white font-semibold rounded-lg hover:bg-light-purple transition-all duration-300 hover-glow text-lg transform hover:scale-105"
            >
              Preview app.minnesota.ceo →
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">Our Mission</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                To illuminate the diverse leadership landscape of Minnesota by conducting in-depth video interviews with individuals who shape our communities, economy, and culture. Through authentic conversations, we aim to inspire future leaders and foster connections across all sectors of society.
              </p>
            </div>
            <div className="glass-effect rounded-xl p-8 animate-fade-up">
              <h3 className="text-2xl font-semibold mb-4 text-primary-purple">Founded by Weldon</h3>
              <p className="text-gray-300">
                A visionary committed to showcasing the extraordinary leaders who make Minnesota a beacon of innovation, community service, and progressive leadership in America.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-20 px-4 bg-gradient-to-b from-transparent to-black/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text animate-fade-up">Our Vision</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-up">
            To create the premier platform for leadership storytelling in Minnesota, where every voice from the city councilmember to the governor, from the school administrator to the tech startup founder, can share their journey, challenges, and vision for the future.
          </p>
        </div>
      </section>

      {/* Purpose Section */}
      <section id="purpose" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text animate-fade-up">Our Purpose</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-effect rounded-xl p-6 hover-glow animate-fade-up">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3 text-primary-purple">Document Leadership</h3>
              <p className="text-gray-300">
                Preserve the wisdom, experiences, and insights of Minnesota&apos;s leaders for current and future generations.
              </p>
            </div>

            <div className="glass-effect rounded-xl p-6 hover-glow animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-3 text-primary-purple">Build Connections</h3>
              <p className="text-gray-300">
                Bridge gaps between different sectors and communities, fostering understanding and collaboration.
              </p>
            </div>

            <div className="glass-effect rounded-xl p-6 hover-glow animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-3 text-primary-purple">Inspire Action</h3>
              <p className="text-gray-300">
                Motivate viewers to pursue leadership roles and make positive impacts in their communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 px-4 bg-gradient-to-t from-transparent to-black/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text animate-fade-up">Leader Categories</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {leaderCategories.map((category, index) => (
              <div
                key={category}
                className="glass-effect rounded-lg p-4 text-center hover-glow animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <p className="text-sm md:text-base text-gray-300">{category}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400 mt-8 animate-fade-up">
            From city councilmembers to governors, from priests and deacons to pastors, 
            from school administrators to tech founders - all Minnesota leaders have a story to tell.
          </p>
        </div>
      </section>

      {/* Nominate Section */}
      <section id="nominate" className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text animate-fade-up">Know a Leader?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-up">
            Help us identify Minnesota&apos;s most impactful leaders. Nominate someone whose story deserves to be heard.
          </p>
          <div className="animate-fade-up">
            <NominationForm />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-t from-black to-transparent">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-up">
            Be Part of the <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-up">
            Join our waitlist to get exclusive early access when we launch on November 1st, 2025.
          </p>
          <div className="animate-fade-up">
            <WaitlistForm source="footer" />
          </div>
        </div>
      </section>

      <EnhancedFooter />
    </div>
  )
}
