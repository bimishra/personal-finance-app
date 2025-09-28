import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import styles from './AuthGuard.module.css'

export default function AuthGuard() {
  const { isAuthenticated, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className={styles.screen}>
        <div className={styles.spinner}></div>
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
