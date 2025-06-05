const API_BASE_URL = "http://localhost:8080/api"

// Create axios-like interface for error handling
const apiClient = {
    async request(url: string, options: RequestInit = {}) {
        const token = localStorage.getItem("jwt_token") || sessionStorage.getItem("jwt_token")

        const config: RequestInit = {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
        }

        try {
            const response = await fetch(`${API_BASE_URL}${url}`, config)

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                throw {
                    response: {
                        status: response.status,
                        data: errorData,
                    },
                }
            }

            return await response.json()
        } catch (error) {
            throw error
        }
    },

    get(url: string) {
        return this.request(url, { method: "GET" })
    },

    post(url: string, data: any) {
        return this.request(url, {
            method: "POST",
            body: JSON.stringify(data),
        })
    },

    put(url: string, data: any) {
        return this.request(url, {
            method: "PUT",
            body: JSON.stringify(data),
        })
    },

    delete(url: string) {
        return this.request(url, { method: "DELETE" })
    },
}

// Example API functions with error handling
export const fetchRooms = async () => {
    try {
        return await apiClient.get("/rooms")
    } catch (error) {
        // Error will be handled by the component using this function
        throw error
    }
}

export const fetchRoomById = async (id: number) => {
    try {
        return await apiClient.get(`/rooms/${id}`)
    } catch (error) {
        throw error
    }
}

export const createBooking = async (bookingData: any) => {
    try {
        return await apiClient.post("/bookings", bookingData)
    } catch (error) {
        throw error
    }
}

// Usage example in a component:
/*
import { useNavigate } from "react-router-dom"
import { handleApiError } from "../utils/errorHandler"
import { fetchRooms } from "../services/api"

const MyComponent = () => {
  const navigate = useNavigate()

  const loadRooms = async () => {
    try {
      const rooms = await fetchRooms()
      // Handle success
    } catch (error) {
      handleApiError(error, navigate, "/rooms")
    }
  }
}
*/
