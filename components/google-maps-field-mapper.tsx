"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Trash2,
  Save,
  RotateCcw,
  MapPin,
  Download,
  Satellite,
  MapIcon,
  Edit3,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getGoogleMapsApiKey } from "@/app/actions/maps"

interface LatLng {
  lat: number
  lng: number
}

interface Field {
  id: string
  name: string
  points: LatLng[]
  area?: number
  color: string
  soilType?: string
  cropType?: string
  visible?: boolean
}

const FIELD_COLORS = [
  "#10b981", // emerald
  "#f59e0b", // amber
  "#3b82f6", // blue
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#f97316", // orange
  "#84cc16", // lime
]

const SOIL_TYPES = ["Clay", "Sandy", "Loamy", "Silty", "Peaty", "Chalky"]
const CROP_TYPES = ["Wheat", "Rice", "Corn", "Sugarcane", "Cotton", "Soybean", "Vegetables", "Fruits"]

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export function GoogleMapsFieldMapper() {
  const { t } = useLanguage()
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [apiKeyError, setApiKeyError] = useState(false)
  const [currentPolygon, setCurrentPolygon] = useState<any>(null)
  const [fields, setFields] = useState<Field[]>([])
  const [fieldName, setFieldName] = useState("")
  const [soilType, setSoilType] = useState("")
  const [cropType, setCropType] = useState("")
  const [isDrawing, setIsDrawing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [mapType, setMapType] = useState<"satellite" | "roadmap">("satellite")
  const [currentPoints, setCurrentPoints] = useState<LatLng[]>([])
  const [fieldPolygons, setFieldPolygons] = useState<Map<string, any>>(new Map())

  // Load Google Maps API
  useEffect(() => {
    if (window.google) {
      setIsLoaded(true)
      return
    }

    const loadGoogleMaps = async () => {
      try {
        const result = await getGoogleMapsApiKey()

        if (!result.success) {
          setApiKeyError(true)
          return
        }

        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=${result.apiKey}&libraries=geometry,drawing`
        script.async = true
        script.defer = true

        window.initMap = () => {
          setIsLoaded(true)
        }

        script.onload = () => {
          if (window.google) {
            setIsLoaded(true)
          }
        }

        script.onerror = () => {
          setApiKeyError(true)
        }

        document.head.appendChild(script)
      } catch (error) {
        console.error("Failed to load Google Maps API key:", error)
        setApiKeyError(true)
      }
    }

    loadGoogleMaps()
  }, [])

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return

    const puneCenter = { lat: 18.5204, lng: 73.8567 }

    const newMap = new window.google.maps.Map(mapRef.current, {
      center: puneCenter,
      zoom: 15,
      mapTypeId: mapType,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    })

    setMap(newMap)
  }, [isLoaded, mapType])

  // Load saved fields
  useEffect(() => {
    const savedFields = localStorage.getItem("farmlens-fields")
    if (savedFields) {
      try {
        const parsedFields = JSON.parse(savedFields)
        setFields(parsedFields.map((field: Field) => ({ ...field, visible: field.visible !== false })))
      } catch (error) {
        console.error("Failed to load saved fields:", error)
      }
    }
  }, [])

  // Save fields to localStorage
  useEffect(() => {
    localStorage.setItem("farmlens-fields", JSON.stringify(fields))
  }, [fields])

  useEffect(() => {
    if (!map || !window.google) return

    // Clear existing polygons
    fieldPolygons.forEach((polygon) => {
      polygon.setMap(null)
    })
    fieldPolygons.clear()

    fields.forEach((field) => {
      if (field.points.length >= 3 && field.visible !== false) {
        const polygon = new window.google.maps.Polygon({
          paths: field.points,
          strokeColor: field.color,
          strokeOpacity: selectedFieldId === field.id ? 1 : 0.8,
          strokeWeight: selectedFieldId === field.id ? 3 : 2,
          fillColor: field.color,
          fillOpacity: selectedFieldId === field.id ? 0.3 : 0.2,
          editable: editingFieldId === field.id,
          draggable: false,
        })

        polygon.setMap(map)
        fieldPolygons.set(field.id, polygon)

        // Add click listener for selection
        polygon.addListener("click", () => {
          setSelectedFieldId(selectedFieldId === field.id ? null : field.id)
        })

        // Add path change listener for editing
        if (editingFieldId === field.id) {
          polygon.getPath().addListener("set_at", () => {
            updateFieldFromPolygon(field.id, polygon)
          })
          polygon.getPath().addListener("insert_at", () => {
            updateFieldFromPolygon(field.id, polygon)
          })
          polygon.getPath().addListener("remove_at", () => {
            updateFieldFromPolygon(field.id, polygon)
          })
        }

        // Add field label
        const bounds = new window.google.maps.LatLngBounds()
        field.points.forEach((point) => bounds.extend(point))
        const center = bounds.getCenter()

        const marker = new window.google.maps.Marker({
          position: center,
          map: map,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="120" height="35" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="35" rx="17" fill="${field.color}" fillOpacity="0.9" stroke="white" strokeWidth="2"/>
                <text x="60" y="23" textAnchor="middle" fill="white" fontFamily="Arial" fontSize="12" fontWeight="bold">${field.name}</text>
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(120, 35),
            anchor: new window.google.maps.Point(60, 17),
          },
        })

        marker.addListener("click", () => {
          setSelectedFieldId(selectedFieldId === field.id ? null : field.id)
        })
      }
    })

    setFieldPolygons(new Map(fieldPolygons))
  }, [map, fields, selectedFieldId, editingFieldId])

  const updateFieldFromPolygon = (fieldId: string, polygon: any) => {
    const path = polygon.getPath()
    const points: LatLng[] = []

    for (let i = 0; i < path.getLength(); i++) {
      const latLng = path.getAt(i)
      points.push({
        lat: latLng.lat(),
        lng: latLng.lng(),
      })
    }

    setFields((prev) =>
      prev.map((field) => (field.id === fieldId ? { ...field, points, area: calculatePolygonArea(points) } : field)),
    )
  }

  const calculatePolygonArea = (points: LatLng[]): number => {
    if (!window.google || points.length < 3) return 0

    const path = points.map((point) => new window.google.maps.LatLng(point.lat, point.lng))
    return window.google.maps.geometry.spherical.computeArea(path)
  }

  const startDrawing = () => {
    if (!map) return

    setIsDrawing(true)
    setCurrentPoints([])
    setFieldName("")
    setSoilType("")
    setCropType("")
    setSelectedFieldId(null)
    setEditingFieldId(null)

    // Remove existing polygon if any
    if (currentPolygon) {
      currentPolygon.setMap(null)
    }

    const polygon = new window.google.maps.Polygon({
      strokeColor: "#10b981",
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: "#10b981",
      fillOpacity: 0.2,
      editable: true,
      draggable: false,
    })

    polygon.setMap(map)
    setCurrentPolygon(polygon)

    // Add click listener to map
    const clickListener = map.addListener("click", (event: any) => {
      const newPoint = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      }

      setCurrentPoints((prev) => {
        const updated = [...prev, newPoint]
        polygon.setPath(updated)
        return updated
      })
    })

    // Store listener for cleanup
    polygon.clickListener = clickListener
  }

  const startEditingField = (fieldId: string) => {
    setIsEditing(true)
    setEditingFieldId(fieldId)
    setSelectedFieldId(fieldId)
    setIsDrawing(false)

    const field = fields.find((f) => f.id === fieldId)
    if (field) {
      setFieldName(field.name)
      setSoilType(field.soilType || "")
      setCropType(field.cropType || "")
    }
  }

  const stopEditingField = () => {
    setIsEditing(false)
    setEditingFieldId(null)
    setFieldName("")
    setSoilType("")
    setCropType("")
  }

  const toggleFieldVisibility = (fieldId: string) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId ? { ...field, visible: field.visible !== false ? false : true } : field,
      ),
    )
  }

  const saveField = () => {
    if (editingFieldId) {
      // Update existing field
      setFields((prev) =>
        prev.map((field) =>
          field.id === editingFieldId
            ? {
                ...field,
                name: fieldName.trim(),
                soilType: soilType || undefined,
                cropType: cropType || undefined,
              }
            : field,
        ),
      )
      stopEditingField()
    } else {
      // Create new field
      if (currentPoints.length < 3 || !fieldName.trim()) return

      const area = calculatePolygonArea(currentPoints)
      const newField: Field = {
        id: Date.now().toString(),
        name: fieldName.trim(),
        points: currentPoints,
        area,
        color: FIELD_COLORS[fields.length % FIELD_COLORS.length],
        soilType: soilType || undefined,
        cropType: cropType || undefined,
        visible: true,
      }

      setFields((prev) => [...prev, newField])
      resetDrawing()
    }
  }

  const resetDrawing = () => {
    if (currentPolygon) {
      if (currentPolygon.clickListener) {
        window.google.maps.event.removeListener(currentPolygon.clickListener)
      }
      currentPolygon.setMap(null)
      setCurrentPolygon(null)
    }

    setCurrentPoints([])
    setFieldName("")
    setSoilType("")
    setCropType("")
    setIsDrawing(false)
  }

  const deleteField = (fieldId: string) => {
    setFields((prev) => prev.filter((field) => field.id !== fieldId))
    if (selectedFieldId === fieldId) setSelectedFieldId(null)
    if (editingFieldId === fieldId) stopEditingField()
  }

  const exportFields = (format: "json" | "csv" = "json") => {
    if (format === "json") {
      const dataStr = JSON.stringify(fields, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = "farmlens-fields.json"
      link.click()
      URL.revokeObjectURL(url)
    } else {
      const csvHeader = "Name,Soil Type,Crop Type,Area (hectares),Points,Color\n"
      const csvData = fields
        .map(
          (field) =>
            `"${field.name}","${field.soilType || ""}","${field.cropType || ""}","${field.area ? (field.area / 10000).toFixed(2) : ""}","${field.points.length}","${field.color}"`,
        )
        .join("\n")

      const dataBlob = new Blob([csvHeader + csvData], { type: "text/csv" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = "farmlens-fields.csv"
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const toggleMapType = () => {
    const newType = mapType === "satellite" ? "roadmap" : "satellite"
    setMapType(newType)
    if (map) {
      map.setMapTypeId(newType)
    }
  }

  const focusOnField = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId)
    if (field && field.points.length > 0 && map) {
      const bounds = new window.google.maps.LatLngBounds()
      field.points.forEach((point) => bounds.extend(point))
      map.fitBounds(bounds)
      setSelectedFieldId(fieldId)
    }
  }

  if (apiKeyError) {
    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {t.interactiveFieldMap} - Setup Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="space-y-4">
                <p>Google Maps API key is required to use the field mapping feature.</p>
                <div className="space-y-2">
                  <p className="font-medium">To set up Google Maps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>
                      Go to the{" "}
                      <a
                        href="https://console.cloud.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Google Cloud Console
                      </a>
                    </li>
                    <li>Create a new project or select an existing one</li>
                    <li>Enable the Maps JavaScript API and Geometry Library</li>
                    <li>Create an API key and restrict it to your domain</li>
                    <li>Add the API key to your Vercel project:</li>
                  </ol>
                  <div className="bg-muted p-3 rounded-md text-sm font-mono">
                    <p>
                      Environment Variable Name: <strong>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</strong>
                    </p>
                    <p>Value: Your Google Maps API key</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add this environment variable in your Vercel Project Settings → Environment Variables
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {t.interactiveFieldMap} - Pune, India
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={toggleMapType}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-transparent"
                >
                  {mapType === "satellite" ? <MapIcon className="h-4 w-4" /> : <Satellite className="h-4 w-4" />}
                  {mapType === "satellite" ? "Road View" : "Satellite"}
                </Button>
                {fields.length > 0 && (
                  <>
                    <Button
                      onClick={() => exportFields("json")}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Download className="h-4 w-4" />
                      JSON
                    </Button>
                    <Button
                      onClick={() => exportFields("csv")}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Download className="h-4 w-4" />
                      CSV
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div
                ref={mapRef}
                className="w-full h-[500px] rounded-lg border border-border"
                style={{ minHeight: "500px" }}
              />
              {!isLoaded && !apiKeyError && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading Google Maps...</p>
                  </div>
                </div>
              )}
              {isDrawing && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg"
                >
                  Click on map to add points • {currentPoints.length} points added
                </motion.div>
              )}
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
                >
                  Editing mode • Drag points to modify field
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Field" : t.fieldDrawing}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isDrawing && !isEditing ? (
                <Button onClick={startDrawing} className="w-full" disabled={!isLoaded}>
                  {t.startDrawingField}
                </Button>
              ) : (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t.fieldName}</label>
                      <Input
                        value={fieldName}
                        onChange={(e) => setFieldName(e.target.value)}
                        placeholder={t.enterFieldName}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Soil Type</label>
                        <Select value={soilType} onValueChange={setSoilType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select soil type" />
                          </SelectTrigger>
                          <SelectContent>
                            {SOIL_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Crop Type</label>
                        <Select value={cropType} onValueChange={setCropType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select crop type" />
                          </SelectTrigger>
                          <SelectContent>
                            {CROP_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={saveField}
                        disabled={
                          (!isEditing && (currentPoints.length < 3 || !fieldName.trim())) ||
                          (isEditing && !fieldName.trim())
                        }
                        className="flex-1"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isEditing ? "Update Field" : t.saveField}
                      </Button>
                      <Button onClick={isEditing ? stopEditingField : resetDrawing} variant="outline">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        {isEditing ? "Cancel" : t.reset}
                      </Button>
                    </div>

                    {currentPoints.length > 0 && !isEditing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-muted-foreground"
                      >
                        Points: {currentPoints.length}
                        {currentPoints.length >= 3 && (
                          <span className="ml-2">
                            • Area: {(calculatePolygonArea(currentPoints) / 10000).toFixed(2)} hectares
                          </span>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Saved Fields */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {t.savedFields} ({fields.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fields.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">{t.noFieldsSaved}</p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  <AnimatePresence>
                    {fields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 border rounded-lg transition-all ${
                          selectedFieldId === field.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div
                              className="w-4 h-4 rounded-full mt-1 cursor-pointer"
                              style={{ backgroundColor: field.color }}
                              onClick={() => focusOnField(field.id)}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{field.name}</span>
                                {selectedFieldId === field.id && (
                                  <Badge variant="secondary" className="text-xs">
                                    Selected
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {field.points.length} points
                                {field.area && (
                                  <span className="ml-2">• {(field.area / 10000).toFixed(2)} hectares</span>
                                )}
                              </div>
                              {(field.soilType || field.cropType) && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {field.soilType && <span>Soil: {field.soilType}</span>}
                                  {field.soilType && field.cropType && <span> • </span>}
                                  {field.cropType && <span>Crop: {field.cropType}</span>}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              onClick={() => toggleFieldVisibility(field.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              {field.visible !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </Button>
                            <Button
                              onClick={() => startEditingField(field.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              disabled={isDrawing || isEditing}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => deleteField(field.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
