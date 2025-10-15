'use client'

import * as CookieConsent from 'vanilla-cookieconsent'

export interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export const cookieConfig: CookieConsent.CookieConsentConfig = {
  guiOptions: {
    consentModal: {
      layout: 'box',
      position: 'bottom right',
      equalWeightButtons: true,
      flipButtons: false
    },
    preferencesModal: {
      layout: 'box',
      position: 'right',
      equalWeightButtons: true,
      flipButtons: false
    }
  },
  categories: {
    necessary: {
      readOnly: true
    },
    analytics: {},
    marketing: {}
  },
  language: {
    default: 'en',
    autoDetect: 'browser',
    translations: {
      en: {
        consentModal: {
          title: 'Cookie Settings',
          description: 'We use cookies to improve your experience.',
          acceptAllBtn: 'Accept',
          acceptNecessaryBtn: 'Decline',
          showPreferencesBtn: 'Customize',
          footer: '<a href="/privacy">Privacy</a>'
        },
        preferencesModal: {
          title: 'Cookie Preferences',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Accept necessary only',
          savePreferencesBtn: 'Save preferences',
          closeIconLabel: 'Close modal',
          serviceCounterLabel: 'Service|Services',
          sections: [
            {
              title: 'Cookie Usage',
              description: 'We use cookies to ensure the basic functionalities of the website and to enhance your experience. You can choose for each category to opt-in/out whenever you want.'
            },
            {
              title: 'Necessary cookies <span class="pm__badge">Always Enabled</span>',
              description: 'These cookies are essential for the proper functioning of the website. Without these cookies, the website would not work properly.',
              linkedCategory: 'necessary',
              cookieTable: {
                headers: {
                  name: 'Name',
                  domain: 'Domain',
                  expiration: 'Expiration',
                  description: 'Description'
                },
                body: [
                  {
                    name: 'session_token',
                    domain: 'minnesota.ceo',
                    expiration: 'Session',
                    description: 'Used for admin authentication'
                  }
                ]
              }
            },
            {
              title: 'Analytics cookies',
              description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
              linkedCategory: 'analytics',
              cookieTable: {
                headers: {
                  name: 'Name',
                  domain: 'Domain',
                  expiration: 'Expiration',
                  description: 'Description'
                },
                body: [
                  {
                    name: 'visitor_id',
                    domain: 'minnesota.ceo',
                    expiration: '1 year',
                    description: 'Unique visitor identifier for analytics'
                  },
                  {
                    name: 'page_views',
                    domain: 'minnesota.ceo',
                    expiration: '30 days',
                    description: 'Tracks page view statistics'
                  }
                ]
              }
            },
            {
              title: 'Marketing cookies',
              description: 'These cookies are used to track visitors across websites to display ads that are relevant and engaging.',
              linkedCategory: 'marketing',
              cookieTable: {
                headers: {
                  name: 'Name',
                  domain: 'Domain',
                  expiration: 'Expiration',
                  description: 'Description'
                },
                body: [
                  {
                    name: 'campaign_id',
                    domain: 'minnesota.ceo',
                    expiration: '90 days',
                    description: 'Tracks marketing campaign effectiveness'
                  }
                ]
              }
            },
            {
              title: 'More information',
              description: 'For any queries in relation to our policy on cookies and your choices, please <a href="mailto:company@everjust.org">contact us</a>.'
            }
          ]
        }
      }
    }
  }
}

function trackEvent(eventName: string) {
  // Track event to our analytics
  if (typeof window !== 'undefined') {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: eventName,
        page_path: window.location.pathname
      })
    }).catch(() => {})
  }
}

function enableAnalytics() {
  // Enable analytics tracking
  if (typeof window !== 'undefined') {
    (window as any).analyticsEnabled = true
  }
}

function disableAnalytics() {
  // Disable analytics tracking
  if (typeof window !== 'undefined') {
    (window as any).analyticsEnabled = false
    // Clear analytics cookies
    document.cookie = 'visitor_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = 'page_views=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }
}

export function getCookiePreferences(): CookiePreferences {
  if (typeof window === 'undefined') {
    return { necessary: true, analytics: false, marketing: false }
  }
  
  const consent = CookieConsent.getCookie()
  return {
    necessary: true,
    analytics: consent?.categories?.includes('analytics') || false,
    marketing: consent?.categories?.includes('marketing') || false
  }
}

// Initialize consent tracking after CookieConsent loads
export function initCookieTracking() {
  if (typeof window !== 'undefined') {
    const consent = CookieConsent.getCookie()
    if (consent?.categories?.includes('analytics')) {
      enableAnalytics()
    } else {
      disableAnalytics()
    }
  }
}
