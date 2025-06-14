"use client"

import type React from "react"

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
    CreditCard,
    Calendar,
    Users,
    Lock,
    Check,
    ArrowLeft,
} from "lucide-react"
import { isAuthenticated, removeToken, getCurrentUser, type UserProfile, fetchBookingById, type BookingDTO, createPaymentDTO, type PaymentDTO, getRoomImagesFromSupabase } from "../services/api"
import DashboardHeader from "@/components/DashboardHeader.tsx";


const PaymentPage = () => {
    const navigate = useNavigate()
    const { bookingId } = useParams()
    const [showDropdown, setShowDropdown] = useState<boolean>(false)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false)
    const [bookingData, setBookingData] = useState<BookingDTO | null>(null)
    const [isLoadingBooking, setIsLoadingBooking] = useState<boolean>(true)

    // Payment form state
    const [paymentOption, setPaymentOption] = useState<"prepaid" | "partial" | "postpaid">("prepaid")
    const [cardData, setCardData] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardholderName: "",
        billingAddress: "",
        city: "",
        zipCode: "",
        country: "",
    })
    const [isProcessing, setIsProcessing] = useState(false)
    const [paymentSuccess, setPaymentSuccess] = useState(false)

    // Obtener imágenes de Supabase para los tipos de habitación
    const roomImages = getRoomImagesFromSupabase();

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
            }
        }

        checkAuthAndGetUser()
    }, [navigate])

    useEffect(() => {
        const fetchBooking = async () => {
            if (!bookingId) return
            setIsLoadingBooking(true)
            try {
                const booking = await fetchBookingById(Number(bookingId))
                setBookingData(booking)
                console.log(booking)
            } catch (error) {
                console.error("Error fetching booking data:", error)
            } finally {
                setIsLoadingBooking(false)
            }
        }
        fetchBooking()
    }, [bookingId])

    const handleLogout = () => {
        removeToken()
        setUserProfile(null)
        setShowDropdown(false)
        navigate("/")
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setCardData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const getPaymentAmount = () => {
        switch (paymentOption) {
            case "prepaid":
                return bookingData?.totalPrice || 0
            case "partial":
                return (bookingData?.totalPrice || 0) * 0.5 // 50% partial payment
            case "postpaid":
                return (bookingData?.totalPrice || 0) * 0.15 // 15% deposit for postpaid
            default:
                return bookingData?.totalPrice || 0
        }
    }

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)

        try {
            if (!bookingData) throw new Error("No booking data available")
            const payment: PaymentDTO = {
                bookingID: bookingData.id,
                amount: bookingData.totalPrice,
                amountPaid: getPaymentAmount(),
                paymentType: paymentOption,
                paymentDate: new Date().toISOString().split("T")[0],
                cardNumber: cardData.cardNumber,
                userid: userProfile?.userID ? String(userProfile.userID) : "0"
            }
            console.log("Payment enviado al backend:", payment);
            setPaymentSuccess(true)
            const paymentResponse = await createPaymentDTO(payment)
            const paymentId = paymentResponse.paymentID
            navigate(`/confirmation/${paymentId}`)
        } catch (error) {
            console.error("Payment error:", error)
        } finally {
            setIsProcessing(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    if (paymentSuccess) {
        return (
            <div className="flex flex-col min-h-screen">
                {/* Header del Dashboard */}
                <DashboardHeader/>

                {/* Payment Success */}
                <div className="flex-1 bg-gray-50 py-12">
                    <div className="container mx-auto px-4">
                        <div className="max-w-2xl mx-auto text-center">
                            <div className="bg-white rounded-lg shadow-lg p-8">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Check className="h-10 w-10 text-green-600" />
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
                                <p className="text-gray-600 mb-6">
                                    Your payment has been processed successfully. You will receive a confirmation email shortly.
                                </p>

                                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-2">Payment Details</h3>
                                    <div className="text-left space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Booking ID:</span>
                                            <span className="font-medium">#{bookingData?.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Amount Paid:</span>
                                            <span className="font-medium">${getPaymentAmount().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Payment Type:</span>
                                            <span className="font-medium capitalize">{paymentOption}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        to="/my-bookings"
                                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        View My Bookings
                                    </Link>
                                    <Link
                                        to="/dashboard"
                                        className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        Back to Dashboard
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header del Dashboard */}
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
                                to="/rooms"
                                className="text-teal-100 hover:bg-white hover:bg-opacity-10 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                            >
                                <BookOpen className="h-4 w-4" />
                                <span>Browse Rooms</span>
                            </Link>
                            <Link
                                to="/my-bookings"
                                className="text-teal-100 hover:bg-white hover:bg-opacity-10 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                            >
                                <BookOpen className="h-4 w-4" />
                                <span>My Bookings</span>
                            </Link>
                            <span className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 whitespace-nowrap flex-shrink-0">
                <CreditCard className="h-4 w-4" />
                <span>Payment</span>
              </span>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Payment Content */}
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

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Booking Summary */}
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Summary</h2>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{bookingData?.room?.roomType?.name || bookingData?.roomName}</h3>
                                    <p className="text-gray-600">Booking ID: #{bookingData?.id}</p>
                                </div>

                                <div className="flex items-start space-x-4 mb-6">
                                    {/* Seleccionar imagen según el tipo de habitación */}
                                    {(() => {
                                        let imageUrl = "/placeholder.svg";
                                        const type = bookingData?.room?.roomType?.toString().toUpperCase();
                                        if (type === "DELUXE") imageUrl = roomImages[0];
                                        else if (type === "STANDARD") imageUrl = roomImages[1];
                                        else if (type === "SUITE") imageUrl = roomImages[2];
                                        return (
                                            <img
                                                src={imageUrl}
                                                alt={type || "Room"}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        );
                                    })()}
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-5 w-5 text-teal-600" />
                                        <div>
                                            <p className="font-medium">Check-in</p>
                                            <p className="text-gray-600">{formatDate(bookingData?.startDate || "")}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-5 w-5 text-teal-600" />
                                        <div>
                                            <p className="font-medium">Check-out</p>
                                            <p className="text-gray-600">{formatDate(bookingData?.endDate|| "")}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Users className="h-5 w-5 text-teal-600" />
                                        <div>
                                            <p className="font-medium">Guests</p>
                                            <p className="text-gray-600">{bookingData?.room.capacity} guests</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold text-gray-900 mb-3">Price Breakdown</h4>
                                    <div className="space-y-2">
                                        <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                                            <span>Total</span>
                                            <span>${(bookingData?.totalPrice || 0).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Form */}
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>

                                {/* Payment Options */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Option</h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="paymentOption"
                                                value="prepaid"
                                                checked={paymentOption === "prepaid"}
                                                onChange={(e) => setPaymentOption(e.target.value as "prepaid")}
                                                className="text-teal-600"
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">Pay Full Amount</span>
                                                    <span className="font-semibold text-teal-600">${(bookingData?.totalPrice || 0).toFixed(2)}</span>
                                                </div>
                                                <p className="text-sm text-gray-600">Pay the full amount now</p>
                                            </div>
                                        </label>

                                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="paymentOption"
                                                value="partial"
                                                checked={paymentOption === "partial"}
                                                onChange={(e) => setPaymentOption(e.target.value as "partial")}
                                                className="text-teal-600"
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">Partial Payment (50%)</span>
                                                    <span className="font-semibold text-teal-600">
                            ${((bookingData?.totalPrice || 0) * 0.5).toFixed(2)}
                          </span>
                                                </div>
                                                <p className="text-sm text-gray-600">Pay 50% now, rest at hotel</p>
                                            </div>
                                        </label>

                                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="paymentOption"
                                                value="postpaid"
                                                checked={paymentOption === "postpaid"}
                                                onChange={(e) => setPaymentOption(e.target.value as "postpaid")}
                                                className="text-teal-600"
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">Pay at Hotel</span>
                                                    <span className="font-semibold text-teal-600">
                                                        ${ ((bookingData?.totalPrice || 0) * 0.15).toFixed(2) }
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">Reserva ahora, paga el 15% como anticipo y el resto al check-in</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Card Form - Only show if not postpaid */}
                                {paymentOption !== "null" && (
                                    <form onSubmit={handlePayment} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                                            <input
                                                type="text"
                                                name="cardholderName"
                                                value={cardData.cardholderName}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="cardNumber"
                                                    value={cardData.cardNumber}
                                                    onChange={handleInputChange}
                                                    className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                                    placeholder="1234 5678 9012 3456"
                                                    maxLength={19}
                                                    required
                                                />
                                                <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                                                <input
                                                    type="text"
                                                    name="expiryDate"
                                                    value={cardData.expiryDate}
                                                    onChange={handleInputChange}
                                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                                    placeholder="MM/YY"
                                                    maxLength={5}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="cvv"
                                                        value={cardData.cvv}
                                                        onChange={handleInputChange}
                                                        className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                                        placeholder="123"
                                                        maxLength={4}
                                                        required
                                                    />
                                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Billing Address</label>
                                            <input
                                                type="text"
                                                name="billingAddress"
                                                value={cardData.billingAddress}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                                placeholder="123 Main Street"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={cardData.city}
                                                    onChange={handleInputChange}
                                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                                    placeholder="New York"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                                                <input
                                                    type="text"
                                                    name="zipCode"
                                                    value={cardData.zipCode}
                                                    onChange={handleInputChange}
                                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                                    placeholder="10001"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                            <select
                                                name="country"
                                                value={cardData.country}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                                required
                                            >
                                                <option value="">Select Country</option>
                                                <option value="US">United States</option>
                                                <option value="CA">Canada</option>
                                                <option value="UK">United Kingdom</option>
                                                <option value="DE">Germany</option>
                                                <option value="FR">France</option>
                                                <option value="ES">Spain</option>
                                                <option value="IT">Italy</option>
                                            </select>
                                        </div>

                                        <div className="border-t pt-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-lg font-semibold">Amount to Pay:</span>
                                                <span className="text-2xl font-bold text-teal-600">${getPaymentAmount().toFixed(2)}</span>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isProcessing}
                                                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                        Processing Payment...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock className="h-5 w-5 mr-2" />
                                                        Complete Payment
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Postpaid confirmation */}
                                {paymentOption === "postpaid" && (
                                    <div className="border-t pt-4">
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                            <h4 className="font-semibold text-blue-900 mb-2">Pay at Hotel</h4>
                                            <p className="text-blue-800 text-sm">
                                                Your reservation will be confirmed. You can pay the full amount at check-in using cash or card.
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setPaymentSuccess(true)}
                                            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center"
                                        >
                                            <Check className="h-5 w-5 mr-2" />
                                            Confirm Reservation
                                        </button>
                                    </div>
                                )}

                                {/* Security Notice */}
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Lock className="h-4 w-4" />
                                        <span>Your payment information is secure and encrypted</span>
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

export default PaymentPage
