import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './assets/css/main.css';
import { BrowserRouter } from 'react-router';


createRoot(document.getElementById('root')).render(
  <>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </>,
)
