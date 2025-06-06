"use client"

import { useState, useEffect } from "react"
import { Calendar, Users, Filter, Star, Wifi, Car, Coffee, Dumbbell } from "lucide-react"
import { Link } from "react-router-dom"

interface Room {
    id: number
    name: string
    type: "Standard" | "Deluxe" | "Suite"
    description: string
    price: number
    image: string
    rating: number
    maxGuests: number
    amenities: string[]
    available: boolean
}

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

    // Mock room data - in real app, this would come from your Spring Boot API
    const mockRooms: Room[] = [
        {
            id: 1,
            name: "Ocean View Standard",
            type: "Standard",
            description: "Comfortable room with beautiful ocean views and modern amenities.",
            price: 150,
            image: "/placeholder.svg?height=300&width=400",
            rating: 4.2,
            maxGuests: 2,
            amenities: ["Free WiFi", "Ocean View", "Air Conditioning", "Mini Bar"],
            available: true,
        },
        {
            id: 2,
            name: "City Standard Room",
            type: "Standard",
            description: "Modern standard room with city skyline views.",
            price: 120,
            image: "/placeholder.svg?height=300&width=400",
            rating: 4.0,
            maxGuests: 2,
            amenities: ["Free WiFi", "City View", "Air Conditioning"],
            available: true,
        },
        {
            id: 3,
            name: "Deluxe Garden Room",
            type: "Deluxe",
            description: "Spacious deluxe room with garden views and premium amenities.",
            price: 250,
            image: "/placeholder.svg?height=300&width=400",
            rating: 4.5,
            maxGuests: 3,
            amenities: ["Free WiFi", "Garden View", "Balcony", "Mini Bar", "Coffee Machine"],
            available: true,
        },
        {
            id: 4,
            name: "Deluxe Ocean Front",
            type: "Deluxe",
            description: "Premium deluxe room with direct ocean front views.",
            price: 320,
            image: "/placeholder.svg?height=300&width=400",
            rating: 4.7,
            maxGuests: 3,
            amenities: ["Free WiFi", "Ocean Front", "Balcony", "Mini Bar", "Room Service"],
            available: false,
        },
        {
            id: 5,
            name: "Presidential Suite",
            type: "Suite",
            description: "Luxurious presidential suite with panoramic views and exclusive amenities.",
            price: 800,
            image: "/placeholder.svg?height=300&width=400",
            rating: 4.9,
            maxGuests: 6,
            amenities: ["Free WiFi", "Panoramic View", "Living Room", "Kitchen", "Butler Service", "Private Balcony"],
            available: true,
        },
        {
            id: 6,
            name: "Executive Suite",
            type: "Suite",
            description: "Elegant executive suite perfect for business travelers.",
            price: 500,
            image: "/placeholder.svg?height=300&width=400",
            rating: 4.6,
            maxGuests: 4,
            amenities: ["Free WiFi", "Office Space", "Living Room", "Mini Bar", "Concierge Service"],
            available: true,
        },
        {
            id: 7,
            name: "Family Suite",
            type: "Suite",
            description: "Spacious family suite with separate bedrooms and kid-friendly amenities.",
            price: 450,
            image: "/placeholder.svg?height=300&width=400",
            rating: 4.4,
            maxGuests: 6,
            amenities: ["Free WiFi", "Separate Bedrooms", "Kids Area", "Kitchen", "Family Games"],
            available: true,
        },
        {
            id: 8,
            name: "Deluxe Business Room",
            type: "Deluxe",
            description: "Business-oriented deluxe room with work desk and meeting facilities.",
            price: 280,
            image: "/placeholder.svg?height=300&width=400",
            rating: 4.3,
            maxGuests: 2,
            amenities: ["Free WiFi", "Work Desk", "Business Center Access", "Mini Bar"],
            available: true,
        },
    ]

    const getAmenityIcon = (amenity: string) => {
        switch (amenity.toLowerCase()) {
            case "free wifi":
                return <Wifi className="h-4 w-4" />
            case "parking":
                return <Car className="h-4 w-4" />
            case "coffee machine":
                return <Coffee className="h-4 w-4" />
            case "fitness center":
                return <Dumbbell className="h-4 w-4" />
            default:
                return <span className="text-sm">•</span>
        }
    }

    const searchRooms = () => {
        if (!checkInDate || !checkOutDate) {
            alert("Please select check-in and check-out dates")
            return
        }

        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setRooms(mockRooms)
            setIsLoading(false)
        }, 1000)
    }

    const applyFilters = () => {
        const filtered = rooms.filter((room) => {
            const typeMatch = filters.roomType === "All" || room.type === filters.roomType
            const priceMatch = room.price <= filters.maxPrice
            const guestMatch = room.maxGuests >= filters.minGuests
            const availableMatch = room.available

            return typeMatch && priceMatch && guestMatch && availableMatch
        })

        setFilteredRooms(filtered)
    }

    useEffect(() => {
        applyFilters()
    }, [rooms, filters])

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

    return (
        <div className="booking-page">
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

            {/* Filters and Results */}
            {rooms.length > 0 && (
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
                                                <option value="Standard">Standard</option>
                                                <option value="Deluxe">Deluxe</option>
                                                <option value="Suite">Suite</option>
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
                                    <h2 className="text-2xl font-bold">Available Rooms ({filteredRooms.length})</h2>
                                    <div className="text-sm text-gray-600">
                                        Showing results for {checkInDate} to {checkOutDate}
                                    </div>
                                </div>

                                {filteredRooms.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-lg">No rooms match your criteria. Try adjusting your filters.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {filteredRooms.map((room) => (
                                            <div key={room.id} className="card">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                                                    {/* Room Image */}
                                                    <div className="md:col-span-1">
                                                        <img
                                                            src={room.image || "/placeholder.svg"}
                                                            alt={room.name}
                                                            className="w-full h-48 object-cover rounded-lg"
                                                        />
                                                    </div>

                                                    {/* Room Details */}
                                                    <div className="md:col-span-1">
                                                        <div className="flex items-center justify-between mb-2">
                              <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full">
                                {room.type}
                              </span>
                                                            <div className="flex items-center">
                                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                                <span className="ml-1 text-sm font-medium">{room.rating}</span>
                                                            </div>
                                                        </div>

                                                        <h3 className="text-xl font-bold mb-2">{room.name}</h3>
                                                        <p className="text-gray-600 mb-4">{room.description}</p>

                                                        <div className="mb-4">
                                                            <p className="text-sm font-medium mb-2">Amenities:</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {room.amenities.slice(0, 4).map((amenity, index) => (
                                                                    <div key={index} className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                                                                        {getAmenityIcon(amenity)}
                                                                        <span className="ml-1">{amenity}</span>
                                                                    </div>
                                                                ))}
                                                                {room.amenities.length > 4 && (
                                                                    <span className="text-xs text-gray-500">+{room.amenities.length - 4} more</span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <p className="text-sm text-gray-600">Max Guests: {room.maxGuests}</p>
                                                    </div>

                                                    {/* Pricing and Booking */}
                                                    <div className="md:col-span-1 flex flex-col justify-between">
                                                        <div className="text-right">
                                                            <div className="text-3xl font-bold text-teal-600 mb-1">${room.price}</div>
                                                            <div className="text-sm text-gray-500 mb-4">per night</div>

                                                            {calculateNights() > 0 && (
                                                                <div className="text-lg font-medium mb-4">
                                                                    Total: ${room.price * calculateNights()}
                                                                    <div className="text-sm text-gray-500">
                                                                        for {calculateNights()} {calculateNights() === 1 ? "night" : "nights"}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Link
                                                                to={`/booking/room/${room.id}?checkin=${checkInDate}&checkout=${checkOutDate}&guests=${guests}`}
                                                                className="btn btn-primary w-full text-center"
                                                            >
                                                                Book Now
                                                            </Link>
                                                            <Link to={`/rooms/${room.id}`} className="btn btn-secondary w-full text-center">
                                                                View Details
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}

export default BookingPage
