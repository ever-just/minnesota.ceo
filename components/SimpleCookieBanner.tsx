'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Cookie } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SimpleCookieBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    localStorage.setItem('cookie-preferences', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true
    }))
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    localStorage.setItem('cookie-preferences', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false
    }))
    setShowBanner(false)
  }

  const handleClose = () => {
    // Treat close as decline
    handleDecline()
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Cookie Banner */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
          >
            <div className="max-w-6xl mx-auto bg-gradient-to-b from-gray-900 to-black border border-purple-500/30 rounded-xl shadow-2xl shadow-purple-500/20 p-6 md:p-8">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Icon & Content */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-purple-600/20 rounded-lg">
                    <Cookie className="w-6 h-6 text-purple-400" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      🍪 We Use Cookies
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      We use cookies to enhance your browsing experience and analyze site traffic. 
                      By clicking &quot;Accept&quot;, you consent to our use of cookies.{' '}
                      <a 
                        href="/privacy" 
                        className="text-purple-400 hover:text-purple-300 underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Learn more
                      </a>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                  <Button
                    onClick={handleDecline}
                    variant="outline"
                    size="lg"
                    className="flex-1 md:flex-none border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    Decline
                  </Button>
                  <Button
                    onClick={handleAccept}
                    variant="gradient"
                    size="lg"
                    className="flex-1 md:flex-none"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

