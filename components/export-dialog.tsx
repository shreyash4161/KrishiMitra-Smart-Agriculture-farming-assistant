"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Database, MapPin, Calculator } from "lucide-react"

interface Field {
  id: string
  name: string
  points: { lat: number; lng: number }[]
  area?: number
  color: string
  soilType?: string
  cropType?: string
  visible?: boolean
}

interface ExportDialogProps {
  fields: Field[]
  trigger?: React.ReactNode
}

export function ExportDialog({ fields, trigger }: ExportDialogProps) {
  const [selectedFields, setSelectedFields] = useState<string[]>(fields.map((f) => f.id))
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | "geojson">("json")
  const [includeMetadata, setIncludeMetadata] = useState(true)
  const [includeCoordinates, setIncludeCoordinates] = useState(true)
  const [areaUnit, setAreaUnit] = useState<"hectares" | "acres" | "sqm">("hectares")

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields((prev) => (prev.includes(fieldId) ? prev.filter((id) => id !== fieldId) : [...prev, fieldId]))
  }

  const selectAllFields = () => {
    setSelectedFields(fields.map((f) => f.id))
  }

  const deselectAllFields = () => {
    setSelectedFields([])
  }

  const getAreaInUnit = (area: number) => {
    switch (areaUnit) {
      case "hectares":
        return (area / 10000).toFixed(2)
      case "acres":
        return (area / 4047).toFixed(2)
      case "sqm":
        return area.toFixed(0)
      default:
        return (area / 10000).toFixed(2)
    }
  }

  const exportData = () => {
    const selectedFieldsData = fields.filter((field) => selectedFields.includes(field.id))

    if (exportFormat === "json") {
      const exportData = {
        metadata: includeMetadata
          ? {
              exportDate: new Date().toISOString(),
              totalFields: selectedFieldsData.length,
              totalArea: selectedFieldsData.reduce((sum, field) => sum + (field.area || 0), 0),
              areaUnit: areaUnit,
              source: "FarmLens",
            }
          : undefined,
        fields: selectedFieldsData.map((field) => ({
          id: field.id,
          name: field.name,
          ...(includeMetadata && {
            soilType: field.soilType,
            cropType: field.cropType,
            color: field.color,
            visible: field.visible,
          }),
          area: field.area
            ? {
                value: Number.parseFloat(getAreaInUnit(field.area)),
                unit: areaUnit,
              }
            : undefined,
          ...(includeCoordinates && {
            coordinates: field.points,
            pointCount: field.points.length,
          }),
        })),
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `farmlens-fields-${new Date().toISOString().split("T")[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } else if (exportFormat === "csv") {
      const headers = [
        "Name",
        ...(includeMetadata ? ["Soil Type", "Crop Type", "Color"] : []),
        `Area (${areaUnit})`,
        ...(includeCoordinates ? ["Points", "Coordinates"] : []),
      ]

      const csvData = selectedFieldsData
        .map((field) =>
          [
            `"${field.name}"`,
            ...(includeMetadata ? [`"${field.soilType || ""}"`, `"${field.cropType || ""}"`, `"${field.color}"`] : []),
            `"${field.area ? getAreaInUnit(field.area) : ""}"`,
            ...(includeCoordinates
              ? [`"${field.points.length}"`, `"${field.points.map((p) => `${p.lat},${p.lng}`).join(";")}"`]
              : []),
          ].join(","),
        )
        .join("\n")

      const csvContent = headers.join(",") + "\n" + csvData
      const dataBlob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `farmlens-fields-${new Date().toISOString().split("T")[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } else if (exportFormat === "geojson") {
      const geoJsonData = {
        type: "FeatureCollection",
        ...(includeMetadata && {
          metadata: {
            exportDate: new Date().toISOString(),
            totalFields: selectedFieldsData.length,
            source: "FarmLens",
          },
        }),
        features: selectedFieldsData.map((field) => ({
          type: "Feature",
          properties: {
            name: field.name,
            ...(includeMetadata && {
              soilType: field.soilType,
              cropType: field.cropType,
              color: field.color,
              visible: field.visible,
            }),
            area: field.area
              ? {
                  value: Number.parseFloat(getAreaInUnit(field.area)),
                  unit: areaUnit,
                }
              : undefined,
          },
          geometry: {
            type: "Polygon",
            coordinates: [field.points.map((p) => [p.lng, p.lat])],
          },
        })),
      }

      const dataStr = JSON.stringify(geoJsonData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/geo+json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `farmlens-fields-${new Date().toISOString().split("T")[0]}.geojson`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const totalSelectedArea = fields
    .filter((field) => selectedFields.includes(field.id))
    .reduce((sum, field) => sum + (field.area || 0), 0)

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export Fields
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Field Data
          </DialogTitle>
          <DialogDescription>Export your field data in various formats with customizable options.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Export Format
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON - Structured data format</SelectItem>
                  <SelectItem value="csv">CSV - Spreadsheet compatible</SelectItem>
                  <SelectItem value="geojson">GeoJSON - Geographic data format</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-4 w-4" />
                Export Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="metadata"
                  checked={includeMetadata}
                  onCheckedChange={(checked) => setIncludeMetadata(!!checked)}
                />
                <label htmlFor="metadata" className="text-sm font-medium">
                  Include metadata (soil type, crop type, colors)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="coordinates"
                  checked={includeCoordinates}
                  onCheckedChange={(checked) => setIncludeCoordinates(!!checked)}
                />
                <label htmlFor="coordinates" className="text-sm font-medium">
                  Include coordinate data
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Area Unit</label>
                <Select value={areaUnit} onValueChange={(value: any) => setAreaUnit(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hectares">Hectares</SelectItem>
                    <SelectItem value="acres">Acres</SelectItem>
                    <SelectItem value="sqm">Square Meters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Field Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Select Fields ({selectedFields.length}/{fields.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button onClick={selectAllFields} variant="outline" size="sm">
                  Select All
                </Button>
                <Button onClick={deselectAllFields} variant="outline" size="sm">
                  Deselect All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                <AnimatePresence>
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50"
                    >
                      <Checkbox
                        id={field.id}
                        checked={selectedFields.includes(field.id)}
                        onCheckedChange={() => handleFieldToggle(field.id)}
                      />
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: field.color }} />
                      <div className="flex-1">
                        <label htmlFor={field.id} className="text-sm font-medium cursor-pointer">
                          {field.name}
                        </label>
                        <div className="text-xs text-muted-foreground">
                          {field.points.length} points
                          {field.area && (
                            <span className="ml-2">
                              • {getAreaInUnit(field.area)} {areaUnit}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Export Summary */}
          {selectedFields.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Export Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Selected Fields:</span>
                      <div className="font-medium">{selectedFields.length}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Area:</span>
                      <div className="font-medium">
                        {getAreaInUnit(totalSelectedArea)} {areaUnit}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Format:</span>
                      <div className="font-medium uppercase">{exportFormat}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">File Size:</span>
                      <div className="font-medium">
                        ~{Math.ceil(selectedFields.length * (includeCoordinates ? 2 : 0.5))} KB
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Export Button */}
          <div className="flex justify-end gap-2">
            <Button onClick={exportData} disabled={selectedFields.length === 0} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export {selectedFields.length} Field{selectedFields.length !== 1 ? "s" : ""}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
