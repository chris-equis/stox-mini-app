import { fromUnixTime, differenceInDays, differenceInHours } from 'date-fns'

import {
  FinnhubStockCandlesResponseData,
  FinnhubStockCandleResolution,
} from '../../finnhub-api/finnhub-api-types'
import { ChartData, ChartDataDerivedDetails, TimeframeConfig } from './chart-types'

export const getBestTimelineResolution = (
  timeframe: TimeframeConfig,
): [FinnhubStockCandleResolution, FinnhubStockCandleResolution[]] => {
  const to = fromUnixTime(timeframe.to)
  const from = fromUnixTime(timeframe.from)

  const diffInDays = differenceInDays(to, from)
  const diffInHours = differenceInHours(to, from)

  if (diffInHours <= 2) return ['1', ['15', '30', '60', 'D', 'W', 'M']]
  if (diffInHours <= 12) return ['1', ['D', 'W', 'M']]
  if (diffInHours <= 24) return ['1', ['D', 'W', 'M']]
  if (diffInDays <= 7) return ['15', ['1', '5', 'D', 'W', 'M']]
  if (diffInDays <= 60) return ['60', ['1', '5', '15', 'M']]
  if (diffInDays <= 90) return ['D', ['1', '5', '15', '30', 'M']]
  if (diffInDays <= 180) return ['D', ['1', '5', '15', '30', '60', 'M']]
  if (diffInDays <= 366) return ['D', ['1', '5', '15', '30', '60']]

  return ['M', ['1', '5', '15', '30', '60', 'D']]
}

export const getChartDataDerivedDetails = (chartData: ChartData): ChartDataDerivedDetails => {
  const timestamps = chartData.map(({ timestamp }) => timestamp)
  const closePrices = chartData.map(({ closePrice }) => closePrice)

  const start = timestamps.length > 0 ? Math.min(...timestamps) : undefined
  const end = timestamps.length > 0 ? Math.max(...timestamps) : undefined
  const min = closePrices.length > 0 ? Math.min(...closePrices) : undefined
  const max = closePrices.length > 0 ? Math.max(...closePrices) : undefined

  const average =
    closePrices.length > 0
      ? closePrices.reduce((sum, price) => sum + price, 0) / closePrices.length
      : undefined

  return {
    start,
    end,
    min,
    max,
    average,
  }
}

export const mapStockCandleData = ({
  c: closePrices,
  v: volumes,
  t: timestamps,
  o: openPrices,
}: FinnhubStockCandlesResponseData): ChartData =>
  timestamps?.map((timestamp, index) => ({
    timestamp,
    closePrice: closePrices[index],
    openPrice: openPrices[index],
    volume: volumes[index],
  })) ?? []
