// Frame.io API v2 utility functions

export const FRAMEIO_AUTH_URL = 'https://applications.frame.io/oauth2/auth'
export const FRAMEIO_TOKEN_URL = 'https://applications.frame.io/oauth2/token'
export const FRAMEIO_API = 'https://api.frame.io/v2'

export const FRAMEIO_SCOPES = [
  'account.read',
  'team.read',
  'project.read',
  'project.create',
  'asset.read',
  'asset.create',
  'asset.delete',
  'offline',
].join(' ')

export function getAuthUrl(state: string) {
  const params = new URLSearchParams({
    client_id: process.env.FRAMEIO_CLIENT_ID!,
    redirect_uri: process.env.FRAMEIO_REDIRECT_URI!,
    response_type: 'code',
    scope: FRAMEIO_SCOPES,
    state,
  })
  return `${FRAMEIO_AUTH_URL}?${params}`
}

export async function exchangeCode(code: string) {
  const res = await fetch(FRAMEIO_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.FRAMEIO_CLIENT_ID,
      client_secret: process.env.FRAMEIO_CLIENT_SECRET,
      redirect_uri: process.env.FRAMEIO_REDIRECT_URI,
      grant_type: 'authorization_code',
      code,
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Frame.io token exchange failed: ${text}`)
  }
  return res.json() as Promise<{
    access_token: string
    refresh_token: string
    token_type: string
    expires_in: number
    scope: string
  }>
}

export async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(FRAMEIO_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.FRAMEIO_CLIENT_ID,
      client_secret: process.env.FRAMEIO_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })
  if (!res.ok) throw new Error('Frame.io token refresh failed')
  return res.json()
}

export async function frameioGet(path: string, token: string) {
  const res = await fetch(`${FRAMEIO_API}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Frame.io API error ${res.status}: ${text}`)
  }
  return res.json()
}

export async function frameioPost(path: string, token: string, body: unknown) {
  const res = await fetch(`${FRAMEIO_API}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Frame.io API error ${res.status}: ${text}`)
  }
  return res.json()
}

export type FrameioAsset = {
  id: string
  name: string
  type: 'file' | 'folder' | 'version_stack'
  filesize: number | null
  filetype: string | null
  thumb_url: string | null
  original: string | null
  download_url: string | null
  stream_url: string | null
  uploaded_at: string
  item_count?: number
}

export type FrameioProject = {
  id: string
  name: string
  root_asset_id: string
  team_id: string
}
