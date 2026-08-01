export interface RivletProfile {
  name: string
  email: string
  phone?: string
  city?: string
}

export interface RivletSession {
  loggedIn: boolean
  profile: RivletProfile
}

const STORAGE_KEY = 'rivlet-session-v1'

type Listener = () => void
const listeners = new Set<Listener>()

const guestProfile: RivletProfile = {
  name: '',
  email: '',
}

function read(): RivletSession {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { loggedIn: false, profile: { ...guestProfile } }
    return JSON.parse(raw) as RivletSession
  } catch {
    return { loggedIn: false, profile: { ...guestProfile } }
  }
}

function write(session: RivletSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  listeners.forEach((l) => l())
}

export function subscribeAuth(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getSession(): RivletSession {
  return read()
}

export function isLoggedIn(): boolean {
  return read().loggedIn
}

export function getProfile(): RivletProfile {
  return read().profile
}

/** Prototype login - any email + password (≥4) succeeds. */
export function login(email: string, password: string, name?: string): { ok: true } | { ok: false; error: string } {
  const clean = email.trim().toLowerCase()
  if (!clean.includes('@') || !clean.includes('.')) {
    return { ok: false, error: 'Enter a valid email.' }
  }
  if (password.trim().length < 4) {
    return { ok: false, error: 'Password needs at least 4 characters.' }
  }
  const existing = read()
  const display =
    name?.trim() ||
    existing.profile.name ||
    clean.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  write({
    loggedIn: true,
    profile: {
      ...existing.profile,
      email: clean,
      name: display,
      city: existing.profile.city || 'Bengaluru',
    },
  })
  return { ok: true }
}

export function logout(): void {
  const profile = read().profile
  write({ loggedIn: false, profile: { ...profile } })
}

export function updateProfile(patch: Partial<RivletProfile>): void {
  const session = read()
  write({
    ...session,
    profile: { ...session.profile, ...patch },
  })
}
