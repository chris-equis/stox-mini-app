# stox.app

Your Personal Stock Exchange Monitor

## Description

**stox** is a handy **mobile-friendly** mini web-app serving as a personal monitor of your favorite stocks and exchange rates.

**stox** is live at **https://stox-278918.web.app** 👈

## How to use "stox"?

### Watching symbols (live!) 👀

Use the search bar labeled "Watch symbols" to add your favorite symbols to the watch-list. There are 3 types of symbols that can be searched:

- **Stocks** (eg. `AMZN` or `Facebook`)
- **Exchange rates / Forex** (eg. `EUR/USD` or `XAU/GBP`)
- **Cryptocurrencies** (eg. `Binance BTCUSDT` - Live all the time)

Each watched symbol will provide useful information such as:

- Name and symbol of the company (for stocks)
- **Live price** if the market is open, or the last closing price
  - In "Live" mode, price changes are color-coded depending on the previous known price
- **Color-coded difference** in percents from the last closing price
- Automatically **detected currency** and precision (for Forex symbols)
- Offline/Live indicator

#### Limitation

- The search results are limited to show the first 20 results, for UI performance reasons
- The watch-list is limited to show a maximum number of symbols, as well for not exceeding the API limits and quota.

#### Edit watch-list

Symbols can be removed by editing the watch-list. Please note that the list is limited to a specific number, to preserved the number of requests.

#### Symbol historical data (chart)

Clicking an item from the watch-list will load useful chart data for a broader overview of how the price fluctuated over time. See below how to use the chart.

### Using the chart 💹

The chart provides useful information showing the **evolution of the stock price** given a time range.

It shows the **open price** (light blue line) and **closing price** (dark blue line) for each resolution (minute, hour, day, etc.), also the **volume** (dashed purple line) and the **average reference**, all relative to the selected time range.

It provides many tuning functionalities to set the viewing preferences, described by:

#### Intervals

Date interval preference can be set using:

- the predefined buttons (`1H | 1D | 1W | YTD`, etc.)
- or the manual date-time pickers

#### Resolutions

Resolution (or granularity) is used to fine-tune the data points loaded by the chart:

- resolution is like a _stock candle_ interval
- resolution is **automatically detected** and adjusted by the interval start and end dates (either from manual input or predefined)
- resolution might not be available for some intervals (eg. one month resolution does not make sense for a 2 days interval)

#### Other mentions

Sometimes, depending on the fine-tuning settings and the current market status, data cannot be retrieved at all (eg. setting intervals in weekends, when the market is closed).

#### Errors handling 🚩

Whenever the app encounters an error it will either show in the watch-list or on the chart.

The most common error is when the API limits and quota exceeds therefore nothing or partial information will be loaded.

##### In case of errors

- Wait nearly 60 seconds before reloading
- Narrow the list of watched symbols

## Technical aspects 🤓

**stox** is written in **TypeScript** using **React** and it uses a simple approach when it comes to how data flows between components, having the heaviest logic living inside custom hooks.

While using the latest functional patterns (hooks), it does not implement complex architectural patterns such as React Context or Redux, given its reduced complexity.

**stox** benefits of a rigid foundation provided by several custom hooks and modules that serve the data loading and handling, all these being empowered by TypeScript's data structures (mostly types and enums).

### Third-parties 🧐

**stox** uses [Finnhub REST API and WebSocket](https://finnhub.io/docs/api#introduction) to load its data: the symbols (search) list, the price data (static or live), and the companies' profiles.

- A free plan for Finnhub API is used, therefore the API calls per minute are limited to 60.

**stox** uses the power of [Material UI](https://material-ui.com/) for its UI components and [Recharts](https://recharts.org/en-US/) for creating simple charts from stocks data.

#### Other mentions

All API requests are done using the native [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and [WebSockets API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) for live data that is pumped with [RxJS Observables](https://rxjs-dev.firebaseapp.com/guide/overview).

[date-fns](https://date-fns.org/), [NumeralJS](http://numeraljs.com/), and [Lodash](https://lodash.com/) complete the list of libraries used to manipulate data.

### Technical improvements 🛠

**stox** can benefit of many improvements, with the most important listed below:

- a more robust architectural pattern (eg. React Context is a good candidate, given the complexity)
- a better data loading and error handling
- more reusable components can be extracted from the largest components
- definitely **unit test** could catch a lot of potential bugs

### Known issues 🤦‍♂️

**stox** is not perfect, yet!

- not all the time the first watched symbol is loaded, but more like a random one, given the race condition of the API requests (which are fired all at once)
- when the app loads for the first time, the chart card might not be present and it appears a bit late, due to the late loading of the chart data after loading the company profile; it can be improved with a better data loading handling
- the maximum limit of the watch-list can be easily hacked, by manually updating the local-storage
- search results list could load a virtualized version of a list so to have all the 10.000+ symbols handled at once

### Installation and running the app ⚙️

1. In order to install the app, after cloning/forking/downloading the repository, run the following command from the root folder:

```sh
yarn install
```

2. Create a copy of the `.env.sample` fine, and rename it `.env.local` and update the `REACT_APP_FINNHUB_TOKEN` variable (in the copy) to have the value of a [Finnhub API key](https://finnhub.io/dashboard).

3. For building the app to be deployed, run

```sh
yarn build
```
