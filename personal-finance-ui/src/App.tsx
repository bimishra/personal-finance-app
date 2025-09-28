import React from 'react'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { useUser } from './context/UserContext'
import { UserProvider } from './context/UserContext'
import { CurrencyProvider } from './context/CurrencyContext'
import Navbar from './components/Navbar'
import AuthenticatedLayout from './layouts/AuthenticatedLayout'
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

// AuthenticatedLayout moved to src/layouts/AuthenticatedLayout.tsx

// Root path handler component
const RootRedirect = () => {
  const { isAuthenticated } = useUser();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
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
