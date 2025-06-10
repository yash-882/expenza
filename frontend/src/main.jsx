import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './app.css'
import Routes from './routes/routes.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {Routes()}
  </StrictMode>,
)
