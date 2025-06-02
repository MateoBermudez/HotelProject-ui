import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-900 text-white">
            <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Luxury Hotel</h3>
                        <p className="text-gray-400 mb-4">
                            Experience unparalleled luxury and comfort in our five-star accommodations. Your dream vacation awaits.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/rooms" className="text-gray-400 hover:text-white transition-colors">
                                    Rooms & Suites
                                </Link>
                            </li>
                            <li>
                                <Link to="/dining" className="text-gray-400 hover:text-white transition-colors">
                                    Dining
                                </Link>
                            </li>
                            <li>
                                <Link to="/amenities" className="text-gray-400 hover:text-white transition-colors">
                                    Amenities
                                </Link>
                            </li>
                            <li>
                                <Link to="/offers" className="text-gray-400 hover:text-white transition-colors">
                                    Special Offers
                                </Link>
                            </li>
                            <li>
                                <Link to="/gallery" className="text-gray-400 hover:text-white transition-colors">
                                    Gallery
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 text-teal-500 mr-2 mt-1" />
                                <span className="text-gray-400">123 Luxury Avenue, Downtown, City, Country</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-5 w-5 text-teal-500 mr-2" />
                                <a href="tel:+1234567890" className="text-gray-400 hover:text-white transition-colors">
                                    +1 (234) 567-890
                                </a>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-5 w-5 text-teal-500 mr-2" />
                                <a href="mailto:info@luxuryhotel.com" className="text-gray-400 hover:text-white transition-colors">
                                    info@luxuryhotel.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Newsletter</h3>
                        <p className="text-gray-400 mb-4">Subscribe to receive updates on our latest offers.</p>
                        <form className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <hr className="border-gray-800 my-8" />

                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">&copy; {currentYear} Luxury Hotel. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                            Terms of Service
                        </Link>
                        <Link to="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors">
                            Sitemap
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
