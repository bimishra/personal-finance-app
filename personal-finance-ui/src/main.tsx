import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './state/store'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Accounts from './pages/Accounts'
import Transactions from './pages/Transactions'
import Categories from './pages/Categories'
import Budgets from './pages/Budgets'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import LoginCallback from './pages/LoginCallback'
import './styles/index.css'

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto flex gap-6 p-4">
          <Sidebar />
          <main className="flex-1">
            <Routes>
              <Route path="/callback" element={<LoginCallback />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  </Provider>
)

createRoot(document.getElementById('root')!).render(<App />)
