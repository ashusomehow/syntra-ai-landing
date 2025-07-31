"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  hasFullAccess: boolean
  subscriptionType: "free" | "premium"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  googleAuth: () => Promise<void>
  logout: () => void
  isLoading: boolean
  isInitialized: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize auth state on client side only
    const initializeAuth = async () => {
      try {
        if (typeof window !== "undefined") {
          const savedUser = localStorage.getItem("syntra_user")
          if (savedUser) {
            const parsedUser = JSON.parse(savedUser)
            // Ensure user has full access
            const userWithAccess = {
              ...parsedUser,
              hasFullAccess: true,
              subscriptionType: "premium" as const,
            }
            setUser(userWithAccess)
            // Update localStorage with full access
            localStorage.setItem("syntra_user", JSON.stringify(userWithAccess))
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        // Clear corrupted data
        if (typeof window !== "undefined") {
          localStorage.removeItem("syntra_user")
        }
      } finally {
        setIsInitialized(true)
      }
    }

    initializeAuth()
  }, [])

  // Don't render children until initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    )
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const userData = {
        id: `user_${Date.now()}`,
        name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
        email,
        avatar: "/placeholder.svg?height=40&width=40",
        hasFullAccess: true,
        subscriptionType: "premium" as const,
      }

      setUser(userData)
      if (typeof window !== "undefined") {
        localStorage.setItem("syntra_user", JSON.stringify(userData))
      }
    } catch (error) {
      throw new Error("Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const userData = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        email,
        avatar: "/placeholder.svg?height=40&width=40",
        hasFullAccess: true,
        subscriptionType: "premium" as const,
      }

      setUser(userData)
      if (typeof window !== "undefined") {
        localStorage.setItem("syntra_user", JSON.stringify(userData))
      }
    } catch (error) {
      throw new Error("Signup failed")
    } finally {
      setIsLoading(false)
    }
  }

  const googleAuth = async () => {
    setIsLoading(true)
    try {
      // Simulate Google OAuth
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userData = {
        id: `google_${Date.now()}`,
        name: "John Doe",
        email: "john.doe@gmail.com",
        avatar: "/placeholder.svg?height=40&width=40",
        hasFullAccess: true,
        subscriptionType: "premium" as const,
      }

      setUser(userData)
      if (typeof window !== "undefined") {
        localStorage.setItem("syntra_user", JSON.stringify(userData))
      }
    } catch (error) {
      throw new Error("Google authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("syntra_user")
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, googleAuth, logout, isLoading, isInitialized }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
