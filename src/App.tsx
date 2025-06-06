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
import LoginPage from "./pages/LoginPage"      // Add this import
import SignUpPage from "./pages/SignUpPage"    // Add this import
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
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/welcome" element={<LandingPage />} />
                            <Route path="/login" element={<LoginPage />} />      {/* Add this route */}
                            <Route path="/signup" element={<SignUpPage />} />
                            {/* Other routes will be added later */}
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </ThemeProvider>
    )
}

export default App
