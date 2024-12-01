import { Canvas } from "@react-three/fiber";
import { AvatarCreator } from "@readyplayerme/react-avatar-creator";
import { ScrollControls, useProgress } from "@react-three/drei";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { Experience } from "./components/Experience";
import { motion } from "framer-motion"; // Changed from framer-motion-3d to framer-motion
import { Loader } from "./components/Loader";
import {
  SocketManager,
  itemsAtom,
  mapAtom,
  roomIDAtom,
  roomsAtom,
  socket,
} from "./components/SocketManager";

import {
  avatarUrlAtom,
  buildModeAtom,
  shopModeAtom,
  UI,
} from "./components/UI";

import { StarFaceIcon } from "hugeicons-react";

let firstLoad = true;

function App() {
  const [roomID] = useAtom(roomIDAtom);
  const [_map, setMap] = useAtom(mapAtom);
  const [rooms] = useAtom(roomsAtom);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const [avatarMode, setAvatarMode] = useState(false);
  const { progress } = useProgress();
  const [loaded, setLoaded] = useState(false);
  const [items] = useAtom(itemsAtom);
  const isMobile = window.innerWidth < 1024;
  const tablet = useRef();
  const [_roomID, setRoomID] = useAtom(roomIDAtom);
  const [buildMode, setBuildMode] = useAtom(buildModeAtom);
  const [shopMode, setShopMode] = useAtom(shopModeAtom);
  const goldenRatio = Math.min(1, window.innerWidth / 1600);
  const [avatarUrl, setAvatarUrl] = useAtom(avatarUrlAtom);

  const joinRoom = (roomId) => {
    socket.emit("joinRoom", roomId, {
      avatarUrl,
    });
    setMap(null);
    setRoomID(roomId);
  };

  useEffect(() => {
    if (progress === 100 && items) {
      setLoaded(true);
    }
  }, [progress, items]);

  return (
    <>
      <SocketManager />
      <Canvas
        shadows
        camera={{
          position: [0, 8, 2],
          fov: 30,
        }}
      >
        <color attach="background" args={["#ffffff"]} />
        <ScrollControls pages={roomID ? 4 : 0}>
          <Experience loaded={loaded} />
        </ScrollControls>
      </Canvas>
      <Loader loaded={loaded} />
      {loaded && <UI />}

      {avatarMode && (
        <AvatarCreator
          subdomain="sims-like"
          className="fixed top-0 left-0 z-[999999999] w-full h-full"
          onAvatarExported={(event) => {
            let newAvatarUrl =
              event.data.url === avatarUrl.split("?")[0]
                ? event.data.url.split("?")[0] + "?" + new Date().getTime()
                : event.data.url;
            newAvatarUrl +=
              (newAvatarUrl.includes("?") ? "&" : "?") +
              "meshlod=1&quality=medium";
            setAvatarUrl(newAvatarUrl);
            localStorage.setItem("avatarURL", newAvatarUrl);
            if (roomID) {
              socket.emit("characterAvatarUpdate", newAvatarUrl);
            }
            setAvatarMode(false);
          }}
        />
      )}
      {loaded && !roomID && (
        <motion.div
          className="absolute left-0 top-0 w-full h-full overflow-hidden"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.8,
          }}
        >
          <div className="max-w-full overflow-y-auto place-items-center pointer-events-none select-none">
            <div className="sm:w-[32rem] w-screen justify-between left-0 h-screen overflow-y-auto bg-gradient-to-b from-blue-500 to-blue-300 p-12 pt-24 rounded-lg flex flex-col space-y-2">
              <div className="space-y-3">
                <div className="w-full flex items-center justify-center">
                  <div className="relative">
                    <h1 className="text-7xl font-bold text-white">SIM</h1>
                    <h1 className="absolute -bottom-2 -right-6 -rotate-12 text-3xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-green-500 font-bold">
                      ilars
                    </h1>
                  </div>
                </div>
                <p className="text-center text-white text-xs">
                  a project by horumy <br />
                  based on wawa sensei's course
                </p>
                <p className="text-center text-white">Select a room to join</p>
                <div className="grid grid-cols-1 gap-4">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-4 rounded-lg bg-white bg-opacity-70 text-pink-700 hover:bg-pink-50 hover:bg-opacity-70 transition-colors cursor-pointer pointer-events-auto flex items-center justify-between size-64"
                      onClick={() => joinRoom(room.id)}
                    >
                      <p className="text-uppercase font-bold text-lg">
                        {room.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          <div>{room.nbCharacters}/</div>
                          <StarFaceIcon size={22} className="mt-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {!buildMode && !shopMode && (
                <button
                  className="pointer-events-auto hover:scale-110 p-4 rounded-lg bg-white bg-opacity-70 text-pink-700 hover:bg-pink-50 hover:bg-opacity-70 transition-cursor-pointer flex items-center justify-center space-x-2 size-64"
                  onClick={() => setAvatarMode(true)}
                >
                  <h1>Customize your avatar!</h1>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default App;
