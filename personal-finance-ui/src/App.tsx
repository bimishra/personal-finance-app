import React, { useEffect } from 'react'
import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { CurrencyProvider } from './context/CurrencyContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import AuthGuard from './components/AuthGuard'
import Dashboard from './pages/Dashboard'
import Accounts from './pages/Accounts'
import Transactions from './pages/Transactions'
import Categories from './pages/Categories'
import Budgets from './pages/Budgets'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Login from './pages/Login'
import LoginCallback from './pages/LoginCallback'

// Layout component for authenticated pages
const AuthenticatedLayout = () => (
  <div className="w-full flex gap-6">
    <Sidebar />
    <main className="flex-1">
      <Outlet />
    </main>
  </div>
)

// Root path handler component
const RootRedirect = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Clear any stale state when landing on root after logout
    if (location.pathname === '/') {
      localStorage.clear();
      sessionStorage.clear();
    }
  }, [location.pathname]);

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <UserProvider>
      <CurrencyProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="max-w-7xl mx-auto p-4">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/callback" element={<LoginCallback />} />
            
            {/* Protected routes */}
            <Route element={<AuthGuard />}>
              <Route element={<AuthenticatedLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/budgets" element={<Budgets />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </div>
      </CurrencyProvider>
    </UserProvider>
  )
}

export default App
