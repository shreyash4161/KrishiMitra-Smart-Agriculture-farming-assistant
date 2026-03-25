"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface AccessibilitySettings {
  fontSize: "small" | "medium" | "large" | "extra-large"
  highContrast: boolean
  reducedMotion: boolean
  screenReaderOptimized: boolean
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void
  resetSettings: () => void
}

const defaultSettings: AccessibilitySettings = {
  fontSize: "medium",
  highContrast: false,
  reducedMotion: false,
  screenReaderOptimized: false,
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("farmlens-accessibility")
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to load accessibility settings:", error)
      }
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("farmlens-accessibility", JSON.stringify(settings))

    // Apply settings to document
    const root = document.documentElement

    // Font size
    root.classList.remove("text-sm", "text-base", "text-lg", "text-xl")
    switch (settings.fontSize) {
      case "small":
        root.classList.add("text-sm")
        break
      case "medium":
        root.classList.add("text-base")
        break
      case "large":
        root.classList.add("text-lg")
        break
      case "extra-large":
        root.classList.add("text-xl")
        break
    }

    // High contrast
    if (settings.highContrast) {
      root.classList.add("high-contrast")
    } else {
      root.classList.remove("high-contrast")
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add("reduce-motion")
    } else {
      root.classList.remove("reduce-motion")
    }

    // Screen reader optimization
    if (settings.screenReaderOptimized) {
      root.classList.add("screen-reader-optimized")
    } else {
      root.classList.remove("screen-reader-optimized")
    }
  }, [settings])

  const updateSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
