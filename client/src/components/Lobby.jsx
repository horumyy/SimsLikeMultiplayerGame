import {
  AccumulativeShadows,
  RandomizedLight,
  Text3D,
  useFont,
} from "@react-three/drei";
import { Suspense, useMemo } from "react";
import { LobbyAvatar } from "./LobbyAvatar";
import { Building } from "./Building";
import { Building3 } from "./Building3";
import { Building2 } from "./Building2";
import { Billboard } from "./Billboard";

export const Lobby = () => {
  const isMobile = window.innerWidth < 1024;

  const goldenRatio = Math.min(1, window.innerWidth / 1600);

  const accumulativeShadows = useMemo(
    () => (
      <AccumulativeShadows
        temporal
        frames={30}
        alphaTest={0.85}
        scale={50}
        position={[0, 0, 0]}
        color="pink"
      >
        <RandomizedLight
          amount={4}
          radius={9}
          intensity={0.55}
          ambient={0.25}
          position={[5, 5, -20]}
        />
        <RandomizedLight
          amount={4}
          radius={5}
          intensity={0.25}
          ambient={0.55}
          position={[-5, 5, -20]}
        />
      </AccumulativeShadows>
    ),
    [],
  );

  return (
    <group position-y={-1.5}>
      <group position-z={-8} rotation-y={Math.PI / 6}>
        <Text3D
          font={"fonts/Inter_Bold.json"}
          size={0.3}
          position-y={3.4}
          position-x={-1}
          castShadow
          bevelEnabled
          bevelThickness={0.005}
          letterSpacing={0.012}
        >
          Sim
          <meshStandardMaterial color="#2E73AE" />
        </Text3D>

        <Billboard
          scale={0.005}
          rotation-y={Math.PI / 2}
          position-z={-1.4}
          position-y={1}
          position-x={1}
        />
        <Text3D
          font={"fonts/Inter_Bold.json"}
          size={0.3}
          position-y={3}
          position-x={-0.3}
          castShadow
          bevelEnabled
          bevelThickness={0.005}
          letterSpacing={0.012}
        >
          ilars
          <meshStandardMaterial color="#99FF99" />
        </Text3D>
        <Building />
        <Building2 position-x={2.5} position-z={-0.5} />
        <Building3 position-x={-2} />
        <Building3 position-x={5} position-z={-0.97} position-y={-0.08} />
      </group>
      {accumulativeShadows}
      <Suspense>
        <LobbyAvatar
          position-z={-1}
          position-x={0.5 * goldenRatio}
          position-y={isMobile ? -0.4 : 0}
          rotation-y={-Math.PI / 8}
        />
      </Suspense>
    </group>
  );
};

useFont.preload("/fonts/Inter_Bold.json");
