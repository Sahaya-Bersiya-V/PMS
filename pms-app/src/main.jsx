import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "bootstrap-icons/font/bootstrap-icons.css";
import { HotelProvider } from "./context/HotelContext";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HotelProvider>
    <App />
    </HotelProvider>
  </StrictMode>,
)
