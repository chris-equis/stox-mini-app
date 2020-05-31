import React, { FunctionComponent, useState, useEffect } from 'react'
import { fromUnixTime, getUnixTime } from 'date-fns'
import DateFnsUtils from '@date-io/date-fns'

import { Box, InputProps, InputBaseComponentProps, MuiThemeProvider } from '@material-ui/core'
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers'
import { TodayRounded, EventRounded, SvgIconComponent } from '@material-ui/icons'

import dateTimePickerTheme from './chart-dates-range-theme'

const CHART_DATES_RANGE_FORMAT = 'MMM d, yyyy - HH:mm'

export const ChartDatesRange: FunctionComponent<{
  start?: number
  end?: number
  onSet: (start?: number, end?: number) => void
}> = ({ start: initialStart, end: initialEnd, onSet }) => {
  const [start, setStart] = useState(new Date())
  const [end, setEnd] = useState(new Date())

  useEffect(() => {
    setStart(initialStart ? fromUnixTime(initialStart) : new Date())
    setEnd(initialEnd ? fromUnixTime(initialEnd) : new Date())
  }, [initialStart, initialEnd])

  const getInputProps = (Icon: SvgIconComponent): InputProps => ({
    readOnly: true,
    disableUnderline: true,
    startAdornment: (
      <Box mr={1} display="flex" alignItems="center">
        <Icon color="primary" fontSize="small" />
      </Box>
    ),
    style: { cursor: 'pointer' },
  })

  const getInputBaseProps = (): InputBaseComponentProps => ({
    style: {
      cursor: 'pointer',
      padding: 0,
      fontSize: 12,
    },
  })

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box mr={2}>
          <MuiThemeProvider theme={dateTimePickerTheme}>
            <DateTimePicker
              value={start}
              maxDate={end}
              format={CHART_DATES_RANGE_FORMAT}
              InputProps={getInputProps(TodayRounded)}
              inputProps={getInputBaseProps()}
              onChange={(date): void => {
                if (date) {
                  onSet(getUnixTime(date), getUnixTime(end))
                }
              }}
            />
          </MuiThemeProvider>
        </Box>

        <Box mr={2}>
          <MuiThemeProvider theme={dateTimePickerTheme}>
            <DateTimePicker
              value={end}
              minDate={start}
              maxDate={new Date()}
              format={CHART_DATES_RANGE_FORMAT}
              InputProps={getInputProps(EventRounded)}
              inputProps={getInputBaseProps()}
              onChange={(date): void => {
                if (date) {
                  onSet(getUnixTime(start), getUnixTime(date))
                }
              }}
            />
          </MuiThemeProvider>
        </Box>
      </Box>
    </MuiPickersUtilsProvider>
  )
}
