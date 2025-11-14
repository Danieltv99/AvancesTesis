"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, X } from "lucide-react"

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Detectar si es iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    const ios = /iphone|ipad|ipod/.test(userAgent)
    setIsIOS(ios)

    // Detectar si ya está instalada como PWA
    const standalone = window.matchMedia("(display-mode: standalone)").matches
    setIsStandalone(standalone)

    // Mostrar prompt solo si es iOS y no está instalada
    if (ios && !standalone) {
      const hasSeenPrompt = localStorage.getItem("pwa-install-prompt-seen")
      if (!hasSeenPrompt) {
        setTimeout(() => setShowPrompt(true), 2000)
      }
    }
  }, [])

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("pwa-install-prompt-seen", "true")
  }

  if (!showPrompt || !isIOS || isStandalone) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-base">Instalar Aplicación</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-6 w-6 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription className="text-sm">
            Instala PhysicsLab en tu pantalla de inicio para acceso rápido
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-sm text-gray-700">
            <p className="font-medium">Pasos para instalar:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>
                Toca el botón de compartir <span className="inline-block">📤</span> en Safari
              </li>
              <li>Desplázate y selecciona "Añadir a pantalla de inicio"</li>
              <li>Toca "Añadir" en la esquina superior derecha</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
