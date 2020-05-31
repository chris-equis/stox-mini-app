import numeral from 'numeral'
import { format as dateFormat, fromUnixTime, getUnixTime } from 'date-fns'
import { round } from 'lodash'

export const getNumeralFormatter = (format = '0a') => (n: number): string =>
  numeral(n).format(format)

export const getCurrencyFormatter = (precision = 2, currency = 'USD') => (n: number): string =>
  round(n, precision).toLocaleString('en', {
    currency,
    style: 'currency',
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })

export const getTimestampFormatter = (format = 'MMM d, yyyy - HH:mm') => (
  timestamp: number,
): string =>
  dateFormat(fromUnixTime(isFinite(timestamp) ? timestamp : getUnixTime(new Date())), format)
