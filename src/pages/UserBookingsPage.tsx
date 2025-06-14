"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, FileText, ChevronDown, ChevronUp, User, Mail, Phone, Clock, MapPin, CreditCard } from "lucide-react"
import DashboardHeader from "@/components/DashboardHeader.tsx"
import {
    fetchBookingsByUserId,
    getCurrentUser,
    Booking,
    getBookingPdf,
    BookingDTO,
    getRoomImagesFromSupabase,
    calculateRefund,
    RefundDTO,
    fetchPaymentById,
    fetchPaymentByBookingId
} from "../services/api"

interface UserProfile {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    address?: string
    memberSince: string
}

const UserBookingsPage = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [bookings, setBookings] = useState<BookingDTO[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [expandedBooking, setExpandedBooking] = useState<number | null>(null)
    const [generatingReport, setGeneratingReport] = useState<number | null>(null)
    const [showRefundModal, setShowRefundModal] = useState<{ visible: boolean, bookingId?: number, amount?: number }>({ visible: false })
    const [refundLoading, setRefundLoading] = useState(false)
    const [refundError, setRefundError] = useState<string | null>(null)
    const [refundResult, setRefundResult] = useState<RefundDTO | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                // Obtener el usuario actual
                const user = await getCurrentUser()
                setProfile({
                    memberSince: "", // Si tienes este campo en el backend, asígnalo aquí
                    id: user.userID,
                    firstName: user.completeName.split(" ")[0] || "",
                    lastName: user.completeName.split(" ").slice(1).join(" ") || "",
                    email: user.email,
                    phone: "", // Ajusta si tienes el campo phone en el backend
                    address: "" // Ajusta si tienes el campo address en el backend
                })
                // Traer las reservas por userID
                const bookings = await fetchBookingsByUserId(user.userID)
                // Adaptar los datos del backend a la UI
                setBookings(bookings)
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

    const roomImages = getRoomImagesFromSupabase();

    const handleGenerateReport = async (bookingId: number) => {
        try {
            setGeneratingReport(bookingId)
            // Obtener el PDF real desde el backend
            const pdfBlob = await getBookingPdf(bookingId)
            const url = window.URL.createObjectURL(pdfBlob)
            const a = document.createElement('a')
            a.href = url
            a.download = `booking_${bookingId}_report.pdf`
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.error("Error generating report:", err)
            alert("Failed to generate report. Please try again later.")
        } finally {
            setGeneratingReport(null)
        }
    }

    const handleRefundClick = (bookingId: number, amount: number) => {
        setShowRefundModal({ visible: true, bookingId, amount });
    };

    const handleRefundConfirm = async () => {
        setRefundLoading(true);
        setRefundError(null);
        setRefundResult(null);
        try {
            const booking = bookings.find(b => b.id === showRefundModal.bookingId);
            if (!booking) throw new Error("Booking not found");
            let paymentID = "";
            if ((booking as any).paymentID) paymentID = (booking as any).paymentID;
            else {
                try {
                    const payment = await fetchPaymentByBookingId(booking.id);
                    paymentID = payment.paymentID;
                } catch (e) {
                    throw new Error("No payment found for this booking");
                }
            }
            const refundDTO: RefundDTO = {
                refundID: null,
                paymentID,
                amount: null,
                refundDate: new Date().toISOString().split('T')[0],
            };
            const result = await calculateRefund(refundDTO);
            setRefundResult(result);
            setShowRefundModal({ visible: false });
            // Actualizar el estado de la reserva a cancelled
            setTimeout(() => setRefundResult(result), 0);
        } catch (err: any) {
            setRefundError(err.message || "Error requesting refund");
        } finally {
            setRefundLoading(false);
        }
    };

    const handleRefundCancel = () => {
        setShowRefundModal({ visible: false });
    };

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
            case "Confirmed":
                return "status-confirmed"
            case "Completed":
                return "status-completed"
            case "Cancelled":
                return "status-cancelled"
            case "pending":
                return "status-pending"
            default:
                return ""
        }
    }

    const getStatusText = (status: boolean) => {
        if (status === true)
            return "Confirmed"
        else {
            return "Cancelled"
        }
    }

    const renderStatusBadge = (booking: BookingDTO) => (
        <div className={`status-badge ${getStatusColor(getStatusText(booking.confirmed))}`}>
            {getStatusText(booking.confirmed)}
        </div>
    );

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
            <DashboardHeader />
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
                            </div>
                        </div>
                        <div className="profile-details">
                            <div className="contact-item">
                                <Mail />
                                <span>{profile.email}</span>
                            </div>
                            <div className="contact-item">
                                <User />
                                <span>{profile.id}</span>
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
                            <button className="btn btn-primary" onClick={() => navigate("/rooms")}>Browse Rooms</button>
                        </div>
                    ) : (
                        <div className="bookings-list">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="booking-card">
                                    {/* Booking Header */}
                                    <div className="booking-header" onClick={() => toggleBookingDetails(booking.id)}>
                                        <div className="booking-main-info">
                                            <div className="room-image">
                                                {(() => {
                                                    let imageUrl = "/placeholder.svg";
                                                    const type = booking.room.roomType.toString().toUpperCase();
                                                    if (type === "DELUXE") imageUrl = roomImages[0];
                                                    else if (type === "STANDARD") imageUrl = roomImages[1];
                                                    else if (type === "SUITE") imageUrl = roomImages[2];

                                                   return(
                                                <img
                                                    src={imageUrl}
                                                    alt={type}
                                                    className="w-full h-40 object-cover rounded-lg"
                                                />
                                                    )
                                                })()}
                                            </div>
                                            <div className="booking-details">
                                                <h3>{booking.room.roomType.toString().toUpperCase()}</h3>
                                                <p className="room-type">{booking.room && booking.room.roomType ? booking.room.roomType.name : ""} Room</p>
                                                <div className="booking-dates">
                                                    <Calendar />
                                                    <span>
                                                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="booking-summary">
                                            {renderStatusBadge(booking)}
                                            <div className="price-info">
                                                <span className="total-price">${booking.totalPrice}</span>
                                                <span className="price-detail">{booking.startDate && booking.endDate ? Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 1} nights</span>
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
                                                        <span className="value">{formatDate(booking.createdAt || booking.startDate)}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="label">Check-in:</span>
                                                        <span className="value">{formatDate(booking.startDate)}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="label">Check-out:</span>
                                                        <span className="value">{formatDate(booking.endDate)}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="label">Duration:</span>
                                                        <span className="value">{booking.startDate && booking.endDate ? Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 1} nights</span>
                                                    </div>
                                                </div>

                                                <div className="details-section">
                                                    <h4>Payment Details</h4>
                                                    <div className="detail-item">
                                                        <span className="label">Room Rate:</span>
                                                        <span className="value">${booking.room ? booking.room.pricePerNight : 0}/night</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="label">Total Amount:</span>
                                                        <span className="value total-amount">${booking.totalPrice}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="label">Payment Method:</span>
                                                        <span className="value">
                                                            <CreditCard />
                                                            <p>Debit Card</p>
                                                            {/* Si tienes el método de pago, muéstralo aquí */}
                                                        </span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="label">Status:</span>
                                                        <span className={`value status-text ${renderStatusBadge(booking)}`}>
                                                            {"Confirmed"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

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
                                                <button
                                                    className="btn btn-outline"
                                                    onClick={() => handleRefundClick(booking.id, booking.totalPrice)}
                                                >
                                                    Refund
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Refund Modal */}
            {showRefundModal.visible && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', minWidth: '320px', maxWidth: '90vw', boxShadow: '0 2px 16px rgba(0,0,0,0.2)' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Are you sure you want to request a refund?</h2>
                        <p style={{ marginBottom: '1rem' }}>This will result in the loss of your reservation.</p>
                        {refundError && <p style={{color: 'red'}}>{refundError}</p>}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button className="btn btn-outline" onClick={handleRefundCancel} disabled={refundLoading}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleRefundConfirm} disabled={refundLoading}>
                                {refundLoading ? 'Processing...' : 'Confirm Refund'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Refund Result Modal */}
            {refundResult && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', minWidth: '320px', maxWidth: '90vw', boxShadow: '0 2px 16px rgba(0,0,0,0.2)' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Refund Processed</h2>
                        <p style={{ marginBottom: '1rem' }}>Your refund has been processed successfully.</p>
                        <p><b>Refund ID:</b> {refundResult.refundID || 'N/A'}</p>
                        <p><b>Payment ID:</b> {refundResult.paymentID}</p>
                        <p><b>Amount:</b> ${refundResult.amount}</p>
                        <p><b>Date:</b> {refundResult.refundDate}</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                            <button className="btn btn-primary" onClick={() => setRefundResult(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserBookingsPage
