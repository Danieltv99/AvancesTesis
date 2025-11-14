"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react"

interface PendulumExperimentProps {
  onBack: () => void
}

export default function PendulumExperiment({ onBack }: PendulumExperimentProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [accelerationData, setAccelerationData] = useState<number[]>([])
  const [period, setPeriod] = useState<number | null>(null)
  const [frequency, setFrequency] = useState<number | null>(null)
  const [amplitude, setAmplitude] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const dataRef = useRef<number[]>([])

  useEffect(() => {
    let handler: ((event: DeviceMotionEvent) => void) | null = null

    if (isRecording) {
      handler = (event: DeviceMotionEvent) => {
        if (event.accelerationIncludingGravity) {
          const x = event.accelerationIncludingGravity.x || 0
          const y = event.accelerationIncludingGravity.y || 0
          const totalAcceleration = Math.sqrt(x * x + y * y)

          dataRef.current.push(totalAcceleration)
          if (dataRef.current.length > 100) {
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

  const calculateMetrics = (data: number[]) => {
    if (data.length < 20) return

    // Calcular período aproximado encontrando picos
    const peaks = findPeaks(data)
    if (peaks.length >= 2) {
      const avgPeriod = peaks.slice(1).reduce((sum, peak, index) => sum + (peak - peaks[index]), 0) / (peaks.length - 1)
      setPeriod(avgPeriod * 0.1) // Asumiendo 10 muestras por segundo
      setFrequency(1 / (avgPeriod * 0.1))
    }

    // Calcular amplitud (diferencia entre máximo y mínimo)
    const max = Math.max(...data.slice(-20))
    const min = Math.min(...data.slice(-20))
    setAmplitude(max - min)
  }

  const findPeaks = (data: number[]): number[] => {
    const peaks: number[] = []
    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] > data[i - 1] && data[i] > data[i + 1] && data[i] > 8) {
        peaks.push(i)
      }
    }
    return peaks
  }

  const drawGraph = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (accelerationData.length === 0) return

    // Configurar el gráfico
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

    // Dibujar datos
    if (accelerationData.length > 1) {
      ctx.strokeStyle = "#3B82F6"
      ctx.lineWidth = 2
      ctx.beginPath()

      const maxVal = Math.max(...accelerationData)
      const minVal = Math.min(...accelerationData)
      const range = maxVal - minVal || 1

      accelerationData.forEach((value, index) => {
        const x = padding + (index / (accelerationData.length - 1)) * width
        const y = canvas.height - padding - ((value - minVal) / range) * height

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()
    }
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
    setPeriod(null)
    setFrequency(null)
    setAmplitude(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Péndulo Simple</h1>
            <p className="text-gray-600">Movimiento Armónico Simple</p>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 text-lg">Instrucciones</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="text-blue-700 text-sm space-y-2">
              <li>1. Sostén tu dispositivo como un péndulo</li>
              <li>2. Presiona "Iniciar" para comenzar la medición</li>
              <li>3. Balancea el dispositivo de lado a lado</li>
              <li>4. Observa los datos en tiempo real</li>
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
          <Badge variant={isRecording ? "default" : "secondary"}>{isRecording ? "Grabando..." : "Detenido"}</Badge>
        </div>

        {/* Graph */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Aceleración vs Tiempo</CardTitle>
          </CardHeader>
          <CardContent>
            <canvas ref={canvasRef} width={300} height={200} className="w-full border rounded" />
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
                <span className="font-medium">Período (T):</span>
                <span className="text-blue-600 font-mono">{period ? `${period.toFixed(2)} s` : "--"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Frecuencia (f):</span>
                <span className="text-blue-600 font-mono">{frequency ? `${frequency.toFixed(2)} Hz` : "--"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Amplitud:</span>
                <span className="text-blue-600 font-mono">{amplitude ? `${amplitude.toFixed(2)} m/s²` : "--"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
