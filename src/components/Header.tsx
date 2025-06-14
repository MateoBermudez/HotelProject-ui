"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, User, Phone } from "lucide-react"

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const location = useLocation()

    const isHomePage = location.pathname === "/"
    const isLandingPage = location.pathname === "/welcome"
    const isTransparent = (isHomePage || isLandingPage) && !isScrolled

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Rooms & Suites", path: "/rooms" },
        { name: "Dining", path: "/dining" },
        { name: "Amenities", path: "/amenities" },
        { name: "Special Offers", path: "/offers" },
        { name: "Contact", path: "/contact" },
    ]

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isTransparent ? "header-transparent" : "header-solid"
            }`}
        >
            <div className="container">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold flex items-center">
                        <span className={`${isTransparent ? "text-white" : "text-teal-600"}`}>Luxury</span>
                        <span>Hotel</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`hover:text-teal-600 transition-colors ${
                                    location.pathname === link.path ? "font-medium" : ""
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Action Buttons */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <Link to="/contact" className="flex items-center hover:text-teal-600 transition-colors">
                            <Phone className="h-4 w-4 mr-1" />
                            <span>Book by Phone</span>
                        </Link>
                        <Link
                            to="/login"
                            className={`px-4 py-2 rounded-full transition-colors ${
                                isTransparent ? "bg-white text-teal-600 hover:bg-gray-100" : "bg-teal-600 text-white hover:bg-teal-700"
                            }`}
                        >
                            <User className="h-4 w-4 inline mr-1" />
                            Sign In
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="lg:hidden focus:outline-none" onClick={toggleMenu} aria-label="Toggle menu">
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white text-gray-800 shadow-lg">
                    <div className="container py-4">
                        <nav className="flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`py-2 hover:text-teal-600 transition-colors ${
                                        location.pathname === link.path ? "font-medium" : ""
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <hr className="my-2" />
                            <Link
                                to="/contact"
                                className="py-2 flex items-center hover:text-teal-600 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Phone className="h-4 w-4 mr-2" />
                                Book by Phone
                            </Link>
                            <Link
                                to="/login"
                                className="py-2 flex items-center hover:text-teal-600 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <User className="h-4 w-4 mr-2" />
                                Sign In
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header
