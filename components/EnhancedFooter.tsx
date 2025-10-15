'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Youtube,
  Instagram,
  ArrowUpRight,
  Heart
} from 'lucide-react'
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa'
import EnhancedEmailField from './EnhancedEmailField'
import { trackClick } from '@/lib/analytics'

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

interface SocialLink {
  icon: React.ElementType
  href: string
  label: string
  color: string
}

export default function EnhancedFooter() {
  const currentYear = new Date().getFullYear()

  const quickLinks: FooterLink[] = [
    { label: 'Mission', href: '#mission' },
    { label: 'Vision', href: '#vision' },
    { label: 'Leader Categories', href: '#categories' },
    { label: 'Nominate', href: '#nominate' },
  ]

  const legalLinks: FooterLink[] = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
    { label: 'Cookie Policy', href: '/privacy#cookies' },
  ]

  const socialLinks: SocialLink[] = [
    { 
      icon: FaTwitter, 
      href: 'https://twitter.com/minnesotaceo',
      label: 'Twitter',
      color: 'hover:text-blue-400'
    },
    { 
      icon: FaLinkedinIn, 
      href: 'https://linkedin.com/company/minnesotaceo',
      label: 'LinkedIn',
      color: 'hover:text-blue-600'
    },
    { 
      icon: FaYoutube, 
      href: 'https://youtube.com/@minnesotaceo',
      label: 'YouTube',
      color: 'hover:text-red-600'
    },
    { 
      icon: FaInstagram, 
      href: 'https://instagram.com/minnesotaceo',
      label: 'Instagram',
      color: 'hover:text-pink-600'
    },
    { 
      icon: FaFacebookF, 
      href: 'https://facebook.com/minnesotaceo',
      label: 'Facebook',
      color: 'hover:text-blue-500'
    },
  ]

  const handleNewsletterSubmit = async (email: string) => {
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'footer-newsletter' }),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Failed to subscribe')
    }

    await trackClick('footer-newsletter', 'Newsletter Signup')
    return data
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <footer className="relative bg-black border-t border-purple-500/20 overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent pointer-events-none" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative container mx-auto px-4 py-12"
      >
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-2xl font-bold gradient-text">MINNESOTA.CEO</h3>
            <p className="text-gray-400">
              Showcasing Minnesota's most influential leaders through exclusive video interviews.
            </p>
            <div className="pt-4">
              <p className="text-sm text-gray-500">Owned & Operated by</p>
              <p className="text-white font-semibold">EVERJUST COMPANY</p>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              Quick Links
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-600 to-purple-400"
              />
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => trackClick(`footer-${link.label.toLowerCase()}`, link.label)}
                    className="group flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors duration-300"
                  >
                    <motion.span
                      className="w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                    />
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal & Contact */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Legal & Contact</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => trackClick(`footer-${link.label.toLowerCase().replace(' ', '-')}`, link.label)}
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="mailto:company@everjust.org"
                  onClick={() => trackClick('footer-email', 'Contact Email')}
                  className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors duration-300"
                >
                  <Mail className="w-4 h-4" />
                  company@everjust.org
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Stay Updated</h4>
            <p className="text-gray-400 text-sm">
              Get exclusive updates and be the first to know when we launch.
            </p>
            <EnhancedEmailField
              onSubmit={handleNewsletterSubmit}
              buttonText="Subscribe"
              successMessage="Subscribed! 🎉"
              placeholder="your@email.com"
            />
          </motion.div>
        </div>

        {/* Social Links */}
        <motion.div 
          variants={itemVariants}
          className="border-t border-purple-500/20 pt-8 mb-8"
        >
          <div className="flex justify-center items-center space-x-6">
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick(`footer-social-${social.label.toLowerCase()}`, social.label)}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  className={`p-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-gray-400 ${social.color} transition-all duration-300`}
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              )
            })}
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          variants={itemVariants}
          className="border-t border-purple-500/20 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} MINNESOTA.CEO by EVERJUST COMPANY. All rights reserved.
            </p>
            
            <motion.div
              className="flex items-center gap-2 text-gray-500 text-sm"
              whileHover={{ scale: 1.05 }}
            >
              Made with
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="w-4 h-4 text-purple-500 fill-purple-500" />
              </motion.span>
              in Minnesota
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  )
}
