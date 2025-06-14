"use client"

import { useState, useEffect } from "react"
import { Calendar, Search, MapPin, Star, User, LogOut, BookOpen, Bell, ChevronDown, Settings, Home } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import {
    isAuthenticated,
    removeToken,
    getCurrentUser,
    type UserProfile,
    getRoomImagesFromSupabase
} from "../services/api"
import DashboardHeader from "../components/DashboardHeader"

const DashboardPage = () => {
    const navigate = useNavigate()
    const [checkInDate, setCheckInDate] = useState<string>("")
    const [checkOutDate, setCheckOutDate] = useState<string>("")
    const [guests, setGuests] = useState<number>(1)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [showDropdown, setShowDropdown] = useState<boolean>(false)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false)

    useEffect(() => {
        // Verificar autenticación y obtener información del usuario
        const checkAuthAndGetUser = async () => {
            const authStatus = isAuthenticated()

            if (!authStatus) {
                navigate("/login")
                return
            }

            setIsLoggedIn(authStatus)
            setIsLoadingUser(true)

            try {
                const profile = await getCurrentUser()
                setUserProfile(profile)
            } catch (error) {
                console.error("Error getting user profile:", error)
                handleLogout()
            } finally {
                setIsLoadingUser(false)
            }
        }

        checkAuthAndGetUser()
    }, [navigate])

    const handleLogout = () => {
        removeToken()
        setIsLoggedIn(false)
        setUserProfile(null)
        setShowDropdown(false)
        navigate("/")
    }

    const roomImages = getRoomImagesFromSupabase();

    const featuredRooms = [
        {
            id: 1,
            name: "Deluxe",
            description: "Spacious suite with ocean view",
            image: roomImages[0],
            rating: 4.8,
        },
        {
            id: 2,
            name: "Suite",
            description: "Elegant room with city skyline view",
            image: roomImages[2],
            rating: 4.6,
        },
        {
            id: 3,
            name: "Standard",
            description: "Perfect for families with children",
            image: roomImages[1],
            rating: 4.7,
        },
    ]

    const amenities = [
        { name: "Free WiFi", icon: "🌐" },
        { name: "Swimming Pool", icon: "🏊" },
        { name: "Fitness Center", icon: "💪" },
        { name: "Spa & Wellness", icon: "💆" },
        { name: "Restaurant", icon: "🍽️" },
        { name: "24/7 Room Service", icon: "🛎️" },
    ]

    return (
        <div className="flex flex-col">
            {/* HEADER MEJORADO PARA DASHBOARD */}
            <DashboardHeader/>
            {/* Welcome Section - NUEVO */}
            <section className="bg-white py-8 border-b">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back, {userProfile?.completeName?.split(" ")[0] || "Guest"}! 👋
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Ready to plan your next luxury experience? Let's find you the perfect room.
                        </p>
                    </div>
                </div>
            </section>

            {/* EL RESTO ES IGUAL AL HOMEPAGE ORIGINAL */}

            {/* Hero Section */}
            <section
                className="relative h-[600px] bg-cover bg-center"
                style={{ backgroundImage: "url('/placeholder.svg?height=600&width=1200')" }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Experience Luxury & Comfort</h1>
                    <p className="text-xl md:text-2xl mb-8">Your perfect getaway starts here</p>
                    <Link
                        to="/booking"
                        className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full font-medium text-lg transition-colors"
                    >
                        Book Now
                    </Link>
                </div>
            </section>

            {/* Featured Rooms */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-2 text-center">Featured Rooms</h2>
                    <p className="text-gray-600 mb-12 text-center">Discover our most popular accommodations</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredRooms.map((room) => (
                            <div
                                key={room.id}
                                className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105"
                            >
                                <img src={room.image || "/placeholder.svg"} alt={room.name} className="w-full h-48 object-cover" />
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-xl font-bold">{room.name}</h3>
                                        <div className="flex items-center">
                                            <Star className="h-5 w-5 text-yellow-500 fill-current" />
                                            <span className="ml-1 font-medium">{room.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4">{room.description}</p>
                                    <div className="flex justify-between items-center">
                                        <Link
                                            to={`/rooms/${room.id}`}
                                            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md font-medium"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            to="/rooms"
                            className="inline-block border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-8 py-3 rounded-full font-medium transition-colors"
                        >
                            View All Rooms
                        </Link>
                    </div>
                </div>
            </section>

            {/* Amenities */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-2 text-center">Hotel Amenities</h2>
                    <p className="text-gray-600 mb-12 text-center">Enjoy our world-class facilities and services</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {amenities.map((amenity, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
                            >
                                <div className="text-4xl mb-3">{amenity.icon}</div>
                                <h3 className="font-medium">{amenity.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-2 text-center">What Our Guests Say</h2>
                    <p className="text-gray-600 mb-12 text-center">Experiences from our valued guests</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center mb-4">
                                <img
                                    src="/placeholder.svg?height=50&width=50"
                                    alt="Guest"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="ml-4">
                                    <h4 className="font-bold">Sarah Johnson</h4>
                                    <div className="flex text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-current" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">
                                "The service was impeccable and the room exceeded our expectations. The ocean view was breathtaking.
                                We'll definitely be back!"
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center mb-4">
                                <img
                                    src="/placeholder.svg?height=50&width=50"
                                    alt="Guest"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="ml-4">
                                    <h4 className="font-bold">Michael Chen</h4>
                                    <div className="flex text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-current" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">
                                "From check-in to check-out, everything was perfect. The staff was friendly and attentive. The spa
                                facilities were amazing!"
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center mb-4">
                                <img
                                    src="/placeholder.svg?height=50&width=50"
                                    alt="Guest"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="ml-4">
                                    <h4 className="font-bold">Emma Rodriguez</h4>
                                    <div className="flex text-yellow-500">
                                        {[...Array(4)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-current" />
                                        ))}
                                        <Star className="h-4 w-4 text-gray-300" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">
                                "The location is perfect - close to all major attractions. The room was spacious and clean. The
                                breakfast buffet had amazing variety!"
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-teal-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready for an Unforgettable Stay?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Book your room today and experience luxury, comfort, and exceptional service.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/booking"
                            className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-3 rounded-full font-medium text-lg transition-colors"
                        >
                            Book Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Location */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Our Location</h2>
                            <p className="text-gray-600 mb-6">
                                Located in the heart of the city, our hotel offers easy access to popular attractions, shopping centers,
                                and restaurants.
                            </p>
                            <div className="flex items-start mb-4">
                                <MapPin className="h-6 w-6 text-teal-600 mr-2 mt-1" />
                                <p className="text-gray-700">123 Luxury Avenue, Downtown, City, Country</p>
                            </div>
                            <Link
                                to="/contact"
                                className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md font-medium"
                            >
                                Get Directions
                            </Link>
                        </div>
                        <div className="h-[400px] bg-gray-200 rounded-lg">
                            {/* This would be replaced with an actual map component */}
                            <div className="w-full h-full flex items-center justify-center">
                                <p className="text-gray-500">Map will be displayed here</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default DashboardPage
