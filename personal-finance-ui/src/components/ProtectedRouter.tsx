import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { getAccessToken, initAuth } from '../services/auth'

export default function ProtectedRoute() {
  const token = localStorage.getItem('auth_token')
  // We use a simplistic check; in production validate token expiry or use a React context
  if (!token) {
    return <Navigate to="/login" />
  }
  return <Outlet />
}
