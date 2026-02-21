import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/css/reset_plus.css'
import './assets/css/styles.css'
import './assets/css/blur-up.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import 'swiper/css'
import 'swiper/css/navigation'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
