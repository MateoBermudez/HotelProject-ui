import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
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
import "./App.css"

function App() {
    return (
        <ThemeProvider>
            <Router>
                <AuthProvider>
                    <ErrorBoundary>
                        <div className="flex flex-col min-h-screen">
                            <Header />
                            <main className="flex-grow">
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/welcome" element={<LandingPage />} />
                                    <Route path="/booking" element={<BookingPage />} />
                                    <Route path="/rooms/:id" element={<RoomDetailsPage />} />
                                    <Route path="/error" element={<ErrorPage />} />

                                    {/* Protected routes example */}
                                    <Route
                                        path="/profile"
                                        element={
                                            <ProtectedRoute>
                                                <div>User Profile Page (Protected)</div>
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Catch all route for 404 */}
                                    <Route path="*" element={<ErrorPage errorType="notfound" customMessage="Page Not Found" />} />
                                </Routes>
                            </main>
                            <Footer />
                        </div>
                    </ErrorBoundary>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    )
}

export default App
