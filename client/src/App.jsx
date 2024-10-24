import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { SocketManager } from "./components/SocketManager";
import UI from "./components/UI";

function App() {
  return (
    <>
      <SocketManager />
      <Canvas
        shadows
        camera={{ position: [8, 8, 8], fov: 30, near: 0.1, far: 50 }}
      >
        <color attach="background" args={["#ececec"]} />
        <Experience />
      </Canvas>
      <UI />
    </>
  );
}

export default App;
