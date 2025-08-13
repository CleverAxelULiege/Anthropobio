import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppSettingsProvider } from './AppSettingsContext.jsx'




createRoot(document.getElementById('root')).render(
    <AppSettingsProvider>
      <App />
    </AppSettingsProvider>
)
