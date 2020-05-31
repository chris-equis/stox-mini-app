import { createMuiTheme, colors } from '@material-ui/core'

export default createMuiTheme({
  spacing: 4,
  palette: {
    primary: colors.blue,
    text: {
      primary: colors.blueGrey[800],
    },
  },
  typography: {
    fontFamily: 'Inter',
    htmlFontSize: 16,
    fontSize: 16,
    h1: {
      fontSize: 24,
      fontWeight: 600,
      letterSpacing: '-0.05em',
    },
    h2: {
      fontSize: 20,
      fontWeight: 500,
      letterSpacing: '-0.05em',
    },
    h3: {
      fontSize: 16,
      fontWeight: 500,
      letterSpacing: '-0.05em',
    },
    h4: {
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: '-0.05em',
    },
    h5: {
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '-0.05em',
    },
    body1: {
      fontSize: 14,
      fontWeight: 400,
      letterSpacing: '-0.033em',
    },
    body2: {
      fontSize: 12,
      fontWeight: 400,
      letterSpacing: '-0.033em',
    },
    subtitle1: {
      fontSize: 16,
      fontWeight: 600,
      opacity: 0.5,
      letterSpacing: '-0.033em',
    },
    subtitle2: {
      fontSize: 14,
      fontWeight: 600,
      opacity: 0.5,
      letterSpacing: '-0.033em',
    },
  },
  overrides: {
    MuiContainer: {
      root: {
        paddingLeft: 16,
        paddingRight: 16,
      },
    },
    MuiAvatar: {
      img: {
        objectFit: 'contain',
      },
    },
    MuiOutlinedInput: {
      // root: {
      //   borderRadius: 99,
      // },
      // inputAdornedStart: {
      //   paddingLeft: 4,
      // },
    },
    MuiCssBaseline: {
      '@global': {
        'html, body, #root': {
          display: 'flex',
          flexDirection: 'column',
        },
        // '.MuiToggleButtonGroup-groupedHorizontal:not(:last-child)': {
        //   borderRadius: `99px !important`,
        // },
      },
    },
  },
})
