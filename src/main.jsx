import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import './styles/template.css'
import './styles/react-overrides.css'
import './styles/dashboard.css'
import App from './App.jsx'
import { initializeAuth } from './recoil/auth.js'

initializeAuth();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </StrictMode>,
)
