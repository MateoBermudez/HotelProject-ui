"use client"

import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Home, RefreshCw, AlertTriangle, Lock, Wifi, Server } from "lucide-react"

interface ErrorMessage {
    message: string
    cause?: string
    statusCode: number
    timestamp: number
    path: string
    errorCode: string
}

interface ErrorPageProps {
    error?: ErrorMessage | null
    errorType?: "auth" | "network" | "server" | "notfound" | "general"
    customMessage?: string
}

const ErrorPage = ({ error, errorType = "general", customMessage }: ErrorPageProps) => {
    const location = useLocation()
    const navigate = useNavigate()
    const [countdown, setCountdown] = useState(10)
    const [autoRedirect, setAutoRedirect] = useState(true)

    // Get error from location state if not passed as prop
    const errorData = error || location.state?.error
    const errorTypeFromState = errorType || location.state?.errorType || "general"

    useEffect(() => {
        if (autoRedirect && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1)
            }, 1000)
            return () => clearTimeout(timer)
        } else if (autoRedirect && countdown === 0) {
            navigate("/")
        }
    }, [countdown, autoRedirect, navigate])

    const getErrorIcon = () => {
        switch (errorTypeFromState) {
            case "auth":
                return <Lock className="h-16 w-16 text-red-500" />
            case "network":
                return <Wifi className="h-16 w-16 text-orange-500" />
            case "server":
                return <Server className="h-16 w-16 text-red-500" />
            case "notfound":
                return <AlertTriangle className="h-16 w-16 text-yellow-500" />
            default:
                return <AlertTriangle className="h-16 w-16 text-red-500" />
        }
    }

    const getErrorTitle = () => {
        if (customMessage) return customMessage

        switch (errorTypeFromState) {
            case "auth":
                return "Authentication Required"
            case "network":
                return "Connection Problem"
            case "server":
                return "Server Error"
            case "notfound":
                return "Page Not Found"
            default:
                return errorData?.message || "Something went wrong"
        }
    }

    const getErrorDescription = () => {
        switch (errorTypeFromState) {
            case "auth":
                return "You need to be logged in to access this page. Please sign in to continue."
            case "network":
                return "We're having trouble connecting to our servers. Please check your internet connection and try again."
            case "server":
                return "Our servers are experiencing some issues. We're working to fix this as quickly as possible."
            case "notfound":
                return "The page you're looking for doesn't exist or has been moved."
            default:
                return errorData?.cause || "An unexpected error occurred. Please try again later."
        }
    }

    const getStatusCode = () => {
        if (errorData?.statusCode) return errorData.statusCode

        switch (errorTypeFromState) {
            case "auth":
                return 401
            case "notfound":
                return 404
            case "server":
                return 500
            case "network":
                return 0
            default:
                return 500
        }
    }

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp).toLocaleString()
    }

    const handleRetry = () => {
        window.location.reload()
    }

    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1)
        } else {
            navigate("/")
        }
    }

    return (
        <div className="error-page min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-2xl w-full text-center">
                {/* Error Icon */}
                <div className="flex justify-center mb-6">{getErrorIcon()}</div>

                {/* Status Code */}
                <div className="text-6xl font-bold text-gray-300 mb-4">{getStatusCode()}</div>

                {/* Error Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{getErrorTitle()}</h1>

                {/* Error Description */}
                <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">{getErrorDescription()}</p>

                {/* Error Details (if available) */}
                {errorData && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-left">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Error Details</h3>
                        <div className="space-y-2 text-sm">
                            {errorData.errorCode && (
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Error Code:</span>
                                    <span className="text-red-600 font-mono">{errorData.errorCode}</span>
                                </div>
                            )}
                            {errorData.path && (
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Path:</span>
                                    <span className="text-gray-800 font-mono">{errorData.path}</span>
                                </div>
                            )}
                            {errorData.timestamp && (
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Time:</span>
                                    <span className="text-gray-800">{formatTimestamp(errorData.timestamp)}</span>
                                </div>
                            )}
                            {errorData.cause && (
                                <div className="mt-3">
                                    <span className="font-medium text-gray-600">Technical Details:</span>
                                    <p className="text-gray-700 mt-1 p-2 bg-gray-50 rounded text-xs font-mono break-all">
                                        {errorData.cause}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <Link to="/" className="btn btn-primary inline-flex items-center justify-center">
                        <Home className="h-5 w-5 mr-2" />
                        Go to Home
                    </Link>

                    {errorTypeFromState === "auth" ? (
                        <Link to="/login" className="btn btn-secondary inline-flex items-center justify-center">
                            <Lock className="h-5 w-5 mr-2" />
                            Sign In
                        </Link>
                    ) : (
                        <button onClick={handleRetry} className="btn btn-secondary inline-flex items-center justify-center">
                            <RefreshCw className="h-5 w-5 mr-2" />
                            Try Again
                        </button>
                    )}

                    <button onClick={handleGoBack} className="btn btn-secondary">
                        Go Back
                    </button>
                </div>

                {/* Auto Redirect */}
                {autoRedirect && countdown > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-blue-800">
                            Automatically redirecting to home page in <span
                            className="font-bold text-blue-900">{countdown}</span>{" "}
                            seconds
                        </p>
                        <button
                            onClick={() => setAutoRedirect(false)}
                            className="text-blue-600 hover:text-blue-800 text-sm underline mt-2"
                        >
                            Cancel auto-redirect
                        </button>
                    </div>
                )}

                {/* Help Section */}
                <div className="bg-gray-100 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Need Help?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <h4 className="font-medium text-gray-700 mb-1">Contact Support</h4>
                            <p className="text-gray-600">
                                Email:{" "}
                                <a href="mailto:support@luxuryhotel.com" className="text-teal-600 hover:text-teal-800">
                                    support@luxuryhotel.com
                                </a>
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-700 mb-1">Call Us</h4>
                            <p className="text-gray-600">
                                Phone:{" "}
                                <a href="tel:+1234567890" className="text-teal-600 hover:text-teal-800">
                                    +1 (234) 567-890
                                </a>
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-700 mb-1">Visit Help Center</h4>
                            <Link to="/help" className="text-teal-600 hover:text-teal-800">
                                Browse FAQ & Guides
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage
