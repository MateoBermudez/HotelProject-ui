import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LandingPage from "./pages/LandingPage"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ThemeProvider from "./components/ThemeProvider"
import LoginPage from "./pages/LoginPage"      // Add this import
import SignUpPage from "./pages/SignUpPage"    // Add this import
import "./App.css"

function App() {
    return (
        <ThemeProvider>
            <Router>
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
