'use client'

import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { format } from 'date-fns'

interface DashboardData {
  period: string
  dateRange: { startDate: string | null; endDate: string | null }
  overview: {
    totalSessions: number
    uniqueVisitors: number
    totalPageViews: number
    avgDuration: number
    avgPagesPerSession: string
    avgTimeOnPage: number
    avgScrollDepth: number
    bounceRate: string
  }
  conversions: Array<{
    conversion_type: string
    total: string
    completed: string
    completion_rate: string
  }>
  topPages: Array<{
    page_path: string
    views: string
    unique_visitors: string
    avg_time: string
    avg_scroll: string
  }>
  geographic: Array<{
    country: string
    sessions: string
    visitors: string
  }>
  devices: Array<{
    device_type: string
    sessions: string
  }>
  browsers: Array<{
    browser: string
    sessions: string
  }>
  trafficOverTime: Array<{
    date: string
    sessions: string
    visitors: string
  }>
  recentActivity: Array<{
    session_id: string
    visitor_id: string
    country: string
    city: string
    device_type: string
    landing_page: string
    page_count: number
    duration_seconds: number
    started_at: string
  }>
}

const COLORS = ['#9333EA', '#C084FC', '#E9D5FF', '#F3E8FF', '#FAF5FF']

export default function AnalyticsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('month')

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period])

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics/dashboard?period=${period}`)
      if (response.ok) {
        const dashboardData = await response.json()
        setData(dashboardData)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading analytics...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">No data available</div>
      </div>
    )
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Enhanced Analytics Dashboard</h2>
        <div className="flex gap-2">
          {['day', 'week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                period === p
                  ? 'bg-primary-purple text-black font-semibold'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <p className="text-gray-400 mb-2">Total Sessions</p>
          <p className="text-3xl font-bold text-primary-purple">{data.overview.totalSessions}</p>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <p className="text-gray-400 mb-2">Unique Visitors</p>
          <p className="text-3xl font-bold text-primary-purple">{data.overview.uniqueVisitors}</p>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <p className="text-gray-400 mb-2">Page Views</p>
          <p className="text-3xl font-bold text-primary-purple">{data.overview.totalPageViews}</p>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <p className="text-gray-400 mb-2">Avg Session Duration</p>
          <p className="text-3xl font-bold text-primary-purple">{formatDuration(data.overview.avgDuration)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <p className="text-gray-400 mb-2">Pages per Session</p>
          <p className="text-3xl font-bold text-primary-purple">{data.overview.avgPagesPerSession}</p>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <p className="text-gray-400 mb-2">Avg Time on Page</p>
          <p className="text-3xl font-bold text-primary-purple">{formatDuration(data.overview.avgTimeOnPage)}</p>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <p className="text-gray-400 mb-2">Avg Scroll Depth</p>
          <p className="text-3xl font-bold text-primary-purple">{data.overview.avgScrollDepth}%</p>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <p className="text-gray-400 mb-2">Bounce Rate</p>
          <p className="text-3xl font-bold text-primary-purple">{data.overview.bounceRate}%</p>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-6 text-primary-purple">Traffic Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.trafficOverTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              tickFormatter={(value) => format(new Date(value), 'MMM d')}
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
              labelStyle={{ color: '#9CA3AF' }}
            />
            <Legend />
            <Line type="monotone" dataKey="sessions" stroke="#9333EA" strokeWidth={2} name="Sessions" />
            <Line type="monotone" dataKey="visitors" stroke="#C084FC" strokeWidth={2} name="Visitors" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-6 text-primary-purple">Device Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.devices}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ device_type, sessions }) => `${device_type}: ${sessions}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="sessions"
                nameKey="device_type"
              >
                {data.devices.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-6 text-primary-purple">Top Browsers</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.browsers.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="browser" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
              />
              <Bar dataKey="sessions" fill="#9333EA" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-6 text-primary-purple">Top Pages</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-primary-purple">Page</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-primary-purple">Views</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-primary-purple">Unique Visitors</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-primary-purple">Avg Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-primary-purple">Avg Scroll</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {data.topPages.map((page, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-white">{page.page_path}</td>
                  <td className="px-4 py-3 text-gray-300">{page.views}</td>
                  <td className="px-4 py-3 text-gray-300">{page.unique_visitors}</td>
                  <td className="px-4 py-3 text-gray-300">{formatDuration(parseInt(page.avg_time || '0'))}</td>
                  <td className="px-4 py-3 text-gray-300">{Math.round(parseFloat(page.avg_scroll || '0'))}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-6 text-primary-purple">Geographic Distribution</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-primary-purple">Country</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-primary-purple">Sessions</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-primary-purple">Visitors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {data.geographic.slice(0, 10).map((geo, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-white">{geo.country}</td>
                  <td className="px-4 py-3 text-gray-300">{geo.sessions}</td>
                  <td className="px-4 py-3 text-gray-300">{geo.visitors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data.conversions.length > 0 && (
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-6 text-primary-purple">Conversion Funnel</h3>
          <div className="space-y-4">
            {data.conversions.map((conversion, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold capitalize">{conversion.conversion_type}</span>
                  <span className="text-primary-purple font-bold">{conversion.completion_rate}%</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span>Total: {conversion.total}</span>
                  <span>Completed: {conversion.completed}</span>
                </div>
                <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-purple rounded-full transition-all duration-500"
                    style={{ width: `${conversion.completion_rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-6 text-primary-purple">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-primary-purple">Location</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-primary-purple">Device</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-primary-purple">Landing Page</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-primary-purple">Pages</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-primary-purple">Duration</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-primary-purple">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {data.recentActivity.map((activity, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-white">
                    {activity.city ? `${activity.city}, ${activity.country}` : activity.country || 'Unknown'}
                  </td>
                  <td className="px-4 py-3 text-gray-300 capitalize">{activity.device_type}</td>
                  <td className="px-4 py-3 text-gray-300">{activity.landing_page}</td>
                  <td className="px-4 py-3 text-gray-300">{activity.page_count}</td>
                  <td className="px-4 py-3 text-gray-300">{formatDuration(activity.duration_seconds)}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">
                    {format(new Date(activity.started_at), 'MMM d, HH:mm')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
