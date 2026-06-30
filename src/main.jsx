import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initFirstTouchAttribution } from './utils/attribution'
import './assets/css/reset_plus.css'
import './assets/css/styles.css'
import './assets/css/blur-up.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import 'swiper/css'
import 'swiper/css/navigation'

// Capture first-touch marketing attribution as early as possible, on the real
// landing page, before any form can be submitted. Never overwrites an existing
// 90-day first-touch value, so internal navigation / returns / later campaigns
// leave the original source intact.
initFirstTouchAttribution()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
