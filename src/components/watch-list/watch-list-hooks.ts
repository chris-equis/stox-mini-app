import { useEffect, useState } from 'react'
import { Set } from 'immutable'
import { createFilterOptions, FilterOptionsState } from '@material-ui/lab'

import { FinnhubSymbol } from '../../finnhub-api/finnhub-api-types'
import { fetchStockSymbols, fetchForexSymbols } from '../../finnhub-api/finnhub-api'

export const useSymbolsListLoad = (): {
  options: FinnhubSymbol[]
  filterOptions: (
    options: FinnhubSymbol[],
    state: FilterOptionsState<FinnhubSymbol>,
  ) => FinnhubSymbol[]
  isLoaded: boolean
  isError: boolean
} => {
  const [options, setOptions] = useState<FinnhubSymbol[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    const loadStockSymbols = async (): Promise<void> => {
      try {
        setIsLoaded(false)
        setIsError(false)

        const stockSymbols = await fetchStockSymbols(controller.signal)
        const forexSymbols = await fetchForexSymbols(controller.signal)

        setOptions(([] as FinnhubSymbol[]).concat(stockSymbols, forexSymbols))
      } catch (error) {
        setIsError(true)
      } finally {
        setIsLoaded(true)
      }
    }

    loadStockSymbols()

    return (): void => controller.abort()
  }, [])

  const filterOptions = createFilterOptions<FinnhubSymbol>({
    limit: 20,
  })

  return { options, filterOptions, isLoaded, isError }
}

const LS_STORED_SYMBOLS_KEY = 'stox-watched-symbols'

export const useSymbolsWatchList = (): {
  symbols: Set<string>
  addSymbol: (symbol: string) => void
  removeSymbol: (symbol: string) => void
} => {
  const [symbols, setSymbols] = useState<Set<string>>(Set([]))

  // Read symbols from Local Storage, once
  useEffect(() => {
    try {
      const storedSymbols = JSON.parse(localStorage.getItem(LS_STORED_SYMBOLS_KEY) ?? '[]')
      setSymbols(
        Set(storedSymbols.length > 0 ? storedSymbols : ['FB', 'MSFT', 'WORK', 'UBER'].reverse()),
      )
    } catch (error) {}
  }, [])

  // Write symbols to Local Storage, every time symbols set change
  useEffect(() => {
    try {
      localStorage.setItem(LS_STORED_SYMBOLS_KEY, JSON.stringify(Array.from(symbols.values())))
    } catch (error) {}
  }, [symbols])

  const addSymbol = (symbol: string): void => {
    setSymbols(symbols.add(symbol))
  }

  const removeSymbol = (symbol: string): void => {
    setSymbols(symbols.remove(symbol))
  }

  return { symbols, addSymbol, removeSymbol }
}
