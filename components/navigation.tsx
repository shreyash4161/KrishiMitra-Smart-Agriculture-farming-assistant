"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, Map, MessageCircle, Settings, Menu, Leaf } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const navigationItems = [
  { name: "dashboard", href: "/", icon: Home },
  { name: "fieldMapping", href: "/field-mapping", icon: Map },
  { name: "chatbot", href: "/chatbot", icon: MessageCircle },
  { name: "settings", href: "/settings", icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        className="hidden md:flex items-center justify-between px-6 py-4 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm sticky top-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          className="flex items-center gap-3"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl shadow-sm"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Leaf className="h-6 w-6 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              KrishiMitra
            </h1>
            <p className="text-xs text-muted-foreground">Smart Agriculture</p>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center gap-1"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {navigationItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <motion.div
                key={item.name}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
              >
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`flex items-center gap-2 transition-all duration-300 relative overflow-hidden ${
                        isActive ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-muted/80 hover:shadow-sm"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"
                          layoutId="activeTab"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <Icon className={`h-4 w-4 ${isActive ? "text-primary-foreground" : ""}`} />
                      <span className="relative z-10">{t[item.name as keyof typeof t] as string}</span>
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.nav>

      {/* Mobile Navigation */}
      <motion.nav
        className="md:hidden flex items-center justify-between px-4 py-3 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm sticky top-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          className="flex items-center gap-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            className="p-1.5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg shadow-sm"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Leaf className="h-5 w-5 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              KrishiMitra
            </h1>
          </div>
        </motion.div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Button variant="ghost" size="icon" className="hover:bg-muted/80">
                <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="h-5 w-5" />
                </motion.div>
              </Button>
            </motion.div>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <motion.div
              className="flex flex-col gap-2 mt-8"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <AnimatePresence>
                {navigationItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <Link href={item.href} onClick={() => setIsOpen(false)}>
                        <motion.div
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className={`w-full justify-start gap-3 transition-all duration-300 relative overflow-hidden ${
                              isActive
                                ? "bg-primary text-primary-foreground shadow-lg"
                                : "hover:bg-muted/80 hover:shadow-sm"
                            }`}
                          >
                            {isActive && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"
                                layoutId="activeMobileTab"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              />
                            )}
                            <Icon className={`h-4 w-4 ${isActive ? "text-primary-foreground" : ""}`} />
                            <span className="relative z-10">{t[item.name as keyof typeof t] as string}</span>
                          </Button>
                        </motion.div>
                      </Link>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          </SheetContent>
        </Sheet>
      </motion.nav>
    </>
  )
}
