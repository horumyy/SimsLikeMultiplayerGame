/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.3 public/models/Animated Woman.glb -o src/components/AnimatedWoman.jsx -r public
*/

import { useAnimations, useGLTF } from "@react-three/drei";
import { useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import { avatarUrlAtom } from "./UI";

export function LobbyAvatar({ ...props }) {
  const [avatarUrl] = useAtom(avatarUrlAtom);
  const avatar = useRef();
  const group = useRef();
  const { scene } = useGLTF(avatarUrl);

  const { animations: waveAnimation } = useGLTF(
    "/animations/M_Standing_Expressions_005.glb",
  );
  const { animations: idleAnimation } = useGLTF(
    "/animations/M_Standing_Idle_Variations_001.glb",
  );

  const { animations: idleAnimation2 } = useGLTF(
    "/animations/M_Standing_Idle_001.glb",
  );
  const { actions } = useAnimations(
    [waveAnimation[0], idleAnimation[0], idleAnimation2[0]],
    avatar,
  );
  console.log(actions);
  const [animation, setAnimation] = useState("M_Standing_Idle_001");
  const [init, setInit] = useState(avatarUrl);

  useEffect(() => {
    actions[animation]
      .reset()
      .fadeIn(init === avatarUrl ? 0.32 : 0)
      .play();
    setInit(avatarUrl);
    return () => actions[animation]?.fadeOut(0.32);
  }, [animation, avatarUrl]);

  const delayWave = (delay) => {
    setTimeout(() => {
      // Start with Standing Idle
      setAnimation("M_Standing_Idle_001");

      // After 6 seconds, play Idle Variations
      setTimeout(() => {
        setAnimation("M_Standing_Idle_Variations_001");

        // After 6 more seconds, play Expressions
        setTimeout(() => {
          setAnimation("M_Standing_Expressions_005");

          // Finally, return to Standing Idle
          setTimeout(() => {
            setAnimation("M_Standing_Idle_001");

            // Restart the cycle after 30 seconds
            delayWave(30000);
          }, 6000);
        }, 6000);
      }, 6000);
    }, delay);
  };

  useEffect(() => {
    delayWave(12);
  }, []);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} ref={avatar} />
    </group>
  );
}
