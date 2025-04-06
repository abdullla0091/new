"use client"

import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function Avatar(props: any) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  // Animate rotation
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.5
  })
  
  return (
    <mesh {...props} ref={meshRef} scale={1.5}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#1E90FF" />
    </mesh>
  )
}

function CharSphere(props: any) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.2
    meshRef.current.rotation.y += delta * 0.3
  })
  
  return (
    <mesh {...props} ref={meshRef} scale={0.6}>
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <meshStandardMaterial color="#9370DB" metalness={0.5} roughness={0.2} />
    </mesh>
  )
}

export default function ThreeScene() {
  return (
    <div className="w-full h-80 bg-gray-900 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Avatar position={[0, 0, 0]} />
        <CharSphere position={[2.5, 0, 0]} />
        <OrbitControls enableZoom={false} />
        <gridHelper args={[10, 10, `white`, `gray`]} />
        <axesHelper args={[5]} />
      </Canvas>
    </div>
  )
} 