import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { initAuth, isAuthenticated } from '../services/auth'
import { useUser } from '../context/UserContext'
import LoginModal from '../components/LoginModal'
import styles from './Login.module.css'

export default function Login() {
  const navigate = useNavigate()
  const { isAuthenticated: userIsAuthenticated, isLoading, fetchUser } = useUser()
  const [isInitializing, setIsInitializing] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        await initAuth()
        const authenticated = await isAuthenticated()
        if (authenticated) {
          navigate('/dashboard', { replace: true })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setIsInitializing(false)
      }
    }

    init()
  }, [navigate])

  useEffect(() => {
    if (userIsAuthenticated && !isLoading) {
      navigate('/dashboard', { replace: true })
    }
  }, [userIsAuthenticated, isLoading, navigate])

  if (isLoading || isInitializing) {
    return (
      <div className={styles.spinnerWrap}>
        <div className={styles.spinner}></div>
      </div>
    )
  }

  const handleLoginClick = () => {
    setShowLoginModal(true)
  }

  const handleLoginSuccess = async () => {
    // Refresh user data after successful login
    await fetchUser()
    navigate('/dashboard', { replace: true })
  }

  return (
    <>
      <div className={styles.root}>
        <div className={styles.card}>
          <div className={styles.hero}>
            <h1 className={styles.title}>Welcome to Personal Finance</h1>
            <p className={styles.subtitle}>Manage your finances with ease</p>
          </div>
          <button onClick={handleLoginClick} className="btn btnPrimary" style={{ width: '100%' }}>
            Sign in to continue
          </button>
        </div>
      </div>
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  )
}
