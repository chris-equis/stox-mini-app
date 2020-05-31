import { stringify } from 'query-string'
import { merge } from 'lodash'

import {
  FinnhubStockCandleQuery,
  FinnhubStockProfile2Query,
  FinnhubQuoteResponseData,
  FinnhubStockCandlesResponseData,
  FinnhubStockProfile,
  FinnhubSymbol,
} from './finnhub-api-types'

export const token = process.env.REACT_APP_FINNHUB_TOKEN
export const apiBaseUrl = 'https://finnhub.io/api/v1'

// Stock API

export const fetchStockSymbols = async (signal?: AbortSignal): Promise<FinnhubSymbol[]> => {
  const queryParams = stringify({ token, exchange: 'US' })

  const response = await fetch(`${apiBaseUrl}/stock/symbol?${queryParams}`, {
    method: 'GET',
    signal,
  })

  return await response.json()
}

export const fetchStockProfile2 = async (
  query: FinnhubStockProfile2Query,
  signal?: AbortSignal,
): Promise<FinnhubStockProfile> => {
  const queryParams = stringify(merge({ token }, query))

  const response = await fetch(`${apiBaseUrl}/stock/profile2?${queryParams}`, {
    method: 'GET',
    signal,
  })

  return await response.json()
}

export const fetchStockCandles = async (
  query: FinnhubStockCandleQuery,
  signal?: AbortSignal,
): Promise<FinnhubStockCandlesResponseData> => {
  const queryParams = stringify(merge({ token }, query))
  const url = `${apiBaseUrl}/stock/candle?${queryParams}`
  const response = await fetch(url, { method: 'GET', signal })

  return await response.json()
}

// Forex API

export const fetchForexSymbols = async (signal?: AbortSignal): Promise<FinnhubSymbol[]> => {
  const queryParams = stringify({ token, exchange: 'oanda' })

  const response = await fetch(`${apiBaseUrl}/forex/symbol?${queryParams}`, {
    method: 'GET',
    signal,
  })

  return await response.json()
}

// Generic Quotes API

export const fetchQuotes = async (
  symbol: string,
  signal?: AbortSignal,
): Promise<FinnhubQuoteResponseData> => {
  const queryParams = stringify({ token, symbol })
  const response = await fetch(`${apiBaseUrl}/quote?${queryParams}`, {
    method: 'GET',
    signal,
  })

  return await response.json()
}
