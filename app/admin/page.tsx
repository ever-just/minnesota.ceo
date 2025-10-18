'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard'
import HeatmapView from '@/components/admin/HeatmapView'

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
  nominator_phone?: string
  created_at: string
}

interface WaitlistEntry {
  id: number
  email: string
  source: string
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
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'heatmap' | 'nominations' | 'waitlist'>('overview')

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

    // Load waitlist data
    try {
      const waitlistRes = await fetch('/api/waitlist?details=true')
      const waitlistData = await waitlistRes.json()
      setWaitlistEntries(waitlistData.entries || [])
      setWaitlistCount(waitlistData.total || waitlistData.count || 0)
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
          <div className="flex gap-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'overview' 
                  ? 'border-primary-purple text-primary-purple' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'analytics' 
                  ? 'border-primary-purple text-primary-purple' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('heatmap')}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'heatmap' 
                  ? 'border-primary-purple text-primary-purple' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Heatmap
            </button>
            <button
              onClick={() => setActiveTab('nominations')}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'nominations' 
                  ? 'border-primary-purple text-primary-purple' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Nominations ({nominations.length})
            </button>
            <button
              onClick={() => setActiveTab('waitlist')}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap ${
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

        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}

        {activeTab === 'heatmap' && (
          <HeatmapView />
        )}

        {activeTab === 'nominations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Leader Nominations</h2>
              <button
                onClick={() => {
                  const csv = ['Nominee Name,Title,Organization,Category,Reason,Nominator Name,Nominator Email,Nominator Phone,Submitted Date']
                  nominations.forEach(nom => {
                    const reason = nom.reason ? nom.reason.replace(/"/g, '""').replace(/\n/g, ' ') : ''
                    csv.push(`"${nom.nominee_name}","${nom.nominee_title || ''}","${nom.nominee_organization || ''}","${nom.category || ''}","${reason}","${nom.nominator_name}","${nom.nominator_email}","${nom.nominator_phone || ''}","${new Date(nom.created_at).toLocaleString()}"`)
                  })
                  const blob = new Blob([csv.join('\n')], { type: 'text/csv' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `nominations-${new Date().toISOString().split('T')[0]}.csv`
                  a.click()
                }}
                className="px-4 py-2 bg-primary-purple text-black font-semibold rounded-lg hover:bg-dark-purple transition-colors"
              >
                Export CSV
              </button>
            </div>
            
            {nominations.length === 0 ? (
              <div className="glass-effect rounded-xl p-8 text-center">
                <p className="text-gray-400">No nominations yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {nominations.map((nomination) => (
                  <div key={nomination.id} className="glass-effect rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
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
                      <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                        {new Date(nomination.created_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    
                    {nomination.reason && (
                      <div className="mb-4 bg-white/5 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-2 font-semibold">Reason for Nomination:</p>
                        <p className="text-gray-300 whitespace-pre-wrap">{nomination.reason}</p>
                      </div>
                    )}
                    
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-sm text-gray-400 mb-1 font-semibold">Submitted by:</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="text-white">
                          <span className="text-gray-400">Name:</span> {nomination.nominator_name}
                        </span>
                        <span className="text-white">
                          <span className="text-gray-400">Email:</span> {nomination.nominator_email}
                        </span>
                        {nomination.nominator_phone && (
                          <span className="text-white">
                            <span className="text-gray-400">Phone:</span> {nomination.nominator_phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'waitlist' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Waitlist</h2>
              <button
                onClick={() => {
                  const csv = ['Email,Source,Joined Date']
                  waitlistEntries.forEach(entry => {
                    csv.push(`${entry.email},${entry.source},${new Date(entry.created_at).toLocaleString()}`)
                  })
                  const blob = new Blob([csv.join('\n')], { type: 'text/csv' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `waitlist-${new Date().toISOString().split('T')[0]}.csv`
                  a.click()
                }}
                className="px-4 py-2 bg-primary-purple text-black font-semibold rounded-lg hover:bg-dark-purple transition-colors"
              >
                Export CSV
              </button>
            </div>
            
            {/* Summary Card */}
            <div className="glass-effect rounded-xl p-6">
              <div className="text-center py-4">
                <p className="text-5xl font-bold text-primary-purple mb-2">{waitlistCount}</p>
                <p className="text-gray-400">Total Waitlist Signups</p>
              </div>
            </div>

            {/* Waitlist Entries */}
            {waitlistEntries.length === 0 ? (
              <div className="glass-effect rounded-xl p-8 text-center">
                <p className="text-gray-400">No waitlist entries yet</p>
              </div>
            ) : (
              <div className="glass-effect rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-primary-purple">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-primary-purple">Source</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-primary-purple">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {waitlistEntries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-white">{entry.email}</td>
                          <td className="px-6 py-4">
                            <span className="inline-block px-3 py-1 bg-primary-purple/20 text-primary-purple text-sm rounded-full">
                              {entry.source}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-400">
                            {new Date(entry.created_at).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
