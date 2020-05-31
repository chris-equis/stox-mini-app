import React, { FunctionComponent, useEffect, useRef, ReactNode } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  YAxis,
  XAxis,
  // CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts'
import {
  Paper,
  useTheme,
  Box,
  Typography,
  makeStyles,
  CircularProgress,
  Fade,
  Divider,
  colors,
  fade,
  Tooltip,
  Avatar,
} from '@material-ui/core'
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'
import { WarningRounded, TimelineRounded } from '@material-ui/icons'

import {
  getCurrencyFormatter,
  getNumeralFormatter,
  getTimestampFormatter,
} from '../../utils/formatters'
import { FinnhubStockProfile } from '../../finnhub-api/finnhub-api-types'

import { timelines, timeframes } from './chart-configs'
import { useLoadChartData } from './chart-hooks'
import { getChartDataDerivedDetails } from './chart-utils'
import { ChartDataDerivedDetails } from './chart-types'
import { ChartDatesRange } from './chart-dates-range/chart-dates-range'
import { renderReferenceLine } from './chart-reference-line/chart-reference-line'
import { ChartTooltip } from './chart-tooltip/chart-tooltip'

const useStyles = makeStyles((theme) => ({
  toggleButtonRoot: {
    whiteSpace: 'nowrap',
    fontSize: 12,
    border: 0,
    padding: theme.spacing(1),
    borderRadius: `${theme.spacing(1)}px !important`,
    minWidth: theme.spacing(6),
    marginLeft: `${theme.spacing(0.5)}px !important`,
    color: 'inherit',
    '&:hover, &.Mui-selected:hover': {
      backgroundColor: fade(colors.blueGrey[600], 0.1),
    },
    '&.Mui-selected, &.Mui-selected:hover': {
      color: theme.palette.primary.main,
      backgroundColor: 'transparent',
    },
  },
  toggleButtonLabel: {
    textTransform: 'none',
  },
  toggleButtonDisabled: {
    textTransform: 'none',
  },
  toggleButtonSelected: {
    color: colors.blue[500],
  },
  loadingChart: {
    opacity: 0.5,
  },
}))

export const Chart: FunctionComponent<{
  symbol?: string
  profile?: FinnhubStockProfile
}> = ({ symbol, profile }) => {
  const theme = useTheme()
  const classes = useStyles()
  const {
    setResolution,
    setTimeframe,
    data,
    timeline,
    timeframe,
    disabledResolutions,
    isLoading,
  } = useLoadChartData(profile?.ticker ?? symbol ?? '')

  const chartDataDetails = useRef<ChartDataDerivedDetails>({})

  useEffect(() => {
    chartDataDetails.current = getChartDataDerivedDetails(data)
  }, [data])

  return (
    <Box component={Paper} display="flex" flexDirection="column" height="100%">
      <Box
        p={4}
        display="flex"
        flexDirection={['column', 'column', 'row']}
        justifyContent="space-between"
        alignItems={['flex-start', 'flex-start', 'center']}
      >
        <Box minWidth={0} width={['100%', '100%', '40%']} alignItems="center" display="flex">
          <Box mr={2}>
            <Avatar src={profile?.logo} style={{ width: 24, height: 24 }}>
              <TimelineRounded />
            </Avatar>
          </Box>
          <Typography variant="h1" noWrap>
            {profile?.name ?? symbol}
          </Typography>
        </Box>

        <Box
          display="flex"
          mt={[4, 4, 0]}
          alignItems={['flex-start', 'flex-start', 'baseline']}
          flexDirection={['column', 'column', 'row']}
        >
          <Box mr={1}>
            <Typography variant="body2">Chart resolution</Typography>
          </Box>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={timeline}
            onChange={(event, value): void => {
              if (value?.resolution) {
                setResolution(value.resolution)
              }
            }}
          >
            {timelines.map((t) => (
              <ToggleButton
                key={t.resolution}
                value={t}
                disabled={disabledResolutions.includes(t.resolution)}
                classes={{
                  root: classes.toggleButtonRoot,
                  disabled: classes.toggleButtonDisabled,
                  selected: classes.toggleButtonSelected,
                  label: classes.toggleButtonLabel,
                }}
              >
                <Tooltip title={t.title} placement="bottom">
                  <span>{t.label}</span>
                </Tooltip>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Divider />

      <Box flexGrow="1" position="relative" height={[200, 200, 400]}>
        <Fade in={isLoading} mountOnEnter unmountOnExit>
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <CircularProgress />
          </Box>
        </Fade>

        <Fade in={!isLoading && (!data || data?.length === 0)} mountOnEnter unmountOnExit>
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box width="33%" textAlign="center">
              <WarningRounded />
              <Typography variant="body1">
                There is no data for the selected time range. Please try different dates or
                timeframe.
              </Typography>
            </Box>
          </Box>
        </Fade>

        <ResponsiveContainer height="100%">
          <LineChart
            margin={{
              top: theme.spacing(8),
              bottom: 0,
              left: theme.spacing(4),
              right: theme.spacing(4),
            }}
            data={data ?? []}
            className={isLoading ? classes.loadingChart : ''}
          >
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis
              axisLine={false}
              dy={theme.spacing(1)}
              padding={{
                left: theme.spacing(4),
                right: theme.spacing(4),
              }}
              interval="preserveStartEnd"
              minTickGap={24}
              tickSize={3}
              dataKey="timestamp"
              tickFormatter={timeline?.formatter}
            />

            <YAxis
              hide
              dataKey="openPrice"
              domain={['dataMin', 'dataMax']}
              tickFormatter={getCurrencyFormatter()}
              tickCount={10}
              allowDataOverflow={false}
            />

            <YAxis
              hide
              axisLine={false}
              tickLine={false}
              minTickGap={24}
              dataKey="closePrice"
              orientation="right"
              domain={['dataMin', 'dataMax']}
              tickFormatter={getCurrencyFormatter()}
              tickCount={10}
              allowDataOverflow={false}
            />

            <YAxis
              hide
              yAxisId="volumeAxis"
              dataKey="volume"
              orientation="left"
              tickFormatter={getNumeralFormatter()}
              tickCount={10}
              domain={['dataMin', 'dataMax']}
              allowDataOverflow={false}
            />

            <RechartsTooltip content={<ChartTooltip />} />

            {/* <RechartsTooltip
              // cursor={false}
              formatter={(value, key, props): string[] => {
                const {
                  payload: { closePrice, openPrice },
                } = props

                const currencyFormatter = getCurrencyFormatter()
                const numeralFormatter = getNumeralFormatter('0,0')

                if (key === 'openPrice') {
                  const textValue = currencyFormatter(value as number)
                  return [textValue, 'Open price']
                }

                if (key === 'closePrice') {
                  let textValue = currencyFormatter(value as number)
                  textValue += ` ${closePrice - openPrice >= 0 ? '+' : '-'}${currencyFormatter(
                    Math.abs(closePrice - openPrice),
                  )}`

                  return [textValue, 'Close price']
                }

                if (key === 'volume') {
                  const textValue = numeralFormatter(value as number)
                  return [textValue, 'Volume']
                }

                return [key, String(value)]
              }}
              labelFormatter={(timestamp: string | number): ReactNode => (
                <Typography
                  component="span"
                  variant="body1"
                  style={{ fontWeight: 600, marginBottom: theme.spacing(4) }}
                >
                  {getTimestampFormatter()(timestamp as number)}
                </Typography>
              )}
            /> */}

            <Line
              dot={false}
              // type="monotone"
              dataKey="closePrice"
              stroke={theme.palette.primary.main}
              strokeWidth={2}
            />

            <Line
              dot={false}
              // type="monotone"
              dataKey="openPrice"
              stroke={theme.palette.primary.light}
              strokeWidth={1}
            />

            <Line
              dot={false}
              type="monotone"
              yAxisId="volumeAxis"
              dataKey="volume"
              strokeDasharray="1 4"
              stroke={theme.palette.secondary.main}
            />

            {/* {renderReferenceLine('minimum', chartDataDetails.current.min)} */}
            {/* {renderReferenceLine('maximum', chartDataDetails.current.max)} */}
            {renderReferenceLine('average', chartDataDetails.current.average)}

            {/* <Legend
              verticalAlign="top"
              formatter={(key: string): string => {
                if (key === 'closePrice') return 'Price'
                if (key === 'volume') return 'Volume'
                return key
              }}
            /> */}
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Divider />

      <Box
        px={4}
        py={2}
        display="flex"
        flexDirection={['column-reverse', 'column-reverse', 'row']}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box mr={4}>
          <ChartDatesRange
            start={chartDataDetails.current.start}
            end={chartDataDetails.current.end}
            onSet={(start?: number, end?: number): void => {
              setTimeframe({
                from: start ?? 0,
                to: end ?? 0,
              })
            }}
          />
        </Box>

        <ToggleButtonGroup
          size="small"
          exclusive
          value={timeframe}
          onChange={(event, value): void => setTimeframe(value)}
        >
          {timeframes.map((t) => (
            <ToggleButton
              key={t.label}
              value={t}
              classes={{
                root: classes.toggleButtonRoot,
                label: classes.toggleButtonLabel,
              }}
            >
              <Tooltip title={t?.title ?? false} placement="top">
                <span>{t.label}</span>
              </Tooltip>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    </Box>
  )
}
