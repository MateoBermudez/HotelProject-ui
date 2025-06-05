"use client"

import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

interface ProtectedRouteProps {
    children: ReactNode
    requireAuth?: boolean
    redirectTo?: string
}

const ProtectedRoute = ({ children, requireAuth = true, redirectTo = "/error" }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        )
    }

    if (requireAuth && !isAuthenticated) {
        return (
            <Navigate
                to={redirectTo}
                state={{
                    errorType: "auth",
                    from: location.pathname,
                }}
                replace
            />
        )
    }

    return <>{children}</>
}

export default ProtectedRoute