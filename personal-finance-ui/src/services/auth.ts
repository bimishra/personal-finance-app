import { createAuth0Client } from '@auth0/auth0-spa-js'
import type { Auth0Client } from '@auth0/auth0-spa-js'

const domain = import.meta.env.VITE_AUTH0_DOMAIN as string
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string
const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string
const redirectUri = window.location.origin + '/callback'

//const popup = window.open('', 'auth0:popup', 'width=500,height=600,left=100,top=100');

let auth0Client: Auth0Client | null = null

export async function initAuth(): Promise<void> {
  if (auth0Client) return
  
  try {
    auth0Client = await createAuth0Client({
      domain,
      clientId: clientId,
      authorizationParams: {
        audience,
        redirect_uri: redirectUri,
        scope: 'openid profile email'
      },
      // Use refresh tokens for better UX (enable in Auth0 dashboard)
      useRefreshTokens: true,
      cacheLocation: 'memory' // Use memory instead of localStorage to avoid state issues
    })
  } catch (e) {
    console.error('Auth initialization error:', e)
    throw e
  }
}

export async function loginRedirect(): Promise<void> {
  if (!auth0Client) await initAuth()
  await auth0Client!.loginWithRedirect()
}

export async function loginWithPopup(): Promise<void> {
  if (!auth0Client) await initAuth()
  
  try {
    await auth0Client!.loginWithPopup(
      {
        authorizationParams: {
          prompt: 'select_account',
          screen_hint: 'login'
        }
      }
    )
    
  } catch (error) {
    console.error('Popup login failed:', error)
    throw error
  }
}

export async function signupWithPopup(): Promise<void> {
  if (!auth0Client) await initAuth()
  
  try {
    await auth0Client!.loginWithPopup(
      {
        authorizationParams: {
          prompt: 'select_account',
          screen_hint: 'signup'
        }
      }
    )
    
  } catch (error) {
    console.error('Popup signup failed:', error)
    throw error
  }
}

export async function handleRedirectCallback(): Promise<{ appState?: any }> {
  if (!auth0Client) await initAuth()
  
  try {
    // Check if we're already authenticated (callback might have been processed already)
    const isAuth = await auth0Client!.isAuthenticated()
    if (isAuth) {
      console.log('User already authenticated, skipping callback processing')
      return { appState: null }
    }
    
    const result = await auth0Client!.handleRedirectCallback()
    return result
  } catch (e) {
    console.error('Callback error:', e)
    
    // If it's an "Invalid state" error, it might mean the callback was already processed
    const errorMessage = e instanceof Error ? e.message : String(e)
    if (errorMessage.includes('Invalid state')) {
      console.log('Invalid state error - checking if user is already authenticated')
      try {
        const isAuth = await auth0Client!.isAuthenticated()
        if (isAuth) {
          console.log('User is authenticated despite invalid state error')
          return { appState: null }
        }
      } catch (checkError) {
        console.error('Error checking authentication status:', checkError)
      }
    }
    
    throw e
  }
}

export async function logout(): Promise<void> {
  try {
    if (!auth0Client) {
      await initAuth()
    }

    // Clear all local storage and session storage first
    localStorage.clear()
    sessionStorage.clear()
    
    // Use the proper logout URL format for Auth0
    const logoutUrl = `https://${domain}/v2/logout?client_id=${clientId}&returnTo=${encodeURIComponent(window.location.origin)}`
    
    // Redirect to Auth0 logout URL
    window.location.href = logoutUrl

  } catch (e) {
    console.error('Logout error:', e)
    // If Auth0 logout fails, at least clear the local state and redirect
    auth0Client = null
    window.location.href = window.location.origin
  }
}

export async function getAccessToken(): Promise<string | undefined> {
  if (!auth0Client) await initAuth()
  
  try {
    const isAuthenticated = await auth0Client!.isAuthenticated()
    if (!isAuthenticated) {
      return undefined
    }

    return await auth0Client!.getTokenSilently({
      authorizationParams: {
        audience,
        scope: 'openid profile email'
      },
      timeoutInSeconds: 10
    })
  } catch (e) {
    console.error('Token error:', e)
    return undefined
  }
}

export async function getUser(): Promise<any | undefined> {
  if (!auth0Client) await initAuth()
  
  try {
    const isAuthenticated = await auth0Client!.isAuthenticated()
    if (!isAuthenticated) {
      return undefined
    }
    
    return await auth0Client!.getUser()
  } catch (e) {
    console.error('Error getting user:', e)
    return undefined
  }
}

// Check if the user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  if (!auth0Client) await initAuth()
  return auth0Client!.isAuthenticated()
}

// Check if the user has a valid session
export async function checkSession(): Promise<boolean> {
  if (!auth0Client) await initAuth()
  
  try {
    return await auth0Client!.isAuthenticated()
  } catch (e) {
    console.error('Session check error:', e)
    return false
  }
}

// Clear Auth0 state completely (for debugging)
export function clearAuthState(): void {
  try {
    localStorage.clear()
    sessionStorage.clear()
    auth0Client = null
    console.log('Auth0 state cleared')
  } catch (e) {
    console.error('Error clearing auth state:', e)
  }
}

// Make debug function available globally for testing
if (typeof window !== 'undefined') {
  (window as any).clearAuthState = clearAuthState
}