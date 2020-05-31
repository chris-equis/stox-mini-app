import React, { FunctionComponent, ReactElement } from 'react'
import { Box, Typography, InputBase, useTheme } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import { Autocomplete } from '@material-ui/lab'

import { FinnhubSymbol } from '../../../finnhub-api/finnhub-api-types'
import { useSymbolsListLoad } from '../watch-list-hooks'

export const WatchListSearch: FunctionComponent<{ onSelect: (symbol: string) => void }> = ({
  onSelect,
}) => {
  const theme = useTheme()
  const { options, isLoaded, filterOptions } = useSymbolsListLoad()

  return (
    <Box>
      <Autocomplete
        options={options}
        filterOptions={filterOptions}
        getOptionLabel={({ symbol, description }): string => `${symbol} ${description}`}
        loading={!isLoaded}
        loadingText="Loading…"
        size="small"
        clearOnBlur
        fullWidth
        value={null}
        onChange={(event, option): void => {
          if (option) {
            onSelect(option.symbol)
          }
        }}
        renderOption={({ symbol, description }: FinnhubSymbol): ReactElement => {
          return (
            <Box display="flex" width="100%" alignItems="center">
              <Box minWidth={0} flexGrow={0} flexShrink={0} mr={2} width={60}>
                <Typography variant="body1" noWrap>
                  <strong>{symbol}</strong>
                </Typography>
              </Box>
              <Box minWidth={0} flexGrow={1}>
                <Typography variant="body2" noWrap>
                  {description}
                </Typography>
              </Box>
            </Box>
          )
        }}
        renderInput={({ inputProps, InputProps }): ReactElement => {
          return (
            <Box>
              <InputBase
                {...InputProps}
                fullWidth
                inputProps={{ ...inputProps }}
                placeholder="Watch symbol"
                // endAdornment={null}
                startAdornment={
                  <Box mr={2}>
                    <Search fontSize="small" color="action" />
                  </Box>
                }
                style={{ paddingRight: theme.spacing(8) }}
              />
            </Box>
          )
        }}
      />
    </Box>
  )
}
