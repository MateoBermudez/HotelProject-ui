// Authentication service for handling JWT tokens

// Store the JWT token in localStorage
export const setToken = (token: string): void => {
    localStorage.setItem("jwt_token", token)
}

// Get the JWT token from localStorage
export const getToken = (): string | null => {
    return localStorage.getItem("jwt_token")
}

// Remove the JWT token from localStorage
export const removeToken = (): void => {
    localStorage.removeItem("jwt_token")
}

// Check if the user is authenticated (has a token)
export const isAuthenticated = (): boolean => {
    const token = getToken()

    if (!token) {
        return false
    }

    // Optional: Check if token is expired
    try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        return payload.exp > Date.now() / 1000
    } catch (e) {
        return false
    }
}

// Parse user information from the token
export const getUserInfo = () => {
    const token = getToken()

    if (!token) {
        return null
    }

    try {
        return JSON.parse(atob(token.split(".")[1]))
    } catch (e) {
        return null
    }
}
