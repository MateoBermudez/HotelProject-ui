"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"

interface User {
    id: number
    email: string
    name: string
    role: string
}

interface AuthContextType {
    user: User | null
    token: string | null
    login: (email: string, password: string) => Promise<boolean>
    logout: () => void
    isAuthenticated: boolean
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        // Check for existing token on app load
        const storedToken = localStorage.getItem("jwt_token") || sessionStorage.getItem("jwt_token")
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user")

        if (storedToken && storedUser) {
            try {
                setToken(storedToken)
                setUser(JSON.parse(storedUser))
            } catch (error) {
                console.error("Error parsing stored user data:", error)
                localStorage.removeItem("jwt_token")
                localStorage.removeItem("user")
                sessionStorage.removeItem("jwt_token")
                sessionStorage.removeItem("user")
            }
        }
        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            // This would be your actual API call to Spring Boot backend
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            if (response.ok) {
                const data = await response.json()
                setToken(data.token)
                setUser(data.user)

                // Store in localStorage (you could also use sessionStorage for session-only storage)
                localStorage.setItem("jwt_token", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))

                return true
            } else {
                return false
            }
        } catch (error) {
            console.error("Login error:", error)
            return false
        }
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem("jwt_token")
        localStorage.removeItem("user")
        sessionStorage.removeItem("jwt_token")
        sessionStorage.removeItem("user")
        navigate("/")
    }

    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
