import React, { FunctionComponent, useState } from 'react'
import { Container, Box, useTheme, Typography } from '@material-ui/core'

import { WatchList } from './components/watch-list/watch-list'
import { Chart } from './components/chart/chart'
import { FinnhubStockProfile } from './finnhub-api/finnhub-api-types'

const App: FunctionComponent<{}> = () => {
  const theme = useTheme()
  const [stockProfile, setStockProfile] = useState<FinnhubStockProfile>()
  const [stockSymbol, setStockSymbol] = useState<string>()

  return (
    <Container style={{ flexGrow: 1 }}>
      <Box
        mt={4}
        display={'grid'}
        height="100%"
        gridColumnGap={theme.spacing(4)}
        gridRowGap={theme.spacing(4)}
        gridTemplateColumns={['1fr', '1fr', '3fr 7fr']}
        gridTemplateRows="max-content"
      >
        <Box
          display="flex"
          alignItems="center"
          gridColumn={['1/1', '1/1', '1 / span 2']}
          minWidth="0"
        >
          <Box>
            <Typography
              variant="h1"
              color="primary"
              style={{
                fontSize: 42,
                fontWeight: 400,
                background: `-webkit-linear-gradient(${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              stox
            </Typography>
          </Box>

          <Box ml={2} position="relative" top={theme.spacing(1)}>
            <Typography
              variant="body2"
              style={{ fontSize: 10, lineHeight: 1.25, opacity: 0.75, letterSpacing: 0 }}
            >
              Your personal Stock
              <br />
              Exchange monitor
            </Typography>
          </Box>
        </Box>

        <Box flexGrow="1" minWidth="0">
          <WatchList
            onSelectedItem={(symbol: string, profile?: FinnhubStockProfile): void => {
              setStockSymbol(symbol)
              setStockProfile(profile)
            }}
          />
        </Box>

        <Box minWidth={0}>
          {(stockProfile || stockSymbol) && <Chart symbol={stockSymbol} profile={stockProfile} />}
        </Box>
      </Box>
    </Container>
  )
}

export default App
