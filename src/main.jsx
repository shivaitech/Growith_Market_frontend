import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/template.css'
import './styles/react-overrides.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
