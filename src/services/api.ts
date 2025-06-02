// This file will be used for API calls to the Spring Boot backend

const API_BASE_URL = "http://localhost:8080/api/v1"

// Example API functions
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

export const createBooking = async (bookingData: any) => {
    try {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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

// Add more API functions as needed
