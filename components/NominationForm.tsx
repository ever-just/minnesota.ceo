'use client'

import { useState } from 'react'
import { validateEmail, sanitizeInput, leaderCategories } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value })
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
        }, 2500)
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          size="lg"
          className="px-8 py-6 text-lg font-semibold border-2 border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
        >
          Nominate a Leader
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-black border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-400">
            Nominate a Minnesota Leader
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Help us identify Minnesota&apos;s most impactful leaders for our interview series.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Nominee Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Nominee Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nomineeName" className="text-gray-300">Name *</Label>
                <Input
                  id="nomineeName"
                  name="nomineeName"
                  value={formData.nomineeName}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-purple-500/30 text-white placeholder:text-gray-500"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomineeTitle" className="text-gray-300">Title/Position</Label>
                <Input
                  id="nomineeTitle"
                  name="nomineeTitle"
                  value={formData.nomineeTitle}
                  onChange={handleChange}
                  className="bg-white/5 border-purple-500/30 text-white placeholder:text-gray-500"
                  placeholder="CEO"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomineeOrganization" className="text-gray-300">Organization</Label>
                <Input
                  id="nomineeOrganization"
                  name="nomineeOrganization"
                  value={formData.nomineeOrganization}
                  onChange={handleChange}
                  className="bg-white/5 border-purple-500/30 text-white placeholder:text-gray-500"
                  placeholder="Company Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-300">Category</Label>
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="bg-white/5 border-purple-500/30 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-purple-500/30">
                    {leaderCategories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-white hover:bg-purple-600/20">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason" className="text-gray-300">
                Why should this person be interviewed?
              </Label>
              <Textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={4}
                className="bg-white/5 border-purple-500/30 text-white placeholder:text-gray-500 resize-none"
                placeholder="Tell us about their impact and achievements..."
              />
            </div>
          </div>

          {/* Nominator Information */}
          <div className="space-y-4 border-t border-purple-500/20 pt-6">
            <h3 className="text-lg font-semibold text-white">Your Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nominatorName" className="text-gray-300">Your Name *</Label>
                <Input
                  id="nominatorName"
                  name="nominatorName"
                  value={formData.nominatorName}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-purple-500/30 text-white placeholder:text-gray-500"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nominatorEmail" className="text-gray-300">Your Email *</Label>
                <Input
                  id="nominatorEmail"
                  name="nominatorEmail"
                  type="email"
                  value={formData.nominatorEmail}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-purple-500/30 text-white placeholder:text-gray-500"
                  placeholder="you@example.com"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="nominatorPhone" className="text-gray-300">Phone (Optional)</Label>
                <Input
                  id="nominatorPhone"
                  name="nominatorPhone"
                  type="tel"
                  value={formData.nominatorPhone}
                  onChange={handleChange}
                  className="bg-white/5 border-purple-500/30 text-white placeholder:text-gray-500"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Status Message */}
          {message && (
            <div className={`flex items-center gap-2 text-sm p-3 rounded-lg ${
              status === 'error' 
                ? 'bg-red-500/10 border border-red-500/30 text-red-400' 
                : 'bg-green-500/10 border border-green-500/30 text-green-400'
            }`}>
              {status === 'error' ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              size="lg"
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold"
            >
              {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
              {status === 'loading' ? 'Submitting...' : status === 'success' ? 'Submitted!' : 'Submit Nomination'}
            </Button>
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              variant="outline"
              size="lg"
              className="border-gray-600 text-gray-400 hover:border-white hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
