import React, { FunctionComponent } from 'react'
import { Box, Typography, useTheme, fade } from '@material-ui/core'
import { ChartDataItem } from '../chart-types'
import { getTimestampFormatter } from '../../../utils/formatters'

export const ChartTooltip: FunctionComponent<{
  active?: boolean
  lines?: {
    color: string
    dataKey: string
    fill: string
    name: string
    payload: ChartDataItem
    stroke: string
    strokeWidth: number
    value: number
  }[]
  label?: string
}> = ({ active, lines, label }) => {
  const theme = useTheme()

  if (!active) return null

  // const []

  return (
    <Box
      p={2}
      bgcolor={fade('#fff', 0.75)}
      borderRadius={1}
      border={`1px solid ${theme.palette.divider}`}
    >
      <Box mb={1}>
        <Typography variant="h5">{getTimestampFormatter()(Number(label))}</Typography>
      </Box>
      <Box></Box>
    </Box>
  )
}

// box-shadow:
//   0 3.2px 5.3px -49px rgba(0, 0, 0, 0.012),
//   0 16.4px 17.9px -49px rgba(0, 0, 0, 0.018),
//   0 100px 80px -49px rgba(0, 0, 0, 0.03)
// ;
