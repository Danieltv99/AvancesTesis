"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react"

interface CircularMotionExperimentProps {
  onBack: () => void
}

export default function CircularMotionExperiment({ onBack }: CircularMotionExperimentProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [rotationData, setRotationData] = useState<{ alpha: number; beta: number; gamma: number }[]>([])
  const [angularVelocity, setAngularVelocity] = useState<number | null>(null)
  const [period, setPeriod] = useState<number | null>(null)
  const [centripetal, setCentripetal] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const dataRef = useRef<{ alpha: number; beta: number; gamma: number }[]>([])
  const lastRotation = useRef<number>(0)
  const rotationCount = useRef<number>(0)
  const startTime = useRef<number>(0)

  useEffect(() => {
    let handler: ((event: DeviceOrientationEvent) => void) | null = null

    if (isRecording) {
      startTime.current = Date.now()

      handler = (event: DeviceOrientationEvent) => {
        const alpha = event.alpha || 0 // Z-axis rotation
        const beta = event.beta || 0 // X-axis rotation
        const gamma = event.gamma || 0 // Y-axis rotation

        const dataPoint = { alpha, beta, gamma }
        dataRef.current.push(dataPoint)

        if (dataRef.current.length > 100) {
          dataRef.current.shift()
        }

        setRotationData([...dataRef.current])
        calculateMetrics(dataRef.current, alpha)
      }

      window.addEventListener("deviceorientation", handler)
    }

    return () => {
      if (handler) {
        window.removeEventListener("deviceorientation", handler)
      }
    }
  }, [isRecording])

  const calculateMetrics = (data: { alpha: number; beta: number; gamma: number }[], currentAlpha: number) => {
    if (data.length < 10) return

    // Detectar rotaciones completas
    const alphaDiff = currentAlpha - lastRotation.current
    if (Math.abs(alphaDiff) > 180) {
      rotationCount.current++
      lastRotation.current = currentAlpha
    }

    // Calcular velocidad angular
    const timeElapsed = (Date.now() - startTime.current) / 1000
    if (timeElapsed > 0 && rotationCount.current > 0) {
      const angVel = (rotationCount.current * 2 * Math.PI) / timeElapsed
      setAngularVelocity(angVel)

      // Calcular período
      if (angVel > 0) {
        setPeriod((2 * Math.PI) / angVel)
      }
    }

    // Calcular aceleración centrípeta aproximada
    // Asumiendo radio de 0.3m (longitud típica del brazo)
    const radius = 0.3
    if (angularVelocity) {
      setCentripetal(angularVelocity * angularVelocity * radius)
    }
  }

  const drawGraph = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (rotationData.length === 0) return

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

    // Dibujar datos de rotación (alpha - Z axis)
    if (rotationData.length > 1) {
      ctx.strokeStyle = "#8B5CF6"
      ctx.lineWidth = 2
      ctx.beginPath()

      rotationData.forEach((point, index) => {
        const x = padding + (index / (rotationData.length - 1)) * width
        const y = canvas.height - padding - ((point.alpha + 180) / 360) * height

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
    ctx.fillText("Rotación Z (α)", padding + 5, padding + 15)
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
  }, [rotationData])

  const resetExperiment = () => {
    setIsRecording(false)
    setRotationData([])
    dataRef.current = []
    setAngularVelocity(null)
    setPeriod(null)
    setCentripetal(null)
    rotationCount.current = 0
    lastRotation.current = 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Movimiento Circular</h1>
            <p className="text-gray-600">Velocidad Angular</p>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mb-6 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-purple-800 text-lg">Instrucciones</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="text-purple-700 text-sm space-y-2">
              <li>1. Sostén el dispositivo firmemente</li>
              <li>2. Presiona "Iniciar" para comenzar</li>
              <li>3. Gira el dispositivo en círculos horizontales</li>
              <li>4. Mantén una velocidad constante</li>
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
          <Badge variant={isRecording ? "default" : "secondary"}>
            {isRecording ? "Midiendo rotación..." : "Detenido"}
          </Badge>
        </div>

        {/* Graph */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Orientación vs Tiempo</CardTitle>
          </CardHeader>
          <CardContent>
            <canvas ref={canvasRef} width={300} height={200} className="w-full border rounded" />
            <p className="text-xs text-gray-500 mt-2">Rotación en el eje Z (horizontal)</p>
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
                <span className="font-medium">Velocidad Angular (ω):</span>
                <span className="text-purple-600 font-mono">
                  {angularVelocity ? `${angularVelocity.toFixed(2)} rad/s` : "--"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Período (T):</span>
                <span className="text-purple-600 font-mono">{period ? `${period.toFixed(2)} s` : "--"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Aceleración Centrípeta:</span>
                <span className="text-purple-600 font-mono">
                  {centripetal ? `${centripetal.toFixed(2)} m/s²` : "--"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Rotaciones completas:</span>
                <span className="text-purple-600 font-mono">{rotationCount.current}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
