import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import SnowfallComponent from './Components/SnowfallComponent';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <SnowfallComponent />
    <App />
    
  </StrictMode>,
)
