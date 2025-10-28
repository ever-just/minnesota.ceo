'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface EnhancedEmailFieldProps {
  onSubmit: (email: string) => Promise<void>
  placeholder?: string
  buttonText?: string
  successMessage?: string
  className?: string
}

export default function EnhancedEmailField({
  onSubmit,
  placeholder = 'your@email.com',
  buttonText = 'Join Waitlist',
  successMessage = 'Welcome aboard! 🎉',
  className = ''
}: EnhancedEmailFieldProps) {
  const [email, setEmail] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !isValidEmail(email)) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')
    
    try {
      await onSubmit(email)
      setStatus('success')
      
      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6B46C1', '#9333EA', '#A855F7', '#C084FC']
      })
      
      // Reset after 3 seconds
      setTimeout(() => {
        setEmail('')
        setStatus('idle')
      }, 3000)
    } catch (error) {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-5 h-5 animate-spin" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Mail className="w-5 h-5 text-purple-400" />
    }
  }

  const getButtonContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Joining...</span>
          </>
        )
      case 'success':
        return (
          <>
            <Sparkles className="w-4 h-4" />
            <span>{successMessage}</span>
          </>
        )
      default:
        return buttonText
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative max-w-md mx-auto ${className}`}>
      <div className="relative">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-400/20 rounded-2xl blur-xl"
          animate={{
            opacity: isFocused ? 1 : 0.5,
            scale: isFocused ? 1.02 : 1
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Input container */}
        <div className="relative bg-black/50 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-2 transition-all duration-300 hover:border-purple-500/50">
          <div className="flex items-center gap-2">
            {/* Status Icon */}
            <motion.div
              animate={{ rotate: status === 'success' ? 360 : 0 }}
              transition={{ duration: 0.5 }}
              className="pl-2"
            >
              {getStatusIcon()}
            </motion.div>
            
            {/* Email Input */}
            <div className="flex-1">
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status === 'error') setStatus('idle')
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={status === 'loading' || status === 'success'}
                placeholder={placeholder}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-11 text-white placeholder:text-gray-500"
              />
            </div>
            
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              variant={status === 'success' ? 'default' : 'gradient'}
              size="lg"
              className={status === 'success' ? 'bg-green-600 hover:bg-green-700 text-white font-semibold' : ''}
            >
              {getButtonContent()}
            </Button>
          </div>
        </div>
        
        {/* Error message */}
        <AnimatePresence>
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -bottom-7 left-0 text-red-400 text-sm flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Success details message */}
        <AnimatePresence>
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -bottom-16 left-0 right-0 text-center"
            >
              <p className="text-sm text-gray-300">
                Check your email for confirmation. We&apos;ll notify you 2 weeks before launch!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Success animation particles */}
        {status === 'success' && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-purple-400 rounded-full"
                initial={{
                  x: '50%',
                  y: '50%',
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 200}%`,
                  y: `${50 + (Math.random() - 0.5) * 200}%`,
                  opacity: [1, 0],
                  scale: [1, 0],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.1,
                  ease: 'easeOut',
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </form>
  )
}
