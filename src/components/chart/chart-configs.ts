import {
  getUnixTime,
  subDays,
  startOfYear,
  subMonths,
  subWeeks,
  subYears,
  subHours,
} from 'date-fns'

import { getTimestampFormatter } from '../../utils/formatters'
import { TimelineConfig, TimeframeConfig } from './chart-types'

export const timelines: TimelineConfig[] = [
  {
    resolution: '1',
    label: '1m',
    formatter: getTimestampFormatter('HH:mm'),
    title: '1 minute',
  },
  {
    resolution: '5',
    label: '5m',
    formatter: getTimestampFormatter('HH:mm'),
    title: '5 minutes',
  },
  {
    resolution: '15',
    label: '15m',
    formatter: getTimestampFormatter('HH:mm'),
    title: '15 minutes',
  },
  {
    resolution: '30',
    label: '30m',
    formatter: getTimestampFormatter('HH:mm'),
    title: '30 minutes',
  },
  {
    resolution: '60',
    label: 'H',
    formatter: getTimestampFormatter('HH:mm'),
    title: '1 hour',
  },
  {
    resolution: 'D',
    label: 'D',
    formatter: getTimestampFormatter('MMM d'),
    title: '1 day',
  },
  {
    resolution: 'W',
    label: 'W',
    formatter: getTimestampFormatter('MMM d'),
    title: '1 week',
  },
  {
    resolution: 'M',
    label: 'M',
    formatter: getTimestampFormatter('MMM, yy'),
    title: '1 month',
  },
]

export const timeframes: TimeframeConfig[] = [
  {
    label: '1H',
    title: 'Last hour',
    from: getUnixTime(subHours(new Date(), 1)),
    to: getUnixTime(new Date()),
  },
  {
    label: '1D',
    title: 'Last day',
    from: getUnixTime(subDays(new Date(), 1)),
    to: getUnixTime(new Date()),
  },
  {
    label: '1W',
    title: 'Last week',
    from: getUnixTime(subWeeks(new Date(), 1)),
    to: getUnixTime(new Date()),
  },
  {
    label: '1M',
    title: 'Last month',
    from: getUnixTime(subMonths(new Date(), 1)),
    to: getUnixTime(new Date()),
  },
  {
    label: '1Y',
    title: 'Last year',
    from: getUnixTime(subYears(new Date(), 1)),
    to: getUnixTime(new Date()),
  },
  {
    label: 'YTD',
    title: 'Year to Date',
    from: getUnixTime(startOfYear(new Date())),
    to: getUnixTime(new Date()),
  },
  {
    label: 'ALL',
    title: 'All time',
    from: 0,
    to: getUnixTime(new Date()),
  },
]

export const defaultTimeframe: TimeframeConfig =
  timeframes.find(({ label }) => label === '1W') ?? timeframes[0]
