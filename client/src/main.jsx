import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { SearchProvider } from './context/Search.jsx';
import { CartProvider } from './context/Cart.jsx';
import 'antd/dist/reset.css';



createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <SearchProvider>
      <CartProvider>
        <StrictMode>
          <App />
          <Toaster />
        </StrictMode>
      </CartProvider>
    </SearchProvider>
  </AuthProvider>

)