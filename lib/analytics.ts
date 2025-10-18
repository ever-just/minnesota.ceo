'use client'

import { getCookiePreferences } from './cookie-preferences'

export interface AnalyticsEvent {
  event_type: string
  page_path?: string
  event_value?: string
  event_category?: string
  user_agent?: string
  referrer?: string
  screen_resolution?: string
  viewport_size?: string
  session_id?: string
  visitor_id?: string
}

export interface PageViewData {
  path: string
  title: string
  referrer: string
  time_on_page?: number
  scroll_depth?: number
}

export interface SessionData {
  session_id: string
  visitor_id: string
  started_at: Date
  pages_viewed: number
  total_time: number
  bounce: boolean
}

class Analytics {
  private sessionId: string | null = null
  private visitorId: string | null = null
  private pageStartTime: number = 0
  private scrollDepth: number = 0
  private isEnabled: boolean = false
  private sessionStartTime: number = 0
  private pageCount: number = 0
  private geoData: any = null
  private landingPage: string = ''

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize()
    }
  }

  private async initialize() {
    // Check cookie consent
    const preferences = getCookiePreferences()
    this.isEnabled = preferences.analytics

    if (!this.isEnabled) return

    // Get or create visitor ID
    this.visitorId = this.getVisitorId()
    
    // Create new session
    this.sessionId = this.generateId()
    this.sessionStartTime = Date.now()
    this.landingPage = window.location.pathname
    this.pageCount = 1
    
    // Track page view on initialization
    this.pageStartTime = Date.now()
    
    await this.fetchGeolocation()
    
    // Create session in database
    await this.createSession()
    
    // Set up event listeners
    this.setupEventListeners()
  }

  private async fetchGeolocation() {
    try {
      const response = await fetch('https://ip-api.com/json/')
      if (response.ok) {
        this.geoData = await response.json()
      }
    } catch (error) {
      console.error('Geolocation fetch error:', error)
    }
  }

  private async createSession() {
    if (!this.sessionId || !this.visitorId) return

    try {
      const deviceType = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
      const browserMatch = navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)\/[\d.]+/)
      const browser = browserMatch ? browserMatch[1] : 'Unknown'
      const osMatch = navigator.userAgent.match(/(Windows|Mac|Linux|Android|iOS)/)
      const os = osMatch ? osMatch[1] : 'Unknown'

      await fetch('/api/analytics/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: this.sessionId,
          visitor_id: this.visitorId,
          ip_address: this.geoData?.query,
          country: this.geoData?.country,
          region: this.geoData?.regionName,
          city: this.geoData?.city,
          latitude: this.geoData?.lat,
          longitude: this.geoData?.lon,
          user_agent: navigator.userAgent,
          device_type: deviceType,
          browser: browser,
          os: os,
          referrer: document.referrer,
          landing_page: this.landingPage,
          started_at: new Date(this.sessionStartTime).toISOString()
        })
      })
    } catch (error) {
      console.error('Session creation error:', error)
    }
  }

  private async updateSession() {
    if (!this.sessionId) return

    try {
      const duration = Math.round((Date.now() - this.sessionStartTime) / 1000)
      await fetch('/api/analytics/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: this.sessionId,
          visitor_id: this.visitorId,
          exit_page: window.location.pathname,
          page_count: this.pageCount,
          ended_at: new Date().toISOString(),
          duration_seconds: duration
        })
      })
    } catch (error) {
      console.error('Session update error:', error)
    }
  }

  private setupEventListeners() {
    if (!this.isEnabled) return

    let maxScroll = 0
    window.addEventListener('scroll', () => {
      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
      maxScroll = Math.max(maxScroll, scrollPercentage)
      this.scrollDepth = maxScroll
    })

    window.addEventListener('beforeunload', () => {
      const timeOnPage = Math.round((Date.now() - this.pageStartTime) / 1000)
      this.trackPageView({
        path: window.location.pathname,
        title: document.title,
        referrer: document.referrer,
        time_on_page: timeOnPage,
        scroll_depth: this.scrollDepth
      })
      this.updateSession()
    })

    let hiddenTime = 0
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        hiddenTime = Date.now()
      } else if (hiddenTime > 0) {
        this.pageStartTime += (Date.now() - hiddenTime)
        hiddenTime = 0
      }
    })

    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      if (target) {
        this.trackClick(
          target.id || target.className || target.tagName,
          target.textContent?.substring(0, 50) || undefined,
          event
        )
      }
    })
  }

  private getVisitorId(): string {
    // Check if visitor ID exists in localStorage
    const stored = localStorage.getItem('visitor_id')
    if (stored) return stored

    // Generate new visitor ID
    const newId = this.generateId()
    localStorage.setItem('visitor_id', newId)
    return newId
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  public async trackEvent(event: Partial<AnalyticsEvent>) {
    if (!this.isEnabled) return

    const fullEvent: AnalyticsEvent = {
      event_type: event.event_type || 'custom',
      page_path: event.page_path || window.location.pathname,
      event_value: event.event_value,
      event_category: event.event_category,
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      session_id: this.sessionId || undefined,
      visitor_id: this.visitorId || undefined
    }

    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullEvent)
      })
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  public async trackPageView(data?: Partial<PageViewData>) {
    if (!this.isEnabled || !this.sessionId || !this.visitorId) return

    this.pageCount++

    try {
      await fetch('/api/analytics/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: this.sessionId,
          visitor_id: this.visitorId,
          page_path: data?.path || window.location.pathname,
          page_title: data?.title || document.title,
          referrer: data?.referrer || document.referrer,
          time_on_page: data?.time_on_page,
          scroll_depth: data?.scroll_depth
        })
      })

      await this.trackEvent({
        event_type: 'page_view',
        page_path: data?.path || window.location.pathname,
        event_value: JSON.stringify({
          title: data?.title || document.title,
          referrer: data?.referrer || document.referrer,
          time_on_page: data?.time_on_page,
          scroll_depth: data?.scroll_depth
        })
      })
    } catch (error) {
      console.error('Page view tracking error:', error)
    }
  }

  public async trackClick(elementId: string, elementText?: string, event?: MouseEvent) {
    if (!this.isEnabled || !this.sessionId || !this.visitorId) return

    try {
      const element = event?.target as HTMLElement
      await fetch('/api/analytics/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: this.sessionId,
          visitor_id: this.visitorId,
          page_path: window.location.pathname,
          element_id: elementId || element?.id,
          element_class: element?.className,
          element_tag: element?.tagName,
          element_text: elementText || element?.textContent?.substring(0, 100),
          x_position: event?.clientX,
          y_position: event?.clientY,
          viewport_width: window.innerWidth,
          viewport_height: window.innerHeight
        })
      })

      await this.trackEvent({
        event_type: 'click',
        event_category: 'interaction',
        event_value: JSON.stringify({ id: elementId, text: elementText })
      })
    } catch (error) {
      console.error('Click tracking error:', error)
    }
  }

  public async trackFormSubmission(formName: string, success: boolean) {
    await this.trackEvent({
      event_type: 'form_submit',
      event_category: 'conversion',
      event_value: JSON.stringify({ form: formName, success })
    })
  }

  public async trackSearch(query: string, resultsCount?: number) {
    await this.trackEvent({
      event_type: 'search',
      event_category: 'interaction',
      event_value: JSON.stringify({ query, results: resultsCount })
    })
  }

  public async trackTiming(category: string, variable: string, time: number) {
    await this.trackEvent({
      event_type: 'timing',
      event_category: category,
      event_value: JSON.stringify({ variable, time })
    })
  }

  public async trackError(error: string, fatal: boolean = false) {
    await this.trackEvent({
      event_type: 'error',
      event_category: 'error',
      event_value: JSON.stringify({ message: error, fatal })
    })
  }

  // Enhanced tracking methods
  public async trackEngagement(type: 'video_play' | 'video_complete' | 'share' | 'download', metadata?: any) {
    await this.trackEvent({
      event_type: 'engagement',
      event_category: type,
      event_value: JSON.stringify(metadata)
    })
  }

  public async trackConversion(type: 'waitlist' | 'nomination' | 'newsletter', metadata?: any) {
    if (!this.isEnabled || !this.sessionId || !this.visitorId) return

    try {
      await fetch('/api/analytics/conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: this.sessionId,
          visitor_id: this.visitorId,
          conversion_type: type,
          conversion_value: metadata?.value,
          funnel_step: metadata?.step,
          completed: metadata?.completed !== false,
          metadata: metadata
        })
      })

      await this.trackEvent({
        event_type: 'conversion',
        event_category: type,
        event_value: JSON.stringify(metadata)
      })
    } catch (error) {
      console.error('Conversion tracking error:', error)
    }
  }

  // Set custom dimensions
  public setUserId(userId: string) {
    if (this.isEnabled) {
      localStorage.setItem('user_id', userId)
    }
  }

  public setUserProperties(properties: Record<string, any>) {
    if (this.isEnabled) {
      localStorage.setItem('user_properties', JSON.stringify(properties))
    }
  }

  // Enable/disable based on consent
  public enable() {
    this.isEnabled = true
    this.initialize()
  }

  public disable() {
    this.isEnabled = false
    // Clear analytics data
    localStorage.removeItem('visitor_id')
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_properties')
  }
}

// Create singleton instance
const analytics = typeof window !== 'undefined' ? new Analytics() : null

export default analytics

// Export convenience functions
export function trackPageView(data?: Partial<PageViewData>) {
  analytics?.trackPageView(data)
}

export function trackEvent(event: Partial<AnalyticsEvent>) {
  analytics?.trackEvent(event)
}

export function trackClick(elementId: string, elementText?: string) {
  analytics?.trackClick(elementId, elementText)
}

export function trackFormSubmission(formName: string, success: boolean) {
  analytics?.trackFormSubmission(formName, success)
}

export function trackConversion(type: 'waitlist' | 'nomination' | 'newsletter', metadata?: any) {
  analytics?.trackConversion(type, metadata)
}
