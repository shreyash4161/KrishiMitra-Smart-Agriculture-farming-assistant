"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const farmingTips = [
  {
    title: "Optimal Watering Time",
    description: "Water your crops early morning (6-8 AM) to reduce evaporation and prevent fungal diseases.",
    category: "Irrigation",
  },
  {
    title: "Soil pH Management",
    description:
      "Most crops thrive in slightly acidic to neutral soil (pH 6.0-7.0). Test regularly and adjust accordingly.",
    category: "Soil Health",
  },
  {
    title: "Crop Rotation Benefits",
    description: "Rotate crops seasonally to prevent soil depletion and reduce pest buildup naturally.",
    category: "Crop Management",
  },
  {
    title: "Natural Pest Control",
    description: "Plant marigolds and neem trees around your fields to naturally repel harmful insects.",
    category: "Pest Control",
  },
  {
    title: "Harvest Timing",
    description: "Harvest vegetables in the early morning when they're crisp and have maximum water content.",
    category: "Harvesting",
  },
]

export function QuickTipsCard() {
  const [currentTip, setCurrentTip] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % farmingTips.length)
    }, 8000) // Change tip every 8 seconds

    return () => clearInterval(interval)
  }, [])

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % farmingTips.length)
  }

  return (
    <Card className="bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-950/20 dark:to-yellow-950/20 border-primary/10 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-primary" />
          Farming Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                {farmingTips[currentTip].category}
              </span>
              <Button variant="ghost" size="sm" onClick={nextTip} className="h-8 w-8 p-0 hover:bg-primary/10">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">{farmingTips[currentTip].title}</h4>
              <p className="text-sm text-muted-foreground text-pretty">{farmingTips[currentTip].description}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-1 mt-4">
          {farmingTips.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTip(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentTip ? "bg-primary w-6" : "bg-primary/20 w-1.5 hover:bg-primary/40"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
