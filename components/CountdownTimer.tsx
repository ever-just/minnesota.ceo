'use client'

import { useEffect, useState } from 'react'
import { getTimeUntilLaunch } from '@/lib/utils'

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilLaunch())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilLaunch())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="flex justify-center items-center space-x-4 md:space-x-8">
        {[0, 0, 0, 0].map((_, i) => (
          <div key={i} className="text-center">
            <div className="glass-effect rounded-lg p-4 md:p-6 min-w-[80px] md:min-w-[100px]">
              <div className="text-2xl md:text-4xl font-bold text-primary-purple">--</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
    <div className="flex justify-center items-center space-x-4 md:space-x-8">
      {units.map((unit) => (
        <div key={unit.label} className="text-center">
          <div className="glass-effect rounded-lg p-4 md:p-6 min-w-[80px] md:min-w-[100px] hover-glow">
            <div className="text-2xl md:text-4xl font-bold text-primary-purple">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="text-xs md:text-sm text-gray-400 mt-2">{unit.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
