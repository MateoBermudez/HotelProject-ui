import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LandingPage from "./pages/LandingPage"
import BookingPage from "./pages/BookingPage"
import RoomDetailsPage from "./pages/RoomDetailsPage"
import ErrorPage from "./pages/ErrorPage"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ThemeProvider from "./components/ThemeProvider"
import ErrorBoundary from "./components/ErrorBoundary"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./hooks/useAuth"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import DashboardPage from "./pages/DashboardPage.tsx"
import ProfilePage from "./pages/ProfilePage"
import PaymentPage from "./pages/PaymentPage.tsx"
import BookingConfirmation from "./pages/BookingConfirmation.tsx"
import "./App.css"
import UserBookingsPage from "@/pages/UserBookingsPage.tsx";
import RoomsPage from "@/pages/RoomsPage.tsx";
import "./styles/bookings.css"

function AppContent() {
    const location = useLocation()
    // Rutas donde SÍ quieres mostrar el Header
    const showHeaderRoutes = ["/", "/welcome", "/rooms/:id", "/error", "/login", "/signup", "/profilePage"]

    const shouldShowHeader = showHeaderRoutes.includes(location.pathname)

    return (
        <div className="flex flex-col min-h-screen">
            {shouldShowHeader && <Header />}
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/welcome" element={<LandingPage />} />
                    <Route path="/booking" element={<BookingPage />} />
                    <Route path="/rooms/:id" element={<RoomDetailsPage />} />
                    <Route path="/error" element={<ErrorPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/payment/:bookingId" element={<PaymentPage />} />
                    <Route path="/confirmation/:paymentId" element={<BookingConfirmation />} />
                    <Route path="/bookings" element={<UserBookingsPage />} />
                    <Route path="/rooms" element={<RoomsPage />} />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <div>User Profile Page (Protected)</div>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<ErrorPage errorType="notfound" customMessage="Page Not Found" />} />
                </Routes>
            </main>
            <Footer />
        </div>
    )
}

function App() {
    return (
        <ThemeProvider>
            <Router>
                <AuthProvider>
                    <ErrorBoundary>
                        <AppContent />
                    </ErrorBoundary>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    )
}

export default App
