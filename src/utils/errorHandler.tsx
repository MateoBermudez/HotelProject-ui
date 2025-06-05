import type { NavigateFunction } from "react-router-dom"

interface ErrorMessage {
    message: string
    cause?: string
    statusCode: number
    timestamp: number
    path: string
    errorCode: string
}

export const handleApiError = (error: any, navigate: NavigateFunction, path?: string) => {
    console.error("API Error:", error)

    let errorMessage: ErrorMessage
    let errorType = "general"

    if (error.response) {
        // Server responded with error status
        const { status, data } = error.response

        if (data && typeof data === "object" && data.message) {
            // Backend error with ErrorMessage format
            errorMessage = {
                message: data.message,
                cause: data.cause,
                statusCode: data.statusCode || status,
                timestamp: data.timestamp || Date.now(),
                path: data.path || path || window.location.pathname,
                errorCode: data.errorCode || `HTTP_${status}`,
            }
        } else {
            // Generic HTTP error
            errorMessage = {
                message: getHttpErrorMessage(status),
                statusCode: status,
                timestamp: Date.now(),
                path: path || window.location.pathname,
                errorCode: `HTTP_${status}`,
            }
        }

        // Determine error type based on status code
        if (status === 401 || status === 403) {
            errorType = "auth"
        } else if (status === 404) {
            errorType = "notfound"
        } else if (status >= 500) {
            errorType = "server"
        }
    } else if (error.request) {
        // Network error
        errorMessage = {
            message: "Network Error",
            cause: "Unable to connect to the server. Please check your internet connection.",
            statusCode: 0,
            timestamp: Date.now(),
            path: path || window.location.pathname,
            errorCode: "NETWORK_ERROR",
        }
        errorType = "network"
    } else {
        // Other error
        errorMessage = {
            message: error.message || "An unexpected error occurred",
            cause: error.stack,
            statusCode: 500,
            timestamp: Date.now(),
            path: path || window.location.pathname,
            errorCode: "UNKNOWN_ERROR",
        }
    }

    // Navigate to error page with error details
    navigate("/error", {
        state: {
            error: errorMessage,
            errorType,
        },
    })
}

const getHttpErrorMessage = (status: number): string => {
    switch (status) {
        case 400:
            return "Bad Request"
        case 401:
            return "Unauthorized - Please log in"
        case 403:
            return "Forbidden - You don't have permission"
        case 404:
            return "Not Found"
        case 408:
            return "Request Timeout"
        case 429:
            return "Too Many Requests"
        case 500:
            return "Internal Server Error"
        case 502:
            return "Bad Gateway"
        case 503:
            return "Service Unavailable"
        case 504:
            return "Gateway Timeout"
        default:
            return `HTTP Error ${status}`
    }
}

export const checkAuthToken = (): boolean => {
    const token = localStorage.getItem("jwt_token") || sessionStorage.getItem("jwt_token")
    return !!token
}

export const redirectToError = (navigate: NavigateFunction, errorType: string, customMessage?: string) => {
    navigate("/error", {
        state: {
            errorType,
            customMessage,
        },
    })
}
