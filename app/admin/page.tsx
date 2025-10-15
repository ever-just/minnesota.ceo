'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Analytics {
  period: string
  visitors: { unique: number; total: number }
  waitlist: number
  nominations: number
  topPages: { page_path: string; views: number }[]
}

interface Nomination {
  id: number
  nominee_name: string
  nominee_title: string
  nominee_organization: string
  category: string
  reason: string
  nominator_name: string
  nominator_email: string
  created_at: string
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [nominations, setNominations] = useState<Nomination[]>([])
  const [waitlistCount, setWaitlistCount] = useState(0)
  const [activeTab, setActiveTab] = useState<'overview' | 'nominations' | 'waitlist'>('overview')

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth')
      const data = await res.json()
      setIsAuthenticated(data.authenticated)
    } catch (error) {
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        setIsAuthenticated(true)
        loadData()
      } else {
        const data = await res.json()
        setError(data.error || 'Invalid password')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' })
      setIsAuthenticated(false)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const loadData = async () => {
    // Load analytics
    try {
      const analyticsRes = await fetch('/api/analytics?period=month')
      const analyticsData = await analyticsRes.json()
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error loading analytics:', error)
    }

    // Load waitlist count
    try {
      const waitlistRes = await fetch('/api/waitlist')
      const waitlistData = await waitlistRes.json()
      setWaitlistCount(waitlistData.count || 0)
    } catch (error) {
      console.error('Error loading waitlist:', error)
    }

    // Load nominations
    try {
      const nominationsRes = await fetch('/api/nominations')
      const nominationsData = await nominationsRes.json()
      setNominations(nominationsData.nominations || [])
    } catch (error) {
      console.error('Error loading nominations:', error)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary-black flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="glass-effect rounded-xl p-8">
            <h1 className="text-2xl font-bold text-primary-purple mb-6 text-center">Admin Access</h1>
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  placeholder="Enter admin password"
                  required
                />
              </div>

              {error && (
                <div className="mb-4 text-red-400 text-sm">{error}</div>
              )}

              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary-purple text-black font-semibold rounded-lg hover:bg-dark-purple transition-all duration-300"
              >
                Login
              </button>
            </form>

            <Link 
              href="/"
              className="block text-center mt-6 text-gray-400 hover:text-primary-purple transition-colors"
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-black text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold gradient-text">MINNESOTA.CEO Admin</h1>
            <div className="flex gap-4">
              <Link 
                href="/"
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'overview' 
                  ? 'border-primary-purple text-primary-purple' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('nominations')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'nominations' 
                  ? 'border-primary-purple text-primary-purple' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Nominations ({nominations.length})
            </button>
            <button
              onClick={() => setActiveTab('waitlist')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'waitlist' 
                  ? 'border-primary-purple text-primary-purple' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Waitlist ({waitlistCount})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">Analytics Overview</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass-effect rounded-xl p-6">
                <p className="text-gray-400 mb-2">Total Visitors</p>
                <p className="text-3xl font-bold text-primary-purple">{analytics?.visitors.total || 0}</p>
              </div>
              <div className="glass-effect rounded-xl p-6">
                <p className="text-gray-400 mb-2">Unique Visitors</p>
                <p className="text-3xl font-bold text-primary-purple">{analytics?.visitors.unique || 0}</p>
              </div>
              <div className="glass-effect rounded-xl p-6">
                <p className="text-gray-400 mb-2">Waitlist Signups</p>
                <p className="text-3xl font-bold text-primary-purple">{waitlistCount}</p>
              </div>
              <div className="glass-effect rounded-xl p-6">
                <p className="text-gray-400 mb-2">Nominations</p>
                <p className="text-3xl font-bold text-primary-purple">{nominations.length}</p>
              </div>
            </div>

            {/* Top Pages */}
            {analytics?.topPages && analytics.topPages.length > 0 && (
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-primary-purple">Top Pages</h3>
                <div className="space-y-2">
                  {analytics.topPages.map((page) => (
                    <div key={page.page_path} className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-gray-300">{page.page_path}</span>
                      <span className="text-white font-semibold">{page.views} views</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'nominations' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Leader Nominations</h2>
            
            {nominations.length === 0 ? (
              <div className="glass-effect rounded-xl p-8 text-center">
                <p className="text-gray-400">No nominations yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {nominations.map((nomination) => (
                  <div key={nomination.id} className="glass-effect rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-primary-purple">{nomination.nominee_name}</h3>
                        <p className="text-gray-400">
                          {nomination.nominee_title && `${nomination.nominee_title}, `}
                          {nomination.nominee_organization}
                        </p>
                        {nomination.category && (
                          <span className="inline-block mt-2 px-3 py-1 bg-primary-purple/20 text-primary-purple text-sm rounded-full">
                            {nomination.category}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(nomination.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {nomination.reason && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-1">Reason:</p>
                        <p className="text-gray-300">{nomination.reason}</p>
                      </div>
                    )}
                    
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-sm text-gray-400">
                        Nominated by: {nomination.nominator_name} ({nomination.nominator_email})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'waitlist' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Waitlist</h2>
            
            <div className="glass-effect rounded-xl p-6">
              <div className="text-center py-8">
                <p className="text-5xl font-bold text-primary-purple mb-4">{waitlistCount}</p>
                <p className="text-gray-400">People waiting for launch</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
