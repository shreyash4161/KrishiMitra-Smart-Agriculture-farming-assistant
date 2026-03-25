"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ExportDialog } from "@/components/export-dialog"
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
  Calculator,
  Layers,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"

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
    L: any
  }
}

export function LeafletFieldMapper() {
  const { t } = useLanguage()
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
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
  const [currentPolygon, setCurrentPolygon] = useState<any>(null)
  const [drawingMarkers, setDrawingMarkers] = useState<any[]>([])
  const [editingPolygon, setEditingPolygon] = useState<any>(null)

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== "undefined" && !window.L) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)

        const script = document.createElement("script")
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        script.onload = () => {
          setIsLoaded(true)
        }
        document.head.appendChild(script)
      } else if (window.L) {
        setIsLoaded(true)
      }
    }

    loadLeaflet()
  }, [])

  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return

    const puneCenter: [number, number] = [18.5204, 73.8567]

    const newMap = window.L.map(mapRef.current, {
      center: puneCenter,
      zoom: 13,
      zoomControl: true,
      attributionControl: true,
    })

    const satelliteLayer = window.L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "© Esri, Maxar, Earthstar Geographics",
        maxZoom: 19,
        fadeAnimation: true,
      },
    )

    const roadLayer = window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
      fadeAnimation: true,
    })

    if (mapType === "satellite") {
      satelliteLayer.addTo(newMap)
    } else {
      roadLayer.addTo(newMap)
    }

    newMap.satelliteLayer = satelliteLayer
    newMap.roadLayer = roadLayer

    newMap.options.zoomAnimation = true
    newMap.options.fadeAnimation = true
    newMap.options.markerZoomAnimation = true

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
    if (!map || !window.L) return

    // Clear existing polygons
    fieldPolygons.forEach((polygonData) => {
      map.removeLayer(polygonData.polygon)
      if (polygonData.marker) map.removeLayer(polygonData.marker)
    })
    fieldPolygons.clear()

    fields.forEach((field) => {
      if (field.points.length >= 3 && field.visible !== false) {
        const latLngs = field.points.map((point) => [point.lat, point.lng])

        const polygon = window.L.polygon(latLngs, {
          color: field.color,
          weight: selectedFieldId === field.id ? 4 : 2,
          opacity: selectedFieldId === field.id ? 1 : 0.8,
          fillColor: field.color,
          fillOpacity: selectedFieldId === field.id ? 0.4 : 0.2,
          className: "field-polygon-smooth",
        })

        polygon.addTo(map)

        polygon.on("click", (e) => {
          e.originalEvent.stopPropagation()
          setSelectedFieldId(selectedFieldId === field.id ? null : field.id)
        })

        polygon.on("mouseover", () => {
          if (selectedFieldId !== field.id) {
            polygon.setStyle({
              weight: 3,
              fillOpacity: 0.3,
            })
          }
        })

        polygon.on("mouseout", () => {
          if (selectedFieldId !== field.id) {
            polygon.setStyle({
              weight: 2,
              fillOpacity: 0.2,
            })
          }
        })

        const bounds = window.L.latLngBounds(latLngs)
        const center = bounds.getCenter()

        const marker = window.L.marker(center, {
          icon: window.L.divIcon({
            className: "field-label-enhanced",
            html: `<div style="
              background: ${field.color}; 
              color: white; 
              padding: 6px 12px; 
              border-radius: 16px; 
              font-size: 12px; 
              font-weight: 600; 
              border: 2px solid white;
              box-shadow: 0 4px 8px rgba(0,0,0,0.3);
              white-space: nowrap;
              transition: all 0.2s ease;
              cursor: pointer;
            ">${field.name}</div>`,
            iconSize: [140, 28],
            iconAnchor: [70, 14],
          }),
        })

        marker.addTo(map)
        marker.on("click", (e) => {
          e.originalEvent.stopPropagation()
          setSelectedFieldId(selectedFieldId === field.id ? null : field.id)
        })

        fieldPolygons.set(field.id, { polygon, marker })
      }
    })

    setFieldPolygons(new Map(fieldPolygons))
  }, [map, fields, selectedFieldId])

  const calculatePolygonArea = (points: LatLng[]): number => {
    if (points.length < 3) return 0

    const earthRadius = 6371000 // meters
    let area = 0

    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length
      const lat1 = (points[i].lat * Math.PI) / 180
      const lat2 = (points[j].lat * Math.PI) / 180
      const lng1 = (points[i].lng * Math.PI) / 180
      const lng2 = (points[j].lng * Math.PI) / 180

      area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2))
    }

    area = Math.abs((area * earthRadius * earthRadius) / 2)
    return area
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

    // Clear existing drawing markers
    drawingMarkers.forEach((marker) => map.removeLayer(marker))
    setDrawingMarkers([])

    if (currentPolygon) {
      map.removeLayer(currentPolygon)
    }

    const onMapClick = (e: any) => {
      const newPoint = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      }

      setCurrentPoints((prev) => {
        const updated = [...prev, newPoint]

        const marker = window.L.circleMarker([newPoint.lat, newPoint.lng], {
          color: "#10b981",
          fillColor: "#10b981",
          fillOpacity: 0.8,
          radius: 8,
          weight: 2,
          className: "drawing-point-marker",
        }).addTo(map)

        // Add connecting lines between points
        if (updated.length > 1) {
          const prevPoint = updated[updated.length - 2]
          const line = window.L.polyline(
            [
              [prevPoint.lat, prevPoint.lng],
              [newPoint.lat, newPoint.lng],
            ],
            {
              color: "#10b981",
              weight: 3,
              opacity: 0.8,
              dashArray: "5, 5",
            },
          ).addTo(map)

          setDrawingMarkers((prevMarkers) => [...prevMarkers, marker, line])
        } else {
          setDrawingMarkers((prevMarkers) => [...prevMarkers, marker])
        }

        // Draw polygon if we have 3+ points
        if (updated.length >= 3) {
          if (currentPolygon) {
            map.removeLayer(currentPolygon)
          }

          const latLngs = updated.map((point) => [point.lat, point.lng])
          const polygon = window.L.polygon(latLngs, {
            color: "#10b981",
            weight: 3,
            opacity: 0.8,
            fillColor: "#10b981",
            fillOpacity: 0.3,
            className: "drawing-polygon",
          }).addTo(map)

          setCurrentPolygon(polygon)
        }

        return updated
      })
    }

    map.on("click", onMapClick)
    map.clickHandler = onMapClick
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

      // Create editable polygon
      const latLngs = field.points.map((point) => [point.lat, point.lng])
      const editPolygon = window.L.polygon(latLngs, {
        color: field.color,
        weight: 3,
        opacity: 1,
        fillColor: field.color,
        fillOpacity: 0.3,
      }).addTo(map)

      // Make polygon editable by adding draggable markers at each point
      const editMarkers: any[] = []
      field.points.forEach((point, index) => {
        const marker = window.L.marker([point.lat, point.lng], {
          draggable: true,
          icon: window.L.divIcon({
            className: "edit-point-marker",
            html: `<div style="
              width: 12px; 
              height: 12px; 
              background: ${field.color}; 
              border: 2px solid white; 
              border-radius: 50%; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              cursor: move;
            "></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6],
          }),
        }).addTo(map)

        marker.on("drag", () => {
          const newLatLng = marker.getLatLng()
          const newPoints = [...field.points]
          newPoints[index] = { lat: newLatLng.lat, lng: newLatLng.lng }

          // Update polygon
          const newLatLngs = newPoints.map((p) => [p.lat, p.lng])
          editPolygon.setLatLngs(newLatLngs)

          // Update field in state
          setFields((prev) =>
            prev.map((f) =>
              f.id === fieldId ? { ...f, points: newPoints, area: calculatePolygonArea(newPoints) } : f,
            ),
          )
        })

        editMarkers.push(marker)
      })

      setEditingPolygon({ polygon: editPolygon, markers: editMarkers })
    }
  }

  const stopEditingField = () => {
    if (editingPolygon) {
      map.removeLayer(editingPolygon.polygon)
      editingPolygon.markers.forEach((marker: any) => map.removeLayer(marker))
      setEditingPolygon(null)
    }

    setIsEditing(false)
    setEditingFieldId(null)
    setFieldName("")
    setSoilType("")
    setCropType("")
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
    if (map && map.clickHandler) {
      map.off("click", map.clickHandler)
    }

    if (currentPolygon) {
      map.removeLayer(currentPolygon)
      setCurrentPolygon(null)
    }

    drawingMarkers.forEach((marker) => map.removeLayer(marker))
    setDrawingMarkers([])

    setCurrentPoints([])
    setFieldName("")
    setSoilType("")
    setCropType("")
    setIsDrawing(false)
  }

  const toggleFieldVisibility = (fieldId: string) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId ? { ...field, visible: field.visible !== false ? false : true } : field,
      ),
    )
  }

  const deleteField = (fieldId: string) => {
    setFields((prev) => prev.filter((field) => field.id !== fieldId))
    if (selectedFieldId === fieldId) setSelectedFieldId(null)
    if (editingFieldId === fieldId) stopEditingField()
  }

  const toggleMapType = () => {
    if (!map) return

    const newType = mapType === "satellite" ? "roadmap" : "satellite"
    setMapType(newType)

    if (mapType === "satellite") {
      map.removeLayer(map.satelliteLayer)
      map.roadLayer.addTo(map)
    } else {
      map.removeLayer(map.roadLayer)
      map.satelliteLayer.addTo(map)
    }
  }

  const focusOnField = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId)
    if (field && field.points.length > 0 && map) {
      const latLngs = field.points.map((point) => [point.lat, point.lng])
      const bounds = window.L.latLngBounds(latLngs)
      map.fitBounds(bounds, { padding: [20, 20], animate: true, duration: 1 })
      setSelectedFieldId(fieldId)
    }
  }

  useEffect(() => {
    if (typeof document !== "undefined") {
      const style = document.createElement("style")
      style.textContent = `
        .field-polygon-smooth {
          transition: all 0.3s ease !important;
        }
        .field-label-enhanced:hover {
          transform: scale(1.05);
        }
        .drawing-point-marker {
          animation: pulse 1s infinite;
        }
        .edit-point-marker {
          transition: all 0.2s ease;
        }
        .edit-point-marker:hover {
          transform: scale(1.2);
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `
      document.head.appendChild(style)
      return () => document.head.removeChild(style)
    }
  }, [])

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
                  disabled={!isLoaded}
                >
                  {mapType === "satellite" ? <MapIcon className="h-4 w-4" /> : <Satellite className="h-4 w-4" />}
                  {mapType === "satellite" ? "Road View" : "Satellite"}
                </Button>
                {fields.length > 0 && (
                  <ExportDialog
                    fields={fields}
                    trigger={
                      <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    }
                  />
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
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading Leaflet Maps...</p>
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
                  {currentPoints.length >= 3 && " • Click Save to finish"}
                </motion.div>
              )}
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
                >
                  Editing mode • Drag points to modify field shape
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
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                {isEditing ? "Edit Field" : t.fieldDrawing}
              </CardTitle>
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
                        className="text-sm text-muted-foreground space-y-1"
                      >
                        <div>Points: {currentPoints.length}</div>
                        {currentPoints.length >= 3 && (
                          <div className="space-y-1">
                            <div>Area: {(calculatePolygonArea(currentPoints) / 10000).toFixed(2)} hectares</div>
                            <div>Area: {(calculatePolygonArea(currentPoints) / 4047).toFixed(2)} acres</div>
                          </div>
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
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
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
                        className={`p-4 border rounded-lg transition-all cursor-pointer ${
                          selectedFieldId === field.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        }`}
                        onClick={() => focusOnField(field.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-4 h-4 rounded-full mt-1" style={{ backgroundColor: field.color }} />
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
                                  <>
                                    <span className="ml-2">• {(field.area / 10000).toFixed(2)} hectares</span>
                                    <span className="ml-2">• {(field.area / 4047).toFixed(2)} acres</span>
                                  </>
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
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFieldVisibility(field.id)
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              {field.visible !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                startEditingField(field.id)
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              disabled={isDrawing || isEditing}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteField(field.id)
                              }}
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
