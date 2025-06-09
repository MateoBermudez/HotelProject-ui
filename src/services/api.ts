// API service for making HTTP requests to the backend

const API_BASE_URL = "http://localhost:8080/api"

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

    return await response.blob()
}

// Get user profile information
export const getUserProfile = async (token: string | null) => {
    if (!token) throw new Error("No authentication token provided")

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })

    return handleResponse(response)
}

// Get user bookings
export const getUserBookings = async (token: string | null) => {
    if (!token) throw new Error("No authentication token provided")

    const response = await fetch(`${API_BASE_URL}/bookings/user`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })

    return handleResponse(response)
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

// Login user and get JWT token
export const loginUser = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })

    return handleResponse(response)
}

// Register new user
export const registerUser = async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    })

    return handleResponse(response)
}
