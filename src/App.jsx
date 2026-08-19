import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import RepoCard from './components/3d/RepoCard'

function App() {
  return (
    <main className="h-screen w-full bg-black">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.4} />

        <directionalLight
          position={[4, 5, 6]}
          intensity={2}
        />

        <pointLight
          position={[-4, -2, 3]}
          intensity={15}
          distance={10}
        />

        <RepoCard />

        <OrbitControls />
      </Canvas>      
    </main>
  )
}

export default App