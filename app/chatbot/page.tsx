"use client"

import { Navigation } from "@/components/navigation"
import { FarmChatbot } from "@/components/farm-chatbot"
import { useLanguage } from "@/lib/language-context"

export default function ChatbotPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">{t.farmAssistant}</h1>
          <p className="text-muted-foreground">{t.farmAssistantDesc}</p>
        </div>

        <FarmChatbot />
      </main>
    </div>
  )
}
