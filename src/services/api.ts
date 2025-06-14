// This file will be used for API calls to the Spring Boot backend
import { createClient } from "@supabase/supabase-js"
const API_BASE_URL = "http://localhost:8080/api/v1"


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

// Get current user information from token
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

export interface RoomType {
    id: number
    name: string
}

export interface AmenityDTO {
    id: number
    name: string
}

// Actualizar la interfaz Room para que coincida con el RoomDTO del backend
export interface Room {
    id: number
    roomNumber: string
    pricePerNight: number
    capacity: number
    available: boolean
    description: string
    roomType: RoomType
    amenities: AmenityDTO[]
    // Agregar campos que podrían estar en el RoomDTO del backend
    size?: number
    bedType?: string
    images?: string[]
}

// Interfaz para Booking (ajusta los campos según tu backend)
export interface Booking {
    id: number
    user: UserProfile["userID"]
    room: Room
    checkInDate: string
    checkOutDate: string
    guests: number
    totalPrice: number
    status?: string
    createdAt?: string
    // Agrega más campos si tu backend los retorna
}

// Interfaz para BookingDTO según el backend
export interface BookingDTO {
    id?: number
    room: Room
    customerName: string
    startDate: string
    endDate: string
    confirmed: boolean
    notes?: string
    createdAt?: string
    totalPrice: number
}

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || `Request failed with status: ${response.status}`)
    }
    return await response.json()
}

// Example API functions (keeping your existing function)
export const fetchRooms = async (): Promise<Room[]> => {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    }
    const token = getToken()
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    try {
        // Cambiar el endpoint para que coincida con tu backend
        const response = await fetch(`${API_BASE_URL}/rooms/all`, { headers })
        return handleResponse(response)
    } catch (error) {
        console.error("Error fetching rooms:", error)
        throw error
    }
}

// Agregar función para obtener habitaciones disponibles con fechas
export const fetchAvailableRooms = async (startDate: string, endDate: string, guests: number): Promise<Room[]> => {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    }
    const token = getToken()
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    try {
        const params = new URLSearchParams({
            startDate,
            endDate,
            guests: guests.toString(),
        })

        const response = await fetch(`${API_BASE_URL}/rooms/available?${params}`, { headers })
        return handleResponse(response)
    } catch (error) {
        console.error("Error fetching available rooms:", error)
        throw error
    }
}

export const fetchRoomById = async (id: number) => {
    try {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        }

        const token = getToken()
        if (token) {
            headers.Authorization = `Bearer ${token}`
        }

        const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
            headers,
        })

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
        const token = getToken()
        if (!token) {
            throw new Error("Authentication required to create a booking")
        }

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

// Crear una reserva usando BookingDTO
export const createBookingDTO = async (booking: BookingDTO): Promise<BookingDTO> => {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    }
    const token = getToken()
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }
    const response = await fetch(`${API_BASE_URL}/bookings/create`, {
        method: "POST",
        headers,
        body: JSON.stringify(booking),
    })
    return handleResponse(response)
}

// Obtener bookingDTO por ID
export const fetchBookingById = async (id: number): Promise<BookingDTO> => {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    }
    const token = getToken()
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }
    try {
        const response = await fetch(`${API_BASE_URL}/bookings/booking/${id}`, { headers })
        return handleResponse(response)
    } catch (error) {
        console.error(`Error fetching booking with id ${id}:`, error)
        throw error
    }
}

// Obtener todas las reservas
export const fetchAllBookings = async (): Promise<Booking[]> => {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    }
    const token = getToken()
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }
    try {
        const response = await fetch(`${API_BASE_URL}/bookings/all`, { headers })
        return handleResponse(response)
    } catch (error) {
        console.error("Error fetching bookings:", error)
        throw error
    }
}

// Interfaz para PaymentDTO según el backend
export interface PaymentDTO {
    paymentID?: string
    bookingID: number
    amount: number
    amountPaid: number
    paymentDate: string
    paymentType: string
    cardNumber: string
    userid: string
}

// Crear un pago usando PaymentDTO
export const createPaymentDTO = async (payment: PaymentDTO): Promise<PaymentDTO> => {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    }
    const token = getToken()
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }
    const response = await fetch("http://localhost:8080/api/v1/users/payments/create", {
        method: "POST",
        headers,
        body: JSON.stringify(payment),
    })
    return handleResponse(response)
}

export const fetchPaymentById = async (paymentId: string): Promise<PaymentDTO> => {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    }
    const token = getToken()
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }
    try {
        const response = await fetch(`${API_BASE_URL}/users/payment/${paymentId}`, { headers })
        return handleResponse(response)
    } catch (error) {
        console.error(`Error fetching booking by payment ID ${paymentId}:`, error)
        throw error
    }
}

export const fetchPaymentByBookingId = async (bookingId: number | undefined): Promise<PaymentDTO> => {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    }
    const token = getToken()
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }
    try {
        const response = await fetch(`${API_BASE_URL}/users/payment-booking/${bookingId}`, { headers })
        return handleResponse(response)
    } catch (error) {
        console.error(`Error fetching booking by payment ID ${bookingId}:`, error)
        throw error
    }
}

// API para obtener el PDF de una reserva
export async function getBookingPdf(bookingId: number): Promise<Blob> {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/bookings/booking/${bookingId}/pdf`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })
        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(errorText || `No se pudo generar el PDF. Código: ${response.status}`)
        }
        return await response.blob()
    } catch (error) {
        console.error("Error al obtener el PDF de la reserva:", error)
        throw error
    }
}

// Obtiene las reservas de un usuario por su userID
export const fetchBookingsByUserId = async (userId: string): Promise<Booking[]> => {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    }
    const token = getToken()
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }
    try {
        const response = await fetch(`${API_BASE_URL}/bookings/user/${userId}/bookings`, { headers })
        return handleResponse(response)
    } catch (error) {
        console.error(`Error fetching bookings for user ${userId}:`, error)
        throw error
    }
}

// Retorna las URLs públicas de las tres imágenes del bucket de Supabase
export const getRoomImagesFromSupabase = (): string[] => {
    return [
        "https://olkgjrucxxwunjrajaai.supabase.co/storage/v1/object/sign/images/DELUXE.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80ODRmNWY4NC1hNzU0LTQ2NzEtYmY0Ny0yMTA3YTQ2NTYwMDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvREVMVVhFLmpwZyIsImlhdCI6MTc0OTYwNjE3MywiZXhwIjoxNzUyMTk4MTczfQ.PBPQ8af9kbnYmvh0xTLymJFL8fYoSU_GqL3rhMR5Ewg",
        "https://olkgjrucxxwunjrajaai.supabase.co/storage/v1/object/sign/images/STANDARD.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80ODRmNWY4NC1hNzU0LTQ2NzEtYmY0Ny0yMTA3YTQ2NTYwMDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvU1RBTkRBUkQuanBnIiwiaWF0IjoxNzQ5NjA2MTk5LCJleHAiOjE3NTIxOTgxOTl9.CzGUylblx93ri0mjICkfyRbyECHYleKLuXKKHxx2PR4",
        "https://olkgjrucxxwunjrajaai.supabase.co/storage/v1/object/sign/images/SUITE.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80ODRmNWY4NC1hNzU0LTQ2NzEtYmY0Ny0yMTA3YTQ2NTYwMDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvU1VJVEUuanBnIiwiaWF0IjoxNzQ5NjA2MjE4LCJleHAiOjE3NTIxOTgyMTh9.CdEaKCb7EYTGZYsOLhQ2D_Q3RoWug8jlol0eZURfMWk"
    ];
}

export interface RefundDTO {
    refundID?: string;
    paymentID: string;
    amount: number;
    refundDate?: string;
}

export const calculateRefund = async (refundDTO: RefundDTO): Promise<RefundDTO> => {
    const token = getToken();
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/refunds/calculate`, {
        method: "POST",
        headers,
        body: JSON.stringify(refundDTO),
    });
    if (!response.ok) {
        throw new Error("Error calculating refund");
    }
    return response.json();
};
