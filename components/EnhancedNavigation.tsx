'use client'

import Link from 'next/link'
import { useState, useEffect, createElement } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Menu, X, ChevronRight, Sparkles, Home, Target, Eye, Users } from 'lucide-react'
import { trackClick } from '@/lib/analytics'

interface NavLink {
  href: string
  label: string
  icon?: React.ElementType
}

export default function EnhancedNavigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20
      setIsScrolled(scrolled)
      
      // Calculate scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks: NavLink[] = [
    { href: '#mission', label: 'Mission', icon: Target },
    { href: '#vision', label: 'Vision', icon: Eye },
    { href: '#categories', label: 'Leaders', icon: Users },
    { href: '#nominate', label: 'Nominate', icon: Sparkles },
  ]

  const handleLinkClick = (label: string) => {
    trackClick(`nav-${label.toLowerCase()}`, label)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-purple-400 z-50 origin-left"
        style={{ scaleX: scrollProgress / 100 }}
        initial={{ scaleX: 0 }}
      />
      
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-500',
          isScrolled 
            ? 'backdrop-blur-xl bg-black/70 border-b border-purple-500/20 py-3' 
            : 'py-6'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo with animation */}
            <Link href="/" className="group relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <span className="relative text-2xl font-bold gradient-text flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: isScrolled ? 360 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Home className="w-5 h-5" />
                  </motion.span>
                  MINNESOTA.CEO
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => handleLinkClick(link.label)}
                      onMouseEnter={() => setHoveredLink(link.label)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className="relative group py-2"
                    >
                      <span className="flex items-center gap-2 text-gray-300 group-hover:text-white transition-colors duration-300">
                        {link.icon && (
                          <motion.span
                            animate={{ rotate: hoveredLink === link.label ? 360 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {createElement(link.icon, { className: "w-4 h-4" })}
                          </motion.span>
                        )}
                        {link.label}
                      </span>
                      
                      {/* Animated underline */}
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-purple-400"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: hoveredLink === link.label ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    </a>
                  </motion.div>
                ))}
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/app"
                  onClick={() => handleLinkClick('Preview Platform')}
                  className="group relative px-6 py-2.5 overflow-hidden rounded-lg font-semibold"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-500 transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                  <span className="relative text-white flex items-center gap-2">
                    Preview Platform
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative p-2 rounded-lg border border-purple-500/30 bg-black/50 backdrop-blur-sm"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: 90 }}
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: -90 }}
                  >
                    <Menu className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 border-t border-purple-500/20"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col space-y-3">
                  {navLinks.map((link, index) => (
                      <motion.a
                        key={link.href}
                        href={link.href}
                        onClick={() => handleLinkClick(link.label)}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all duration-300"
                      >
                        {link.icon && createElement(link.icon, { className: "w-5 h-5" })}
                        <span className="font-medium">{link.label}</span>
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </motion.a>
                    ))}
                  
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: navLinks.length * 0.1 }}
                  >
                    <Link
                      href="/app"
                      onClick={() => handleLinkClick('Preview Platform')}
                      className="block px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-lg text-center hover:from-purple-700 hover:to-purple-600 transition-all duration-300"
                    >
                      Preview Platform
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
