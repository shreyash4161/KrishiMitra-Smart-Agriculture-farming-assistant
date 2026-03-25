"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { Language, Translations } from "./translations"
import { getTranslation } from "./translations"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [t, setT] = useState<Translations>(getTranslation("en"))

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("smart-farm-language") as Language
    if (savedLanguage && ["en", "hi", "mr"].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
      setT(getTranslation(savedLanguage))
    }
  }, [])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    setT(getTranslation(newLanguage))
    localStorage.setItem("smart-farm-language", newLanguage)
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
