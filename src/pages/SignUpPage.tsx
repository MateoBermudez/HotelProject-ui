"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { User, Mail, Lock, Eye, EyeOff, UserCheck, Hash, ArrowRight, Shield } from "lucide-react"
import { registerUser, saveToken, type RegisterRequest } from "../services/api"

const SignUpPage = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        userID: "",
        username: "",
        completeName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "USER", // Default role
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.userID.trim()) {
            newErrors.userID = "User ID is required"
        }

        if (!formData.username.trim()) {
            newErrors.username = "Username is required"
        } else if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters"
        }

        if (!formData.completeName.trim()) {
            newErrors.completeName = "Complete name is required"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password"
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        if (!formData.role) {
            newErrors.role = "Please select a role"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)
        setErrors({})

        try {
            // Prepare data for backend (matching RegisterRequest DTO)
            const registerData: RegisterRequest = {
                userID: formData.userID,
                username: formData.username,
                completeName: formData.completeName,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            }

            // Call the API
            const response = await registerUser(registerData)

            // Save the JWT token
            saveToken(response.token)

            // Show success message
            console.log("Registration successful! Token:", response.token)

            // Redirect to home page or dashboard
            navigate("/dashboard")
        } catch (error) {
            console.error("Registration error:", error)

            // Handle specific backend errors
            const errorMessage = error instanceof Error ? error.message : "Registration failed"

            if (errorMessage.includes("User with Id")) {
                setErrors({ userID: "This User ID already exists" })
            } else if (errorMessage.includes("username")) {
                setErrors({ username: "This username already exists" })
            } else if (errorMessage.includes("email")) {
                setErrors({ email: "This email already exists" })
            } else {
                setErrors({ general: errorMessage })
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-6">
            <span className="text-4xl font-bold">
              <span className="text-teal-600">Luxury</span>
              <span className="text-gray-800">Hotel</span>
            </span>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
                    <p className="text-gray-600">Join us and enjoy exclusive benefits</p>
                </div>

                {/* Registration Form Container */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {errors.general && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                                {errors.general}
                            </div>
                        )}

                        {/* User ID Field */}
                        <div>
                            <label htmlFor="userID" className="block text-sm font-medium text-gray-700 mb-2">
                                User ID
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Hash className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="userID"
                                    name="userID"
                                    type="text"
                                    required
                                    value={formData.userID}
                                    onChange={handleInputChange}
                                    className={`form-input pl-10 ${errors.userID ? "border-red-300" : ""}`}
                                    placeholder="Enter a unique user ID"
                                    style={{ paddingLeft: "2.5rem" }}
                                />
                            </div>
                            {errors.userID && <p className="mt-1 text-sm text-red-600">{errors.userID}</p>}
                        </div>

                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={`form-input pl-10 ${errors.username ? "border-red-300" : ""}`}
                                    placeholder="Choose a username"
                                    style={{ paddingLeft: "2.5rem" }}
                                />
                            </div>
                            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                        </div>

                        {/* Complete Name Field */}
                        <div>
                            <label htmlFor="completeName" className="block text-sm font-medium text-gray-700 mb-2">
                                Complete Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserCheck className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="completeName"
                                    name="completeName"
                                    type="text"
                                    required
                                    value={formData.completeName}
                                    onChange={handleInputChange}
                                    className={`form-input pl-10 ${errors.completeName ? "border-red-300" : ""}`}
                                    placeholder="Enter your full name"
                                    style={{ paddingLeft: "2.5rem" }}
                                />
                            </div>
                            {errors.completeName && <p className="mt-1 text-sm text-red-600">{errors.completeName}</p>}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`form-input pl-10 ${errors.email ? "border-red-300" : ""}`}
                                    placeholder="Enter your email address"
                                    style={{ paddingLeft: "2.5rem" }}
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        {/* Role Field */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                                Role
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Shield className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    id="role"
                                    name="role"
                                    required
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className={`form-input pl-10 ${errors.role ? "border-red-300" : ""}`}
                                    style={{ paddingLeft: "2.5rem" }}
                                >
                                    <option value="">Select a role</option>
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="MANAGER">Manager</option>
                                </select>
                            </div>
                            {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`form-input pl-10 pr-10 ${errors.password ? "border-red-300" : ""}`}
                                    placeholder="Create a password"
                                    style={{ paddingLeft: "2.5rem" }}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`form-input pl-10 pr-10 ${errors.confirmPassword ? "border-red-300" : ""}`}
                                    placeholder="Confirm your password"
                                    style={{ paddingLeft: "2.5rem" }}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-1"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                I agree to the{" "}
                                <Link to="/terms" className="text-teal-600 hover:text-teal-800 transition-colors">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link to="/privacy" className="text-teal-600 hover:text-teal-800 transition-colors">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`btn btn-primary w-full flex items-center justify-center ${isLoading ? "disabled" : ""}`}
                        >
                            {isLoading ? (
                                "Creating Account..."
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                            </div>
                        </div>

                        {/* Sign In Link */}
                        <div className="mt-6 text-center">
                            <Link to="/login" className="font-medium text-teal-600 hover:text-teal-800 transition-colors">
                                Sign in here
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage
