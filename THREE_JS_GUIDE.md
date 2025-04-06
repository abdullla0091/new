# Three.js Integration Guide

This document provides a guide on how to work with the Three.js integration in the Character AI Clone project.

## Overview

The project uses [Three.js](https://threejs.org/) along with React Three Fiber and Drei for rendering 3D elements. The integration allows for:

- 3D visualization of characters and environments
- Interactive 3D elements on the home page
- Potential for more immersive character interactions

## Key Components

### ThreeScene (components/ThreeScene.tsx)

The main component that renders a 3D scene with:
- Character avatars represented as 3D objects
- Interactive camera controls using OrbitControls
- Lighting and grid helpers for orientation

## Customizing the Scene

### Adding New 3D Objects

1. Define a new component function in ThreeScene.tsx:

```tsx
function YourNewObject(props: any) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  // Optional animation
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.3
  })
  
  return (
    <mesh {...props} ref={meshRef} scale={1.0}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#FF6B6B" />
    </mesh>
  )
}
```

2. Add your component to the Canvas:

```tsx
<Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
  <ambientLight intensity={0.5} />
  <pointLight position={[10, 10, 10]} intensity={1} />
  <Avatar position={[0, 0, 0]} />
  <CharSphere position={[2.5, 0, 0]} />
  <YourNewObject position={[-2.5, 0, 0]} />
  <OrbitControls enableZoom={false} />
</Canvas>
```

### Using 3D Models

To use custom 3D models (GLB/GLTF):

1. Place your model files in the `public/models/` directory
2. Import the useGLTF hook from drei:

```tsx
import { useGLTF } from '@react-three/drei'

function Model({ url, ...props }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} {...props} />
}

// In your scene:
<Model url="/models/character.glb" position={[0, 0, 0]} scale={1.5} />
```

## Performance Considerations

- Use dynamic imports with suspense boundaries to avoid loading Three.js on pages that don't need it
- Keep model polygon counts low for better performance on mobile devices
- Consider using compressed textures for better loading times

## Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [Drei Documentation](https://github.com/pmndrs/drei)
- [Three.js Examples](https://threejs.org/examples/) 