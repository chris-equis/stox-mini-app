import { TickFormatterFunction } from 'recharts'

import { FinnhubStockCandleResolution } from '../../finnhub-api/finnhub-api-types'

export type ChartDataItem = {
  closePrice: number
  openPrice: number
  timestamp: number
  volume: number
}

export type ChartData = ChartDataItem[]

export type ChartDataDerivedDetails = {
  start?: number
  end?: number
  max?: number
  min?: number
  average?: number
}

export type ChartTooltipFormatterValue = string | number | React.ReactText[]

export type ChartTooltipFormatterMap = {
  [key: string]: {
    label: string
    format: (value: unknown) => string
  }
}

export type TimelineConfig = {
  resolution: FinnhubStockCandleResolution
  formatter: TickFormatterFunction
  title: string
  label: string
}

export type TimeframeConfig = {
  label?: string
  title?: string
  from: number
  to: number
}
