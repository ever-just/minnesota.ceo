'use client'

import { useState, useEffect, useRef } from 'react'
import h337 from 'heatmap.js'

interface HeatmapData {
  page: string
  period: string
  clicks: Array<{
    x: number
    y: number
    value: number
    viewport: {
      width: number
      height: number
    }
    element: {
      id: string | null
      class: string | null
      tag: string | null
    }
  }>
  scrollDepth: Array<{
    scroll_depth: number
    count: string
  }>
  totalClicks: number
}

export default function HeatmapView() {
  const [data, setData] = useState<HeatmapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPage, setSelectedPage] = useState('/')
  const [period, setPeriod] = useState('month')
  const [pages, setPages] = useState<string[]>([])
  const heatmapRef = useRef<HTMLDivElement>(null)
  const heatmapInstance = useRef<any>(null)

  useEffect(() => {
    loadPages()
  }, [])

  useEffect(() => {
    loadHeatmapData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage, period])

  useEffect(() => {
    if (data && heatmapRef.current && data.clicks.length > 0) {
      renderHeatmap()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const loadPages = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard?period=month')
      if (response.ok) {
        const dashboardData = await response.json()
        const pageList = dashboardData.topPages.map((p: any) => p.page_path)
        setPages(pageList.length > 0 ? pageList : ['/'])
      }
    } catch (error) {
      console.error('Error loading pages:', error)
      setPages(['/'])
    }
  }

  const loadHeatmapData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics/heatmap?page=${encodeURIComponent(selectedPage)}&period=${period}`)
      if (response.ok) {
        const heatmapData = await response.json()
        setData(heatmapData)
      }
    } catch (error) {
      console.error('Error loading heatmap data:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderHeatmap = () => {
    if (!heatmapRef.current || !data) return

    if (heatmapInstance.current) {
      heatmapInstance.current.setData({ data: [], max: 10 })
    }

    const container = heatmapRef.current
    container.innerHTML = ''

    heatmapInstance.current = h337.create({
      container: container,
      radius: 40,
      maxOpacity: 0.6,
      minOpacity: 0,
      blur: 0.75,
      gradient: {
        0.0: '#9333EA',
        0.5: '#C084FC',
        1.0: '#E9D5FF'
      }
    })

    const normalizedData = data.clicks.map(click => {
      const viewportWidth = click.viewport.width || 1920
      const viewportHeight = click.viewport.height || 1080
      const containerWidth = container.offsetWidth
      const containerHeight = container.offsetHeight

      const normalizedX = (click.x / viewportWidth) * containerWidth
      const normalizedY = (click.y / viewportHeight) * containerHeight

      return {
        x: Math.round(normalizedX),
        y: Math.round(normalizedY),
        value: click.value
      }
    })

    const maxValue = Math.max(...normalizedData.map(d => d.value), 10)

    heatmapInstance.current.setData({
      max: maxValue,
      data: normalizedData
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading heatmap...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Click Heatmap</h2>
        <div className="flex gap-4">
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-purple"
          >
            {pages.map((page) => (
              <option key={page} value={page} className="bg-primary-black">
                {page}
              </option>
            ))}
          </select>
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
      </div>

      <div className="glass-effect rounded-xl p-6">
        <div className="mb-4">
          <p className="text-gray-400">
            Total Clicks: <span className="text-white font-semibold">{data?.totalClicks || 0}</span>
          </p>
        </div>

        {data && data.clicks.length > 0 ? (
          <div className="relative bg-white/5 rounded-lg overflow-hidden" style={{ height: '600px' }}>
            <div 
              ref={heatmapRef} 
              className="absolute inset-0"
              style={{ width: '100%', height: '100%' }}
            />
            <div className="absolute top-4 right-4 bg-black/80 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-2">Heat Intensity</p>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#9333EA' }}></div>
                <span className="text-xs text-gray-400">Low</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#C084FC' }}></div>
                <span className="text-xs text-gray-400">Medium</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#E9D5FF' }}></div>
                <span className="text-xs text-gray-400">High</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 rounded-lg p-12 text-center">
            <p className="text-gray-400">No click data available for this page and period</p>
          </div>
        )}
      </div>

      {data && data.scrollDepth.length > 0 && (
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-primary-purple">Scroll Depth Distribution</h3>
          <div className="space-y-2">
            {data.scrollDepth.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-gray-400 w-16">{item.scroll_depth}%</span>
                <div className="flex-1 h-8 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-purple rounded-full transition-all duration-500"
                    style={{ width: `${(parseInt(item.count) / data.totalClicks) * 100}%` }}
                  />
                </div>
                <span className="text-white w-12 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
