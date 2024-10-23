import {
  ContactShadows,
  Environment,
  Grid,
  OrbitControls,
  useCursor,
} from "@react-three/drei";
import { AnimatedWoman } from "./AnimatedWoman";
import { charactersAtom, mapAtom, userAtom } from "./SocketManager";
import { useAtom } from "jotai";
import { useState } from "react";
import { socket } from "./SocketManager";
import * as THREE from "three";
import Item from "./Item";
import { useThree } from "@react-three/fiber";
import useGrid from "../hooks/useGrid";

export const Experience = () => {
  const [characters] = useAtom(charactersAtom);
  const [map] = useAtom(mapAtom);
  console.log(map, "map");
  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);

  const scene = useThree((state) => state.scene);
  const [user] = useAtom(userAtom);
  const { gridToVector3, vector3ToGrid } = useGrid();

  const onCharacterMove = (e) => {
    const character = scene.getObjectByName(`character-${user}`);
    if (!character) return;
    socket.emit(
      "move",
      vector3ToGrid(character.position),
      vector3ToGrid(e.point),
    );
  };

  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.3} />
      <OrbitControls />
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.001}
        onClick={onCharacterMove}
        onPointerEnter={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}
        position-x={map.size[0] / 2}
        position-z={map.size[1] / 2}
      >
        <planeGeometry args={map.size} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />
      {map.items.map((item, index) => (
        <Item key={`${item.name}_${index}`} item={item} />
      ))}
      {characters.map((character) => (
        <AnimatedWoman
          key={character.id}
          id={character.id}
          path={character.path}
          position={gridToVector3(character.position)}
          hairColor={character.hairColor}
          topColor={character.topColor}
          bottomColor={character.bottomColor}
        />
      ))}
    </>
  );
};
