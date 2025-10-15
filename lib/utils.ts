import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Input sanitization to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[&<>"']/g, '') // Remove special characters
    .trim()
}

// Leader categories for nomination form
export const leaderCategories = [
  'Business Leaders',
  'Government Officials',
  'Education Leaders',
  'Community Organizers',
  'Tech Founders',
  'Healthcare Professionals',
  'Nonprofit Directors',
  'Religious Leaders',
  'Arts & Culture',
  'Media & Communications',
  'Sports & Recreation',
  'Environmental Advocates',
  'Legal Professionals',
  'Real Estate Developers',
  'Other',
]

// Calculate time until launch date
export function getTimeUntilLaunch() {
  const launchDate = new Date('2025-11-01T00:00:00')
  const now = new Date()
  const diff = launchDate.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}
