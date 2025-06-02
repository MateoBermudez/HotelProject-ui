import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LandingPage from "./pages/LandingPage"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ThemeProvider from "./components/ThemeProvider"
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
