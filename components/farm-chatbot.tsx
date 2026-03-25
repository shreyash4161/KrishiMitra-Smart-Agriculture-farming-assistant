"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Sprout, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface SensorData {
  temperature: number
  ph: number
  humidity: number
  salinity: number
}

export function FarmChatbot() {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your Smart Farm assistant. I can help you with farming advice, interpret your sensor readings, and answer questions about crop management. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickQuestions, setShowQuickQuestions] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Simulate current sensor data (in real app, this would come from props or context)
  const getCurrentSensorData = (): SensorData => ({
    temperature: 25 + Math.random() * 10,
    ph: 6 + Math.random() * 2,
    humidity: 50 + Math.random() * 30,
    salinity: 5 + Math.random() * 10,
  })

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        setTimeout(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight
        }, 100)
      }
    }
  }, [messages])

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    const sensorData = getCurrentSensorData()

    // Sensor-related responses
    if (
      message.includes("sensor") ||
      message.includes("reading") ||
      message.includes("temperature") ||
      message.includes("ph") ||
      message.includes("humidity") ||
      message.includes("salinity")
    ) {
      let response = "Based on your current sensor readings:\n\n"

      // Temperature advice
      if (sensorData.temperature > 35) {
        response += `🌡️ Temperature is high (${sensorData.temperature.toFixed(1)}°C). Consider:\n- Increasing irrigation\n- Providing shade cloth\n- Checking ventilation\n\n`
      } else if (sensorData.temperature < 20) {
        response += `🌡️ Temperature is low (${sensorData.temperature.toFixed(1)}°C). Consider:\n- Using row covers\n- Adjusting greenhouse heating\n- Protecting sensitive plants\n\n`
      } else {
        response += `🌡️ Temperature looks good (${sensorData.temperature.toFixed(1)}°C)\n\n`
      }

      // pH advice
      if (sensorData.ph < 5.5) {
        response += `⚗️ Soil pH is acidic (${sensorData.ph.toFixed(1)}). Consider:\n- Adding lime to raise pH\n- Using alkaline fertilizers\n- Testing soil regularly\n\n`
      } else if (sensorData.ph > 8) {
        response += `⚗️ Soil pH is alkaline (${sensorData.ph.toFixed(1)}). Consider:\n- Adding sulfur to lower pH\n- Using acidic fertilizers\n- Improving drainage\n\n`
      } else {
        response += `⚗️ pH level is optimal (${sensorData.ph.toFixed(1)})\n\n`
      }

      // Humidity advice
      if (sensorData.humidity > 80) {
        response += `💧 High humidity (${sensorData.humidity.toFixed(1)}%). Watch for:\n- Fungal diseases\n- Poor air circulation\n- Need for dehumidification\n\n`
      } else if (sensorData.humidity < 40) {
        response += `💧 Low humidity (${sensorData.humidity.toFixed(1)}%). Consider:\n- Increasing irrigation frequency\n- Using mulch to retain moisture\n- Misting systems for sensitive crops\n\n`
      } else {
        response += `💧 Humidity levels are good (${sensorData.humidity.toFixed(1)}%)\n\n`
      }

      return response
    }

    // Crop-specific advice
    if (message.includes("tomato")) {
      return "🍅 Tomato growing tips:\n- Maintain soil pH between 6.0-6.8\n- Water consistently to prevent blossom end rot\n- Provide support structures\n- Watch for common pests like hornworms\n- Harvest when fruits are firm and fully colored"
    }

    if (message.includes("lettuce") || message.includes("leafy")) {
      return "🥬 Leafy greens advice:\n- Keep soil consistently moist\n- Provide partial shade in hot weather\n- Harvest outer leaves first\n- Plant successively for continuous harvest\n- Watch for aphids and slugs"
    }

    if (message.includes("pest") || message.includes("bug") || message.includes("insect")) {
      return "🐛 Pest management strategies:\n- Regular inspection is key\n- Use beneficial insects when possible\n- Rotate crops to break pest cycles\n- Remove infected plants promptly\n- Consider organic pesticides as last resort\n- Maintain healthy soil for strong plants"
    }

    if (message.includes("water") || message.includes("irrigation")) {
      return "💧 Watering best practices:\n- Water early morning or evening\n- Deep, less frequent watering is better\n- Check soil moisture before watering\n- Use mulch to retain moisture\n- Consider drip irrigation for efficiency\n- Adjust based on weather and season"
    }

    if (message.includes("fertilizer") || message.includes("nutrient")) {
      return "🌱 Fertilization guidance:\n- Test soil before fertilizing\n- Use organic matter when possible\n- Follow N-P-K ratios for your crops\n- Don't over-fertilize - it can harm plants\n- Consider slow-release fertilizers\n- Monitor plants for nutrient deficiency signs"
    }

    if (message.includes("disease") || message.includes("sick") || message.includes("problem")) {
      return "🏥 Plant health troubleshooting:\n- Identify the problem first (pest, disease, or environmental)\n- Remove affected plant parts\n- Improve air circulation\n- Avoid overhead watering\n- Use disease-resistant varieties\n- Keep tools clean to prevent spread"
    }

    if (message.includes("harvest") || message.includes("when to pick")) {
      return "🌾 Harvest timing tips:\n- Learn the signs of ripeness for each crop\n- Harvest in cool morning hours when possible\n- Use clean, sharp tools\n- Handle produce gently\n- Store properly after harvest\n- Keep records of harvest dates and yields"
    }

    // General responses
    const generalResponses = [
      "That's a great question! For specific crop advice, try asking about tomatoes, lettuce, or other crops you're growing.",
      "I'd be happy to help! You can ask me about sensor readings, pest management, watering, fertilization, or specific crops.",
      "Smart farming involves monitoring your crops closely. What specific aspect of farming would you like to know more about?",
      "Every farm is unique! Tell me more about what you're growing or what challenges you're facing.",
      "Good farming practices include regular monitoring, proper watering, and soil health management. What would you like to focus on?",
    ]

    return generalResponses[Math.floor(Math.random() * generalResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)
    setShowQuickQuestions(false)

    // Simulate bot thinking time
    setTimeout(
      () => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: generateBotResponse(userMessage.content),
          sender: "bot",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 2000,
    ) // 1-3 seconds delay
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInputValue(question)
    setShowQuickQuestions(false)
  }

  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  }

  const typingVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-[600px] flex flex-col shadow-lg border-2 border-primary/10">
        <CardHeader className="flex-shrink-0 bg-gradient-to-r from-primary/5 to-primary/10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <CardTitle className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
              >
                <Bot className="h-6 w-6 text-primary" />
              </motion.div>
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {t.farmAssistantChatbot}
              </span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
              >
                <Sparkles className="h-4 w-4 text-primary/60" />
              </motion.div>
            </CardTitle>
          </motion.div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
            <div className="space-y-4 py-4">
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender === "bot" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1, type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Avatar className="h-8 w-8 bg-gradient-to-br from-primary to-primary/80 shadow-md">
                          <AvatarFallback className="bg-transparent">
                            <Sprout className="h-4 w-4 text-primary-foreground" />
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                    )}

                    <motion.div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                        message.sender === "user"
                          ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
                          : "bg-gradient-to-br from-muted to-muted/80 text-foreground border border-border/50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <motion.div
                        className="whitespace-pre-wrap text-sm leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {message.content}
                      </motion.div>
                      <motion.div
                        className="text-xs opacity-70 mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        transition={{ delay: 0.4 }}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </motion.div>
                    </motion.div>

                    {message.sender === "user" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1, type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Avatar className="h-8 w-8 bg-gradient-to-br from-secondary to-secondary/80 shadow-md">
                          <AvatarFallback className="bg-transparent">
                            <User className="h-4 w-4 text-secondary-foreground" />
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                    )}
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    variants={typingVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex gap-3 justify-start"
                  >
                    <Avatar className="h-8 w-8 bg-gradient-to-br from-primary to-primary/80 shadow-md">
                      <AvatarFallback className="bg-transparent">
                        <Sprout className="h-4 w-4 text-primary-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <motion.div
                      className="bg-gradient-to-br from-muted to-muted/80 text-foreground rounded-2xl px-4 py-3 border border-border/50 shadow-sm"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-primary rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{
                              duration: 0.6,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: i * 0.2,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>

          {/* Input Area */}
          <motion.div
            className="border-t border-border p-4 space-y-3 bg-gradient-to-r from-background to-muted/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {/* Quick Questions */}
            <AnimatePresence>
              {showQuickQuestions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-wrap gap-2"
                >
                  {t.quickQuestions.map((question, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickQuestion(question)}
                        className="text-xs hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 hover:scale-105"
                      >
                        {question}
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message Input */}
            <motion.div
              className="flex gap-2"
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t.askAboutFarming}
                className="flex-1 border-2 border-border/50 focus:border-primary/50 transition-all duration-200"
                disabled={isTyping}
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md"
                >
                  <motion.div
                    animate={isTyping ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 1, repeat: isTyping ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
                  >
                    <Send className="h-4 w-4" />
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Help Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card className="border-primary/20 shadow-md">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground space-y-3">
              <motion.h4
                className="font-medium text-foreground flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
                {t.whatICanHelp}
              </motion.h4>
              <motion.ul
                className="list-disc list-inside space-y-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {t.helpTopics.map((topic, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    {topic}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
