"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { DataExport } from "@/components/data-export"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { useLanguage } from "@/lib/language-context"
import { useAccessibility } from "@/lib/accessibility-context"
import type { Language } from "@/lib/translations"
import { SettingsIcon, Globe, Palette, Check, Eye, Type, Zap, Volume2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const {
    settings: accessibilitySettings,
    updateSetting: updateAccessibilitySetting,
    resetSettings,
  } = useAccessibility()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const languages = [
    { value: "en" as Language, label: "English", nativeLabel: "English" },
    { value: "hi" as Language, label: "Hindi", nativeLabel: "हिन्दी" },
    { value: "mr" as Language, label: "Marathi", nativeLabel: "मराठी" },
  ]

  const themes = [
    { value: "light", label: t.light, icon: "☀️" },
    { value: "dark", label: t.dark, icon: "🌙" },
    { value: "system", label: t.system, icon: "💻" },
  ]

  const fontSizes = [
    { value: "small", label: "Small", size: "14px" },
    { value: "medium", label: "Medium", size: "16px" },
    { value: "large", label: "Large", size: "18px" },
    { value: "extra-large", label: "Extra Large", size: "20px" },
  ]

  const handleSavePreferences = async () => {
    setIsLoading(true)
    // Simulate saving preferences
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)

    toast({
      title: t.preferencesSaved,
      description: `Settings have been saved successfully.`,
    })
  }

  const handleResetAccessibility = () => {
    resetSettings()
    toast({
      title: "Accessibility Reset",
      description: "All accessibility settings have been reset to defaults.",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-6">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-foreground">{t.settingsTitle}</h1>
          <p className="text-muted-foreground">{t.settingsDesc}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Language Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {t.language}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.selectLanguage}</label>
                  <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          <div className="flex items-center gap-2">
                            <span>{lang.nativeLabel}</span>
                            <span className="text-muted-foreground">({lang.label})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Current language: {languages.find((l) => l.value === language)?.nativeLabel}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Theme Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  {t.theme}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.selectTheme}</label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((themeOption) => (
                        <SelectItem key={themeOption.value} value={themeOption.value}>
                          <div className="flex items-center gap-2">
                            <span>{themeOption.icon}</span>
                            <span>{themeOption.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Current theme: {themes.find((th) => th.value === theme)?.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Accessibility Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Accessibility Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Font Size */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    <label className="text-sm font-medium">Font Size</label>
                  </div>
                  <Select
                    value={accessibilitySettings.fontSize}
                    onValueChange={(value: "small" | "medium" | "large" | "extra-large") =>
                      updateAccessibilitySetting("fontSize", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: size.size }}>{size.label}</span>
                            <span className="text-muted-foreground">({size.size})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* High Contrast */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <label className="text-sm font-medium">High Contrast Mode</label>
                    </div>
                    <p className="text-xs text-muted-foreground">Increases contrast for better visibility</p>
                  </div>
                  <Switch
                    checked={accessibilitySettings.highContrast}
                    onCheckedChange={(checked) => updateAccessibilitySetting("highContrast", checked)}
                  />
                </div>

                {/* Reduced Motion */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      <label className="text-sm font-medium">Reduce Motion</label>
                    </div>
                    <p className="text-xs text-muted-foreground">Minimizes animations and transitions</p>
                  </div>
                  <Switch
                    checked={accessibilitySettings.reducedMotion}
                    onCheckedChange={(checked) => updateAccessibilitySetting("reducedMotion", checked)}
                  />
                </div>

                {/* Screen Reader Optimization */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <label className="text-sm font-medium">Screen Reader Optimized</label>
                    </div>
                    <p className="text-xs text-muted-foreground">Enhanced compatibility with screen readers</p>
                  </div>
                  <Switch
                    checked={accessibilitySettings.screenReaderOptimized}
                    onCheckedChange={(checked) => updateAccessibilitySetting("screenReaderOptimized", checked)}
                  />
                </div>

                <div className="pt-4 border-t">
                  <Button onClick={handleResetAccessibility} variant="outline" size="sm">
                    Reset Accessibility Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Export */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <DataExport />
          </motion.div>

          {/* Preferences Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  {t.preferences}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">{t.language}</h4>
                    <p className="text-sm text-muted-foreground">
                      {languages.find((l) => l.value === language)?.nativeLabel}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">{t.theme}</h4>
                    <p className="text-sm text-muted-foreground">
                      {themes.find((th) => th.value === theme)?.icon} {themes.find((th) => th.value === theme)?.label}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Accessibility</h4>
                    <p className="text-sm text-muted-foreground">
                      {accessibilitySettings.fontSize} font,{" "}
                      {accessibilitySettings.highContrast ? "high contrast" : "normal contrast"}
                    </p>
                  </div>
                </div>

                <Button onClick={handleSavePreferences} disabled={isLoading} className="w-full md:w-auto">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      {t.savePreferences}
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
