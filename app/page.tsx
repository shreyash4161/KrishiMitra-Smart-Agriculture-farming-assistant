"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { SensorCard } from "@/components/sensor-card"
import { SensorChart } from "@/components/sensor-chart"
import { WeatherCard } from "@/components/weather-card"
import { QuickTipsCard } from "@/components/quick-tips-card"
import { Thermometer, Droplets, Wind, Waves, RefreshCw, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

interface SensorReading {
  temperature: number
  ph: number
  humidity: number
  salinity: number
  timestamp: string
}

interface ChartData {
  time: string
  value: number
}

export default function Dashboard() {
  const { t } = useLanguage()
  const [currentReading, setCurrentReading] = useState<SensorReading>({
    temperature: 25.0,
    ph: 6.5,
    humidity: 65.0,
    salinity: 8.0,
    timestamp: new Date().toLocaleTimeString(),
  })

  const [temperatureData, setTemperatureData] = useState<ChartData[]>([])
  const [phData, setPhData] = useState<ChartData[]>([])
  const [humidityData, setHumidityData] = useState<ChartData[]>([])
  const [salinityData, setSalinityData] = useState<ChartData[]>([])

  const generateReading = (): SensorReading => ({
    temperature: 20 + Math.random() * 20,
    ph: 4 + Math.random() * 5,
    humidity: 30 + Math.random() * 60,
    salinity: Math.random() * 20,
    timestamp: new Date().toLocaleTimeString(),
  })

  useEffect(() => {
    const updateInterval = () => Math.random() * 5000 + 5000

    let timeoutId: NodeJS.Timeout

    const scheduleNextUpdate = () => {
      timeoutId = setTimeout(() => {
        const newReading = generateReading()
        setCurrentReading(newReading)

        const timeStr = new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })

        setTemperatureData((prev) => [...prev.slice(-29), { time: timeStr, value: newReading.temperature }])
        setPhData((prev) => [...prev.slice(-29), { time: timeStr, value: newReading.ph }])
        setHumidityData((prev) => [...prev.slice(-29), { time: timeStr, value: newReading.humidity }])
        setSalinityData((prev) => [...prev.slice(-29), { time: timeStr, value: newReading.salinity }])

        scheduleNextUpdate()
      }, updateInterval())
    }

    const initialReading = generateReading()
    setCurrentReading(initialReading)
    const initialTime = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    })

    setTemperatureData([{ time: initialTime, value: initialReading.temperature }])
    setPhData([{ time: initialTime, value: initialReading.ph }])
    setHumidityData([{ time: initialTime, value: initialReading.humidity }])
    setSalinityData([{ time: initialTime, value: initialReading.salinity }])

    scheduleNextUpdate()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  const getTemperatureAlert = (temp: number) => {
    if (temp > 35) return { level: "critical", message: t.highTemperature }
    if (temp < 22) return { level: "warning", message: t.lowTemperature }
    return null
  }

  const getPhAlert = (ph: number) => {
    if (ph < 5) return { level: "critical", message: t.phTooAcidic }
    if (ph > 8) return { level: "critical", message: t.phTooAlkaline }
    if (ph < 5.5 || ph > 7.5) return { level: "warning", message: "pH approaching limits" }
    return null
  }

  const getHumidityAlert = (humidity: number) => {
    if (humidity > 85) return { level: "critical", message: t.highHumidity }
    if (humidity < 35) return { level: "critical", message: t.lowHumidity }
    if (humidity > 80 || humidity < 40) return { level: "warning", message: "Humidity suboptimal" }
    return null
  }

  const getSalinityAlert = (salinity: number) => {
    if (salinity > 15) return { level: "critical", message: t.highSalinity }
    if (salinity > 12) return { level: "warning", message: "Salinity elevated" }
    return null
  }

  const manualRefresh = () => {
    const newReading = generateReading()
    setCurrentReading(newReading)
  }

  const getAlertStatus = (alertResult: any) => {
    if (!alertResult) return { isAlert: false, level: "normal" }
    return { isAlert: true, level: alertResult.level, message: alertResult.message }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23059669' fillOpacity='1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <Navigation />

      <main className="container mx-auto px-4 py-6 relative">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <motion.div
              className="flex items-center gap-3 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="p-2 bg-primary/10 rounded-xl farm-sway">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground text-balance">KrishiMitra</h1>
                <p className="text-sm text-muted-foreground font-medium">Smart Farming Dashboard</p>
              </div>
            </motion.div>
            <motion.p
              className="text-muted-foreground text-pretty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {t.liveReadings} • {t.lastUpdated}: {currentReading.timestamp}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <Button
              onClick={manualRefresh}
              variant="outline"
              size="sm"
              className="hover:bg-primary/5 bg-transparent border-primary/20 hover:border-primary/40 transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t.refresh}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <WeatherCard />
          <QuickTipsCard />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {[
            {
              title: t.temperature,
              value: currentReading.temperature,
              unit: t.celsius,
              icon: <Thermometer className="h-5 w-5" />,
              alert: getAlertStatus(getTemperatureAlert(currentReading.temperature)),
              trend: currentReading.temperature > 30 ? "up" : currentReading.temperature < 25 ? "down" : "stable",
              color: "hsl(var(--chart-4))",
            },
            {
              title: t.phLevel,
              value: currentReading.ph,
              unit: "",
              icon: <Droplets className="h-5 w-5" />,
              alert: getAlertStatus(getPhAlert(currentReading.ph)),
              trend: currentReading.ph > 7 ? "up" : currentReading.ph < 6 ? "down" : "stable",
              color: "hsl(var(--chart-5))",
            },
            {
              title: t.humidity,
              value: currentReading.humidity,
              unit: t.percent,
              icon: <Wind className="h-5 w-5" />,
              alert: getAlertStatus(getHumidityAlert(currentReading.humidity)),
              trend: currentReading.humidity > 70 ? "up" : currentReading.humidity < 50 ? "down" : "stable",
              color: "hsl(var(--chart-3))",
            },
            {
              title: t.salinity,
              value: currentReading.salinity,
              unit: t.psu,
              icon: <Waves className="h-5 w-5" />,
              alert: getAlertStatus(getSalinityAlert(currentReading.salinity)),
              trend: currentReading.salinity > 12 ? "up" : "stable",
              color: "hsl(var(--chart-1))",
            },
          ].map((sensor, index) => (
            <motion.div
              key={sensor.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
              className="grow-in"
            >
              <SensorCard
                title={sensor.title}
                value={sensor.value}
                unit={sensor.unit}
                icon={sensor.icon}
                isAlert={sensor.alert.isAlert}
                alertMessage={sensor.alert.message}
                alertLevel={sensor.alert.level}
                trend={sensor.trend}
                color={sensor.color}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          {[
            { title: t.temperature, data: temperatureData, color: "hsl(var(--chart-4))", unit: t.celsius },
            { title: t.phLevel, data: phData, color: "hsl(var(--chart-5))", unit: "" },
            { title: t.humidity, data: humidityData, color: "hsl(var(--chart-3))", unit: t.percent },
            { title: t.salinity, data: salinityData, color: "hsl(var(--chart-1))", unit: t.psu },
          ].map((chart, index) => (
            <motion.div
              key={chart.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
            >
              <SensorChart {...chart} />
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}
