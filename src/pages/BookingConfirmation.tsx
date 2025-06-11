"use client"

import React, { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
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
import {
    isAuthenticated,
    removeToken,
    getCurrentUser,
    type UserProfile,
    fetchPaymentById,
    fetchBookingById,
    type PaymentDTO,
    type BookingDTO,
    getBookingPdf,
    getRoomImagesFromSupabase,
} from "../services/api"
import DashboardHeader from "@/components/DashboardHeader.tsx";
import Footer from "@/components/Footer";

const BookingConfirmationPage = () => {
    const navigate = useNavigate()
    const { paymentId } = useParams()
    const [showDropdown, setShowDropdown] = useState<boolean>(false)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [paymentData, setPaymentData] = useState<PaymentDTO | null>(null)
    const [bookingData, setBookingData] = useState<BookingDTO | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Función para enmascarar el número de tarjeta
    const maskCardNumber = (cardNumber: string) => {
        if (!cardNumber) return ''
        const visibleDigits = 4
        const maskedLength = cardNumber.length - visibleDigits
        const masked = '*'.repeat(maskedLength > 0 ? maskedLength : 0)
        return masked + cardNumber.slice(-visibleDigits)
    }

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
        const fetchData = async () => {
            if (!paymentId) return
            setIsLoading(true)
            setError(null)
            try {
                const payment = await fetchPaymentById(paymentId as string)
                setPaymentData(payment)
                if (payment.bookingID) {
                    const booking = await fetchBookingById(payment.bookingID)
                    setBookingData(booking)
                } else {
                    setError("No se encontró el bookingID en el pago.")
                }
            } catch (err: any) {
                setError(err.message || "Error al obtener datos de pago o reserva.")
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [paymentId])

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

    const formatDateTime = (dateString: string | undefined) => {
        if (!dateString) return ''
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const calculateNights = () => {
        if (!bookingData) return 0
        const start = new Date(bookingData.startDate)
        const end = new Date(bookingData.endDate)
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    }

    const calculateBreakdown = () => {
        if (!bookingData) return { nights: 0, roomTotal: 0, taxes: 0, serviceFee: 0, total: 0 }
        const nights = calculateNights()
        const roomTotal = bookingData.room.pricePerNight * nights
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

    const handleDownloadReceipt = async () => {
        if (!bookingData?.id) return;
        try {
            const pdfBlob = await getBookingPdf(bookingData.id);
            const url = window.URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `booking_${bookingData.id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            setError("No se pudo descargar el recibo PDF. " + (err.message || ""));
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

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded shadow text-center">
                    <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
                    <p className="text-gray-700">{error}</p>
                    <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-teal-600 text-white rounded">Volver al inicio</button>
                </div>
            </div>
        )
    }

    if (!bookingData || !paymentData) {
        return null
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Dashboard Header */}
            <DashboardHeader/>

            {/* Confirmation Content */}
            <div className="flex-1 bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Back Button */}
                        <div className="mb-6">
                            <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
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
                                    <span>Payment ID: {paymentData.paymentID}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Booking Information */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Room Details */}
                                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                    <div className="relative">
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
                                                        className="w-full h-40 object-cover rounded-lg"
                                                    />
                                                );
                                            })()}
                                        </div>
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

                                        {/* Room Amenities */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Room Amenities</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {bookingData.room.amenities.map((amenity, index) => (
                                                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                                        <span>{amenity.name}</span>
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
                                                    <span className="font-medium">{bookingData.createdAt}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Stay Information</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Check-in:</span>
                                                    <span className="font-medium">{bookingData.startDate}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Check-out:</span>
                                                    <span className="font-medium">{bookingData.endDate}</span>
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
                                                    <span className="font-medium">{paymentData.paymentID}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Payment Method:</span>
                                                    <span className="font-medium">{paymentData.paymentType}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Payment Card:</span>
                                                    <span className="font-medium">{maskCardNumber(paymentData.cardNumber)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Payment Date:</span>
                                                    <span className="font-medium">{formatDate(paymentData.paymentDate)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Status:</span>
                                                    <span className="font-medium text-green-600">{"CONFIRMED"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Price Breakdown</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                          <span className="text-gray-600">
                            ${bookingData.room.pricePerNight} × {breakdown.nights} nights:
                          </span>
                                                    <span className="font-medium">${breakdown.roomTotal.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">What you payed:</span>
                                                    <span className="font-medium">${paymentData.amountPaid.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">What you owe:</span>
                                                    <span className="font-medium">${(paymentData.amount - paymentData.amountPaid).toFixed(2)}</span>
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
                                        <button onClick={handleDownloadReceipt} className="w-full flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-colors">
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
                                            <p className="text-gray
                                            -600">Available 24/7 for any assistance you may need.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default BookingConfirmationPage
