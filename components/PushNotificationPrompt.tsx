'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, CheckCircle, AlertCircle } from 'lucide-react'
import pushManager, { isPushSupported, getPushPermissionStatus } from '@/lib/push-notifications'
import { trackClick } from '@/lib/analytics'

export default function PushNotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Check if we should show the prompt
    const checkPrompt = async () => {
      if (!isPushSupported()) return

      const permission = getPushPermissionStatus()
      const hasSeenPrompt = localStorage.getItem('push_prompt_seen')
      
      // Show prompt after user has been on site for 30 seconds
      // and hasn't seen it before
      if (permission === 'default' && !hasSeenPrompt) {
        setTimeout(() => {
          setShowPrompt(true)
        }, 30000) // 30 seconds
      }

      // Initialize push notifications if already granted
      if (permission === 'granted') {
        await pushManager?.initialize()
      }
    }

    checkPrompt()
  }, [])

  const handleEnable = async () => {
    setIsLoading(true)
    setStatus('idle')
    
    try {
      const success = await pushManager?.requestPermission()
      
      if (success) {
        setStatus('success')
        setMessage('Notifications enabled! You\'ll be the first to know.')
        trackClick('push-notification-enable', 'Enabled')
        localStorage.setItem('push_prompt_seen', 'true')
        
        // Hide prompt immediately after success
        setTimeout(() => {
          setShowPrompt(false)
          setIsLoading(false)
        }, 800)
      } else {
        setStatus('error')
        setMessage('Notifications were not enabled. You can enable them later in settings.')
        trackClick('push-notification-deny', 'Denied')
        setIsLoading(false)
        
        // Auto-dismiss after error
        setTimeout(() => {
          setShowPrompt(false)
        }, 3000)
      }
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('push_prompt_seen', 'true')
    trackClick('push-notification-dismiss', 'Dismissed')
  }

  const handleRemindLater = () => {
    setShowPrompt(false)
    // Show again in 3 days
    const remindDate = new Date()
    remindDate.setDate(remindDate.getDate() + 3)
    localStorage.setItem('push_prompt_remind', remindDate.toISOString())
    trackClick('push-notification-later', 'Remind Later')
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm w-full sm:w-auto"
        >
          <div className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl p-6">
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon and title */}
            <div className="flex items-start gap-4 mb-4">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
                className="p-3 bg-gradient-to-br from-purple-600 to-purple-500 rounded-lg"
              >
                <Bell className="w-6 h-6 text-white" />
              </motion.div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Stay in the Loop! 🎯
                </h3>
                <p className="text-sm text-gray-400">
                  Get instant notifications when new leader interviews drop and be first to know about our launch.
                </p>
              </div>
            </div>

            {/* Status messages */}
            {status !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4"
              >
                <div className={`flex items-center gap-2 text-sm ${
                  status === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {status === 'success' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {message}
                </div>
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEnable}
                disabled={isLoading || status === 'success'}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Enabling...' : 'Enable Notifications'}
              </motion.button>
              
              <button
                onClick={handleRemindLater}
                className="px-4 py-2 bg-white/10 text-gray-300 font-medium rounded-lg hover:bg-white/20 transition-colors duration-300"
              >
                Later
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-4 pt-4 border-t border-purple-500/20">
              <p className="text-xs text-gray-500 text-center">
                🔒 We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
