'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text3D, Center, useMatcapTexture, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

interface Icon3DProps {
  text: string
  color?: string
  size?: number
}

function Icon3D({ text, color = '#9333EA', size = 1 }: Icon3DProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [matcap] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91', 256)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
      <Center>
        <Text3D
          ref={meshRef}
          size={size}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          font="/fonts/helvetiker_bold.typeface.json"
        >
          {text}
          <meshMatcapMaterial matcap={matcap} color={color} />
        </Text3D>
        <Sparkles count={20} scale={3} size={2} speed={0.4} color={color} />
      </Center>
    </Float>
  )
}

export interface FloatingIconProps {
  text: string
  className?: string
  color?: string
  size?: number
  height?: string
}

export default function FloatingIcon({ 
  text, 
  className = '', 
  color = '#9333EA',
  size = 1,
  height = '200px' 
}: FloatingIconProps) {
  return (
    <div className={`relative ${className}`} style={{ height }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <Icon3D text={text} color={color} size={size} />
        </Suspense>
      </Canvas>
    </div>
  )
}
