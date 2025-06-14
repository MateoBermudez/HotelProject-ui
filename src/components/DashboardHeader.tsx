// src/components/DashboardHeader.tsx
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Bell, ChevronDown, User, BookOpen, Settings, Home, LogOut } from "lucide-react"
import { isAuthenticated, removeToken, getCurrentUser, type UserProfile } from "../services/api"

const DashboardHeader = () => {
    const navigate = useNavigate()
    const [showDropdown, setShowDropdown] = useState(false)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [isLoadingUser, setIsLoadingUser] = useState(false)

    useEffect(() => {
        const checkAuthAndGetUser = async () => {
            if (!isAuthenticated()) {
                navigate("/login")
                return
            }
            setIsLoadingUser(true)
            try {
                const profile = await getCurrentUser()
                setUserProfile(profile)
            } catch {
                handleLogout()
            } finally {
                setIsLoadingUser(false)
            }
        }
        checkAuthAndGetUser()
    }, [navigate])

    const handleLogout = () => {
        removeToken()
        setUserProfile(null)
        setShowDropdown(false)
        navigate("/")
    }

    return (
        <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white sticky top-0 z-50 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/dashboard" className="flex items-center space-x-2">
                        <div className="text-2xl font-bold">
                            <span className="text-white">Luxury</span>
                            <span className="text-teal-200">Hotel</span>
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-sm font-medium text-teal-200 bg-teal-500 px-2 py-1 rounded-full">Dashboard</span>
                        </div>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link to="/dashboard" className="relative p-2 hover:bg-teal-500 rounded-full transition-colors duration-200">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                                3
                            </span>
                        </Link>
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center space-x-3 bg-teal-500 hover:bg-teal-400 rounded-lg py-2 px-3 transition-colors duration-200 min-w-0"
                            >
                                <div className="bg-white rounded-full p-1 flex-shrink-0">
                                    <User className="h-4 w-4 text-teal-600" />
                                </div>
                                <div className="text-left min-w-0 hidden sm:block">
                                    <p className="font-medium text-sm truncate">
                                        {isLoadingUser ? "Loading..." : userProfile?.completeName || "User"}
                                    </p>
                                    <p className="text-xs text-teal-200 truncate">{userProfile?.role || "Guest"}</p>
                                </div>
                                <ChevronDown className="h-4 w-4 flex-shrink-0" />
                            </button>
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900 truncate">{userProfile?.completeName}</p>
                                        <p className="text-xs text-gray-500 truncate">@{userProfile?.username}</p>
                                        <p className="text-xs text-gray-500 truncate">{userProfile?.email}</p>
                                    </div>
                                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center transition-colors" onClick={() => setShowDropdown(false)}>
                                        <User className="h-4 w-4 mr-3 text-gray-500" /> My Profile
                                    </Link>
                                    <Link to="/bookings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center transition-colors" onClick={() => setShowDropdown(false)}>
                                        <BookOpen className="h-4 w-4 mr-3 text-gray-500" /> My Bookings
                                    </Link>
                                    <Link to="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center transition-colors" onClick={() => setShowDropdown(false)}>
                                        <Settings className="h-4 w-4 mr-3 text-gray-500" /> Settings
                                    </Link>
                                    <hr className="my-2" />
                                    <Link to="/" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center transition-colors" onClick={() => setShowDropdown(false)}>
                                        <Home className="h-4 w-4 mr-3 text-gray-500" /> Public Site
                                    </Link>
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center transition-colors">
                                        <LogOut className="h-4 w-4 mr-3" /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="border-t border-teal-500 border-opacity-30">
                    <nav className="flex space-x-1 py-2 overflow-x-auto">
                        <Link to="/dashboard" className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 whitespace-nowrap flex-shrink-0">
                            <Home className="h-4 w-4" /> <span>Dashboard</span>
                        </Link>
                        <Link to="/booking" className="text-teal-100 hover:bg-white hover:bg-opacity-10 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200 whitespace-nowrap flex-shrink-0">
                            <span>Browse Rooms</span>
                        </Link>
                        <Link to="/bookings" className="text-teal-100 hover:bg-white hover:bg-opacity-10 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200 whitespace-nowrap flex-shrink-0">
                            <BookOpen className="h-4 w-4" /> <span>My Bookings</span>
                        </Link>
                        <Link to="/profile" className="text-teal-100 hover:bg-white hover:bg-opacity-10 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200 whitespace-nowrap flex-shrink-0">
                            <User className="h-4 w-4" /> <span>Profile</span>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default DashboardHeader