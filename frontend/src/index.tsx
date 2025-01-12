import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import { frFR as corefrFR, enUS as coreenUS } from '@mui/material/locale'
import { frFR, enUS } from '@mui/x-date-pickers/locales'
import { frFR as dataGridfrFR, enUS as dataGridenUS } from '@mui/x-data-grid'
import { disableDevTools } from 'disable-react-devtools'
import * as Helper from './common/Helper'
import * as UserService from './services/UserService'
import { strings as commonStrings } from './lang/common'
import Env from './config/env.config'
import App from './App'

import 'react-toastify/dist/ReactToastify.min.css'
import './assets/css/common.css'
import './assets/css/index.css'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

if (process.env.REACT_APP_NODE_ENV === 'production') {
  disableDevTools()
}

let language = Env.DEFAULT_LANGUAGE
const user = JSON.parse(localStorage.getItem('mi-user') ?? 'null')
let lang = UserService.getQueryLanguage()

if (lang) {
  if (!Env.LANGUAGES.includes(lang)) {
    lang = localStorage.getItem('mi-language')

    if (lang && !Env.LANGUAGES.includes(lang)) {
      lang = Env.DEFAULT_LANGUAGE
    }
  }

  try {
    if (user) {
      language = user.language
      if (lang && lang.length === 2 && user.language !== lang) {
        const data = {
          id: user.id,
          language: lang,
        }

        const status = await UserService.validateAccessToken()

        if (status === 200) {
          const _status = await UserService.updateLanguage(data)
          if (_status !== 200) {
            Helper.error(null, commonStrings.CHANGE_LANGUAGE_ERROR)
          }
        }

        language = lang
      }
    } else if (lang) {
      language = lang
    }
    UserService.setLanguage(language)
    commonStrings.setLanguage(language)
  } catch (err) {
    Helper.error(err, commonStrings.CHANGE_LANGUAGE_ERROR)
  }
}

language = UserService.getLanguage()
const isFr = language === 'fr'

const theme = createTheme(
  {
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        "'Segoe UI'",
        'Roboto',
        "'Helvetica Neue'",
        'Arial',
        'sans-serif',
        "'Apple Color Emoji'",
        "'Segoe UI Emoji'",
        "'Segoe UI Symbol'",
      ].join(','),
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: '#fafafa',
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            '& .Mui-disabled': {
              color: '#333 !important',
            },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            '& .Mui-checked': {
              color: '#0D63C9 !important',
            },
            '& .Mui-checked+.MuiSwitch-track': {
              opacity: 0.7,
              backgroundColor: '#0D63C9 !important',
            },
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          root: {
            '& .MuiAutocomplete-inputRoot': {
              paddingRight: '20px !important',
            },
          },
          listbox: {
            '& .Mui-focused': {
              backgroundColor: '#eee !important',
            },
          },
          option: {
            // Hover
            // '&[data-focus="true"]': {
            //     backgroundColor: '#eee !important',
            //     borderColor: 'transparent',
            // },
            // Selected
            '&[aria-selected="true"]': {
              backgroundColor: '#faad43 !important',
            },
          },
        },
      },
    },
  },
  isFr ? frFR : enUS,
  isFr ? dataGridfrFR : dataGridenUS,
  isFr ? corefrFR : coreenUS,
)

root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline>
      <App />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme="dark"
      />
    </CssBaseline>
  </ThemeProvider>,
)
