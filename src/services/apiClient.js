import { API_BASE_URL } from '../data/config'

export class ApiError extends Error {
  constructor(message, { status = 0, details = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

function friendlyMessage(status, details) {
  const serverMessage = details && typeof details === 'object' ? details.message : null
  if (status === 400 || status === 422) return serverMessage || 'Some of the information was not valid. Please check it and try again.'
  if (status === 404) return "We couldn't find what you were looking for."
  if (status >= 500) return 'The server ran into a problem. Please try again in a moment.'
  return serverMessage || 'Something went wrong. Please try again.'
}

/**
 * Thin wrapper around fetch for the Spring Boot backend.
 * - Prefixes API_BASE_URL
 * - Sends/receives JSON
 * - Throws ApiError with a message that is safe to show to customers
 */
export async function request(path, { method = 'GET', body, signal, headers } = {}) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new ApiError("We couldn't reach the server. Please check your connection and try again.", {
      details: err.message,
    })
  }

  if (!response.ok) {
    let details = null
    try {
      details = await response.json()
    } catch {
      /* response had no JSON body */
    }
    throw new ApiError(friendlyMessage(response.status, details), { status: response.status, details })
  }

  if (response.status === 204) return null
  const text = await response.text()
  return text ? JSON.parse(text) : null
}
