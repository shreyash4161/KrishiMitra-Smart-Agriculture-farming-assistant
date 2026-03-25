"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Sun, CloudRain, MapPin } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  icon: "sunny" | "cloudy" | "rainy"
}

export function WeatherCard() {
  const { t } = useLanguage()
  const [weather, setWeather] = useState<WeatherData>({
    location: "Pune, Maharashtra",
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 65,
    icon: "cloudy",
  })

  useEffect(() => {
    // Simulate weather updates
    const interval = setInterval(() => {
      const conditions = [
        { condition: "Sunny", icon: "sunny" as const, temp: 30 + Math.random() * 8 },
        { condition: "Partly Cloudy", icon: "cloudy" as const, temp: 25 + Math.random() * 8 },
        { condition: "Light Rain", icon: "rainy" as const, temp: 22 + Math.random() * 6 },
      ]
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]

      setWeather((prev) => ({
        ...prev,
        ...randomCondition,
        temperature: randomCondition.temp,
        humidity: 50 + Math.random() * 40,
      }))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getWeatherIcon = () => {
    switch (weather.icon) {
      case "sunny":
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-500" />
      default:
        return <Cloud className="h-8 w-8 text-gray-500" />
    }
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 border-primary/10 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          Weather Conditions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{weather.location}</p>
            <div className="flex items-center gap-3">
              <motion.div
                key={weather.icon}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {getWeatherIcon()}
              </motion.div>
              <div>
                <p className="text-2xl font-bold">{Math.round(weather.temperature)}°C</p>
                <p className="text-sm text-muted-foreground">{weather.condition}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Humidity</p>
            <p className="text-lg font-semibold">{Math.round(weather.humidity)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
