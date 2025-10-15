'use client'

import { useState } from 'react'
import { validateEmail } from '@/lib/utils'
import EnhancedEmailField from '@/components/EnhancedEmailField'
import { trackConversion } from '@/lib/analytics'

interface WaitlistFormProps {
  source?: string
}

export default function WaitlistForm({ source = 'main' }: WaitlistFormProps) {
  const handleEnhancedSubmit = async (emailValue: string) => {
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailValue, source }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to join waitlist')
    }

    // Track conversion
    await trackConversion('waitlist', { source })
    
    return data
  }

  return (
    <div className="w-full">
      <EnhancedEmailField
        onSubmit={handleEnhancedSubmit}
        buttonText="Get Notified"
        successMessage="You're on the list! 🎉"
        className="w-full"
      />
    </div>
  )
}
