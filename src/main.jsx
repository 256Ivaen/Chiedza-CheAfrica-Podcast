import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { HashRouter } from 'react-router-dom'
import ShopContextProvider from './context/ShopContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>  {/* Simpler, no server config needed */}
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </HashRouter>
  </React.StrictMode>,
)