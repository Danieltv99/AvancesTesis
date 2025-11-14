"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FlaskConical, User, Mail, Hash, Building2, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    codigo: "",
    institucion: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validaciones
    if (!formData.nombre || !formData.apellidos || !formData.correo || !formData.codigo || !formData.institucion) {
      setError("Por favor completa todos los campos obligatorios")
      setIsLoading(false)
      return
    }

    // Validar formato de correo institucional
    if (!formData.correo.includes("@") || !formData.correo.includes(".")) {
      setError("Por favor ingresa un correo institucional válido")
      setIsLoading(false)
      return
    }

    // Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    // Simulación de registro
    setTimeout(() => {
      // Obtener usuarios existentes
      const existingUsers = JSON.parse(localStorage.getItem("physicslab_users") || "[]")

      // Verificar si el correo ya existe
      const userExists = existingUsers.some((user: any) => user.correo === formData.correo)
      if (userExists) {
        setError("Este correo ya está registrado")
        setIsLoading(false)
        return
      }

      // Guardar nuevo usuario
      const newUser = {
        id: Date.now().toString(),
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.correo,
        codigo: formData.codigo,
        institucion: formData.institucion,
        password: formData.password,
        registeredAt: new Date().toISOString(),
      }

      existingUsers.push(newUser)
      localStorage.setItem("physicslab_users", JSON.stringify(existingUsers))

      setSuccess(true)
      setIsLoading(false)

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    }, 1000)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Registro Exitoso</h2>
              <p className="text-gray-600 mb-4">Tu cuenta ha sido creada correctamente</p>
              <p className="text-sm text-gray-500">Redirigiendo al inicio de sesión...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
          <p className="text-gray-600">Registro de Nuevos Estudiantes</p>
        </div>

        {/* Register Card */}
        <Card>
          <CardHeader>
            <CardTitle>Crear Cuenta</CardTitle>
            <CardDescription>Completa el formulario para registrarte en el laboratorio virtual</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre">
                  Nombre <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="Juan"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Apellidos */}
              <div className="space-y-2">
                <Label htmlFor="apellidos">
                  Apellidos <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="apellidos"
                    name="apellidos"
                    type="text"
                    placeholder="Pérez García"
                    value={formData.apellidos}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Correo Institucional */}
              <div className="space-y-2">
                <Label htmlFor="correo">
                  Correo Institucional <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="correo"
                    name="correo"
                    type="email"
                    placeholder="estudiante@universidad.edu"
                    value={formData.correo}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Código Estudiantil */}
              <div className="space-y-2">
                <Label htmlFor="codigo">
                  Código Estudiantil <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="codigo"
                    name="codigo"
                    type="text"
                    placeholder="2024001234"
                    value={formData.codigo}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Institución Educativa */}
              <div className="space-y-2">
                <Label htmlFor="institucion">
                  Institución Educativa <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="institucion"
                    name="institucion"
                    type="text"
                    placeholder="Universidad Nacional"
                    value={formData.institucion}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  Contraseña <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Confirmar Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirmar Contraseña <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
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
                {isLoading ? "Registrando..." : "Registrarse"}
              </Button>
            </form>

            {/* Link to Login */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">Laboratorio Virtual de Física - Sistema Educativo</p>
      </div>
    </div>
  )
}
