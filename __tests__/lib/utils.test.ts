import { validateEmail, sanitizeInput, getTimeUntilLaunch } from '@/lib/utils'

describe('Utils', () => {
  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('test+tag@example.com')).toBe(true)
    })

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false)
      expect(validateEmail('invalid@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test @example.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('sanitizeInput', () => {
    it('removes HTML tags and special characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert"xss"script')
      expect(sanitizeInput('Test & Name')).toBe('Test  Name')
      expect(sanitizeInput('Normal Text')).toBe('Normal Text')
    })

    it('trims whitespace', () => {
      expect(sanitizeInput('  test  ')).toBe('test')
      expect(sanitizeInput('\n\ttest\n')).toBe('test')
    })
  })

  describe('getTimeUntilLaunch', () => {
    it('returns time object with correct properties', () => {
      const time = getTimeUntilLaunch()
      
      expect(time).toHaveProperty('days')
      expect(time).toHaveProperty('hours')
      expect(time).toHaveProperty('minutes')
      expect(time).toHaveProperty('seconds')
      
      expect(typeof time.days).toBe('number')
      expect(typeof time.hours).toBe('number')
      expect(typeof time.minutes).toBe('number')
      expect(typeof time.seconds).toBe('number')
    })

    it('returns non-negative values', () => {
      const time = getTimeUntilLaunch()
      
      expect(time.days).toBeGreaterThanOrEqual(0)
      expect(time.hours).toBeGreaterThanOrEqual(0)
      expect(time.minutes).toBeGreaterThanOrEqual(0)
      expect(time.seconds).toBeGreaterThanOrEqual(0)
    })
  })
})

