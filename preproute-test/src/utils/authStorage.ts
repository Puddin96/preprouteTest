export type StoredUser = {
  userId: string
}

const USER_KEY = 'preproute_user'

export function setUser(user: StoredUser) {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getUser(): StoredUser | null {
  const raw = sessionStorage.getItem(USER_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as StoredUser
  } catch {
    return null
  }
}

export function clearUser() {
  sessionStorage.removeItem(USER_KEY)
}
