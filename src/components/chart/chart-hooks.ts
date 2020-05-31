import { useEffect, useState } from 'react'
import { fetchStockCandles } from '../../finnhub-api/finnhub-api'
import { timelines, defaultTimeframe } from './chart-configs'
import { mapStockCandleData, getBestTimelineResolution } from './chart-utils'
import { ChartData, TimelineConfig, TimeframeConfig } from './chart-types'
import { FinnhubStockCandleResolution } from '../../finnhub-api/finnhub-api-types'

export const useLoadChartData = (
  symbol: string,
): {
  setResolution: (resolution: FinnhubStockCandleResolution) => void
  setTimeframe: (timeframe: TimeframeConfig) => void
  isLoading: boolean
  isError: boolean
  data: ChartData
  timeline?: TimelineConfig
  timeframe: TimeframeConfig
  disabledResolutions: FinnhubStockCandleResolution[]
} => {
  const [timeframe, _setTimeframe] = useState<TimeframeConfig>(defaultTimeframe)

  const [defaultOptimumResolution, defaultDisabledResolutions] = getBestTimelineResolution(
    defaultTimeframe,
  )

  const [resolution, _setResolution] = useState<FinnhubStockCandleResolution>(
    defaultOptimumResolution,
  )

  const [disabledResolutions, _setDisabledResolutions] = useState<FinnhubStockCandleResolution[]>(
    defaultDisabledResolutions,
  )

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const [data, setData] = useState<ChartData>([])

  useEffect(() => {
    const loadChartData = async (): Promise<void> => {
      if (symbol && resolution && timeframe) {
        try {
          setIsLoading(true)
          setIsError(false)
          setData(
            mapStockCandleData(
              await fetchStockCandles({
                symbol,
                resolution,
                from: timeframe.from,
                to: timeframe.to,
                adjusted: true,
              }),
            ),
          )
        } catch (error) {
          setIsError(true)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadChartData()
  }, [symbol, resolution, timeframe])

  const setTimeframe = (timeframe: TimeframeConfig): void => {
    const [optimumResolution, disabledResolutions] = getBestTimelineResolution(timeframe)
    _setResolution(optimumResolution)
    _setTimeframe(timeframe)
    _setDisabledResolutions(disabledResolutions)
  }

  const setResolution = (resolution: FinnhubStockCandleResolution): void => {
    _setResolution(resolution)
  }

  const timeline = timelines.find((t) => resolution === t.resolution)

  return {
    setResolution,
    setTimeframe,
    isLoading,
    isError,
    data,
    timeline,
    timeframe,
    disabledResolutions,
  }
}
