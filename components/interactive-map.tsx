"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Save, RotateCcw, MapPin } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface Point {
  x: number
  y: number
  id: string
}

interface Field {
  id: string
  name: string
  points: Point[]
  area?: number
  color: string
}

const FIELD_COLORS = [
  "#10b981", // emerald
  "#f59e0b", // amber
  "#3b82f6", // blue
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
]

export function InteractiveMap() {
  const { t } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentPoints, setCurrentPoints] = useState<Point[]>([])
  const [fields, setFields] = useState<Field[]>([])
  const [fieldName, setFieldName] = useState("")
  const [isDrawing, setIsDrawing] = useState(false)
  const [selectedField, setSelectedField] = useState<string | null>(null)

  // Load fields from localStorage on mount
  useEffect(() => {
    const savedFields = localStorage.getItem("smart-farm-fields")
    if (savedFields) {
      try {
        setFields(JSON.parse(savedFields))
      } catch (error) {
        console.error("Failed to load saved fields:", error)
      }
    }
  }, [])

  // Save fields to localStorage whenever fields change
  useEffect(() => {
    localStorage.setItem("smart-farm-fields", JSON.stringify(fields))
  }, [fields])

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid background
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    for (let i = 0; i <= canvas.width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i <= canvas.height; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw existing fields
    fields.forEach((field) => {
      if (field.points.length > 2) {
        // Fill polygon
        ctx.fillStyle = field.color + "20" // 20% opacity
        ctx.beginPath()
        ctx.moveTo(field.points[0].x, field.points[0].y)
        field.points.forEach((point) => {
          ctx.lineTo(point.x, point.y)
        })
        ctx.closePath()
        ctx.fill()

        // Draw polygon outline
        ctx.strokeStyle = field.color
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw field name
        if (field.points.length > 0) {
          const centerX = field.points.reduce((sum, p) => sum + p.x, 0) / field.points.length
          const centerY = field.points.reduce((sum, p) => sum + p.y, 0) / field.points.length
          ctx.fillStyle = field.color
          ctx.font = "14px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(field.name, centerX, centerY)
        }
      }

      // Draw field points
      field.points.forEach((point, index) => {
        ctx.fillStyle = field.color
        ctx.beginPath()
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI)
        ctx.fill()

        // Draw point number
        ctx.fillStyle = "white"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText((index + 1).toString(), point.x, point.y + 3)
      })
    })

    // Draw current drawing points
    if (currentPoints.length > 0) {
      // Draw lines between points
      if (currentPoints.length > 1) {
        ctx.strokeStyle = "#10b981"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(currentPoints[0].x, currentPoints[0].y)
        currentPoints.forEach((point) => {
          ctx.lineTo(point.x, point.y)
        })
        ctx.stroke()
      }

      // Draw points
      currentPoints.forEach((point, index) => {
        ctx.fillStyle = "#10b981"
        ctx.beginPath()
        ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI)
        ctx.fill()

        // Draw point number
        ctx.fillStyle = "white"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText((index + 1).toString(), point.x, point.y + 4)
      })

      // Draw preview polygon if we have 3+ points
      if (currentPoints.length >= 3) {
        ctx.fillStyle = "#10b98120"
        ctx.beginPath()
        ctx.moveTo(currentPoints[0].x, currentPoints[0].y)
        currentPoints.forEach((point) => {
          ctx.lineTo(point.x, point.y)
        })
        ctx.closePath()
        ctx.fill()
      }
    }
  }, [currentPoints, fields])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const newPoint: Point = {
      x,
      y,
      id: Date.now().toString(),
    }

    setCurrentPoints((prev) => [...prev, newPoint])
  }

  const calculateArea = (points: Point[]): number => {
    if (points.length < 3) return 0

    let area = 0
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length
      area += points[i].x * points[j].y
      area -= points[j].x * points[i].y
    }
    return Math.abs(area) / 2
  }

  const saveField = () => {
    if (currentPoints.length < 3 || !fieldName.trim()) return

    const area = calculateArea(currentPoints)
    const newField: Field = {
      id: Date.now().toString(),
      name: fieldName.trim(),
      points: currentPoints,
      area,
      color: FIELD_COLORS[fields.length % FIELD_COLORS.length],
    }

    setFields((prev) => [...prev, newField])
    setCurrentPoints([])
    setFieldName("")
    setIsDrawing(false)
  }

  const deleteField = (fieldId: string) => {
    setFields((prev) => prev.filter((field) => field.id !== fieldId))
    if (selectedField === fieldId) {
      setSelectedField(null)
    }
  }

  const resetCurrentField = () => {
    setCurrentPoints([])
    setFieldName("")
  }

  const startDrawing = () => {
    setIsDrawing(true)
    setCurrentPoints([])
    setFieldName("")
  }

  return (
    <div className="space-y-6">
      {/* Map Canvas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t.interactiveFieldMap}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="border border-border rounded-lg cursor-crosshair w-full max-w-full hover:shadow-sm transition-shadow"
              onClick={handleCanvasClick}
              style={{ maxHeight: "500px" }}
            />
            {isDrawing && (
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm shadow-md">
                Click to add points • {currentPoints.length} {t.points.toLowerCase()} added
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Drawing Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t.fieldDrawing}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isDrawing ? (
              <Button onClick={startDrawing} className="w-full">
                {t.startDrawingField}
              </Button>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.fieldName}</label>
                  <Input
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    placeholder={t.enterFieldName}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={saveField}
                    disabled={currentPoints.length < 3 || !fieldName.trim()}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {t.saveField}
                  </Button>
                  <Button onClick={resetCurrentField} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {t.reset}
                  </Button>
                </div>

                {currentPoints.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {t.points}: {currentPoints.length}
                    {currentPoints.length >= 3 && (
                      <span className="ml-2">
                        • {t.estimatedArea}: {calculateArea(currentPoints).toFixed(0)} {t.sqUnits}
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Saved Fields */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t.savedFields} ({fields.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {fields.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">{t.noFieldsSaved}</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {fields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: field.color }} />
                      <div>
                        <div className="font-medium">{field.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {field.points.length} {t.points.toLowerCase()}
                          {field.area && (
                            <span className="ml-2">
                              • {field.area.toFixed(0)} {t.sqUnits}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => deleteField(field.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <h4 className="font-medium text-foreground">{t.howToUse}</h4>
            <ul className="list-disc list-inside space-y-1">
              {t.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
