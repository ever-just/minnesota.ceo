export interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export function getCookiePreferences(): CookiePreferences {
  if (typeof window === 'undefined') {
    return { necessary: true, analytics: false, marketing: false }
  }
  
  try {
    const stored = localStorage.getItem('cookie-preferences')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error reading cookie preferences:', error)
  }
  
  // Default: only necessary cookies
  return { necessary: true, analytics: false, marketing: false }
}

