// This file will be used for API calls to the Spring Boot backend

const API_BASE_URL = "http://localhost:8080/api/v1"

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        // Try to get error message from response
        let errorMessage
        try {
            const errorData = await response.json()
            errorMessage = errorData.message || `Error: ${response.status}`
        } catch (e) {
            errorMessage = `Error: ${response.status}`
        }
        throw new Error(errorMessage)
    }

    // Check if response is empty
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
        return await response.json()
    }
// Request/Response types matching your backend DTOs
export interface RegisterRequest {
    userID: string
    username: string
    completeName: string
    email: string
    password: string
    role: string
}

export interface LoginRequest {
    username: string
    password: string
}

export interface AuthResponse {
    token: string
}

export interface UserProfile {
    userID: string
    username: string
    completeName: string
    email: string
    role: string
}

// Error response type for better error handling
export interface ApiError {
    message: string
    status: number
}

// Token management functions
export const saveToken = (token: string): void => {
    localStorage.setItem("authToken", token)
}

export const getToken = (): string | null => {
    return localStorage.getItem("authToken")
}

export const removeToken = (): void => {
    localStorage.removeItem("authToken")
}

export const isAuthenticated = (): boolean => {
    return getToken() !== null
}

// Authentication API functions
export const registerUser = async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })

        if (!response.ok) {
            const errorData = await response.text()
            throw new Error(errorData || `Registration failed with status: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error("Error registering user:", error)
        throw error
    }
}

// Generate booking report (PDF)
export const generateBookingReport = async (token: string | null, bookingId: number) => {
    if (!token) throw new Error("No authentication token provided")

    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/report`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/pdf",
        },
    })

    return handleResponse(response)
}

// Example API functions from previous implementation
export const fetchRooms = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/rooms`)
        if (!response.ok) {
            throw new Error("Failed to fetch rooms")
        }
        return await response.json()
export const loginUser = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        })

        if (!response.ok) {
            const errorData = await response.text()

            // Handle specific backend exceptions
            if (errorData.includes("User not found")) {
                throw new Error("Username not found. Please check your username.")
            } else if (errorData.includes("Invalid password")) {
                throw new Error("Invalid password. Please check your password.")
            } else if (response.status === 401) {
                throw new Error("Invalid username or password.")
            } else {
                throw new Error(errorData || `Login failed with status: ${response.status}`)
            }
        }

        return await response.json()
    } catch (error) {
        console.error("Error logging in:", error)
        throw error
    }
}

// Example API functions (keeping your existing function)
export const fetchRooms = async () => {
    try {
        // Add token to request if user is authenticated
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        }

        const token = getToken()
        if (token) {
            headers.Authorization = `Bearer ${token}`
        }

        const response = await fetch(`${API_BASE_URL}/rooms`, {
            headers,
        })

        if (!response.ok) {
            throw new Error("Failed to fetch rooms")
        }
        return await response.json()
    } catch (error) {
        console.error("Error fetching rooms:", error)
        throw error
    }
}

export const fetchRoomById = async (id: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/rooms/${id}`)
        if (!response.ok) {
            throw new Error(`Failed to fetch room with id ${id}`)
        }
        return await response.json()
    } catch (error) {
        console.error(`Error fetching room ${id}:`, error)
        throw error
    }
}

export const createBooking = async (bookingData: any, token: string | null) => {
    if (!token) throw new Error("No authentication token provided")

    try {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(bookingData),
        })

        if (!response.ok) {
            throw new Error("Failed to create booking")
        }

        return await response.json()
    } catch (error) {
        console.error("Error creating booking:", error)
        throw error
    }
}


export const getCurrentUser = async (): Promise<UserProfile> => {
    try {
        const token = getToken()
        if (!token) {
            throw new Error("No authentication token found")
        }

        const response = await fetch(`${API_BASE_URL}/users/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid - remove it
                removeToken()
                throw new Error("Session expired. Please login again.")
            }
            throw new Error(`Failed to get user info: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error("Error getting current user:", error)
        throw error
    }
}
*/
