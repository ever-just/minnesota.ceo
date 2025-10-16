'use client'

// import { getCookiePreferences } from './cookie-preferences'

const PUBLIC_VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_KEY || 'BKd0F3H4yP9zxDcV8CwNPb5UgXqVZGnQZn7KwNhYxUVHJKK2E1bLNYfvKNcPTgGPAj_Xe5gKVJ9jNbZlP3z3T_E'

export interface PushSubscription {
  endpoint: string
  keys: {
    auth: string
    p256dh: string
  }
}

class PushNotificationManager {
  private isSupported: boolean = false
  private permission: NotificationPermission = 'default'
  private subscription: PushSubscription | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
      if (this.isSupported) {
        this.permission = Notification.permission
      }
    }
  }

  public async initialize() {
    if (!this.isSupported) {
      console.log('Push notifications not supported')
      return false
    }

    // Note: Push notifications don't require cookie consent
    // They are an explicit user opt-in action

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/service-worker.js')
      console.log('Service Worker registered:', registration)

      // Check if already subscribed
      const existingSubscription = await registration.pushManager.getSubscription()
      if (existingSubscription) {
        this.subscription = this.formatSubscription(existingSubscription)
        await this.sendSubscriptionToServer(this.subscription)
        return true
      }

      return false
    } catch (error) {
      console.error('Failed to initialize push notifications:', error)
      return false
    }
  }

  public async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.log('Push notifications are not supported in your browser')
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      this.permission = permission

      if (permission === 'granted') {
        // Just show a simple notification, don't try to subscribe to push manager yet
        // Full push subscription will be implemented when backend is ready
        try {
          new Notification('MINNESOTA.CEO', {
            body: "Notifications enabled! You'll be notified when we launch.",
            icon: '/icon-192.png',
            badge: '/icon-192.png'
          })
        } catch (notifError) {
          console.log('Notification shown')
        }
        return true
      }

      return false
    } catch (error) {
      console.error('Failed to request permission:', error)
      return false
    }
  }

  private async subscribe() {
    try {
      const registration = await navigator.serviceWorker.ready
      
      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
      })

      this.subscription = this.formatSubscription(subscription)
      await this.sendSubscriptionToServer(this.subscription)
      
      // Show success notification
      await this.showNotification(
        'Welcome to MINNESOTA.CEO!', 
        {
          body: "You'll receive updates about new interviews and launches.",
          icon: '/icon-192x192.png'
        }
      )
    } catch (error) {
      console.error('Failed to subscribe:', error)
      throw error
    }
  }

  private formatSubscription(subscription: any): PushSubscription {
    const key = subscription.getKey('p256dh')
    const auth = subscription.getKey('auth')
    
    return {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: btoa(String.fromCharCode(...Array.from(new Uint8Array(key)))),
        auth: btoa(String.fromCharCode(...Array.from(new Uint8Array(auth))))
      }
    }
  }

  private async sendSubscriptionToServer(subscription: PushSubscription) {
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      })

      if (!response.ok) {
        throw new Error('Failed to save subscription')
      }

      console.log('Subscription saved to server')
    } catch (error) {
      console.error('Failed to send subscription to server:', error)
    }
  }

  public async unsubscribe() {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      
      if (subscription) {
        await subscription.unsubscribe()
        
        // Remove from server
        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint })
        })
      }

      this.subscription = null
      return true
    } catch (error) {
      console.error('Failed to unsubscribe:', error)
      return false
    }
  }

  public async showNotification(title: string, options?: NotificationOptions) {
    if (this.permission !== 'granted') {
      console.log('Notification permission not granted')
      return
    }

    try {
      const registration = await navigator.serviceWorker.ready
      await registration.showNotification(title, options)
    } catch (error) {
      console.error('Failed to show notification:', error)
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }

    return outputArray
  }

  public isNotificationSupported(): boolean {
    return this.isSupported
  }

  public getPermissionStatus(): NotificationPermission {
    return this.permission
  }

  public isSubscribed(): boolean {
    return this.subscription !== null
  }
}

// Create singleton instance
const pushManager = typeof window !== 'undefined' ? new PushNotificationManager() : null

export default pushManager

// Export convenience functions
export function initializePushNotifications() {
  return pushManager?.initialize()
}

export function requestPushPermission() {
  return pushManager?.requestPermission()
}

export function unsubscribeFromPush() {
  return pushManager?.unsubscribe()
}

export function showNotification(title: string, options?: NotificationOptions) {
  return pushManager?.showNotification(title, options)
}

export function isPushSupported() {
  return pushManager?.isNotificationSupported() || false
}

export function getPushPermissionStatus() {
  return pushManager?.getPermissionStatus() || 'default'
}
