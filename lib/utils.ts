import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/<[^>]*>?/gm, '')
}

export function getTimeUntilLaunch(): {
  days: number
  hours: number
  minutes: number
  seconds: number
} {
  const launchDate = new Date('2025-11-01T00:00:00')
  const now = new Date()
  const difference = launchDate.getTime() - now.getTime()

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

export const leaderCategories = [
  'Business Leaders',
  'Public Company Executives',
  'Education Leaders',
  'Religious Leaders',
  'Government Officials',
  'Non-Profit Directors',
  'Tech & Startup Founders',
  'Community Organizers',
  'Healthcare Leaders',
  'Arts & Culture Leaders',
]
