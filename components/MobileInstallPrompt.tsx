'use client'

import { useState, useEffect, createElement } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Smartphone, 
  Download, 
  Share, 
  Plus, 
  Home,
  ChevronRight,
  X,
  CheckCircle,
  Apple,
  Chrome
} from 'lucide-react'
import { FaAndroid } from 'react-icons/fa'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import { trackClick } from '@/lib/analytics'

interface InstallStep {
  icon: React.ElementType
  title: string
  description: string
}

export default function MobileInstallPrompt({ trigger = false }: { trigger?: boolean }) {
  const [showPrompt, setShowPrompt] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [installed, setInstalled] = useState(false)
  
  const device = useDeviceDetection()

  useEffect(() => {
    // Listen for beforeinstallprompt event (Chrome/Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if already installed
    if (device.isPWA) {
      setInstalled(true)
    }

    // Show prompt when triggered (after waitlist signup)
    if (trigger && device.canInstallPWA && !installed) {
      setTimeout(() => {
        setShowPrompt(true)
      }, 1000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [trigger, device.canInstallPWA, device.isPWA, installed])

  const handleInstallClick = async () => {
    trackClick('mobile-install-prompt', 'Install Click')

    if (deferredPrompt) {
      // Chrome/Edge PWA install
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setInstalled(true)
        trackClick('mobile-install-success', 'PWA Installed')
      }
      
      setDeferredPrompt(null)
      setShowPrompt(false)
    } else if (device.isIOS) {
      // Show iOS install guide
      setShowGuide(true)
      trackClick('mobile-install-guide', 'iOS Guide Shown')
    } else if (device.isAndroid) {
      // Show Android install guide
      setShowGuide(true)
      trackClick('mobile-install-guide', 'Android Guide Shown')
    }
  }

  const getInstallSteps = (): InstallStep[] => {
    if (device.isIOS && device.isSafari) {
      return [
        {
          icon: Share,
          title: 'Tap the Share Button',
          description: 'Find the share icon at the bottom of Safari'
        },
        {
          icon: Plus,
          title: 'Add to Home Screen',
          description: 'Scroll down and tap "Add to Home Screen"'
        },
        {
          icon: Home,
          title: 'Name & Add',
          description: 'Choose a name and tap "Add" in the top right'
        }
      ]
    } else if (device.isAndroid && device.isChrome) {
      return [
        {
          icon: Chrome,
          title: 'Tap Menu (⋮)',
          description: 'Find the three dots menu in the top right'
        },
        {
          icon: Download,
          title: 'Install App',
          description: 'Select "Install app" or "Add to Home screen"'
        },
        {
          icon: CheckCircle,
          title: 'Confirm',
          description: 'Tap "Install" to add to your home screen'
        }
      ]
    } else {
      return [
        {
          icon: Chrome,
          title: 'Open in Chrome',
          description: 'For best experience, use Chrome browser'
        },
        {
          icon: Download,
          title: 'Look for Install',
          description: 'Check the address bar or menu for install option'
        },
        {
          icon: Home,
          title: 'Add to Device',
          description: 'Follow prompts to add to your device'
        }
      ]
    }
  }

  if (installed) {
    return null
  }

  return (
    <>
      {/* Install Prompt */}
      <AnimatePresence>
        {showPrompt && !showGuide && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto"
          >
            <div className="bg-black/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-2xl">
              <button
                onClick={() => setShowPrompt(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Install MINNESOTA.CEO App
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Add to your home screen for the best experience with offline access and instant notifications.
                  </p>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleInstallClick}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-lg"
                    >
                      {device.isIOS ? 'Show Me How' : 'Install Now'}
                    </motion.button>
                    
                    <button
                      onClick={() => {
                        setShowPrompt(false)
                        localStorage.setItem('install_prompt_dismissed', 'true')
                      }}
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      Not Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Installation Guide */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black/95 border border-purple-500/30 rounded-2xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Install Our App
                  </h2>
                  <p className="text-gray-400">
                    {device.isIOS ? 'For iPhone/iPad' : device.isAndroid ? 'For Android' : 'Quick Setup Guide'}
                  </p>
                </div>
                
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Platform Icon */}
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-purple-600/20 to-purple-500/20 rounded-2xl">
                  {device.isIOS ? (
                    <Apple className="w-12 h-12 text-white" />
                  ) : device.isAndroid ? (
                    <FaAndroid className="w-12 h-12 text-green-500" />
                  ) : (
                    <Chrome className="w-12 h-12 text-blue-500" />
                  )}
                </div>
              </div>

              {/* Installation Steps */}
              <div className="space-y-4 mb-6">
                {getInstallSteps().map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                        {createElement(step.icon, { className: "w-5 h-5 text-purple-400" })}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">
                          Step {index + 1}: {step.title}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowGuide(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-lg"
              >
                Got it!
              </motion.button>

              {/* Help Text */}
              <p className="text-center text-xs text-gray-500 mt-4">
                Having trouble? Email us at{' '}
                <a href="mailto:company@everjust.org" className="text-purple-400">
                  company@everjust.org
                </a>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
