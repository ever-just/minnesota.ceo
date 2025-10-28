'use client'

import { useEffect } from 'react'
import EnhancedNavigation from '@/components/EnhancedNavigation'
import CountdownTimer from '@/components/CountdownTimer'
import WaitlistForm from '@/components/WaitlistForm'
import NominationForm from '@/components/NominationForm'
import EnhancedFooter from '@/components/EnhancedFooter'
import ScrollReveal from '@/components/animations/ScrollReveal'
import ParallaxSection from '@/components/animations/ParallaxSection'
import { leaderCategories } from '@/lib/utils'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { trackPageView } from '@/lib/analytics'
import { 
  AnimatedIcon, 
  PremiumBadge, 
  SectionDivider,
  categoryIcons,
  purposeIcons,
  featureIcons 
} from '@/components/icons/PremiumIcons'
import {
  FloatingOrbs,
  GridPattern,
  DotsPattern,
  PremiumCard,
  AnimatedLine
} from '@/components/visuals/BackgroundElements'
import { ArrowRight, Play, Sparkles, Star, ChevronDown, Landmark, Briefcase, GraduationCap, Users, Heart, Rocket, Handshake, Megaphone, TrendingUp, Shield, BookOpen, Lightbulb, Trophy, Video } from 'lucide-react'

export default function HomePage() {
  useEffect(() => {
    trackPageView({ path: '/', title: 'Home' })
  }, [])

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const id = hash.substring(1)
      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [])

  return (
    <div className="min-h-screen bg-primary-black text-white overflow-x-hidden">
      <EnhancedNavigation />

      {/* Hero Section with Premium Spacing */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-32 overflow-hidden">
        <FloatingOrbs />
        <GridPattern className="opacity-30" />
        
        <div className="container mx-auto max-w-7xl text-center z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-2"
          >
            <PremiumBadge text="Launching November 2025" icon={Sparkles} />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight"
          >
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient pb-4">
              MINNESOTA.CEO
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl lg:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light"
          >
            Watch in-depth video interviews with Minnesota&apos;s top CEOs, innovators, and community leaders
            <span className="block mt-4 text-lg md:text-xl text-gray-300">
              Gain insights, inspiration, and actionable wisdom from those shaping our state&apos;s future
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-8 pb-4"
          >
            <CountdownTimer />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-8"
          >
            <WaitlistForm />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown size={32} className="text-purple-400/50" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Platform Preview Section */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-purple-900/10 via-black to-black">
        <GridPattern className="opacity-10" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <ScrollReveal animationVariant="fadeUp">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Experience the Platform
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Get an exclusive look at how we&apos;re transforming leadership storytelling in Minnesota. 
                Explore our interactive platform before the official launch.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animationVariant="scale" delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <PremiumCard hover={true} className="text-center">
                <div className="p-3 bg-purple-500/10 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Video size={32} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Video Interviews</h3>
                <p className="text-gray-300 text-sm">High-quality interviews with Minnesota&apos;s leaders</p>
              </PremiumCard>

              <PremiumCard hover={true} className="text-center">
                <div className="p-3 bg-purple-500/10 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users size={32} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Leader Directory</h3>
                <p className="text-gray-300 text-sm">Browse leaders across all industries and sectors</p>
              </PremiumCard>

              <PremiumCard hover={true} className="text-center">
                <div className="p-3 bg-purple-500/10 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Sparkles size={32} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Exclusive Content</h3>
                <p className="text-gray-300 text-sm">Behind-the-scenes insights and stories</p>
              </PremiumCard>
            </div>
          </ScrollReveal>

          <ScrollReveal animationVariant="fadeUp" delay={0.4}>
            <div className="flex justify-center">
              <Link
                href="https://app.minnesota.ceo"
                prefetch={false}
                className="group inline-flex items-center gap-2 px-6 py-3 border-2 border-purple-500/50 rounded-xl hover:border-purple-400 hover:bg-purple-500/10 transition-all duration-300 text-sm"
              >
                <Play size={18} className="text-purple-400" />
                <span className="text-purple-300 font-medium">Preview App</span>
                <ArrowRight size={16} className="text-purple-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider type="gradient" />

      {/* Mission Section with Premium Cards */}
      <section id="mission" className="relative py-32 px-6">
        <DotsPattern className="opacity-10" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <ScrollReveal animationVariant="fadeUp">
            <div className="text-center mb-20">
              <PremiumBadge text="Our Story" icon={Star} />
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-6 mb-8">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Illuminating Leadership
                </span>
              </h2>
              <AnimatedLine orientation="horizontal" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            <ScrollReveal animationVariant="slideLeft">
              <PremiumCard gradient={true} className="h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <Trophy size={32} className="text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Our Mission</h3>
                </div>
                <p className="text-lg text-gray-300 leading-loose">
                  To illuminate the diverse leadership landscape of Minnesota through authentic, 
                  in-depth video interviews. We showcase individuals who shape our communities, 
                  economy, and culture—inspiring future leaders and fostering meaningful connections 
                  across all sectors of society.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {['Authentic', 'Inspiring', 'Diverse'].map((tag) => (
                    <span key={tag} className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </PremiumCard>
            </ScrollReveal>

            <ScrollReveal animationVariant="slideRight">
              <PremiumCard gradient={true} className="h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-yellow-500/20 rounded-xl">
                    <Star size={32} className="text-yellow-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Founded by Weldon</h3>
                </div>
                <p className="text-lg text-gray-300 leading-loose">
                  A visionary entrepreneur committed to showcasing the extraordinary leaders who make 
                  Minnesota a beacon of innovation, community service, and progressive leadership. 
                  Through compelling storytelling, we preserve wisdom for generations.
                </p>
                <div className="mt-8">
                  <Link href="#nominate" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
                    <span>Nominate a Leader</span>
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </PremiumCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider type="wave" />

      {/* Vision Section */}
      <section id="vision" className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-black to-purple-900/10" />
        <GridPattern className="opacity-20" />
        
        <div className="container mx-auto max-w-7xl text-center relative z-10">
          <ScrollReveal animationVariant="scale">
            <div className="p-4 bg-purple-500/10 rounded-2xl w-20 h-20 mx-auto mb-8 flex items-center justify-center">
              <Megaphone size={48} className="text-purple-400" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Our Vision
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-loose font-light">
              To create Minnesota&apos;s premier platform for leadership storytelling—where every voice, 
              from city councilmembers to governors, from school administrators to tech founders, 
              can share their journey, challenges, and vision for the future.
            </p>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { number: '100+', label: 'Leaders Featured' },
                { number: '50+', label: 'Industries Covered' },
                { number: '∞', label: 'Stories to Tell' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider type="dots" />

      {/* Purpose Section with Icon Grid */}
      <section id="purpose" className="relative py-32 px-6">
        <DotsPattern className="opacity-10" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <ScrollReveal animationVariant="fadeUp">
            <div className="text-center mb-20">
              <PremiumBadge text="Why We Do This" icon={Sparkles} />
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-6 mb-8">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Our Purpose
                </span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <ScrollReveal animationVariant="fadeUp" delay={0}>
              <PremiumCard hover={true} className="text-center h-full">
                <div className="p-4 bg-purple-500/10 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <BookOpen size={40} className="text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Document Leadership</h3>
                <p className="text-gray-300 leading-relaxed">
                  Preserve the wisdom, experiences, and insights of Minnesota&apos;s leaders for current and future generations.
                </p>
              </PremiumCard>
            </ScrollReveal>

            <ScrollReveal animationVariant="fadeUp" delay={0.2}>
              <PremiumCard hover={true} className="text-center h-full">
                <div className="p-4 bg-purple-500/10 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Handshake size={40} className="text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Build Connections</h3>
                <p className="text-gray-300 leading-relaxed">
                  Bridge gaps between different sectors and communities, fostering understanding and collaboration.
                </p>
              </PremiumCard>
            </ScrollReveal>

            <ScrollReveal animationVariant="fadeUp" delay={0.4}>
              <PremiumCard hover={true} className="text-center h-full">
                <div className="p-4 bg-purple-500/10 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Lightbulb size={40} className="text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Inspire Action</h3>
                <p className="text-gray-300 leading-relaxed">
                  Motivate viewers to pursue leadership roles and make positive impacts in their communities.
                </p>
              </PremiumCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider type="gradient" />

      {/* Featured Leaders Preview Section */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-black via-purple-900/5 to-black">
        <DotsPattern className="opacity-10" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <ScrollReveal animationVariant="fadeUp">
            <div className="text-center mb-16">
              <PremiumBadge text="Coming Soon" icon={Sparkles} />
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-6 mb-8">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Featured Leaders
                </span>
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Get a preview of the inspiring leaders we&apos;ll be featuring at launch
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Governor Tim Walz', title: 'Governor of Minnesota', category: 'Government', badge: 'Featured' },
              { name: 'Dr. Sarah Johnson', title: 'CEO, HealthPartners', category: 'Healthcare', badge: 'Featured' },
              { name: 'Marcus Chen', title: 'Founder, TechMN', category: 'Tech & Innovation', badge: 'Featured' }
            ].map((leader, index) => (
              <ScrollReveal key={leader.name} animationVariant="fadeUp" delay={index * 0.1}>
                <PremiumCard hover={true} className="h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{leader.name}</h3>
                      <p className="text-sm text-gray-300 mb-2">{leader.title}</p>
                      <span className="inline-block px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300">
                        {leader.category}
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xs font-semibold text-white">
                      {leader.badge}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Watch exclusive interviews and learn from Minnesota&apos;s most influential leaders when we launch in November 2025.
                  </p>
                </PremiumCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider type="wave" />

      {/* Categories Section with Premium Icons */}
      <section id="categories" className="relative py-32 px-6">
        <GridPattern className="opacity-10" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <ScrollReveal animationVariant="fadeUp">
            <div className="text-center mb-20">
              <PremiumBadge text="Leader Categories" icon={Star} />
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-6 mb-8">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Every Leader Has a Story
                </span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: 'Government', icon: Landmark },
              { name: 'Business', icon: Briefcase },
              { name: 'Education', icon: GraduationCap },
              { name: 'Community', icon: Users },
              { name: 'Healthcare', icon: Heart },
              { name: 'Tech & Innovation', icon: Rocket },
              { name: 'Non-profit', icon: Handshake },
              { name: 'Media & Arts', icon: Megaphone },
              { name: 'Finance', icon: TrendingUp },
              { name: 'Law & Legal', icon: Shield }
            ].map((category, index) => (
              <ScrollReveal key={category.name} animationVariant="scale" delay={index * 0.05}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="relative group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 h-full text-center">
                    <category.icon size={32} className="mx-auto mb-3 text-purple-400" />
                    <p className="text-sm md:text-base text-gray-300 font-medium">{category.name}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal animationVariant="fadeUp">
            <p className="text-center text-lg text-gray-300 mt-16 max-w-3xl mx-auto leading-relaxed">
              From city councilmembers to governors, from faith leaders to educators, 
              from healthcare heroes to tech innovators—every Minnesota leader has a unique story worth sharing.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider type="wave" />

      {/* Nominate Section with Premium Form */}
      <section id="nominate" className="relative py-32 px-6">
        <FloatingOrbs />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <ScrollReveal animationVariant="fadeUp">
            <PremiumBadge text="Make a Difference" icon={Sparkles} />
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-6 mb-8">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Know a Leader?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Help us identify Minnesota&apos;s most impactful leaders. 
              Nominate someone whose story deserves to be heard.
            </p>
          </ScrollReveal>
          
          <ScrollReveal animationVariant="scale">
            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 md:p-12">
              <NominationForm />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider type="gradient" />

      {/* Final CTA Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
        <GridPattern className="opacity-20" />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <ScrollReveal animationVariant="scale">
            <motion.div
              animate={{ 
                boxShadow: [
                  '0 0 60px rgba(147, 51, 234, 0.3)',
                  '0 0 80px rgba(236, 72, 153, 0.3)',
                  '0 0 60px rgba(147, 51, 234, 0.3)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block mb-8"
            >
              <Sparkles size={48} className="text-purple-400" />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
              Be Part of the <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Journey</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join our exclusive waitlist and be the first to experience Minnesota&apos;s 
              premier leadership platform when we launch.
            </p>
            <WaitlistForm source="footer" />
          </ScrollReveal>
        </div>
      </section>

      <EnhancedFooter />
    </div>
  )
}
