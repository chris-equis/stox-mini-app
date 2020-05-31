import React, { ReactNode } from 'react'
import { colors } from '@material-ui/core'
import { ReferenceLine } from 'recharts'

import { getCurrencyFormatter } from '../../../utils/formatters'

const referenceLineConfigs = {
  average: {
    color: colors.lightBlue[500],
    makeLabel: (value: number): string => `Avg. ${getCurrencyFormatter()(value)}`,
  },
  minimum: {
    color: colors.deepOrange[500],
    makeLabel: (value: number): string => `Min. ${getCurrencyFormatter()(value)}`,
  },
  maximum: {
    color: colors.lightGreen[500],
    makeLabel: (value: number): string => `Max. ${getCurrencyFormatter()(value)}`,
  },
}

export const renderReferenceLine = (
  type: 'average' | 'minimum' | 'maximum',
  value?: number,
): ReactNode => {
  if (!value) return null

  const config = referenceLineConfigs[type]

  return (
    <ReferenceLine
      y={value}
      label={({ viewBox }): ReactNode => {
        return (
          <text
            x={(viewBox ?? {}).x ?? 0}
            y={((viewBox ?? {}).y ?? 0) - 8}
            fill={config.color}
            fontWeight={500}
          >
            {config.makeLabel(value)}
          </text>
        )
      }}
      // stroke={config.color}
      strokeDasharray="2 2"
    />
  )
}
