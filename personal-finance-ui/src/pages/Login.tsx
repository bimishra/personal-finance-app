import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { initAuth, loginRedirect, isAuthenticated } from '../services/auth'
import { useUser } from '../context/UserContext'

export default function Login() {
  const navigate = useNavigate()
  const { isAuthenticated: userIsAuthenticated, isLoading } = useUser()
  const [isInitializing, setIsInitializing] = useState(true)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

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

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true)
      await loginRedirect()
    } catch (error) {
      console.error('Login error:', error)
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Personal Finance</h1>
          <p className="text-gray-600">Manage your finances with ease</p>
        </div>
        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className={`w-full px-6 py-3 rounded-lg shadow-md transition-all duration-200 ${
            isLoggingIn
              ? 'bg-indigo-400 text-white cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          {isLoggingIn ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              Signing in...
            </div>
          ) : (
            'Sign in to continue'
          )}
        </button>
      </div>
    </div>
  )
}
