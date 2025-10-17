'use client'

import { motion } from 'framer-motion'

// Floating gradient orbs for background
export function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  )
}

// Grid pattern overlay
export function GridPattern({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <div className="absolute inset-0" 
        style={{
          backgroundImage: `linear-gradient(to right, rgb(147 51 234 / 0.05) 1px, transparent 1px),
                           linear-gradient(to bottom, rgb(147 51 234 / 0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
    </div>
  )
}

// Dots pattern for section backgrounds
export function DotsPattern({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <div className="absolute inset-0" 
        style={{
          backgroundImage: `radial-gradient(circle, rgb(147 51 234 / 0.1) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />
    </div>
  )
}

// Minnesota-themed decorative element
export function MinnesotaShape() {
  return (
    <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
      <path 
        d="M100 20 L150 60 L180 100 L150 140 L100 180 L50 140 L20 100 L50 60 Z" 
        stroke="url(#gradient)" 
        strokeWidth="2" 
        fill="url(#gradient)" 
        fillOpacity="0.1"
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9333ea" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Animated line decoration
export function AnimatedLine({ orientation = 'horizontal' }: { orientation?: 'horizontal' | 'vertical' }) {
  if (orientation === 'horizontal') {
    return (
      <motion.div className="relative w-full h-px overflow-hidden">
        <motion.div
          className="absolute h-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"
          initial={{ left: '-100%', right: '100%' }}
          animate={{ left: '100%', right: '-100%' }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ width: '100%' }}
        />
      </motion.div>
    )
  }
  
  return (
    <motion.div className="relative h-full w-px overflow-hidden">
      <motion.div
        className="absolute w-full bg-gradient-to-b from-transparent via-purple-500 to-transparent"
        initial={{ top: '-100%', bottom: '100%' }}
        animate={{ top: '100%', bottom: '-100%' }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        style={{ height: '100%' }}
      />
    </motion.div>
  )
}

// Premium card with glass effect and hover animations
interface PremiumCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
}

export function PremiumCard({ children, className = '', hover = true, gradient = false }: PremiumCardProps) {
  return (
    <motion.div
      className={`relative group ${className}`}
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : undefined}
    >
      {gradient && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-20 blur group-hover:opacity-30 transition-opacity duration-300" />
      )}
      <div className="relative bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 h-full">
        {children}
      </div>
    </motion.div>
  )
}

// Spotlight effect that follows mouse
export function SpotlightCard({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(147, 51, 234, 0.1), transparent 40%)',
        }}
      />
      <div className="relative bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
        {children}
      </div>
    </div>
  )
}
