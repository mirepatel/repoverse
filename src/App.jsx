import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function Cube() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="white" />
    </mesh>
  )
}

function App() {
  return (
    <main className="h-screen w-full bg-black">
      <Canvas camera={{ position: [3, 3, 5], fov: 50 }}>
        <ambientLight intensity={1} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={2}
        />

        <Cube />

        <OrbitControls />
      </Canvas>
    </main>
  )
}

export default App