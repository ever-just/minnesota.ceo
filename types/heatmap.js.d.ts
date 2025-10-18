declare module 'heatmap.js' {
  interface HeatmapDataPoint {
    x: number
    y: number
    value?: number
  }

  interface HeatmapData {
    max?: number
    min?: number
    data: HeatmapDataPoint[]
  }

  interface HeatmapConfig {
    container: HTMLElement
    radius?: number
    maxOpacity?: number
    minOpacity?: number
    blur?: number
    gradient?: Record<string, string>
  }

  interface Heatmap {
    setData(data: HeatmapData): void
    addData(data: HeatmapDataPoint | HeatmapDataPoint[]): void
    setDataMax(max: number): void
    setDataMin(min: number): void
    configure(config: Partial<HeatmapConfig>): void
    getValueAt(point: { x: number; y: number }): number
    getData(): HeatmapData
    repaint(): void
  }

  interface HeatmapJS {
    create(config: HeatmapConfig): Heatmap
  }

  const h337: HeatmapJS
  export default h337
}
