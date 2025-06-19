import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Router from './routes.jsx'
import UserProvider from './contexts/user/UserProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* routes */}
  <UserProvider>

    {Router()} 

  </UserProvider>

  </StrictMode>,
)
