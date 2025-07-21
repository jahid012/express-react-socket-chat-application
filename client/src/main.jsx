import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './assets/css/main.css';
import { BrowserRouter } from 'react-router';
import Toaster from 'react-hot-toast';
import { ToastContainer, toast } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  <>
  <ToastContainer />
  <BrowserRouter>
      
    <App />
  </BrowserRouter>
  </>,
)
