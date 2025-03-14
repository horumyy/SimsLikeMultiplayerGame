/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.3 public/models/Animated Woman.glb -o src/components/AnimatedWoman.jsx -r public
*/

import { useAnimations, useGLTF } from "@react-three/drei";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { SkeletonUtils } from "three-stdlib";

import { motion } from "framer-motion-3d";

export function ChatAvatar({
  isChatting,
  avatarUrl = "https://models.readyplayer.me/673103d3a06abaf268eb0ff8.glb",
  ...props
}) {
  const position = useMemo(() => props.position, []);

  const avatar = useRef();

  const group = useRef();
  const { scene } = useGLTF(avatarUrl);
  // Skinned meshes cannot be re-used in threejs without cloning them
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  // useGraph creates two flat object collections for nodes and materials

  const { animations: idleAnimation } = useGLTF(
    "/animations/M_Standing_Idle_001.glb",
  );

  const { animations: talkingAnimation } = useGLTF(
    "/animations/F_Talking_Variations_002.glb",
  );

  const { actions } = useAnimations(
    [idleAnimation[0], talkingAnimation[0]],
    avatar,
  );
  const [animation, setAnimation] = useState("M_Standing_Idle_001");
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (isChatting) {
      setAnimation("F_Talking_Variations_002");
    } else {
      setAnimation("M_Standing_Idle_001");
    }
  }, [isChatting]);

  useEffect(() => {
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clone]);

  useEffect(() => {
    actions[animation]
      .reset()
      .fadeIn(init ? 0.32 : 0)
      .play();
    setInit(true);
    return () => actions[animation]?.fadeOut(0.32);
  }, [animation, avatarUrl]);

  return (
    <group
      ref={group}
      {...props}
      position={position}
      dispose={null}
      name={`character-user`}
    >
      <motion.group
        initial={{
          y: 3,
          rotateY: Math.PI * 4,
          scale: 0,
        }}
        animate={{
          y: 0,
          rotateY: 0,
          scale: 1,
        }}
        transition={{
          delay: 0.8,
          mass: 5,
          stiffness: 200,
          damping: 42,
        }}
      >
        <primitive object={clone} ref={avatar} />
      </motion.group>
    </group>
  );
}

useGLTF.preload(
  localStorage.getItem("avatarURL") ||
    "https://models.readyplayer.me/673103d3a06abaf268eb0ff8.glb",
);
useGLTF.preload("/animations/M_Standing_Idle_001.glb");
useGLTF.preload("/animations/F_Talking_Variations_002.glb");
