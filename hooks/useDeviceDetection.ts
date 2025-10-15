'use client'

import { useEffect, useState } from 'react'

export interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isIOS: boolean
  isAndroid: boolean
  isSafari: boolean
  isChrome: boolean
  isFirefox: boolean
  isPWA: boolean
  canInstallPWA: boolean
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isIOS: false,
    isAndroid: false,
    isSafari: false,
    isChrome: false,
    isFirefox: false,
    isPWA: false,
    canInstallPWA: false
  })

  useEffect(() => {
    const detectDevice = () => {
      const ua = navigator.userAgent.toLowerCase()
      const windowWidth = window.innerWidth
      
      // Device type detection
      const isMobile = /mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua) && windowWidth < 768
      const isTablet = /ipad|tablet|kindle|silk/i.test(ua) || (windowWidth >= 768 && windowWidth < 1024)
      const isDesktop = !isMobile && !isTablet

      // OS detection
      const isIOS = /iphone|ipad|ipod/i.test(ua) || 
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      const isAndroid = /android/i.test(ua)

      // Browser detection
      const isSafari = /safari/i.test(ua) && !/chrome/i.test(ua)
      const isChrome = /chrome/i.test(ua) && !/edge/i.test(ua)
      const isFirefox = /firefox/i.test(ua)

      // PWA detection
      const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                    (window.navigator as any).standalone === true ||
                    document.referrer.includes('android-app://')

      // Can install PWA
      let canInstallPWA = false
      
      // iOS Safari - can add to home screen
      if (isIOS && isSafari && !isPWA) {
        canInstallPWA = true
      }
      
      // Android Chrome - check for beforeinstallprompt
      if (isAndroid && isChrome && !isPWA) {
        canInstallPWA = true
      }

      // Desktop Chrome/Edge - check for beforeinstallprompt
      if (isDesktop && (isChrome || /edge/i.test(ua)) && !isPWA) {
        canInstallPWA = true
      }

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isIOS,
        isAndroid,
        isSafari,
        isChrome,
        isFirefox,
        isPWA,
        canInstallPWA
      })
    }

    detectDevice()
    
    // Re-detect on resize
    window.addEventListener('resize', detectDevice)
    return () => window.removeEventListener('resize', detectDevice)
  }, [])

  return deviceInfo
}
