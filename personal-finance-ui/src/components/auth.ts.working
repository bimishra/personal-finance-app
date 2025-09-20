import { createAuth0Client } from '@auth0/auth0-spa-js'
import type { Auth0Client, PopupLoginOptions } from '@auth0/auth0-spa-js'

const domain = import.meta.env.VITE_AUTH0_DOMAIN as string
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string
const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string
const redirectUri = window.location.origin + '/callback'

//const domain = import.meta.env.VITE_AUTH0_DOMAIN as string
//const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string
//const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string
//const redirectUri = window.location.origin + '/callback'


let auth0Client: Auth0Client | null = null

export async function initAuth(): Promise<void> {
  if (auth0Client) return
  auth0Client = await createAuth0Client({
    domain,
    clientId: clientId,
    authorizationParams: {
      audience,
      redirect_uri: redirectUri
    },
    // Use refresh tokens for better UX (enable in Auth0 dashboard)
    useRefreshTokens: true,
    cacheLocation: 'memory' // for demo; for production consider rotating refresh tokens & httpOnly cookie for refresh
  })
}

export async function loginRedirect(): Promise<void> {
  if (!auth0Client) await initAuth()
  await auth0Client!.loginWithRedirect()
}

export async function handleRedirectCallback(): Promise<{ appState?: any }> {
  if (!auth0Client) await initAuth()
  const result = await auth0Client!.handleRedirectCallback()
  return result
}

export async function logout(): Promise<void> {
  if (!auth0Client) await initAuth()
  auth0Client!.logout({ logoutParams: { returnTo: window.location.origin } })
}

export async function getAccessToken(): Promise<string | undefined> {
  if (!auth0Client) await initAuth()
  try {
    const token = await auth0Client!.getTokenSilently()
    return token
  } catch (e) {
    // fallback to getTokenWithPopup (not ideal for prod)
    try {
      const token = await auth0Client!.getTokenWithPopup()
      return token
    } catch (err) {
      console.error('Token error', err)
      return undefined
    }
  }
}

export async function getUser(): Promise<any | undefined> {
  if (!auth0Client) await initAuth()
  return await auth0Client!.getUser()
}

export function getToken(): string | null {
  // Implement your logic to retrieve the token, e.g. from localStorage
  return localStorage.getItem('token');
}
