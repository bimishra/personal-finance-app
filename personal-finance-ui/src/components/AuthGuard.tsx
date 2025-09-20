import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { getToken } from '../services/auth'

export default function AuthGuard() {
  const token = getToken()
  return token ? <Outlet /> : <Navigate to="/login" />
}
