'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'

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
  const inputRef = useRef<HTMLInputElement>(null)
  
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

  const getButtonText = () => {
    switch (status) {
      case 'loading':
        return 'Joining...'
      case 'success':
        return successMessage
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
          <div className="flex items-center gap-3">
            {/* Icon */}
            <motion.div
              animate={{ rotate: status === 'success' ? 360 : 0 }}
              transition={{ duration: 0.5 }}
              className="pl-3"
            >
              {getStatusIcon()}
            </motion.div>
            
            {/* Input with floating label */}
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status === 'error') setStatus('idle')
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={status === 'loading' || status === 'success'}
                className="w-full bg-transparent text-white px-2 py-3 outline-none placeholder-transparent peer disabled:opacity-50"
                placeholder={placeholder}
                id="email-input"
              />
              
              <label
                htmlFor="email-input"
                className={`absolute left-2 transition-all duration-200 pointer-events-none
                  ${email || isFocused 
                    ? '-top-2 text-xs text-purple-400 bg-black px-1' 
                    : 'top-3 text-sm text-gray-400'}`}
              >
                {email || isFocused ? 'Email' : 'Enter your email'}
              </label>
            </div>
            
            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              whileHover={{ scale: status === 'idle' ? 1.02 : 1 }}
              whileTap={{ scale: status === 'idle' ? 0.98 : 1 }}
              className={`
                px-6 py-3 rounded-xl font-semibold transition-all duration-300
                ${status === 'success' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600'}
                disabled:opacity-50 disabled:cursor-not-allowed
                min-w-[140px]
              `}
            >
              <span className="flex items-center justify-center gap-2">
                {status === 'success' && <Sparkles className="w-4 h-4" />}
                {getButtonText()}
              </span>
            </motion.button>
          </div>
        </div>
        
        {/* Error message */}
        <AnimatePresence>
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -bottom-8 left-0 text-red-400 text-sm flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {errorMessage}
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
