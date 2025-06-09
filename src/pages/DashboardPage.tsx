"use client"

import { useState, useEffect } from "react"
import { Calendar, Search, MapPin, Star, User, LogOut, BookOpen, Bell, ChevronDown, Settings, Home } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { isAuthenticated, removeToken, getCurrentUser, type UserProfile } from "../services/api"

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

    const featuredRooms = [
        {
            id: 1,
            name: "Deluxe Suite",
            description: "Spacious suite with ocean view",
            price: 299,
            image: "/placeholder.svg?height=300&width=400",
            rating: 4.8,
        },
        {
            id: 2,
            name: "Executive Room",
            description: "Elegant room with city skyline view",
            price: 199,
            image: "/placeholder.svg?height=300&width=400",
            rating: 4.6,
        },
        {
            id: 3,
            name: "Family Suite",
            description: "Perfect for families with children",
            price: 349,
            image: "/placeholder.svg?height=300&width=400",
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
            <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white sticky top-0 z-50 shadow-lg">
                <div className="container mx-auto px-4">
                    {/* Main Header Row */}
                    <div className="flex items-center justify-between h-16">
                        {/* Left Side - Logo */}
                        <Link to="/dashboard" className="flex items-center space-x-2">
                            <div className="text-2xl font-bold">
                                <span className="text-white">Luxury</span>
                                <span className="text-teal-200">Hotel</span>
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-sm font-medium text-teal-200 bg-teal-500 px-2 py-1 rounded-full">Dashboard</span>
                            </div>
                        </Link>

                        {/* Right Side - Notifications & User */}
                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <Link
                                to="/notifications"
                                className="relative p-2 hover:bg-teal-500 rounded-full transition-colors duration-200"
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  3
                </span>
                            </Link>

                            {/* User Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center space-x-3 bg-teal-500 hover:bg-teal-400 rounded-lg py-2 px-3 transition-colors duration-200 min-w-0"
                                >
                                    <div className="bg-white rounded-full p-1 flex-shrink-0">
                                        <User className="h-4 w-4 text-teal-600" />
                                    </div>
                                    <div className="text-left min-w-0 hidden sm:block">
                                        <p className="font-medium text-sm truncate">
                                            {isLoadingUser ? "Loading..." : userProfile?.completeName || "User"}
                                        </p>
                                        <p className="text-xs text-teal-200 truncate">{userProfile?.role || "Guest"}</p>
                                    </div>
                                    <ChevronDown className="h-4 w-4 flex-shrink-0" />
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900 truncate">{userProfile?.completeName}</p>
                                            <p className="text-xs text-gray-500 truncate">@{userProfile?.username}</p>
                                            <p className="text-xs text-gray-500 truncate">{userProfile?.email}</p>
                                        </div>

                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center transition-colors"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <User className="h-4 w-4 mr-3 text-gray-500" />
                                            My Profile
                                        </Link>

                                        <Link
                                            to="/my-bookings"
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center transition-colors"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <BookOpen className="h-4 w-4 mr-3 text-gray-500" />
                                            My Bookings
                                        </Link>

                                        <Link
                                            to="/settings"
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center transition-colors"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <Settings className="h-4 w-4 mr-3 text-gray-500" />
                                            Settings
                                        </Link>

                                        <hr className="my-2" />

                                        <Link
                                            to="/"
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center transition-colors"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <Home className="h-4 w-4 mr-3 text-gray-500" />
                                            Public Site
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center transition-colors"
                                        >

                                            <LogOut className="h-4 w-4 mr-3" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs Row */}
                    <div className="border-t border-teal-500 border-opacity-30">
                        <nav className="flex space-x-1 py-2 overflow-x-auto">
                            <Link
                                to="/dashboard"
                                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 whitespace-nowrap flex-shrink-0"
                            >
                                <Home className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                to="/rooms"
                                className="text-teal-100 hover:bg-white hover:bg-opacity-10 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                            >
                                <Search className="h-4 w-4" />
                                <span>Browse Rooms</span>
                            </Link>
                            <Link
                                to="/my-bookings"
                                className="text-teal-100 hover:bg-white hover:bg-opacity-10 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                            >
                                <BookOpen className="h-4 w-4" />
                                <span>My Bookings</span>
                            </Link>
                            <Link
                                to="/profile"
                                className="text-teal-100 hover:bg-white hover:bg-opacity-10 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                            >
                                <User className="h-4 w-4" />
                                <span>Profile</span>
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

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
                        to="/rooms"
                        className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full font-medium text-lg transition-colors"
                    >
                        Book Now
                    </Link>
                </div>
            </section>

            {/* Booking Form */}
            <section className="bg-white py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 -mt-20 relative z-10">
                        <h2 className="text-2xl font-bold mb-6 text-center">Find Your Perfect Room</h2>
                        <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="flex flex-col">
                                <label className="mb-2 font-medium">Check-in</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={checkInDate}
                                        onChange={(e) => setCheckInDate(e.target.value)}
                                        className="w-full p-3 border rounded-md pl-10"
                                    />
                                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 font-medium">Check-out</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={checkOutDate}
                                        onChange={(e) => setCheckOutDate(e.target.value)}
                                        className="w-full p-3 border rounded-md pl-10"
                                    />
                                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 font-medium">Guests</label>
                                <select
                                    value={guests}
                                    onChange={(e) => setGuests(Number.parseInt(e.target.value))}
                                    className="w-full p-3 border rounded-md"
                                >
                                    {[1, 2, 3, 4, 5, 6].map((num) => (
                                        <option key={num} value={num}>
                                            {num} {num === 1 ? "Guest" : "Guests"}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="w-full bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-md font-medium flex items-center justify-center"
                                >
                                    <Search className="mr-2 h-5 w-5" />
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
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
                    <span className="text-xl font-bold text-teal-600">
                      ${room.price}
                        <span className="text-sm text-gray-500">/night</span>
                    </span>
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
                            to="/rooms"
                            className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-3 rounded-full font-medium text-lg transition-colors"
                        >
                            Book Now
                        </Link>
                        <Link
                            to="/contact"
                            className="border-2 border-white text-white hover:bg-white hover:text-teal-600 px-8 py-3 rounded-full font-medium text-lg transition-colors"
                        >
                            Contact Us
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
