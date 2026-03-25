"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface SensorCardProps {
  title: string
  value: number
  unit: string
  icon: React.ReactNode
  trend?: "up" | "down" | "stable"
  isAlert?: boolean
  alertMessage?: string
  alertLevel?: "normal" | "warning" | "critical"
  className?: string
  color?: string
}

export function SensorCard({
  title,
  value,
  unit,
  icon,
  trend = "stable",
  isAlert = false,
  alertMessage,
  alertLevel = "normal",
  className,
  color,
}: SensorCardProps) {
  const { t } = useLanguage()
  const [displayValue, setDisplayValue] = useState(0)
  const [prevValue, setPrevValue] = useState(value)

  useEffect(() => {
    if (Math.abs(value - prevValue) > 0.1) {
      const duration = 1000 // 1 second animation
      const steps = 30
      const stepValue = (value - displayValue) / steps
      let currentStep = 0

      const interval = setInterval(() => {
        currentStep++
        setDisplayValue((prev) => {
          const newValue = prev + stepValue
          if (currentStep >= steps) {
            clearInterval(interval)
            return value
          }
          return newValue
        })
      }, duration / steps)

      setPrevValue(value)
      return () => clearInterval(interval)
    } else {
      setDisplayValue(value)
    }
  }, [value, displayValue, prevValue])

  const getCardStyle = () => {
    if (alertLevel === "critical") {
      return "border-destructive/50 bg-destructive/5 shadow-lg shadow-destructive/20"
    }
    if (alertLevel === "warning") {
      return "border-yellow-500/50 bg-yellow-500/5 shadow-lg shadow-yellow-500/20"
    }
    return "border-border hover:shadow-md"
  }

  const getStatusIcon = () => {
    if (alertLevel === "critical") {
      return <AlertTriangle className="h-4 w-4 text-destructive" />
    }
    if (alertLevel === "warning") {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className={cn("relative transition-all duration-300", getCardStyle(), className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="text-muted-foreground">{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <motion.div
                className="text-2xl font-bold text-foreground"
                key={Math.floor(displayValue * 10)} // Re-trigger animation on significant changes
                initial={{ scale: 1.1, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {displayValue.toFixed(1)}
                {unit}
              </motion.div>

              {isAlert && alertMessage && (
                <motion.div
                  className="flex items-center gap-1 mt-1"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <AlertTriangle
                    className={cn("h-3 w-3", alertLevel === "critical" ? "text-destructive" : "text-yellow-500")}
                  />
                  <span className={cn("text-xs", alertLevel === "critical" ? "text-destructive" : "text-yellow-600")}>
                    {alertMessage}
                  </span>
                </motion.div>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}>
                {getStatusIcon()}
              </motion.div>

              {/* Trend indicator */}
              <div className="flex items-center gap-1">
                {trend === "up" && (
                  <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </motion.div>
                )}
                {trend === "down" && (
                  <motion.div
                    initial={{ y: -5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  </motion.div>
                )}

                {isAlert && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }}>
                    <Badge
                      variant={alertLevel === "critical" ? "destructive" : "secondary"}
                      className={cn(
                        "text-xs",
                        alertLevel === "warning" && "bg-yellow-500 text-white hover:bg-yellow-600",
                      )}
                    >
                      {alertLevel === "critical" ? "Critical" : alertLevel === "warning" ? "Warning" : t.alert}
                    </Badge>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
