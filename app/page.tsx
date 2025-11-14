"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FlaskConical, Smartphone, Users, BookOpen, Target, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo y nombre */}
            <div className="flex items-center">
              <FlaskConical className="w-10 h-10 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PhysicsLab</h1>
                <p className="text-xs text-gray-500">Laboratorio Virtual de Física</p>
              </div>
            </div>

            {/* Links de navegación */}
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="outline">Iniciar Sesión</Button>
              </Link>
              <Link href="/register">
                <Button>Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Aprende Física de Forma Interactiva</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experimenta con los sensores de tu dispositivo móvil para comprender los conceptos fundamentales de la
            física mecánica en tiempo real
          </p>
        </div>

        {/* Público Objetivo */}
        <Card className="mb-12 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <Target className="w-6 h-6 mr-2" />
              ¿A quién está dirigido?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start">
                <Users className="w-8 h-8 text-blue-600 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Estudiantes</h3>
                  <p className="text-sm text-gray-700">
                    De secundaria y universidad que desean comprender la física mediante experimentación práctica
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <BookOpen className="w-8 h-8 text-blue-600 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Docentes</h3>
                  <p className="text-sm text-gray-700">
                    Profesores que buscan herramientas innovadoras para enseñar conceptos de física mecánica
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Smartphone className="w-8 h-8 text-blue-600 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Instituciones</h3>
                  <p className="text-sm text-gray-700">
                    Centros educativos que desean implementar laboratorios virtuales accesibles y económicos
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sobre la Aplicación */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-6 h-6 mr-2 text-yellow-600" />
                ¿Qué es PhysicsLab?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700">
                PhysicsLab es una aplicación web progresiva que transforma tu dispositivo móvil en un laboratorio de
                física portátil. Utilizando los sensores integrados de tu smartphone o tablet, puedes realizar
                experimentos reales de física mecánica.
              </p>
              <p className="text-gray-700">
                La aplicación captura datos en tiempo real de acelerómetros y giroscopios, procesándolos para calcular
                magnitudes físicas como velocidad, aceleración, período, frecuencia y más.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FlaskConical className="w-6 h-6 mr-2 text-purple-600" />
                Experimentos Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-2xl mr-3">⚖️</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Péndulo Simple</h4>
                    <p className="text-sm text-gray-600">
                      Estudia el movimiento armónico simple y calcula período, frecuencia y amplitud
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">🪨</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Caída Libre</h4>
                    <p className="text-sm text-gray-600">
                      Mide la aceleración gravitacional y observa la velocidad en tiempo real
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">🌀</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Movimiento Circular</h4>
                    <p className="text-sm text-gray-600">
                      Analiza la velocidad angular y la aceleración centrípeta mediante rotación
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Comienza a Experimentar Ahora</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Regístrate gratis y accede a todos los experimentos de física mecánica. Solo necesitas tu dispositivo móvil
            para comenzar.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="px-8">
                Crear Cuenta Gratis
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-gray-500">
            PhysicsLab - Laboratorio Virtual de Física © 2025 | Desarrollado para el aprendizaje de la física mecánica
          </p>
        </div>
      </footer>
    </div>
  )
}
