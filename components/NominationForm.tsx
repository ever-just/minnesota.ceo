'use client'

import { useState } from 'react'
import { validateEmail, sanitizeInput, leaderCategories } from '@/lib/utils'

export default function NominationForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    nomineeName: '',
    nomineeTitle: '',
    nomineeOrganization: '',
    category: '',
    reason: '',
    nominatorName: '',
    nominatorEmail: '',
    nominatorPhone: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(formData.nominatorEmail)) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const sanitizedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, sanitizeInput(value)])
      )

      const response = await fetch('/api/nominations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Thank you for your nomination! We\'ll review it soon.')
        setFormData({
          nomineeName: '',
          nomineeTitle: '',
          nomineeOrganization: '',
          category: '',
          reason: '',
          nominatorName: '',
          nominatorEmail: '',
          nominatorPhone: '',
        })
        setTimeout(() => {
          setIsOpen(false)
          setStatus('idle')
          setMessage('')
        }, 3000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Unable to submit nomination. Please try again later.')
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-8 py-4 bg-transparent border-2 border-primary-purple text-primary-purple font-semibold rounded-lg hover:bg-primary-purple hover:text-black transition-all duration-300 hover-glow"
      >
        Nominate a Leader
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-black border border-primary-purple/20 rounded-xl p-6 md:p-8">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>

            <h2 className="text-2xl md:text-3xl font-bold text-primary-purple mb-6">Nominate a Minnesota Leader</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nominee Name *</label>
                  <input
                    type="text"
                    name="nomineeName"
                    value={formData.nomineeName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Title/Position</label>
                  <input
                    type="text"
                    name="nomineeTitle"
                    value={formData.nomineeTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Organization</label>
                  <input
                    type="text"
                    name="nomineeOrganization"
                    value={formData.nomineeOrganization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {leaderCategories.map((cat) => (
                      <option key={cat} value={cat} className="bg-black">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Why should this person be interviewed?</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent resize-none"
                />
              </div>

              <div className="border-t border-gray-800 pt-4">
                <h3 className="text-lg font-semibold text-white mb-4">Your Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Your Name *</label>
                    <input
                      type="text"
                      name="nominatorName"
                      value={formData.nominatorName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Your Email *</label>
                    <input
                      type="email"
                      name="nominatorEmail"
                      value={formData.nominatorEmail}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Phone (Optional)</label>
                    <input
                      type="tel"
                      name="nominatorPhone"
                      value={formData.nominatorPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {message && (
                <div className={`text-sm ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                  {message}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="flex-1 px-8 py-3 bg-primary-purple text-black font-semibold rounded-lg hover:bg-dark-purple transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Submitting...' : status === 'success' ? 'Submitted!' : 'Submit Nomination'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-8 py-3 bg-transparent border border-gray-600 text-gray-400 font-semibold rounded-lg hover:border-white hover:text-white transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
