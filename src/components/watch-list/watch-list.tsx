import React, { FunctionComponent, useState, useEffect, useRef } from 'react'
import { Box, Divider, Typography, Paper, Button, Collapse, useTheme } from '@material-ui/core'

import { FinnhubStockProfile } from '../../finnhub-api/finnhub-api-types'

import { WatchListSearch } from './watch-list-search/watch-list-search'
import { WatchListItem } from './watch-list-item/watch-list-item'
import { useSymbolsWatchList } from './watch-list-hooks'
import { MAX_WATCH_LIST_ITEMS } from './watch-list-constants'

export const WatchList: FunctionComponent<{
  onSelectedItem: (symbol: string, profile: FinnhubStockProfile) => void
}> = ({ onSelectedItem }) => {
  const theme = useTheme()
  const { symbols, addSymbol, removeSymbol } = useSymbolsWatchList()

  const [edit, setEdit] = useState(false)
  const [showMaxLimitMessage, setShowMaxLimitMessage] = useState(false)

  const firstProfileLoadedRef = useRef<FinnhubStockProfile>()

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowMaxLimitMessage(false)
    }, 2000)

    return (): void => clearTimeout(timeout)
  }, [showMaxLimitMessage])

  return (
    <Paper elevation={1}>
      <Box>
        <Box py={2} px={4} display="flex" alignItems="center" minHeight={60}>
          <Box flexGrow="1">
            <WatchListSearch
              onSelect={(symbol): void => {
                const maxLimitReached = symbols.size >= MAX_WATCH_LIST_ITEMS

                if (maxLimitReached) {
                  setShowMaxLimitMessage(true)
                  return
                }

                addSymbol(symbol)
                setEdit(false)
              }}
            />
          </Box>
        </Box>

        <Divider />

        <Collapse in={showMaxLimitMessage}>
          <Box px={4} py={2} bgcolor={theme.palette.secondary.main} color="#fff">
            Maximum watch limit is {MAX_WATCH_LIST_ITEMS} companies.
          </Box>
        </Collapse>

        <Box py={2}>
          {symbols.size > 0 ? (
            <Box>
              {Array.from(symbols.values())
                .reverse()
                .map((symbol) => (
                  <Box key={symbol} p={4}>
                    <WatchListItem
                      edit={edit}
                      symbol={symbol}
                      onSelect={(profile): void => onSelectedItem(symbol, profile)}
                      onRemove={(): void => removeSymbol(symbol)}
                      onProfileLoad={(profile): void => {
                        if (!firstProfileLoadedRef.current) {
                          firstProfileLoadedRef.current = profile
                          onSelectedItem(symbol, profile)
                        }
                      }}
                    />
                  </Box>
                ))}
            </Box>
          ) : (
            <Box p={4}>
              <Typography variant="body1">
                <span role="img" aria-labelledby="no-results">
                  ☝️
                </span>
                &nbsp;
                <span id="no-results">Use the search field to watch stocks</span>
              </Typography>
            </Box>
          )}
        </Box>

        <Divider />

        <Box ml={2} py={2} display="flex" justifyContent="center">
          <Button
            size="small"
            variant="text"
            color={edit ? 'inherit' : 'primary'}
            onClick={(): void => setEdit(!edit)}
          >
            {edit ? 'Close' : 'Edit'}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}
