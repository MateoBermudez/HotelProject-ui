import { ArrowRight, Check, Star } from "lucide-react"
import { Link } from "react-router-dom"

const LandingPage = () => {
    const features = [
        "Luxurious rooms and suites with stunning views",
        "Award-winning restaurants and bars",
        "State-of-the-art fitness center and spa",
        "Infinity pool overlooking the ocean",
        "24/7 concierge and room service",
        "Complimentary high-speed WiFi",
    ]

    const specialOffers = [
        {
            title: "Weekend Getaway",
            description: "Enjoy a perfect weekend with 20% off room rates, complimentary breakfast, and late checkout.",
            image: "/placeholder.svg?height=300&width=400",
        },
        {
            title: "Family Package",
            description: "Kids stay and eat free! Includes family activities and special amenities for children.",
            image: "/placeholder.svg?height=300&width=400",
        },
        {
            title: "Honeymoon Special",
            description: "Romantic package with champagne, couples massage, and private dining experience.",
            image: "/placeholder.svg?height=300&width=400",
        },
    ]

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section
                className="relative h-screen bg-cover bg-center"
                style={{ backgroundImage: "url('/placeholder.svg?height=1080&width=1920')" }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Welcome to Luxury Hotel & Resort</h1>
                        <p className="text-xl text-white mb-8">
                            Experience unparalleled luxury and comfort in our five-star accommodations. Your dream vacation awaits.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/rooms"
                                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-full font-medium text-lg transition-colors inline-flex items-center justify-center"
                            >
                                Explore Rooms
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                to="/about"
                                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-medium text-lg transition-colors inline-flex items-center justify-center"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-10 left-0 right-0 flex justify-center">
                    <div className="animate-bounce bg-white p-2 w-10 h-10 ring-1 ring-slate-900/5 shadow-lg rounded-full flex items-center justify-center">
                        <svg
                            className="w-6 h-6 text-teal-600"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                        </svg>
                    </div>
                </div>
            </section>

            {/* Introduction */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-6">Experience the Ultimate in Luxury</h2>
                            <p className="text-gray-600 mb-6 text-lg">
                                Our hotel combines elegant design, exceptional service, and world-class amenities to create an
                                unforgettable experience for our guests. Whether you're traveling for business or pleasure, we offer the
                                perfect setting for your stay.
                            </p>
                            <p className="text-gray-600 mb-8 text-lg">
                                Located in a prime location with breathtaking views, our property provides easy access to major
                                attractions while offering a peaceful retreat from the bustling city.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-start">
                                        <Check className="h-6 w-6 text-teal-600 mr-2 mt-1 flex-shrink-0" />
                                        <p className="text-gray-700">{feature}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <img
                                src="/placeholder.svg?height=300&width=300"
                                alt="Hotel Feature"
                                className="rounded-lg h-full object-cover"
                            />
                            <img
                                src="/placeholder.svg?height=300&width=300"
                                alt="Hotel Feature"
                                className="rounded-lg mt-8 h-full object-cover"
                            />
                            <img
                                src="/placeholder.svg?height=300&width=300"
                                alt="Hotel Feature"
                                className="rounded-lg h-full object-cover"
                            />
                            <img
                                src="/placeholder.svg?height=300&width=300"
                                alt="Hotel Feature"
                                className="rounded-lg -mt-8 h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Special Offers */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Special Offers</h2>
                        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                            Take advantage of our exclusive packages and promotions designed to enhance your stay and provide
                            exceptional value.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {specialOffers.map((offer, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
                            >
                                <img src={offer.image || "/placeholder.svg"} alt={offer.title} className="w-full h-48 object-cover" />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-3">{offer.title}</h3>
                                    <p className="text-gray-600 mb-6">{offer.description}</p>
                                    <Link to="/offers" className="text-teal-600 font-medium hover:text-teal-800 inline-flex items-center">
                                        View Details
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Virtual Tour */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <h2 className="text-4xl font-bold mb-6">Take a Virtual Tour</h2>
                            <p className="text-gray-600 mb-6 text-lg">
                                Explore our hotel from the comfort of your home. Our virtual tour allows you to see our elegant rooms,
                                luxurious amenities, and beautiful surroundings before you book.
                            </p>
                            <p className="text-gray-600 mb-8 text-lg">
                                Get a glimpse of what awaits you at our five-star property and start planning your perfect stay today.
                            </p>
                            <Link
                                to="/virtual-tour"
                                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full font-medium text-lg transition-colors inline-flex items-center"
                            >
                                Start Tour
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </div>
                        <div className="order-1 lg:order-2 relative">
                            <img src="/placeholder.svg?height=400&width=600" alt="Virtual Tour" className="rounded-lg w-full" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white bg-opacity-80 rounded-full p-4 cursor-pointer hover:bg-opacity-100 transition-all">
                                    <svg className="w-12 h-12 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Guest Experiences</h2>
                        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                            Don't just take our word for it. Here's what our guests have to say about their stay with us.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <div className="flex text-yellow-500 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-current" />
                                ))}
                            </div>
                            <p className="text-gray-600 italic mb-6">
                                "This hotel exceeded all my expectations. The room was spacious and beautifully designed, the staff was
                                incredibly attentive, and the amenities were top-notch. I can't wait to return!"
                            </p>
                            <div className="flex items-center">
                                <img
                                    src="/placeholder.svg?height=50&width=50"
                                    alt="Guest"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="ml-4">
                                    <h4 className="font-bold">Robert Johnson</h4>
                                    <p className="text-gray-500 text-sm">New York, USA</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <div className="flex text-yellow-500 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-current" />
                                ))}
                            </div>
                            <p className="text-gray-600 italic mb-6">
                                "We celebrated our anniversary here and it was magical. The special touches arranged by the staff made
                                our stay unforgettable. The spa treatments were divine and the dining experience was exceptional."
                            </p>
                            <div className="flex items-center">
                                <img
                                    src="/placeholder.svg?height=50&width=50"
                                    alt="Guest"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="ml-4">
                                    <h4 className="font-bold">Emily & David</h4>
                                    <p className="text-gray-500 text-sm">London, UK</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <div className="flex text-yellow-500 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-current" />
                                ))}
                            </div>
                            <p className="text-gray-600 italic mb-6">
                                "As a business traveler, I appreciate efficiency and comfort. This hotel delivers both, along with
                                exceptional service. The business center and meeting rooms are well-equipped, and the location is
                                perfect."
                            </p>
                            <div className="flex items-center">
                                <img
                                    src="/placeholder.svg?height=50&width=50"
                                    alt="Guest"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="ml-4">
                                    <h4 className="font-bold">Sophia Chen</h4>
                                    <p className="text-gray-500 text-sm">Tokyo, Japan</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter & CTA */}
            <section className="py-20 bg-teal-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-6">Stay Updated with Special Offers</h2>
                            <p className="text-lg mb-8">
                                Subscribe to our newsletter and be the first to know about exclusive deals, seasonal promotions, and
                                special events at our hotel.
                            </p>
                            <form className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="px-6 py-3 rounded-full text-gray-800 flex-grow"
                                />
                                <button
                                    type="submit"
                                    className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-3 rounded-full font-medium transition-colors"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                        <div className="bg-white bg-opacity-10 p-8 rounded-lg">
                            <h3 className="text-2xl font-bold mb-4">Book Direct Benefits</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <Check className="h-6 w-6 mr-2 mt-1 flex-shrink-0" />
                                    <p>Best rate guarantee</p>
                                </li>
                                <li className="flex items-start">
                                    <Check className="h-6 w-6 mr-2 mt-1 flex-shrink-0" />
                                    <p>Free room upgrades when available</p>
                                </li>
                                <li className="flex items-start">
                                    <Check className="h-6 w-6 mr-2 mt-1 flex-shrink-0" />
                                    <p>Early check-in and late check-out options</p>
                                </li>
                                <li className="flex items-start">
                                    <Check className="h-6 w-6 mr-2 mt-1 flex-shrink-0" />
                                    <p>Exclusive member-only offers</p>
                                </li>
                            </ul>
                            <Link
                                to="/rooms"
                                className="mt-6 inline-block bg-white text-teal-600 hover:bg-gray-100 px-8 py-3 rounded-full font-medium transition-colors"
                            >
                                Book Now
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default LandingPage
