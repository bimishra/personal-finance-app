import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { initAuth, isAuthenticated } from '../services/auth'
import { useUser } from '../context/UserContext'
import LoginModal from '../components/LoginModal'

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
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Personal Finance</h1>
            <p className="text-gray-600">Manage your finances with ease</p>
          </div>
          <button
            onClick={handleLoginClick}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
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
