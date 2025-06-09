"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
    User,
    LogOut,
    BookOpen,
    Bell,
    ChevronDown,
    Settings,
    Home,
    Calendar,
    Users,
    Check,
    ArrowLeft,
    MapPin,
    Star,
    Wifi,
    Car,
    Coffee,
    Utensils,
    Dumbbell,
    Waves,
    CreditCard,
    Clock,
    FileText,
    Download,
    Share2,
    Mail,
} from "lucide-react"
import { isAuthenticated, removeToken, getCurrentUser, type UserProfile } from "../services/api"

interface RoomDTO {
    id: number
    name: string
    description: string
    price: number
    capacity: number
    size: number
    bedType: string
    amenities: string[]
    images: string[]
    available: boolean
}

interface BookingDTO {
    id: number
    room: RoomDTO
    customerName: string
    startDate: string
    endDate: string
    confirmed: boolean
    notes: string
    createdAt: string
    totalPrice: number
}

const BookingConfirmationPage = () => {
    const navigate = useNavigate()
    const { bookingId } = useParams()
    const [showDropdown, setShowDropdown] = useState<boolean>(false)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    // Example booking data based on BookingDTO
    const bookingData: BookingDTO = {
        id: Number.parseInt(bookingId || "12345"),
        room: {
            id: 1,
            name: "Deluxe Ocean Suite",
            description:
                "Spacious suite with panoramic ocean views, private balcony, and luxury amenities. Perfect for a romantic getaway or special occasion.",
            price: 299.0,
            capacity: 2,
            size: 65,
            bedType: "King Size Bed",
            amenities: [
                "Free WiFi",
                "Ocean View",
                "Private Balcony",
                "Mini Bar",
                "Room Service",
                "Air Conditioning",
                "Safe",
                "Flat Screen TV",
            ],
            images: [
                "/placeholder.svg?height=400&width=600",
                "/placeholder.svg?height=300&width=400",
                "/placeholder.svg?height=300&width=400",
            ],
            available: true,
        },
        customerName: "John Smith",
        startDate: "2025-06-15",
        endDate: "2025-06-20",
        confirmed: true,
        notes: "Celebrating anniversary. Please arrange flowers and champagne in room.",
        createdAt: "2025-06-08",
        totalPrice: 1584.7,
    }

    // Payment information
    const paymentData = {
        paymentId: "PAY-ABC123456",
        paymentMethod: "Visa ending in 4532",
        paymentDate: "2025-06-08",
        paymentStatus: "Completed",
        transactionId: "TXN-789012345",
    }

    useEffect(() => {
        const checkAuthAndGetUser = async () => {
            const authStatus = isAuthenticated()

            if (!authStatus) {
                navigate("/login")
                return
            }

            setIsLoadingUser(true)
            try {
                const profile = await getCurrentUser()
                setUserProfile(profile)
            } catch (error) {
                console.error("Error getting user profile:", error)
                handleLogout()
            } finally {
                setIsLoadingUser(false)
                setIsLoading(false)
            }
        }

        checkAuthAndGetUser()
    }, [navigate])

    const handleLogout = () => {
        removeToken()
        setUserProfile(null)
        setShowDropdown(false)
        navigate("/")
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const calculateNights = () => {
        const start = new Date(bookingData.startDate)
        const end = new Date(bookingData.endDate)
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    }

    const calculateBreakdown = () => {
        const nights = calculateNights()
        const roomTotal = bookingData.room.price * nights
        const taxes = roomTotal * 0.15 // 15% taxes
        const serviceFee = 25.0
        return {
            nights,
            roomTotal,
            taxes,
            serviceFee,
            total: bookingData.totalPrice,
        }
    }

    const breakdown = calculateBreakdown()

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading booking confirmation...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Dashboard Header */}
            <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white sticky top-0 z-50 shadow-lg">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/dashboard" className="flex items-center space-x-2">
                            <div className="text-2xl font-bold">
                                <span className="text-white">Luxury</span>
                                <span className="text-teal-200">Hotel</span>
                            </div>
                            <span className="text-sm font-medium text-teal-200 bg-teal-500 px-2 py-1 rounded-full">Dashboard</span>
                        </Link>

                        <div className="flex items-center space-x-4">
                            <Link
                                to="/notifications"
                                className="relative p-2 hover:bg-teal-500 rounded-full transition-colors duration-200"
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  3
                </span>
                            </Link>

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

                    <div className="border-t border-teal-500 border-opacity-30">
                        <nav className="flex space-x-1 py-2 overflow-x-auto">
                            <Link
                                to="/dashboard"
                                className="text-teal-100 hover:bg-white hover:bg-opacity-10 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                            >
                                <Home className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                to="/my-bookings"
                                className="text-teal-100 hover:bg-white hover:bg-opacity-10 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                            >
                                <BookOpen className="h-4 w-4" />
                                <span>My Bookings</span>
                            </Link>
                            <span className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 whitespace-nowrap flex-shrink-0">
                <Check className="h-4 w-4" />
                <span>Confirmation</span>
              </span>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Confirmation Content */}
            <div className="flex-1 bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Back Button */}
                        <div className="mb-6">
                            <Link to="/my-bookings" className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to My Bookings
                            </Link>
                        </div>

                        {/* Success Header */}
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="h-10 w-10 text-green-600" />
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
                                <p className="text-gray-600 text-lg mb-4">
                                    Your reservation has been successfully confirmed. We look forward to welcoming you!
                                </p>
                                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                                    <span>Booking ID: #{bookingData.id}</span>
                                    <span>•</span>
                                    <span>Payment ID: {paymentData.paymentId}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Booking Information */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Room Details */}
                                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                    <div className="relative">
                                        <img
                                            src={bookingData.room.images[0] || "/placeholder.svg"}
                                            alt={bookingData.room.name}
                                            className="w-full h-64 object-cover"
                                        />
                                        <div className="absolute top-4 left-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {bookingData.confirmed ? "Confirmed" : "Pending"}
                      </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{bookingData.room.name}</h2>
                                                <p className="text-gray-600">{bookingData.room.description}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center">
                                                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                                                    <span className="ml-1 font-medium">4.8</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                <Users className="h-6 w-6 text-teal-600 mx-auto mb-1" />
                                                <p className="text-sm text-gray-600">Capacity</p>
                                                <p className="font-semibold">{bookingData.room.capacity} Guests</p>
                                            </div>
                                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                <MapPin className="h-6 w-6 text-teal-600 mx-auto mb-1" />
                                                <p className="text-sm text-gray-600">Size</p>
                                                <p className="font-semibold">{bookingData.room.size} m²</p>
                                            </div>
                                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                <Calendar className="h-6 w-6 text-teal-600 mx-auto mb-1" />
                                                <p className="text-sm text-gray-600">Bed Type</p>
                                                <p className="font-semibold">{bookingData.room.bedType}</p>
                                            </div>
                                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                <CreditCard className="h-6 w-6 text-teal-600 mx-auto mb-1" />
                                                <p className="text-sm text-gray-600">Price/Night</p>
                                                <p className="font-semibold">${bookingData.room.price}</p>
                                            </div>
                                        </div>

                                        {/* Room Amenities */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Room Amenities</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {bookingData.room.amenities.map((amenity, index) => (
                                                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                                        <span>{amenity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Details */}
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Details</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Guest Information</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Customer Name:</span>
                                                    <span className="font-medium">{bookingData.customerName}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Booking ID:</span>
                                                    <span className="font-medium">#{bookingData.id}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Created At:</span>
                                                    <span className="font-medium">{formatDateTime(bookingData.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Stay Information</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Check-in:</span>
                                                    <span className="font-medium">{formatDate(bookingData.startDate)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Check-out:</span>
                                                    <span className="font-medium">{formatDate(bookingData.endDate)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Duration:</span>
                                                    <span className="font-medium">{breakdown.nights} nights</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Special Notes */}
                                    {bookingData.notes && (
                                        <div className="mt-6 pt-6 border-t">
                                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                                <FileText className="h-5 w-5 mr-2 text-teal-600" />
                                                Special Notes
                                            </h4>
                                            <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{bookingData.notes}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Payment Information */}
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Payment Details</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Payment ID:</span>
                                                    <span className="font-medium">{paymentData.paymentId}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Transaction ID:</span>
                                                    <span className="font-medium">{paymentData.transactionId}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Payment Method:</span>
                                                    <span className="font-medium">{paymentData.paymentMethod}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Payment Date:</span>
                                                    <span className="font-medium">{formatDate(paymentData.paymentDate)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Status:</span>
                                                    <span className="font-medium text-green-600">{paymentData.paymentStatus}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Price Breakdown</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                          <span className="text-gray-600">
                            ${bookingData.room.price} × {breakdown.nights} nights:
                          </span>
                                                    <span className="font-medium">${breakdown.roomTotal.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Taxes & fees:</span>
                                                    <span className="font-medium">${breakdown.taxes.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Service fee:</span>
                                                    <span className="font-medium">${breakdown.serviceFee.toFixed(2)}</span>
                                                </div>
                                                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                                    <span>Total Amount:</span>
                                                    <span className="text-teal-600">${bookingData.totalPrice.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Quick Actions */}
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                                    <div className="space-y-3">
                                        <button className="w-full flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-colors">
                                            <Download className="h-4 w-4" />
                                            <span>Download Receipt</span>
                                        </button>
                                        <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg transition-colors">
                                            <Mail className="h-4 w-4" />
                                            <span>Email Confirmation</span>
                                        </button>
                                        <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg transition-colors">
                                            <Share2 className="h-4 w-4" />
                                            <span>Share Booking</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Check-in Information */}
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Check-in Information</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-4 w-4 text-teal-600" />
                                            <span className="text-gray-600">Check-in: 3:00 PM</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-4 w-4 text-teal-600" />
                                            <span className="text-gray-600">Check-out: 11:00 AM</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="h-4 w-4 text-teal-600" />
                                            <span className="text-gray-600">123 Luxury Avenue, Downtown</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
                                    <div className="space-y-3 text-sm">
                                        <p className="text-gray-600">Contact our customer service team:</p>
                                        <div className="space-y-2">
                                            <p className="font-medium">📞 +1 (555) 123-4567</p>
                                            <p className="font-medium">✉️ support@luxuryhotel.com</p>
                                            <p className="text-gray-500">Available 24/7</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Hotel Amenities */}
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Hotel Amenities</h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Wifi className="h-4 w-4 text-teal-600" />
                                            <span>Free WiFi</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Car className="h-4 w-4 text-teal-600" />
                                            <span>Parking</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Waves className="h-4 w-4 text-teal-600" />
                                            <span>Pool</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Dumbbell className="h-4 w-4 text-teal-600" />
                                            <span>Fitness</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Utensils className="h-4 w-4 text-teal-600" />
                                            <span>Restaurant</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Coffee className="h-4 w-4 text-teal-600" />
                                            <span>Room Service</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingConfirmationPage
