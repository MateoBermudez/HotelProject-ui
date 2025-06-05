"use client"

import type React from "react"
import { Component, type ReactNode } from "react"
import ErrorPage from "../pages/ErrorPage"

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
    errorInfo?: React.ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo)
        this.setState({ error, errorInfo })
    }

    render() {
        if (this.state.hasError) {
            const errorMessage = {
                message: this.state.error?.message || "Application Error",
                cause: this.state.error?.stack || undefined,
                statusCode: 500,
                timestamp: Date.now(),
                path: window.location.pathname,
                errorCode: "REACT_ERROR",
            }

            return <ErrorPage error={errorMessage} errorType="general" />
        }

        return this.props.children
    }
}

export default ErrorBoundary
