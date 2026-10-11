
import { API_BASE_URL } from '../data/config'

const ADMIN_AUTH_KEY = 'sbf_admin_auth'

export class ApiError extends Error {
  constructor(message, { status = 0, details = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

// Keep admin credentials only for this browser session.
export function setAdminCredentials(username, password) {
  const credentials = btoa(`${username}:${password}`)
  sessionStorage.setItem(ADMIN_AUTH_KEY, credentials)
}

export function clearAdminCredentials() {
  sessionStorage.removeItem(ADMIN_AUTH_KEY)
}

function getAdminAuthorization() {
  try {
    const credentials = sessionStorage.getItem(ADMIN_AUTH_KEY)
    return credentials ? `Basic ${credentials}` : null
  } catch {
    return null
  }
}

function friendlyMessage(status, details) {
  const serverMessage =
    details && typeof details === 'object' ? details.message : null

  if (status === 400 || status === 422) {
    return (
      serverMessage ||
      'Some information was not valid. Please check it and try again.'
    )
  }

  if (status === 401) {
    return 'Admin login is required or the credentials are incorrect.'
  }

  if (status === 403) {
    return "You don't have permission to perform this action."
  }

  if (status === 404) {
    return "We couldn't find what you were looking for."
  }

  if (status >= 500) {
    return 'The server ran into a problem. Please try again in a moment.'
  }

  return serverMessage || 'Something went wrong. Please try again.'
}

/**
 * Sends requests to the Spring Boot backend.
 * Admin endpoints must explicitly use { admin: true }.
 */
export async function request(
  path,
  { method = 'GET', body, signal, headers, admin = false } = {},
) {
  const requestHeaders = {
    Accept: 'application/json',
    ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...headers,
  }

  if (admin) {
    const authorization = getAdminAuthorization()

    if (authorization) {
      requestHeaders.Authorization = authorization
    }
  }

  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      signal,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    if (err.name === 'AbortError') throw err

    throw new ApiError(
      "We couldn't reach the server. Please check your connection and try again.",
      { details: err.message },
    )
  }

  if (!response.ok) {
    let details = null

    try {
      details = await response.json()
    } catch {
      // The server returned no JSON body.
    }

    throw new ApiError(friendlyMessage(response.status, details), {
      status: response.status,
      details,
    })
  }

  if (response.status === 204) return null

  const text = await response.text()
  return text ? JSON.parse(text) : null
}
