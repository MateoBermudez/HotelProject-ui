"use client"

import {useState, useEffect} from "react"
import {useParams, useSearchParams, Link} from "react-router-dom"
import {Star, Wifi, Car, Coffee, Dumbbell, ArrowLeft, Calendar} from "lucide-react"

interface Room {
    id: number
    name: string
    type: "Standard" | "Deluxe" | "Suite"
    description: string
    fullDescription: string
    price: number
    images: string[]
    rating: number
    maxGuests: number
    amenities: string[]
    available: boolean
    size: string
    bedType: string
    view: string
}

const RoomDetailsPage = () => {
    const {id} = useParams()
    const [searchParams] = useSearchParams()
    const [room, setRoom] = useState<Room | null>(null)
    const [selectedImage, setSelectedImage] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    const checkInDate = searchParams.get("checkin") || ""
    const checkOutDate = searchParams.get("checkout") || ""
    const guests = Number(searchParams.get("guests")) || 1

    // Mock room data - in real app, this would come from your Spring Boot API
    const mockRoomDetails: Record<number, Room> = {
        1: {
            id: 1,
            name: "Ocean View Standard",
            type: "Standard",
            description: "Comfortable room with beautiful ocean views and modern amenities.",
            fullDescription:
                "Experience comfort and elegance in our Ocean View Standard room. This beautifully appointed room features a private balcony with stunning ocean views, modern furnishings, and all the amenities you need for a perfect stay. The room includes a comfortable king-size bed, a spacious bathroom with premium toiletries, and a work desk for business travelers.",
            price: 150,
            images: [
                "/placeholder.svg?height=400&width=600",
                "/placeholder.svg?height=400&width=600",
                "/placeholder.svg?height=400&width=600",
                "/placeholder.svg?height=400&width=600",
            ],
            rating: 4.2,
            maxGuests: 2,
            amenities: [
                "Free WiFi",
                "Ocean View",
                "Air Conditioning",
                "Mini Bar",
                "Room Service",
                "Balcony",
                "Safe",
                "Hair Dryer",
            ],
            available: true,
            size: "35 m²",
            bedType: "King Size Bed",
            view: "Ocean View",
        },
        5: {
            id: 5,
            name: "Presidential Suite",
            type: "Suite",
            description: "Luxurious presidential suite with panoramic views and exclusive amenities.",
            fullDescription:
                "Indulge in the ultimate luxury experience in our Presidential Suite. This expansive suite features a separate living room, dining area, and bedroom, all with panoramic ocean and city views. The suite includes premium amenities, personalized butler service, and access to exclusive facilities. Perfect for special occasions and VIP guests.",
            price: 800,
            images: [
                "/placeholder.svg?height=400&width=600",
                "/placeholder.svg?height=400&width=600",
                "/placeholder.svg?height=400&width=600",
                "/placeholder.svg?height=400&width=600",
            ],
            rating: 4.9,
            maxGuests: 6,
            amenities: [
                "Free WiFi",
                "Panoramic View",
                "Living Room",
                "Kitchen",
                "Butler Service",
                "Private Balcony",
                "Jacuzzi",
                "Premium Bar",
                "Concierge Service",
            ],
            available: true,
            size: "120 m²",
            bedType: "King Size Bed + Sofa Bed",
            view: "Panoramic Ocean & City View",
        },
    }

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            const roomData = mockRoomDetails[Number(id)]
            setRoom(roomData || null)
            setIsLoading(false)
        }, 500)
    }, [id])

    const calculateNights = () => {
        if (!checkInDate || !checkOutDate) return 0
        const start = new Date(checkInDate)
        const end = new Date(checkOutDate)
        const diffTime = Math.abs(end.getTime() - start.getTime())
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const getAmenityIcon = (amenity: string) => {
        switch (amenity.toLowerCase()) {
            case "free wifi":
                return <Wifi className="h-5 w-5"/>
            case "parking":
                return <Car className="h-5 w-5"/>
            case "coffee machine":
                return <Coffee className="h-5 w-5"/>
            case "fitness center":
                return <Dumbbell className="h-5 w-5"/>
            default:
                return <span className="text-lg">•</span>
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Loading room details...</div>
            </div>
        )
    }

    if (!room) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Room Not Found</h1>
                <Link to="/booking" className="btn btn-primary">
                    Back to Booking
                </Link>
            </div>
        )
    }

    return (
        <div className="room-details-page">
            {/* Header */}
            <section className="py-8 bg-gray-50">
                <div className="container">
                    <Link to="/booking" className="inline-flex items-center text-teal-600 hover:text-teal-800 mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2"/>
                        Back to Room Search
                    </Link>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
              <span className="px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full mb-2 inline-block">
                {room.type}
              </span>
                            <h1 className="text-4xl font-bold mb-2">{room.name}</h1>
                            <div className="flex items-center">
                                <Star className="h-5 w-5 text-yellow-500 fill-current"/>
                                <span className="ml-1 font-medium">{room.rating}</span>
                                <span className="ml-2 text-gray-600">• {room.view}</span>
                            </div>
                        </div>

                        <div className="text-right mt-4 md:mt-0">
                            <div className="text-3xl font-bold text-teal-600">
                                ${room.price}
                                <span className="text-lg text-gray-500">/night</span>
                            </div>
                            {calculateNights() > 0 && (
                                <div className="text-lg font-medium">Total: ${room.price * calculateNights()}</div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Image Gallery */}
            <section className="py-8">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="lg:col-span-3">
                            <img
                                src={room.images[selectedImage] || "/placeholder.svg"}
                                alt={room.name}
                                className="w-full h-96 object-cover rounded-lg"
                            />
                        </div>
                        <div className="grid grid-cols-4 lg:grid-cols-1 gap-2">
                            {room.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image || "/placeholder.svg"}
                                    alt={`${room.name} ${index + 1}`}
                                    className={`w-full h-20 lg:h-24 object-cover rounded cursor-pointer transition-opacity ${
                                        selectedImage === index ? "opacity-100 ring-2 ring-teal-500" : "opacity-70 hover:opacity-100"
                                    }`}
                                    onClick={() => setSelectedImage(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Room Details */}
            <section className="py-8">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <h2 className="text-2xl font-bold mb-4">Room Description</h2>
                                <p className="text-gray-600 mb-6">{room.fullDescription}</p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="font-bold text-lg">{room.size}</div>
                                        <div className="text-sm text-gray-600">Room Size</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="font-bold text-lg">{room.maxGuests}</div>
                                        <div className="text-sm text-gray-600">Max Guests</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="font-bold text-lg">{room.bedType}</div>
                                        <div className="text-sm text-gray-600">Bed Type</div>
                                    </div>
                                </div>
                            </div>

                            {/* Amenities */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold mb-4">Room Amenities</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {room.amenities.map((amenity, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className="text-teal-600 mr-3">{getAmenityIcon(amenity)}</div>
                                            <span>{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Booking Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                                <h3 className="text-xl font-bold mb-4">Book This Room</h3>

                                {checkInDate && checkOutDate ? (
                                    <div className="mb-4">
                                        <div className="flex items-center text-sm text-gray-600 mb-2">
                                            <Calendar className="h-4 w-4 mr-2"/>
                                            Your Stay
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded">
                                            <div className="flex justify-between mb-1">
                                                <span>Check-in:</span>
                                                <span className="font-medium">{checkInDate}</span>
                                            </div>
                                            <div className="flex justify-between mb-1">
                                                <span>Check-out:</span>
                                                <span className="font-medium">{checkOutDate}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Guests:</span>
                                                <span className="font-medium">{guests}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                        <p className="text-sm text-yellow-800">
                                            Please select your dates on the booking page to see availability.
                                        </p>
                                    </div>
                                )}

                                <div className="border-t pt-4 mb-4">
                                    <div className="flex justify-between mb-2">
                    <span>
                      ${room.price} × {calculateNights() || 1} {calculateNights() === 1 ? "night" : "nights"}
                    </span>
                                        <span>${room.price * (calculateNights() || 1)}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Service fee</span>
                                        <span>$25</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Taxes</span>
                                        <span>${Math.round(room.price * (calculateNights() || 1) * 0.1)}</span>
                                    </div>
                                    <hr className="my-2"/>
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>
                      $
                                            {room.price * (calculateNights() || 1) +
                                                25 +
                                                Math.round(room.price * (calculateNights() || 1) * 0.1)}
                    </span>
                                    </div>
                                </div>

                                {room.available ? (
                                    <Link
                                        to={`/booking/confirm/${room.id}?checkin=${checkInDate}&checkout=${checkOutDate}&guests=${guests}`}
                                        className="btn btn-primary w-full text-center mb-3"
                                    >
                                        Reserve Now
                                    </Link>
                                ) : (
                                    <button className="btn btn-primary w-full disabled" disabled>
                                        Not Available
                                    </button>
                                )}

                                <Link to="/booking" className="btn btn-secondary w-full text-center">
                                    Change Dates
                                </Link>

                                <p className="text-xs text-gray-500 mt-3 text-center">
                                    Free cancellation up to 24 hours before check-in
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default RoomDetailsPage
