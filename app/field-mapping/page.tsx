"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { LeafletFieldMapper } from "@/components/leaflet-field-mapper"
import { useLanguage } from "@/lib/language-context"

export default function FieldMappingPage() {
  const { t } = useLanguage()

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
          <h1 className="text-3xl font-bold text-foreground">{t.fieldMappingTitle}</h1>
          <p className="text-muted-foreground">{t.fieldMappingDesc}</p>
        </motion.div>

        <LeafletFieldMapper />
      </main>
    </div>
  )
}
