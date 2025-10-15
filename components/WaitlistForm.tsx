'use client'

import { useState } from 'react'
import { validateEmail } from '@/lib/utils'
import EnhancedEmailField from '@/components/EnhancedEmailField'
import MobileInstallPrompt from '@/components/MobileInstallPrompt'
import { trackConversion } from '@/lib/analytics'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'

interface WaitlistFormProps {
  source?: string
}

export default function WaitlistForm({ source = 'main' }: WaitlistFormProps) {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const { isMobile } = useDeviceDetection()

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
    
    // Show mobile install prompt after successful signup on mobile devices
    if (isMobile) {
      setTimeout(() => setShowInstallPrompt(true), 1500)
    }
    
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
      {showInstallPrompt && <MobileInstallPrompt trigger={showInstallPrompt} />}
    </div>
  )
}
