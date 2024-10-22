import {
  ContactShadows,
  Environment,
  OrbitControls,
  useCursor,
} from "@react-three/drei";
import { AnimatedWoman } from "./AnimatedWoman";
import { charactersAtom, mapAtom } from "./SocketManager";
import { useAtom } from "jotai";
import { useState } from "react";
import { socket } from "./SocketManager";
import * as THREE from "three";
import Item from "./Item";

export const Experience = () => {
  const [characters] = useAtom(charactersAtom);
  const [map] = useAtom(mapAtom);
  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);
  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.3} />
      <OrbitControls />
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.001}
        onClick={(e) => socket.emit("move", [e.point.x, 0, e.point.z])}
        onPointerEnter={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}
        position-x={map.size[0] / 2}
        position-z={map.size[1] / 2}
      >
        <planeGeometry args={map.size} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      {map.items.map((item, index) => (
        <Item key={`${item.name}_${index}`} item={item} />
      ))}
      {characters.map((character) => (
        <AnimatedWoman
          key={character.id}
          id={character.id}
          position={new THREE.Vector3(...character.position)}
          hairColor={character.hairColor}
          topColor={character.topColor}
          bottomColor={character.bottomColor}
        />
      ))}
    </>
  );
};
