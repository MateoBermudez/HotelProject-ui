"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Star, Users, Bed, Wifi, Car, Coffee, Waves, Dumbbell, Filter, Search } from "lucide-react"
import DashboardHeader from "@/components/DashboardHeader.tsx";

interface Room {
    id: number
    name: string
    description: string
    price: number
    originalPrice?: number
    images: string[]
    rating: number
    reviewCount: number
    maxGuests: number
    bedType: string
    size: number
    amenities: string[]
    category: string
    availability: boolean
    features: string[]
}

const RoomsPage = () => {
    const [rooms, setRooms] = useState<Room[]>([])
    const [filteredRooms, setFilteredRooms] = useState<Room[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
    const [sortBy, setSortBy] = useState("price-low")
    const [showFilters, setShowFilters] = useState(false)

    // Mock data - replace with actual API call later
    const mockRooms: Room[] = [
        {
            id: 1,
            name: "Deluxe Ocean Suite",
            description: "Spacious suite with breathtaking ocean views and premium amenities",
            price: 299,
            originalPrice: 349,
            images: [
                "/placeholder.svg?height=300&width=400",
                "/placeholder.svg?height=300&width=400",
                "/placeholder.svg?height=300&width=400",
            ],
            rating: 4.8,
            reviewCount: 124,
            maxGuests: 4,
            bedType: "King Bed",
            size: 65,
            amenities: ["Free WiFi", "Ocean View", "Mini Bar", "Room Service", "Balcony"],
            category: "suite",
            availability: true,
            features: ["Ocean View", "Balcony", "Premium Location"],
        },
        {
            id: 2,
            name: "Executive Business Room",
            description: "Perfect for business travelers with modern amenities and city views",
            price: 199,
            images: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
            rating: 4.6,
            reviewCount: 89,
            maxGuests: 2,
            bedType: "Queen Bed",
            size: 35,
            amenities: ["Free WiFi", "Work Desk", "City View", "Coffee Machine"],
            category: "business",
            availability: true,
            features: ["City View", "Work Space", "High-Speed Internet"],
        },
        {
            id: 3,
            name: "Family Suite",
            description: "Spacious accommodation perfect for families with children",
            price: 349,
            images: [
                "/placeholder.svg?height=300&width=400",
                "/placeholder.svg?height=300&width=400",
                "/placeholder.svg?height=300&width=400",
            ],
            rating: 4.7,
            reviewCount: 156,
            maxGuests: 6,
            bedType: "2 Queen Beds",
            size: 85,
            amenities: ["Free WiFi", "Kitchenette", "Living Area", "Kids Amenities", "Connecting Rooms"],
            category: "family",
            availability: true,
            features: ["Family Friendly", "Extra Space", "Kitchenette"],
        },
        {
            id: 4,
            name: "Standard Double Room",
            description: "Comfortable and affordable room with all essential amenities",
            price: 129,
            images: ["/placeholder.svg?height=300&width=400"],
            rating: 4.3,
            reviewCount: 67,
            maxGuests: 2,
            bedType: "Double Bed",
            size: 25,
            amenities: ["Free WiFi", "Air Conditioning", "Private Bathroom"],
            category: "standard",
            availability: true,
            features: ["Budget Friendly", "Essential Amenities"],
        },
        {
            id: 5,
            name: "Presidential Suite",
            description: "Ultimate luxury with panoramic views and exclusive services",
            price: 799,
            originalPrice: 899,
            images: [
                "/placeholder.svg?height=300&width=400",
                "/placeholder.svg?height=300&width=400",
                "/placeholder.svg?height=300&width=400",
                "/placeholder.svg?height=300&width=400",
            ],
            rating: 4.9,
            reviewCount: 45,
            maxGuests: 4,
            bedType: "King Bed + Sofa Bed",
            size: 120,
            amenities: ["Free WiFi", "Butler Service", "Private Terrace", "Jacuzzi", "Premium Bar"],
            category: "presidential",
            availability: false,
            features: ["Luxury", "Butler Service", "Private Terrace", "Exclusive"],
        },
        {
            id: 6,
            name: "Garden View Room",
            description: "Peaceful room overlooking beautiful hotel gardens",
            price: 159,
            images: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
            rating: 4.4,
            reviewCount: 92,
            maxGuests: 2,
            bedType: "Queen Bed",
            size: 30,
            amenities: ["Free WiFi", "Garden View", "Mini Fridge", "Coffee Machine"],
            category: "standard",
            availability: true,
            features: ["Garden View", "Peaceful", "Nature"],
        },
        {
            id: 7,
            name: "Honeymoon Suite",
            description: "Romantic suite perfect for couples with special amenities",
            price: 449,
            images: [
                "/placeholder.svg?height=300&width=400",
                "/placeholder.svg?height=300&width=400",
                "/placeholder.svg?height=300&width=400",
            ],
            rating: 4.8,
            reviewCount: 78,
            maxGuests: 2,
            bedType: "King Bed",
            size: 55,
            amenities: ["Free WiFi", "Jacuzzi", "Champagne", "Rose Petals", "Romantic Lighting"],
            category: "romantic",
            availability: true,
            features: ["Romantic", "Jacuzzi", "Special Amenities"],
        },
        {
            id: 8,
            name: "Penthouse Suite",
            description: "Top-floor luxury with 360-degree city and ocean views",
            price: 599,
            images: [
                "/placeholder.svg?height=300&width=400",
                "/placeholder.svg?height=300&width=400",
                "/placeholder.svg?height=300&width=400",
            ],
            rating: 4.9,
            reviewCount: 34,
            maxGuests: 4,
            bedType: "King Bed",
            size: 95,
            amenities: ["Free WiFi", "360° Views", "Private Elevator", "Rooftop Access", "Premium Bar"],
            category: "penthouse",
            availability: true,
            features: ["360° Views", "Top Floor", "Private Elevator", "Exclusive"],
        },
    ]

    const categories = [
        { value: "all", label: "All Rooms" },
        { value: "STANDARD", label: "Standard" },
        { value: "DELUXE", label: "Business" },
        { value: "SUITE", label: "Suite" }
    ]

    const amenityIcons: { [key: string]: any } = {
        "Free WiFi": Wifi,
        "Ocean View": Waves,
        "City View": Waves,
        "Garden View": Waves,
        "Fitness Center": Dumbbell,
        "Coffee Machine": Coffee,
        Parking: Car,
    }

    // Simulate API call
    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true)
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setRooms(mockRooms)
            setFilteredRooms(mockRooms)
            setLoading(false)
        }

        fetchRooms()
    }, [])

    // Filter and sort rooms
    useEffect(() => {
        const filtered = rooms.filter((room) => {
            const matchesSearch =
                room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                room.description.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = selectedCategory === "all" || room.category === selectedCategory
            const matchesPrice = room.price >= priceRange.min && room.price <= priceRange.max

            return matchesSearch && matchesCategory && matchesPrice
        })

        // Sort rooms
        switch (sortBy) {
            case "price-low":
                filtered.sort((a, b) => a.price - b.price)
                break
            case "price-high":
                filtered.sort((a, b) => b.price - a.price)
                break
            case "rating":
                filtered.sort((a, b) => b.rating - a.rating)
                break
            case "name":
                filtered.sort((a, b) => a.name.localeCompare(b.name))
                break
        }

        setFilteredRooms(filtered)
    }, [rooms, searchTerm, selectedCategory, priceRange, sortBy])

    const getAmenityIcon = (amenity: string) => {
        const IconComponent = amenityIcons[amenity]
        return IconComponent ? <IconComponent className="h-4 w-4" /> : null
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading rooms...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader/>
            {/* Hero Section */}
            <section className="bg-teal-600 text-white py-16">
                <div className="container">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Rooms & Suites</h1>
                        <p className="text-xl max-w-3xl mx-auto">
                            Discover our collection of beautifully designed accommodations, each offering unique amenities and
                            stunning views.
                        </p>
                    </div>
                </div>
            </section>

            <div className="container py-8">
                {/* Search and Filter Bar */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        {/* Search */}
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search rooms..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="form-input pl-10"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="form-input"
                        >
                            {categories.map((category) => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>

                        {/* Sort */}
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="form-input">
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Highest Rated</option>
                            <option value="name">Name A-Z</option>
                        </select>

                        {/* Filter Toggle */}
                        <button onClick={() => setShowFilters(!showFilters)} className="btn btn-secondary flex items-center">
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                        </button>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Price Range</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange((prev) => ({ ...prev, min: Number(e.target.value) }))}
                                            className="form-input"
                                        />
                                        <span>to</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))}
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">
                        Showing {filteredRooms.length} of {rooms.length} rooms
                    </p>
                </div>

                {/* Rooms Grid */}
                {filteredRooms.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No rooms found matching your criteria.</p>
                        <button
                            onClick={() => {
                                setSearchTerm("")
                                setSelectedCategory("all")
                                setPriceRange({ min: 0, max: 1000 })
                            }}
                            className="btn btn-primary mt-4"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredRooms.map((room) => (
                            <div key={room.id} className="card">
                                {/* Room Image */}
                                <div className="relative">
                                    <img
                                        src={room.images[0] || "/placeholder.svg"}
                                        alt={room.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    {room.originalPrice && (
                                        <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                                            Save ${room.originalPrice - room.price}
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 text-sm font-medium">
                                        {room.images.length} photos
                                    </div>
                                </div>

                                {/* Room Details */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold">{room.name}</h3>
                                        <div className="flex items-center">
                                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                            <span className="ml-1 text-sm font-medium">{room.rating}</span>
                                            <span className="ml-1 text-sm text-gray-500">({room.reviewCount})</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mb-4 text-sm">{room.description}</p>

                                    {/* Room Info */}
                                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                        <div className="flex items-center">
                                            <Users className="h-4 w-4 text-gray-400 mr-2" />
                                            <span>{room.maxGuests} guests</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Bed className="h-4 w-4 text-gray-400 mr-2" />
                                            <span>{room.bedType}</span>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {room.features.slice(0, 3).map((feature, index) => (
                                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {feature}
                      </span>
                                        ))}
                                    </div>

                                    {/* Amenities */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {room.amenities.slice(0, 4).map((amenity, index) => (
                                            <div key={index} className="flex items-center text-xs text-gray-600">
                                                {getAmenityIcon(amenity)}
                                                <span className="ml-1">{amenity}</span>
                                            </div>
                                        ))}
                                        {room.amenities.length > 4 && (
                                            <span className="text-xs text-gray-500">+{room.amenities.length - 4} more</span>
                                        )}
                                    </div>

                                    {/* Price and Book Button */}
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold text-teal-600">${room.price}</span>
                                                {room.originalPrice && (
                                                    <span className="text-sm text-gray-500 line-through">${room.originalPrice}</span>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-500">per night</span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Link to={`/rooms/${room.id}`} className="btn btn-secondary text-sm px-4 py-2">
                                                View Details
                                            </Link>
                                            {room.availability ? (
                                                <Link to={`/book/${room.id}`} className="btn btn-primary text-sm px-4 py-2">
                                                    Book Now
                                                </Link>
                                            ) : (
                                                <button disabled className="btn btn-primary text-sm px-4 py-2 disabled">
                                                    Unavailable
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Load More Button (for pagination) */}
                {filteredRooms.length > 0 && (
                    <div className="text-center mt-12">
                        <button className="btn btn-secondary">Load More Rooms</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RoomsPage
