import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './state/store'
import App from './App'
import './styles/index.css'
import { Toaster } from 'react-hot-toast'

const Root = () => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <Toaster position="top-right" />
  </Provider>
)

createRoot(document.getElementById('root')!).render(<Root />)
