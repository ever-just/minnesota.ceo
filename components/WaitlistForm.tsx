'use client'

import { useState } from 'react'
import { validateEmail } from '@/lib/utils'

interface WaitlistFormProps {
  source?: string
}

export default function WaitlistForm({ source = 'main' }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Thank you! You\'re on the list. Check your email for confirmation.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Unable to join waitlist. Please try again later.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent backdrop-blur-sm"
          disabled={status === 'loading' || status === 'success'}
          required
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="px-8 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-dark-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover-glow"
        >
          {status === 'loading' ? 'Joining...' : status === 'success' ? 'Joined!' : 'Get Notified'}
        </button>
      </div>
      
      {message && (
        <div className={`mt-3 text-sm ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}>
          {message}
        </div>
      )}
    </form>
  )
}
