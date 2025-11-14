"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FlaskConical, User, Lock, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    setTimeout(() => {
      if (email && password) {
        // Obtener usuarios registrados
        const registeredUsers = JSON.parse(localStorage.getItem("physicslab_users") || "[]")

        // Buscar usuario
        const user = registeredUsers.find((u: any) => u.correo === email && u.password === password)

        if (user) {
          // Usuario encontrado - guardar sesión
          const userData = {
            email: user.correo,
            name: user.nombre,
            apellidos: user.apellidos,
            codigo: user.codigo,
            institucion: user.institucion,
            loginTime: new Date().toISOString(),
          }
          localStorage.setItem("physicslab_user", JSON.stringify(userData))
          router.push("/experiments")
        } else {
          // Credenciales de demostración (mantener para pruebas)
          if (email === "estudiante@fisica.com") {
            const userData = {
              email,
              name: "Estudiante Demo",
              loginTime: new Date().toISOString(),
            }
            localStorage.setItem("physicslab_user", JSON.stringify(userData))
            router.push("/experiments")
          } else {
            setError("Correo o contraseña incorrectos")
          }
        }
      } else {
        setError("Por favor completa todos los campos")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FlaskConical className="w-12 h-12 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">PhysicsLab</h1>
          </div>
          <p className="text-gray-600">Acceso para Estudiantes</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder al laboratorio virtual</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="estudiante@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">¿No tienes cuenta?</span>
                </div>
              </div>

              <Link href="/register">
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  Registrarse como Estudiante
                </Button>
              </Link>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <p className="text-sm font-medium text-blue-900 mb-2">Credenciales de demostración:</p>
              <p className="text-xs text-blue-700">Correo: estudiante@fisica.com</p>
              <p className="text-xs text-blue-700">Contraseña: cualquier contraseña</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">Laboratorio Virtual de Física - Sistema Educativo</p>
      </div>
    </div>
  )
}
