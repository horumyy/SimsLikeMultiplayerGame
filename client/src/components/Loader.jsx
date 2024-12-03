"use client";

import { useProgress } from "@react-three/drei";
import { useAtom } from "jotai";
import { itemsAtom } from "./SocketManager";
import { motion } from "framer-motion";

export const Loader = ({ loaded }) => {
  const { progress } = useProgress();
  const [items] = useAtom(itemsAtom);

  const circumference = 2 * Math.PI * 45; // 45 is the radius of the circle

  return (
    <div className="fixed w-screen h-screen top-0 left-0 grid place-items-center pointer-events-none select-none">
      <div
        className={`relative transition-opacity duration-1000 ${
          progress === 100 || loaded ? "opacity-0" : ""
        }`}
      >
        <svg className="w-40 h-40" viewBox="0 0 100 100">
          <circle
            className="text-gray-200"
            strokeWidth="5"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          <circle
            className="text-black transition-all duration-300 ease-in-out"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (progress / 100) * circumference}
            strokeLinecap="round"
            stroke="#22C55D"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
        </svg>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{
              y: [-3, 3, -3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <h1 className="text-5xl font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
              SIM
            </h1>
            <h1 className="absolute -bottom-2 -right-2 -rotate-12 text-lg drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-green-500 font-bold">
              ilars
            </h1>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
