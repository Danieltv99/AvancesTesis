"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react"

interface FreeFallExperimentProps {
  onBack: () => void
}

export default function FreeFallExperiment({ onBack }: FreeFallExperimentProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [accelerationData, setAccelerationData] = useState<{ x: number; y: number; z: number; total: number }[]>([])
  const [gravity, setGravity] = useState<number | null>(null)
  const [velocity, setVelocity] = useState<number>(0)
  const [maxAcceleration, setMaxAcceleration] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const dataRef = useRef<{ x: number; y: number; z: number; total: number }[]>([])
  const startTime = useRef<number>(0)

  useEffect(() => {
    let handler: ((event: DeviceMotionEvent) => void) | null = null

    if (isRecording) {
      startTime.current = Date.now()

      handler = (event: DeviceMotionEvent) => {
        if (event.accelerationIncludingGravity) {
          const x = event.accelerationIncludingGravity.x || 0
          const y = event.accelerationIncludingGravity.y || 0
          const z = event.accelerationIncludingGravity.z || 0
          const total = Math.sqrt(x * x + y * y + z * z)

          const dataPoint = { x, y, z, total }
          dataRef.current.push(dataPoint)

          if (dataRef.current.length > 50) {
            dataRef.current.shift()
          }

          setAccelerationData([...dataRef.current])
          calculateMetrics(dataRef.current)
        }
      }

      window.addEventListener("devicemotion", handler)
    }

    return () => {
      if (handler) {
        window.removeEventListener("devicemotion", handler)
      }
    }
  }, [isRecording])

  const calculateMetrics = (data: { x: number; y: number; z: number; total: number }[]) => {
    if (data.length < 5) return

    // Calcular gravedad promedio (cuando el dispositivo está en reposo)
    const recentData = data.slice(-10)
    const avgGravity = recentData.reduce((sum, point) => sum + point.total, 0) / recentData.length
    setGravity(avgGravity)

    // Calcular aceleración máxima
    const maxAcc = Math.max(...data.map((point) => point.total))
    setMaxAcceleration(maxAcc)

    // Calcular velocidad aproximada (integración simple)
    const timeElapsed = (Date.now() - startTime.current) / 1000
    const avgAcceleration = data.slice(-5).reduce((sum, point) => sum + (point.total - 9.8), 0) / 5
    setVelocity(Math.abs(avgAcceleration * timeElapsed))
  }

  const drawGraph = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (accelerationData.length === 0) return

    const padding = 20
    const width = canvas.width - 2 * padding
    const height = canvas.height - 2 * padding

    // Dibujar ejes
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.stroke()

    // Línea de referencia para g = 9.8 m/s²
    ctx.strokeStyle = "#EF4444"
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    const gLine = canvas.height - padding - (9.8 / 20) * height
    ctx.beginPath()
    ctx.moveTo(padding, gLine)
    ctx.lineTo(canvas.width - padding, gLine)
    ctx.stroke()
    ctx.setLineDash([])

    // Dibujar datos de aceleración total
    if (accelerationData.length > 1) {
      ctx.strokeStyle = "#3B82F6"
      ctx.lineWidth = 2
      ctx.beginPath()

      accelerationData.forEach((point, index) => {
        const x = padding + (index / (accelerationData.length - 1)) * width
        const y = canvas.height - padding - (point.total / 20) * height

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()
    }

    // Etiquetas
    ctx.fillStyle = "#374151"
    ctx.font = "12px sans-serif"
    ctx.fillText("g = 9.8 m/s²", padding + 5, gLine - 5)
  }

  useEffect(() => {
    const animate = () => {
      drawGraph()
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [accelerationData])

  const resetExperiment = () => {
    setIsRecording(false)
    setAccelerationData([])
    dataRef.current = []
    setGravity(null)
    setVelocity(0)
    setMaxAcceleration(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Caída Libre</h1>
            <p className="text-gray-600">Medición de la Gravedad</p>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 text-lg">Instrucciones</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="text-green-700 text-sm space-y-2">
              <li>1. Mantén el dispositivo en posición vertical</li>
              <li>2. Presiona "Iniciar" para comenzar</li>
              <li>3. Deja caer el dispositivo suavemente</li>
              <li>4. Observa la medición de la gravedad</li>
            </ol>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={() => setIsRecording(!isRecording)}
            className="flex-1"
            variant={isRecording ? "destructive" : "default"}
          >
            {isRecording ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRecording ? "Pausar" : "Iniciar"}
          </Button>
          <Button onClick={resetExperiment} variant="outline">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Status */}
        <div className="mb-4">
          <Badge variant={isRecording ? "default" : "secondary"}>{isRecording ? "Midiendo..." : "Detenido"}</Badge>
        </div>

        {/* Graph */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Aceleración Total vs Tiempo</CardTitle>
          </CardHeader>
          <CardContent>
            <canvas ref={canvasRef} width={300} height={200} className="w-full border rounded" />
            <p className="text-xs text-gray-500 mt-2">Línea roja: g teórica = 9.8 m/s²</p>
          </CardContent>
        </Card>

        {/* Metrics */}
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resultados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Gravedad medida:</span>
                <span className="text-green-600 font-mono">{gravity ? `${gravity.toFixed(2)} m/s²` : "--"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Velocidad estimada:</span>
                <span className="text-green-600 font-mono">{velocity ? `${velocity.toFixed(2)} m/s` : "--"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Aceleración máxima:</span>
                <span className="text-green-600 font-mono">
                  {maxAcceleration ? `${maxAcceleration.toFixed(2)} m/s²` : "--"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Error vs g teórica:</span>
                <span className="text-green-600 font-mono">
                  {gravity ? `${Math.abs(gravity - 9.8).toFixed(2)} m/s²` : "--"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
