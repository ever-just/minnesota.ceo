'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  MeshDistortMaterial, 
  Sphere, 
  Box, 
  Torus, 
  Cone,
  Octahedron,
  OrbitControls,
  Environment
} from '@react-three/drei'
import * as THREE from 'three'

interface Shape3DProps {
  type: 'sphere' | 'box' | 'torus' | 'cone' | 'octahedron'
  color?: string
  distort?: number
  speed?: number
}

function Shape3D({ type = 'sphere', color = '#9333EA', distort = 0.3, speed = 2 }: Shape3DProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  const renderShape = () => {
    const material = (
      <MeshDistortMaterial 
        color={color} 
        distort={distort} 
        speed={speed} 
        roughness={0.2}
        metalness={0.8}
      />
    )

    switch (type) {
      case 'box':
        return (
          <Box ref={meshRef} args={[2, 2, 2]}>
            {material}
          </Box>
        )
      case 'torus':
        return (
          <Torus ref={meshRef} args={[1, 0.4, 16, 100]}>
            {material}
          </Torus>
        )
      case 'cone':
        return (
          <Cone ref={meshRef} args={[1, 2, 32]}>
            {material}
          </Cone>
        )
      case 'octahedron':
        return (
          <Octahedron ref={meshRef} args={[1.5]}>
            {material}
          </Octahedron>
        )
      default:
        return (
          <Sphere ref={meshRef} args={[1.5, 64, 64]}>
            {material}
          </Sphere>
        )
    }
  }

  return renderShape()
}

export interface GeometricShapeProps {
  type?: 'sphere' | 'box' | 'torus' | 'cone' | 'octahedron'
  className?: string
  color?: string
  height?: string
  interactive?: boolean
}

export default function GeometricShape({ 
  type = 'sphere',
  className = '', 
  color = '#9333EA',
  height = '300px',
  interactive = false
}: GeometricShapeProps) {
  return (
    <div className={`relative ${className}`} style={{ height }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#6B46C1" />
        <Suspense fallback={null}>
          <Shape3D type={type} color={color} />
          {interactive && <OrbitControls enableZoom={false} enablePan={false} />}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}
