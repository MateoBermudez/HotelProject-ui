"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, FileText, ChevronDown, ChevronUp, User, Mail, Phone, Clock, MapPin, CreditCard } from "lucide-react"

interface UserProfile {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string
    address?: string
    memberSince: string
}

interface Booking {
    id: number
    roomName: string
    roomType: string
    checkInDate: string
    checkOutDate: string
    guests: number
    totalPrice: number
    status: "confirmed" | "completed" | "cancelled" | "pending"
    paymentMethod: string
    bookingDate: string
    specialRequests?: string
    roomImage: string
    nights: number
    pricePerNight: number
}

const UserBookingsPage = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [expandedBooking, setExpandedBooking] = useState<number | null>(null)
    const [generatingReport, setGeneratingReport] = useState<number | null>(null)
    const navigate = useNavigate()

    // Mock data for development
    const mockProfile: UserProfile = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main Street, New York, NY 10001",
        memberSince: "2023-01-15",
    }

    const mockBookings: Booking[] = [
        {
            id: 1,
            roomName: "Deluxe Ocean Suite",
            roomType: "Suite",
            checkInDate: "2024-03-15",
            checkOutDate: "2024-03-18",
            guests: 2,
            totalPrice: 1197,
            status: "confirmed",
            paymentMethod: "Visa ending in 4532",
            bookingDate: "2024-02-20",
            specialRequests: "Late checkout requested, ocean view preferred",
            roomImage: "/placeholder.svg?height=200&width=300",
            nights: 3,
            pricePerNight: 399,
        },
        {
            id: 2,
            roomName: "Executive Business Room",
            roomType: "Business",
            checkInDate: "2024-02-10",
            checkOutDate: "2024-02-12",
            guests: 1,
            totalPrice: 598,
            status: "completed",
            paymentMethod: "Mastercard ending in 8765",
            bookingDate: "2024-01-15",
            specialRequests: "Early check-in, quiet room for business calls",
            roomImage: "/placeholder.svg?height=200&width=300",
            nights: 2,
            pricePerNight: 299,
        },
        {
            id: 3,
            roomName: "Family Suite",
            roomType: "Family",
            checkInDate: "2024-01-05",
            checkOutDate: "2024-01-08",
            guests: 4,
            totalPrice: 1047,
            status: "completed",
            paymentMethod: "Visa ending in 1234",
            bookingDate: "2023-12-10",
            specialRequests: "Extra towels for children, crib needed",
            roomImage: "/placeholder.svg?height=200&width=300",
            nights: 3,
            pricePerNight: 349,
        },
        {
            id: 4,
            roomName: "Standard Room",
            roomType: "Standard",
            checkInDate: "2023-12-20",
            checkOutDate: "2023-12-22",
            guests: 2,
            totalPrice: 398,
            status: "cancelled",
            paymentMethod: "Visa ending in 4532",
            bookingDate: "2023-11-25",
            roomImage: "/placeholder.svg?height=200&width=300",
            nights: 2,
            pricePerNight: 199,
        },
    ]

    useEffect(() => {
        // Simulate API call
        const fetchData = async () => {
            setLoading(true)
            try {
                // Simulate network delay
                await new Promise((resolve) => setTimeout(resolve, 1000))

                setProfile(mockProfile)
                setBookings(mockBookings)
                setError(null)
            } catch (err) {
                console.error("Error fetching user data:", err)
                setError("Failed to load your information. Please try again later.")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const toggleBookingDetails = (bookingId: number) => {
        setExpandedBooking(expandedBooking === bookingId ? null : bookingId)
    }

    const handleGenerateReport = async (bookingId: number) => {
        try {
            setGeneratingReport(bookingId)

            // Simulate report generation
            await new Promise((resolve) => setTimeout(resolve, 2000))

            // Create a mock PDF download
            const element = document.createElement("a")
            element.href = "data:text/plain;charset=utf-8,Booking Report for Booking ID: " + bookingId
            element.download = `booking-${bookingId}-report.pdf`
            document.body.appendChild(element)
            element.click()
            document.body.removeChild(element)
        } catch (err) {
            console.error("Error generating report:", err)
            alert("Failed to generate report. Please try again later.")
        } finally {
            setGeneratingReport(null)
        }
    }

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
        }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed":
                return "status-confirmed"
            case "completed":
                return "status-completed"
            case "cancelled":
                return "status-cancelled"
            case "pending":
                return "status-pending"
            default:
                return ""
        }
    }

    const getStatusText = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1)
    }

    if (loading) {
        return (
            <div className="user-bookings-page">
                <div className="container py-20">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <h2>Loading your bookings...</h2>
                        <p>Please wait while we fetch your reservation details.</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="user-bookings-page">
                <div className="container py-20">
                    <div className="error-container">
                        <h2>Oops! Something went wrong</h2>
                        <p>{error}</p>
                        <button className="btn btn-primary" onClick={() => window.location.reload()}>
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="user-bookings-page">
            <div className="container py-20">
                {/* Page Header */}
                <div className="page-header">
                    <h1>My Bookings</h1>
                    <p>Manage your reservations and download reports</p>
                </div>

                {/* User Profile Card */}
                {profile && (
                    <div className="profile-card">
                        <div className="profile-header">
                            <div className="profile-avatar">
                                <User />
                            </div>
                            <div className="profile-info">
                                <h2>
                                    {profile.firstName} {profile.lastName}
                                </h2>
                                <p className="member-since">Member since {formatDate(profile.memberSince)}</p>
                            </div>
                        </div>
                        <div className="profile-details">
                            <div className="contact-item">
                                <Mail />
                                <span>{profile.email}</span>
                            </div>
                            <div className="contact-item">
                                <Phone />
                                <span>{profile.phone}</span>
                            </div>
                            {profile.address && (
                                <div className="contact-item">
                                    <MapPin />
                                    <span>{profile.address}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Bookings Section */}
                <div className="bookings-section">
                    <div className="section-header">
                        <h2>Your Reservations</h2>
                        <p>Total bookings: {bookings.length}</p>
                    </div>

                    {bookings.length === 0 ? (
                        <div className="empty-state">
                            <Calendar />
                            <h3>No bookings found</h3>
                            <p>You haven't made any reservations yet.</p>
                            <button className="btn btn-primary" onClick={() => navigate("/rooms")}>
                                Browse Rooms
                            </button>
                        </div>
                    ) : (
                        <div className="bookings-list">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="booking-card">
                                    {/* Booking Header */}
                                    <div className="booking-header" onClick={() => toggleBookingDetails(booking.id)}>
                                        <div className="booking-main-info">
                                            <div className="room-image">
                                                <img src={booking.roomImage || "/placeholder.svg"} alt={booking.roomName} />
                                            </div>
                                            <div className="booking-details">
                                                <h3>{booking.roomName}</h3>
                                                <p className="room-type">{booking.roomType} Room</p>
                                                <div className="booking-dates">
                                                    <Calendar />
                                                    <span>
                            {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                          </span>
                                                </div>
                                                <div className="booking-guests">
                                                    <User />
                                                    <span>
                            {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
                          </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="booking-summary">
                                            <div className={`status-badge ${getStatusColor(booking.status)}`}>
                                                {getStatusText(booking.status)}
                                            </div>
                                            <div className="price-info">
                                                <span className="total-price">${booking.totalPrice}</span>
                                                <span className="price-detail">{booking.nights} nights</span>
                                            </div>
                                            <div className="expand-indicator">
                                                {expandedBooking === booking.id ? <ChevronUp /> : <ChevronDown />}
                                                <span>{expandedBooking === booking.id ? "Hide" : "Show"} Details</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedBooking === booking.id && (
                                        <div className="booking-expanded">
                                            <div className="details-grid">
                                                <div className="details-section">
                                                    <h4>Reservation Information</h4>
                                                    <div className="detail-item">
                                                        <span className="label">Booking ID:</span>
                                                        <span className="value">#{booking.id.toString().padStart(6, "0")}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="label">Booking Date:</span>
                                                        <span className="value">{formatDate(booking.bookingDate)}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="label">Check-in:</span>
                                                        <span className="value">{formatDate(booking.checkInDate)}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="label">Check-out:</span>
                                                        <span className="value">{formatDate(booking.checkOutDate)}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="label">Duration:</span>
                                                        <span className="value">{booking.nights} nights</span>
                                                    </div>
                                                </div>

                                                <div className="details-section">
                                                    <h4>Payment Details</h4>
                                                    <div className="detail-item">
                                                        <span className="label">Room Rate:</span>
                                                        <span className="value">${booking.pricePerNight}/night</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="label">Total Amount:</span>
                                                        <span className="value total-amount">${booking.totalPrice}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="label">Payment Method:</span>
                                                        <span className="value">
                              <CreditCard />
                                                            {booking.paymentMethod}
                            </span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="label">Status:</span>
                                                        <span className={`value status-text ${getStatusColor(booking.status)}`}>
                              {getStatusText(booking.status)}
                            </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {booking.specialRequests && (
                                                <div className="special-requests">
                                                    <h4>Special Requests</h4>
                                                    <p>{booking.specialRequests}</p>
                                                </div>
                                            )}

                                            <div className="booking-actions">
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() => handleGenerateReport(booking.id)}
                                                    disabled={generatingReport === booking.id}
                                                >
                                                    {generatingReport === booking.id ? (
                                                        <>
                                                            <Clock className="animate-spin" />
                                                            Generating Report...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FileText />
                                                            Download Report
                                                        </>
                                                    )}
                                                </button>
                                                {booking.status === "confirmed" && <button className="btn btn-outline">Modify Booking</button>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserBookingsPage
