"use client"

import { useState, useEffect } from "react"
import { Calendar, Users, Filter, Wifi, Car, Coffee, Dumbbell, AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { fetchRooms, fetchAvailableRooms, type Room, createBookingDTO, getCurrentUser, type BookingDTO, getRoomImagesFromSupabase } from "../services/api"
import { useNavigate } from "react-router-dom"
import DashboardHeader from "../components/DashboardHeader"

interface BookingFilters {
    roomType: string
    maxPrice: number
    minGuests: number
}

const BookingPage = () => {
    const [checkInDate, setCheckInDate] = useState<string>("")
    const [checkOutDate, setCheckOutDate] = useState<string>("")
    const [guests, setGuests] = useState<number>(1)
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState<BookingFilters>({
        roomType: "All",
        maxPrice: 1000,
        minGuests: 1,
    })
    const [rooms, setRooms] = useState<Room[]>([])
    const [filteredRooms, setFilteredRooms] = useState<Room[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [hasSearched, setHasSearched] = useState(false)
    const navigate = useNavigate();

    // Obtener las imágenes de Supabase una sola vez
    const roomImages = getRoomImagesFromSupabase();

    useEffect(() => {
        // Cargar todas las habitaciones al montar el componente
        loadAllRooms()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [rooms, filters])

    const loadAllRooms = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await fetchRooms()
            console.log("Rooms loaded:", data) // Para debugging
            setRooms(data)
        } catch (error) {
            console.error("Error loading rooms:", error)
            setError(error instanceof Error ? error.message : "Failed to load rooms")
        } finally {
            setIsLoading(false)
        }
    }

    const getAmenityIcon = (amenityName: string) => {
        switch (amenityName.toLowerCase()) {
            case "free wifi":
            case "wifi":
                return <Wifi className="h-4 w-4" />
            case "parking":
                return <Car className="h-4 w-4" />
            case "coffee machine":
            case "coffee":
                return <Coffee className="h-4 w-4" />
            case "fitness center":
            case "gym":
                return <Dumbbell className="h-4 w-4" />
            default:
                return <span className="text-sm">•</span>
        }
    }

    const searchRooms = async () => {
        if (!checkInDate || !checkOutDate) {
            alert("Please select check-in and check-out dates")
            return
        }

        if (new Date(checkInDate) >= new Date(checkOutDate)) {
            alert("Check-out date must be after check-in date")
            return
        }

        setIsLoading(true)
        setError(null)
        setHasSearched(true)

        try {
            // Intentar buscar habitaciones disponibles con fechas específicas
            const availableRooms = await fetchAvailableRooms(checkInDate, checkOutDate, guests)
            setRooms(availableRooms)
        } catch (error) {
            console.error("Error searching rooms:", error)
            // Si falla la búsqueda específica, cargar todas las habitaciones
            console.log("Falling back to all rooms...")
            await loadAllRooms()
        } finally {
            setIsLoading(false)
        }
    }

    const applyFilters = () => {
        const filtered = rooms.filter((room) => {
            const typeMatch = filters.roomType === "All" || room.roomType === filters.roomType.toUpperCase()
            const priceMatch = room.pricePerNight <= filters.maxPrice
            const guestMatch = room.capacity >= filters.minGuests
            const availableMatch = room.available
            return typeMatch && priceMatch && guestMatch && availableMatch
        })
        setFilteredRooms(filtered)
    }

    const calculateNights = () => {
        if (!checkInDate || !checkOutDate) return 0
        const start = new Date(checkInDate)
        const end = new Date(checkOutDate)
        const diffTime = Math.abs(end.getTime() - start.getTime())
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const getTodayDate = () => {
        const today = new Date()
        return today.toISOString().split("T")[0]
    }

    const getTomorrowDate = () => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        return tomorrow.toISOString().split("T")[0]
    }

    // Función para reservar una habitación
    const handleBookNow = async (room: Room) => {
        if (!checkInDate || !checkOutDate) {
            alert("Por favor selecciona fechas de check-in y check-out.")
            return
        }
        if (new Date(checkInDate) >= new Date(checkOutDate)) {
            alert("La fecha de check-out debe ser posterior a la de check-in.")
            return
        }
        try {
            const user = await getCurrentUser()
            const nights = calculateNights()
            const totalPrice = room.pricePerNight * nights
            const booking: BookingDTO = {
                room,
                customerName: user.userID,
                startDate: checkInDate,
                endDate: checkOutDate,
                confirmed: false,
                notes: "",
                totalPrice,
            }
            const createdBooking = await createBookingDTO(booking)
            if (createdBooking && createdBooking.id) {
                navigate(`/payment/${createdBooking.id}`)
            } else {
                alert("No se pudo obtener el ID de la reserva.")
            }
        } catch (error) {
            alert("Error al crear la reserva: " + (error instanceof Error ? error.message : error))
        }
    }

    return (
        <div className="booking-page">
            <DashboardHeader />
            {/* Search Section */}
            <section className="py-8 bg-gray-50">
                <div className="container">
                    <h1 className="text-4xl font-bold mb-8 text-center">Book Your Perfect Room</h1>

                    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="flex flex-col">
                                <label className="mb-2 font-medium text-gray-700">Check-in Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={checkInDate}
                                        onChange={(e) => setCheckInDate(e.target.value)}
                                        min={getTodayDate()}
                                        className="form-input pl-10"
                                    />
                                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-2 font-medium text-gray-700">Check-out Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={checkOutDate}
                                        onChange={(e) => setCheckOutDate(e.target.value)}
                                        min={checkInDate || getTomorrowDate()}
                                        className="form-input pl-10"
                                    />
                                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-2 font-medium text-gray-700">Guests</label>
                                <div className="relative">
                                    <select
                                        value={guests}
                                        onChange={(e) => setGuests(Number(e.target.value))}
                                        className="form-input pl-10"
                                    >
                                        {[1, 2, 3, 4, 5, 6].map((num) => (
                                            <option key={num} value={num}>
                                                {num} {num === 1 ? "Guest" : "Guests"}
                                            </option>
                                        ))}
                                    </select>
                                    <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={searchRooms}
                                    disabled={isLoading}
                                    className={`btn btn-primary w-full ${isLoading ? "disabled" : ""}`}
                                >
                                    {isLoading ? "Searching..." : "Search Rooms"}
                                </button>
                            </div>
                        </div>

                        {checkInDate && checkOutDate && (
                            <div className="text-center text-gray-600">
                                <p>
                                    {calculateNights()} {calculateNights() === 1 ? "night" : "nights"} • {guests}{" "}
                                    {guests === 1 ? "guest" : "guests"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Error Display */}
            {error && (
                <section className="py-4">
                    <div className="container">
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                                <div>
                                    <p className="text-red-800 font-medium">Error loading rooms</p>
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                                <button onClick={loadAllRooms} className="ml-auto btn btn-secondary text-sm">
                                    Retry
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Loading State */}
            {isLoading && (
                <section className="py-8">
                    <div className="container">
                        <div className="max-w-6xl mx-auto text-center">
                            <div className="animate-pulse">
                                <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="bg-white rounded-lg shadow-md p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="h-48 bg-gray-200 rounded-lg"></div>
                                                <div className="space-y-3">
                                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="h-8 bg-gray-200 rounded w-1/2 ml-auto"></div>
                                                    <div className="h-10 bg-gray-200 rounded"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Filters and Results */}
            {!isLoading && rooms.length > 0 && (
                <section className="py-8">
                    <div className="container">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Filters Sidebar */}
                            <div className="lg:w-1/4">
                                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold">Filters</h3>
                                        <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden btn btn-secondary">
                                            <Filter className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
                                        {/* Room Type Filter */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Room Type</label>
                                            <select
                                                value={filters.roomType}
                                                onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}
                                                className="form-input"
                                            >
                                                <option value="All">All Types</option>
                                                <option value="STANDARD">Standard</option>
                                                <option value="DELUXE">Deluxe</option>
                                                <option value="SUITE">Suite</option>
                                            </select>
                                        </div>

                                        {/* Price Range Filter */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Max Price per Night: ${filters.maxPrice}</label>
                                            <input
                                                type="range"
                                                min="100"
                                                max="1000"
                                                step="50"
                                                value={filters.maxPrice}
                                                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                                                className="w-full"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>$100</span>
                                                <span>$1000</span>
                                            </div>
                                        </div>

                                        {/* Minimum Guests Filter */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Minimum Guests</label>
                                            <select
                                                value={filters.minGuests}
                                                onChange={(e) => setFilters({ ...filters, minGuests: Number(e.target.value) })}
                                                className="form-input"
                                            >
                                                {[1, 2, 3, 4, 5, 6].map((num) => (
                                                    <option key={num} value={num}>
                                                        {num}+ {num === 1 ? "Guest" : "Guests"}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Reset Filters */}
                                        <button
                                            onClick={() => setFilters({ roomType: "All", maxPrice: 1000, minGuests: 1 })}
                                            className="btn btn-secondary w-full"
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Room Results */}
                            <div className="lg:w-3/4">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">
                                        {hasSearched ? "Available Rooms" : "All Rooms"} ({filteredRooms.length})
                                    </h2>
                                    {hasSearched && checkInDate && checkOutDate && (
                                        <div className="text-sm text-gray-600">
                                            Showing results for {checkInDate} to {checkOutDate}
                                        </div>
                                    )}
                                </div>

                                {filteredRooms.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-lg">
                                            {hasSearched
                                                ? "No rooms available for your selected dates. Try different dates or adjust your filters."
                                                : "No rooms match your criteria. Try adjusting your filters."}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {filteredRooms.map((room) => {
                                            // Seleccionar imagen según el tipo de habitación (roomType.name)
                                            let imageUrl = "/placeholder.svg";
                                            const type = room.roomType && typeof room.roomType === "object" ? room.roomType.name?.toUpperCase() : room.roomType?.toUpperCase();
                                            if (type === "DELUXE") imageUrl = roomImages[0];
                                            else if (type === "STANDARD") imageUrl = roomImages[1];
                                            else if (type === "SUITE") imageUrl = roomImages[2];
                                            return (
                                                <div key={room.id} className="card">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                                                        {/* Room Image */}
                                                        <div className="md:col-span-1">
                                                            <img
                                                                src={imageUrl}
                                                                alt={room.roomType && typeof room.roomType === "object" ? room.roomType.name : room.roomType}
                                                                className="w-full h-48 object-cover rounded-lg"
                                                            />
                                                        </div>
                                                        {/* Room Details */}
                                                        <div className="md:col-span-1">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full">
                                                                    {room.roomType && typeof room.roomType === "object" ? room.roomType.name : room.roomType}
                                                                </span>
                                                                {room.available && (
                                                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                                        Available
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h3 className="text-xl font-bold mb-2">Room {room.roomNumber}</h3>
                                                            <p className="text-gray-600 mb-4">{room.description}</p>
                                                            <div className="mb-4">
                                                                <p className="text-sm font-medium mb-2">Amenities:</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {room.amenities.slice(0, 4).map((amenity, index) => (
                                                                        <div key={index} className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                                                                            {getAmenityIcon(amenity.name)}
                                                                            <span className="ml-1">{amenity.name}</span>
                                                                        </div>
                                                                    ))}
                                                                    {room.amenities.length > 4 && (
                                                                        <span className="text-xs text-gray-500">+{room.amenities.length - 4} more</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-gray-600">Max Guests: {room.capacity}</p>
                                                            {room.size && <p className="text-sm text-gray-600">Size: {room.size} m²</p>}
                                                            {room.bedType && <p className="text-sm text-gray-600">Bed: {room.bedType}</p>}
                                                        </div>
                                                        {/* Pricing and Booking */}
                                                        <div className="md:col-span-1 flex flex-col justify-between">
                                                            <div className="text-right">
                                                                <div className="text-3xl font-bold text-teal-600 mb-1">${room.pricePerNight}</div>
                                                                <div className="text-sm text-gray-500 mb-4">per night</div>
                                                                {calculateNights() > 0 && (
                                                                    <div className="text-lg font-medium mb-4">
                                                                        Total: ${room.pricePerNight * calculateNights()}
                                                                        <div className="text-sm text-gray-500">
                                                                            for {calculateNights()} {calculateNights() === 1 ? "night" : "nights"}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="space-y-2">
                                                                <button
                                                                    className="btn btn-primary w-full text-center"
                                                                    onClick={() => handleBookNow(room)}
                                                                >
                                                                    Book Now
                                                                </button>
                                                                <Link to={`/payment`} className="btn btn-secondary w-full text-center">
                                                                    View Details
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* No rooms loaded state */}
            {!isLoading && rooms.length === 0 && !error && (
                <section className="py-12">
                    <div className="container">
                        <div className="max-w-6xl mx-auto text-center">
                            <p className="text-gray-500 text-lg mb-4">No rooms available at the moment.</p>
                            <button onClick={loadAllRooms} className="btn btn-primary">
                                Refresh Rooms
                            </button>
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}

export default BookingPage
