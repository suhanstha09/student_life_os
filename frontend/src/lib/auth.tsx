'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  apiFetch,
  apiPost,
  clearTokens,
  getAccessToken,
  setTokens,
} from './api'

type User = {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string
  bio: string
  timezone: string
  theme: 'light' | 'dark' | 'system'
  daily_focus_goal: number
}

type AuthContextValue = {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<string | null>
  register: (
    payload: {
      email: string
      username: string
      password: string
      passwordConfirm: string
      firstName?: string
      lastName?: string
    }
  ) => Promise<string | null>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const readErrorMessage = async (error: unknown) => {
  if (error instanceof Error) return error.message
  return 'Something went wrong'
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshUser = async () => {
    try {
      const data = await apiFetch('/auth/me/')
      setUser(data as User)
    } catch {
      setUser(null)
      clearTokens()
    }
  }

  useEffect(() => {
    const bootstrap = async () => {
      if (getAccessToken()) {
        await refreshUser()
      }
      setLoading(false)
    }

    bootstrap()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const tokens = await apiPost<{ access: string; refresh: string }>(
        '/auth/token/',
        { email, password }
      )
      setTokens(tokens)
      await refreshUser()
      router.push('/')
      return null
    } catch (error) {
      return readErrorMessage(error)
    }
  }

  const register = async ({
    email,
    username,
    password,
    passwordConfirm,
    firstName,
    lastName,
  }: {
    email: string
    username: string
    password: string
    passwordConfirm: string
    firstName?: string
    lastName?: string
  }) => {
    try {
      await apiPost('/auth/register/', {
        email,
        username,
        password,
        password_confirm: passwordConfirm,
        first_name: firstName ?? '',
        last_name: lastName ?? '',
      })
      return login(email, password)
    } catch (error) {
      return readErrorMessage(error)
    }
  }

  const logout = () => {
    clearTokens()
    setUser(null)
    router.push('/login')
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user) || Boolean(getAccessToken()),
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
