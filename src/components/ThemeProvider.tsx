"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { Sun, Moon } from "lucide-react"

type Theme = "light" | "dark"

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}

interface ThemeProviderProps {
    children: ReactNode
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [theme, setTheme] = useState<Theme>("light")

    useEffect(() => {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem("theme") as Theme | null
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

        if (savedTheme) {
            setTheme(savedTheme)
        } else if (prefersDark) {
            setTheme("dark")
        }
    }, [])

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute("data-theme", theme)
        localStorage.setItem("theme", theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
            {/* Theme toggle button */}
            <button
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
        </ThemeContext.Provider>
    )
}

export default ThemeProvider
