"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { User, Mail, Shield, ArrowLeft, Calendar, Lock, Bell } from "lucide-react"
import { isAuthenticated, getToken } from "../services/api"
import DashboardHeader from "@/components/DashboardHeader.tsx";

// Interfaz que coincide con tu UserDTO del backend
interface UserProfile {
    userID: string
    username: string
    completeName: string
    email: string
    role: string
}

const ProfilePage = () => {
    const navigate = useNavigate()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Verificar si el usuario está autenticado
        if (!isAuthenticated()) {
            navigate("/login", { state: { from: "/profile" } })
            return
        }

        // Obtener información del perfil del usuario
        fetchUserProfile()
    }, [navigate])

    const fetchUserProfile = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const token = getToken()
            const response = await fetch("http://localhost:8080/api/v1/users/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                if (response.status === 401) {
                    // Token expirado o inválido
                    navigate("/login", { state: { from: "/profile" } })
                    throw new Error("Tu sesión ha expirado. Por favor inicia sesión nuevamente.")
                }
                throw new Error(`Error ${response.status}: ${await response.text()}`)
            }

            const userData = await response.json()
            console.log("Datos del usuario:", userData) // <-- Aquí lo agregas
            setProfile(userData)
            setProfile(userData)
        } catch (err) {
            console.error("Error al obtener el perfil:", err)
            setError(err instanceof Error ? err.message : "Error al cargar el perfil")
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading && !profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile information...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            <DashboardHeader/>
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Cabecera */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                        <p className="text-gray-600">Your Account Information</p>
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-start">
                            <div className="flex-shrink-0 mt-0.5">
                                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Contenido del Perfil */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start mb-8">
                                <div className="bg-gray-200 rounded-full h-24 w-24 flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
                                    <User className="h-12 w-12 text-gray-500" />
                                </div>
                                <div className="text-center sm:text-left">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile?.completeName}</h2>
                                    <p className="text-gray-600 mb-2">@{profile?.username}</p>
                                    <div className="flex items-center justify-center sm:justify-start">
                                        <Shield className="h-4 w-4 text-teal-600 mr-1" />
                                        <span className="text-sm font-medium text-teal-600">{profile?.role}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start">
                                        <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{profile?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Username</p>
                                            <p className="font-medium">{profile?.username}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6 mt-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-500">User ID</p>
                                        <p className="font-medium">{profile?.userID}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Role</p>
                                        <p className="font-medium">{profile?.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enlaces Rápidos */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            to="/bookings"
                            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow flex items-center"
                        >
                            <Calendar className="h-5 w-5 text-teal-600 mr-3" />
                            <span className="font-medium">My Bookings</span>
                        </Link>
                        <Link
                            to="/change-password"
                            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow flex items-center"
                        >
                            <Lock className="h-5 w-5 text-teal-600 mr-3" />
                            <span className="font-medium">Change Password</span>
                        </Link>
                        <Link
                            to="/notifications"
                            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow flex items-center"
                        >
                            <Bell className="h-5 w-5 text-teal-600 mr-3" />
                            <span className="font-medium">Notificaciones</span>
                        </Link>
                    </div>

                    {/* Volver a Inicio */}
                    <div className="mt-8">
                        <Link to="/dashboard" className="text-gray-600 hover:text-gray-800 font-medium flex items-center">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
