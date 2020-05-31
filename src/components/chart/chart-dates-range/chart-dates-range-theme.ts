import { createMuiTheme } from '@material-ui/core'

import appTheme from '../../../app-theme'

const { spacing, palette, typography } = appTheme
const { fontFamily, fontSize } = typography

export default createMuiTheme({
  spacing,
  palette,
  typography: {
    fontFamily,
    fontSize,
    h3: {
      fontSize: '3rem',
      letterSpacing: '-0.06em',
    },
    h4: {
      fontSize: '2.2rem',
      letterSpacing: '-0.06em',
    },
  },
})
