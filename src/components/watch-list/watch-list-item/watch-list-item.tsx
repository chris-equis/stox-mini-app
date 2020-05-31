import React, { FunctionComponent, useEffect, useState, useCallback } from 'react'
import { throttleTime } from 'rxjs/operators'
import { Box, Typography, colors, IconButton, ButtonBase, Avatar } from '@material-ui/core'
import { Delete, TimelineRounded } from '@material-ui/icons'

import { subscribe } from '../../../finnhub-api/finnhub-api-socket'
import { StringDiff } from '../../string-diff/string-diff'

import { useWatchListItemLoad } from './watch-list-item-hooks'
import { getCurrencyFormatter } from '../../../utils/formatters'
import { FinnhubStockProfile } from '../../../finnhub-api/finnhub-api-types'

const simplifySymbol = (symbol: string): string =>
  symbol?.split(':').pop()?.replace(/_/, '/') ?? 'Unknown'

export const WatchListItem: FunctionComponent<{
  edit: boolean
  symbol: string
  onSelect: (profile: FinnhubStockProfile) => void
  onRemove: () => void
  onProfileLoad: (profile: FinnhubStockProfile) => void
}> = ({ edit, symbol, onSelect, onRemove, onProfileLoad }) => {
  const { isLoaded, isError, currentPrice, previousPrice, profile } = useWatchListItemLoad(symbol)

  const [price, setPrice] = useState(0)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    if (profile) {
      onProfileLoad(profile)
    }
  }, [profile, onProfileLoad])

  useEffect(() => {
    setPrice(currentPrice)
  }, [currentPrice])

  useEffect(() => {
    const [subject, closeSubject] = subscribe(symbol)
    const subscription = subject
      .pipe(throttleTime(1000, undefined, { leading: true }))
      .subscribe((price) => {
        setPrice(price)
        setIsLive(true)
      })

    return (): void => {
      closeSubject()
      subscription.unsubscribe()
    }
  }, [symbol])

  const difference = ((price - previousPrice) / previousPrice) * 100
  const trendingColor = difference >= 0 ? colors.lightGreen[700] : colors.red[400]

  const getStatus = useCallback((): string => {
    if (!isLoaded) return 'Loading…'
    if (isLive) return 'Live'
    if (isError) return 'Error!'
    return 'Offline'
  }, [isError, isLoaded, isLive])

  return (
    <Box position="relative" pr={edit ? 8 : 0} style={{ transition: 'padding 0.33s ease-out' }}>
      <Box
        position="absolute"
        top="0"
        bottom="0"
        left="0"
        right="0"
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        zIndex={edit ? 3 : 1}
        style={{ opacity: edit ? 1 : 0, transition: 'opacity .2s ease-in' }}
      >
        <Box>
          <IconButton size="medium" color="primary" edge="end" onClick={onRemove}>
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box
        component={ButtonBase}
        onClick={(): void => {
          if (profile) {
            onSelect(profile)
          }
        }}
        display="flex"
        width="100%"
        position="relative"
        textAlign="inherit"
        zIndex="2"
        alignItems="center"
      >
        <Box flexGrow="0" flexShrink="0" mr={4} minWidth="0">
          <Avatar src={profile?.logo}>
            <TimelineRounded />
          </Avatar>
        </Box>

        <Box display="block" width="100%" minWidth="0">
          <Box mb={1} display="flex" justifyContent="space-between" position="relative" zIndex="2">
            <Box minWidth="0" mr={1} flexBasis="60%">
              <Typography variant="h3" noWrap>
                {profile?.name ?? simplifySymbol(symbol)}
              </Typography>
            </Box>

            <Box
              flexShrink="0"
              style={{
                opacity: edit ? 0 : 1,
                transition: 'all 0.33s ease-out',
              }}
            >
              <Typography variant="h3">
                <strong>
                  <StringDiff
                    color={isLive ? trendingColor : 'inherit'}
                    // string={formatCurrency(price, 'USD', SYMBOLS_OPTIONS[symbol]?.precision)}
                    string={getCurrencyFormatter()(price)}
                  />
                </strong>
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="baseline" justifyContent="space-between">
            <Box minWidth="0" mr={1} flexBasis="50%">
              <Typography variant="body1" style={{ fontWeight: 300 }} noWrap>
                {simplifySymbol(symbol)}
              </Typography>
            </Box>

            <Box flexShrink="0" display={edit ? 'none' : 'block'}>
              <Typography variant="body1" noWrap>
                {(isLoaded || isLive) && isFinite(difference) && (
                  <Box
                    mr={2}
                    component="span"
                    display="inline-flex"
                    alignItems="center"
                    color={trendingColor}
                    fontWeight={600}
                  >
                    <Typography component="span" variant="inherit" color="inherit">
                      {difference < 0 ? '-' : '+'}
                      {Math.abs(difference || 0).toLocaleString('en', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                      %
                    </Typography>
                  </Box>
                )}

                <Box component="span">
                  <Typography component="span" style={{ opacity: 0.5 }}>
                    {getStatus()}
                  </Typography>
                </Box>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
