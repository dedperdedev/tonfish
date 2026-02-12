import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LocaleProvider } from './contexts/LocaleContext'
import { RadioProvider } from './contexts/RadioContext'
import { RadioModalProvider } from './contexts/RadioModalContext'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.DEV ? '' : import.meta.env.BASE_URL}>
      <LocaleProvider>
        <RadioProvider>
          <RadioModalProvider>
            <App />
          </RadioModalProvider>
        </RadioProvider>
      </LocaleProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

