"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Database, MessageSquare, Map, Calendar } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface ExportOptions {
  format: "json" | "csv" | "pdf"
  dateRange: "all" | "last-week" | "last-month" | "last-year"
  includeFields: boolean
  includeSensorData: boolean
  includeChatHistory: boolean
  includeSettings: boolean
}

export function DataExport() {
  const { t } = useLanguage()
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "json",
    dateRange: "all",
    includeFields: true,
    includeSensorData: true,
    includeChatHistory: false,
    includeSettings: false,
  })
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)

    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const exportData: any = {}

      // Collect data based on options
      if (exportOptions.includeFields) {
        const fields = localStorage.getItem("farmlens-fields")
        if (fields) {
          exportData.fields = JSON.parse(fields)
        }
      }

      if (exportOptions.includeSensorData) {
        // Simulate sensor data
        exportData.sensorData = {
          temperature: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
            value: 20 + Math.random() * 15,
          })),
          humidity: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
            value: 40 + Math.random() * 40,
          })),
          ph: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
            value: 6 + Math.random() * 2,
          })),
        }
      }

      if (exportOptions.includeSettings) {
        const settings = localStorage.getItem("farmlens-settings")
        const accessibility = localStorage.getItem("farmlens-accessibility")
        exportData.settings = {
          general: settings ? JSON.parse(settings) : {},
          accessibility: accessibility ? JSON.parse(accessibility) : {},
        }
      }

      // Generate file based on format
      let fileContent: string
      let fileName: string
      let mimeType: string

      switch (exportOptions.format) {
        case "json":
          fileContent = JSON.stringify(exportData, null, 2)
          fileName = `farmlens-export-${new Date().toISOString().split("T")[0]}.json`
          mimeType = "application/json"
          break
        case "csv":
          // Convert to CSV format
          fileContent = convertToCSV(exportData)
          fileName = `farmlens-export-${new Date().toISOString().split("T")[0]}.csv`
          mimeType = "text/csv"
          break
        case "pdf":
          // For PDF, we'd use a library like jsPDF, but for now just JSON
          fileContent = JSON.stringify(exportData, null, 2)
          fileName = `farmlens-export-${new Date().toISOString().split("T")[0]}.txt`
          mimeType = "text/plain"
          break
        default:
          fileContent = JSON.stringify(exportData, null, 2)
          fileName = `farmlens-export-${new Date().toISOString().split("T")[0]}.json`
          mimeType = "application/json"
      }

      // Download file
      const blob = new Blob([fileContent], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = fileName
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const convertToCSV = (data: any): string => {
    let csv = ""

    if (data.fields) {
      csv += "Field Data\n"
      csv += "Name,Soil Type,Crop Type,Area (hectares),Points Count\n"
      data.fields.forEach((field: any) => {
        csv += `"${field.name}","${field.soilType || ""}","${field.cropType || ""}","${field.area ? (field.area / 10000).toFixed(2) : ""}","${field.points?.length || 0}"\n`
      })
      csv += "\n"
    }

    if (data.sensorData) {
      csv += "Sensor Data\n"
      csv += "Date,Temperature,Humidity,pH\n"
      const dates = data.sensorData.temperature.map((t: any) => t.date)
      dates.forEach((date: string, i: number) => {
        csv += `"${date}","${data.sensorData.temperature[i]?.value.toFixed(2) || ""}","${data.sensorData.humidity[i]?.value.toFixed(2) || ""}","${data.sensorData.ph[i]?.value.toFixed(2) || ""}"\n`
      })
    }

    return csv
  }

  const getDataSizeEstimate = (): string => {
    let size = 0
    if (exportOptions.includeFields) size += 5 // KB
    if (exportOptions.includeSensorData) size += 15 // KB
    if (exportOptions.includeChatHistory) size += 10 // KB
    if (exportOptions.includeSettings) size += 1 // KB

    return size > 0 ? `~${size}KB` : "0KB"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Data Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Format */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Export Format</label>
          <Select
            value={exportOptions.format}
            onValueChange={(value: "json" | "csv" | "pdf") => setExportOptions((prev) => ({ ...prev, format: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  JSON - Structured data
                </div>
              </SelectItem>
              <SelectItem value="csv">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  CSV - Spreadsheet format
                </div>
              </SelectItem>
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF - Document format
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range</label>
          <Select
            value={exportOptions.dateRange}
            onValueChange={(value: "all" | "last-week" | "last-month" | "last-year") =>
              setExportOptions((prev) => ({ ...prev, dateRange: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  All time
                </div>
              </SelectItem>
              <SelectItem value="last-week">Last 7 days</SelectItem>
              <SelectItem value="last-month">Last 30 days</SelectItem>
              <SelectItem value="last-year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Types */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Include Data Types</label>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fields"
                checked={exportOptions.includeFields}
                onCheckedChange={(checked) => setExportOptions((prev) => ({ ...prev, includeFields: !!checked }))}
              />
              <label htmlFor="fields" className="text-sm flex items-center gap-2">
                <Map className="h-4 w-4" />
                Field mapping data
                <Badge variant="secondary" className="text-xs">
                  ~5KB
                </Badge>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sensor"
                checked={exportOptions.includeSensorData}
                onCheckedChange={(checked) => setExportOptions((prev) => ({ ...prev, includeSensorData: !!checked }))}
              />
              <label htmlFor="sensor" className="text-sm flex items-center gap-2">
                <Database className="h-4 w-4" />
                Sensor readings
                <Badge variant="secondary" className="text-xs">
                  ~15KB
                </Badge>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="chat"
                checked={exportOptions.includeChatHistory}
                onCheckedChange={(checked) => setExportOptions((prev) => ({ ...prev, includeChatHistory: !!checked }))}
              />
              <label htmlFor="chat" className="text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat history
                <Badge variant="secondary" className="text-xs">
                  ~10KB
                </Badge>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="settings"
                checked={exportOptions.includeSettings}
                onCheckedChange={(checked) => setExportOptions((prev) => ({ ...prev, includeSettings: !!checked }))}
              />
              <label htmlFor="settings" className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                App settings
                <Badge variant="secondary" className="text-xs">
                  ~1KB
                </Badge>
              </label>
            </div>
          </div>
        </div>

        {/* Export Summary */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Export Summary</p>
              <p className="text-xs text-muted-foreground">Estimated size: {getDataSizeEstimate()}</p>
            </div>
            <Badge variant="outline">{exportOptions.format.toUpperCase()}</Badge>
          </div>
        </div>

        {/* Export Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleExport}
            disabled={
              isExporting ||
              (!exportOptions.includeFields &&
                !exportOptions.includeSensorData &&
                !exportOptions.includeChatHistory &&
                !exportOptions.includeSettings)
            }
            className="w-full"
          >
            {isExporting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Exporting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </div>
            )}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  )
}
