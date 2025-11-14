"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FlaskConical, Smartphone, Activity } from "lucide-react"
import PendulumExperiment from "@/components/pendulum-experiment"
import FreeFallExperiment from "@/components/free-fall-experiment"
import CircularMotionExperiment from "@/components/circular-motion-experiment"
import { InstallPrompt } from "@/app/install-prompt"

type Experiment = "pendulum" | "freefall" | "circular" | null

export default function ExperimentsPage() {
  const router = useRouter()
  const [currentExperiment, setCurrentExperiment] = useState<Experiment>(null)
  const [sensorPermission, setSensorPermission] = useState<boolean | null>(null)
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("physicslab_user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/login")
    }
  }, [router])

  const requestSensorPermission = async () => {
    try {
      if (typeof DeviceMotionEvent !== "undefined" && "requestPermission" in DeviceMotionEvent) {
        const permission = await (DeviceMotionEvent as any).requestPermission()
        setSensorPermission(permission === "granted")
      } else {
        setSensorPermission(true)
      }
    } catch (error) {
      console.error("Error solicitando permisos de sensores:", error)
      setSensorPermission(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("physicslab_user")
    router.push("/login")
  }

  const experiments = [
    {
      id: "pendulum" as const,
      title: "Péndulo Simple",
      description: "Estudia el movimiento armónico simple usando el acelerómetro",
      icon: "⚖️",
      sensors: ["Acelerómetro"],
      concepts: ["Período", "Frecuencia", "Amplitud"],
    },
    {
      id: "freefall" as const,
      title: "Caída Libre",
      description: "Mide la aceleración gravitacional en tiempo real",
      icon: "🪨",
      sensors: ["Acelerómetro"],
      concepts: ["Gravedad", "Velocidad", "Aceleración"],
    },
    {
      id: "circular" as const,
      title: "Movimiento Circular",
      description: "Analiza la velocidad angular usando el giroscopio",
      icon: "🌀",
      sensors: ["Giroscopio"],
      concepts: ["Velocidad Angular", "Aceleración Centrípeta", "Período"],
    },
  ]

  if (currentExperiment === "pendulum") {
    return <PendulumExperiment onBack={() => setCurrentExperiment(null)} />
  }

  if (currentExperiment === "freefall") {
    return <FreeFallExperiment onBack={() => setCurrentExperiment(null)} />
  }

  if (currentExperiment === "circular") {
    return <CircularMotionExperiment onBack={() => setCurrentExperiment(null)} />
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-gray-600">Verificando sesión...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <InstallPrompt />

      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FlaskConical className="w-12 h-12 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">PhysicsLab</h1>
          </div>
          <p className="text-gray-600">Laboratorio Virtual de Física</p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <Badge variant="secondary">Bienvenido, {user.name}</Badge>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
          <Badge variant="secondary" className="mt-2">
            <Smartphone className="w-4 h-4 mr-1" />
            Sensores en Tiempo Real
          </Badge>
        </div>

        {/* Sensor Permission */}
        {sensorPermission === null && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Permisos de Sensores
              </CardTitle>
              <CardDescription className="text-orange-700">
                Esta aplicación necesita acceso a los sensores de tu dispositivo para funcionar correctamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={requestSensorPermission} className="w-full">
                Activar Sensores
              </Button>
            </CardContent>
          </Card>
        )}

        {sensorPermission === false && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700 text-center">
                No se pudieron activar los sensores. Algunos experimentos pueden no funcionar correctamente.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Experiments List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Experimentos de Dinámica</h2>

          {experiments.map((experiment) => (
            <Card
              key={experiment.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500"
              onClick={() => setCurrentExperiment(experiment.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{experiment.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{experiment.title}</CardTitle>
                      <CardDescription className="mt-1">{experiment.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Sensores utilizados:</p>
                    <div className="flex flex-wrap gap-1">
                      {experiment.sensors.map((sensor) => (
                        <Badge key={sensor} variant="outline" className="text-xs">
                          {sensor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Conceptos físicos:</p>
                    <div className="flex flex-wrap gap-1">
                      {experiment.concepts.map((concept) => (
                        <Badge key={concept} variant="secondary" className="text-xs">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Desarrollado para el aprendizaje de la física mecánica</p>
        </div>
      </div>
    </div>
  )
}
