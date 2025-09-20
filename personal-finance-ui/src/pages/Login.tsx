import React, { useEffect } from 'react'
import { handleRedirectCallback } from '../services/auth'
// import { login } from '../services/auth'
import { loginRedirect } from '../services/auth'

export default function Login() {
  useEffect(() => {
    handleRedirectCallback()
  }, [])

  return (
    <div className="flex items-center justify-center h-96">
      <button
        onClick={loginRedirect}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md"
      >
        Login with Auth0
      </button>
    </div>
  )
}
