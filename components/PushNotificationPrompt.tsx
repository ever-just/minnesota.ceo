'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
      const hasDismissed = localStorage.getItem('push_prompt_dismissed')
      
      // Show prompt after user scrolls 60% down the page
      // and hasn't seen it before or dismissed it
      if (permission === 'default' && !hasSeenPrompt && !hasDismissed) {
        const handleScroll = () => {
          const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
          
          if (scrollPercentage > 60) {
            setTimeout(() => {
              setShowPrompt(true)
            }, 2000)
            window.removeEventListener('scroll', handleScroll)
          }
        }
        
        window.addEventListener('scroll', handleScroll)
        
        return () => window.removeEventListener('scroll', handleScroll)
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
        setIsLoading(false)
        setTimeout(() => {
          setShowPrompt(false)
        }, 500)
      } else {
        setStatus('error')
        setMessage('Notifications were not enabled.')
        trackClick('push-notification-deny', 'Denied')
        setIsLoading(false)
        localStorage.setItem('push_prompt_seen', 'true')
        
        // Auto-dismiss after error
        setTimeout(() => {
          setShowPrompt(false)
        }, 2000)
      }
    } catch (error) {
      console.error('Push notification error:', error)
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
      setIsLoading(false)
      
      // Auto-dismiss on error
      setTimeout(() => {
        setShowPrompt(false)
      }, 2000)
    }
  }

  const handleRemindLater = () => {
    setShowPrompt(false)
    localStorage.setItem('push_prompt_seen', 'true')
    localStorage.setItem('push_prompt_dismissed', 'true')
    const remindDate = new Date()
    remindDate.setDate(remindDate.getDate() + 3)
    localStorage.setItem('push_prompt_remind', remindDate.toISOString())
    trackClick('push-notification-later', 'Remind Later')
  }
  
  const handleClose = () => {
    setShowPrompt(false)
    localStorage.setItem('push_prompt_seen', 'true')
    localStorage.setItem('push_prompt_dismissed', 'true')
    trackClick('push-notification-close', 'Closed')
  }

  return (
    <Dialog open={showPrompt} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-black border-purple-500/30">
        <DialogHeader>
          <div className="flex items-start gap-4 mb-2">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
              className="p-3 bg-gradient-to-br from-purple-600 to-purple-500 rounded-lg"
            >
              <Bell className="w-6 h-6 text-white" />
            </motion.div>
            
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-white mb-1">
                Stay in the Loop! 🎯
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-400">
                Get instant notifications when new leader interviews drop.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Status Message */}
        {status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 p-3 rounded-lg flex items-center gap-2 text-sm"
            style={{
              backgroundColor: status === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              borderColor: status === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
              borderWidth: '1px',
              color: status === 'success' ? '#4ade80' : '#f87171'
            }}
          >
            {status === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {message}
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleEnable}
            disabled={isLoading || status === 'success'}
            variant="gradient"
            size="lg"
            className="flex-1"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Enabling...' : 'Enable Notifications'}
          </Button>
          
          <Button
            onClick={handleRemindLater}
            variant="outline"
            size="lg"
            className="border-purple-500/30 text-gray-300 hover:bg-purple-500/10 hover:text-white"
          >
            Later
          </Button>
        </div>

        {/* Trust Indicator */}
        <p className="text-xs text-gray-500 text-center pt-4 border-t border-purple-500/20">
          🔒 We respect your privacy. Unsubscribe anytime.
        </p>
      </DialogContent>
    </Dialog>
  )
}
