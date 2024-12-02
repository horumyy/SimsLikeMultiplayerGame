import { atom, useAtom } from "jotai";
import { GrSend } from "react-icons/gr";
import { useEffect, useRef, useState } from "react";
import {
  TiCog,
  TiHome,
  TiArrowBack,
  TiUser,
  TiTrash,
  TiArrowSyncOutline,
  TiArrowSync,
  TiChevronLeft,
  TiShoppingCart,
} from "react-icons/ti";
import { AvatarCreator } from "@readyplayerme/react-avatar-creator";
import { motion } from "framer-motion";
import { roomItemsAtom } from "./Room";
import { roomIDAtom, socket } from "./SocketManager";
import { Canvas } from "@react-three/fiber";
import { ChatAvatar } from "./ChatAvatar";
export const buildModeAtom = atom(false);
export const shopModeAtom = atom(false);
export const draggedItemAtom = atom(null);
export const draggedItemRotationAtom = atom(0);

export const avatarUrlAtom = atom(
  localStorage.getItem("avatarURL") ||
    "https://models.readyplayer.me/673103d3a06abaf268eb0ff8.glb",
);

function CircularButton({ isHoveringAvatarCircle, index, total }) {
  const angle = (index / (total - 1) - 0.5) * Math.PI * 0.5; // Adjust this value to change the curve
  const radius = 90; // Adjust this value to change the distance from the center
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <motion.div
      className="absolute"
      animate={
        isHoveringAvatarCircle
          ? { opacity: 1, scale: 1, x, y }
          : { opacity: 0, scale: 0.8, x: 0, y: 0 }
      }
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      <DanceButton index={index} />
    </motion.div>
  );
}
const PasswordInput = ({ onClose, onSuccess }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const checkPassword = () => {
    socket.emit("passwordCheck", password);
  };

  useEffect(() => {
    socket.on("passwordCheckSuccess", () => {
      onSuccess();
      onClose();
    });
    socket.on("passwordCheckFail", () => {
      setError("Wrong password");
    });
    return () => {
      socket.off("passwordCheckSuccess");
      socket.off("passwordCheckFail");
    };
  });

  return (
    <div className="fixed z-10 grid place-items-center w-full h-full top-0 left-0">
      <div
        className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-lg p-4 z-10">
        <p className="text-lg font-bold">Password</p>
        <input
          autoFocus
          type="text"
          className="border rounded-lg p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="space-y-2 mt-2">
          <button
            className="bg-green-500 text-white rounded-lg px-4 py-2 flex-1 w-full"
            onClick={checkPassword}
          >
            Enter
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
};

const Chat = (props) => {
  const [chatMessage, setChatMessage] = useState("");
  const sendChatMessage = () => {
    if (chatMessage.length > 0) {
      socket.emit("chatMessage", chatMessage);
      setChatMessage("");
      props.setIsChatting(true);
      setTimeout(() => {
        props.setIsChatting(false);
      }, 4500);
    }
  };
  return (
    <div className="pointer-events-auto flex  items-center space-x-2">
      <input
        type="text"
        className="w-40 sm:w-56 border px-5 p-4 h-12 rounded-full"
        placeholder="Type a message..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendChatMessage();
          }
        }}
        value={chatMessage}
        onChange={(e) => setChatMessage(e.target.value)}
      />
      <button
        className="p-3 rounded-full bg-gradient-to-b from-blue-500  to-blue-300 hover:scale-110 relative text-white drop-shadow-md cursor-pointer transition-all duration-350 pointer-events-auto"
        onClick={sendChatMessage}
      >
        <GrSend size={24} />
      </button>
    </div>
  );
};

const QuitToLobby = (props) => {
  const leaveRoom = () => {
    socket.emit("leaveRoom");
    props.setRoomID(null);
    props.setBuildMode(false);
    props.setShopMode(false);
  };
  return (
    <button
      className="p-4 bg-gradient-to-b from-green-500 to-green-300 transition-all duration-350 hover:scale-110 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer pointer-events-auto"
      onClick={leaveRoom}
    >
      <TiArrowBack />
    </button>
  );
};

const BackButton = (props) => {
  return (
    <button
      className="p-4 rounded-full bg-gradient-to-b from-blue-500  to-blue-300 hover:scale-110 relative text-white drop-shadow-md cursor-pointer transition-all duration-350 pointer-events-auto"
      onClick={() => {
        props.shopMode ? props.setShopMode(false) : props.setBuildMode(false);
      }}
    >
      <TiChevronLeft size={24} />
    </button>
  );
};

const BuildButton = (props) => {
  const forceSuccess = () => {
    socket.emit("passwordCheck", "_");
  };

  useEffect(() => {
    socket.on("passwordCheckSuccess", () => {
      props.onSuccess();
      props.onClose();
    });
    socket.on("passwordCheckFail", () => {
      setError("Wrong password");
    });
    return () => {
      socket.off("passwordCheckSuccess");
      socket.off("passwordCheckFail");
    };
  });

  return (
    <button
      className="p-4 rounded-full bg-gradient-to-b from-blue-500  to-blue-300 hover:scale-110 relative text-white drop-shadow-md cursor-pointer transition-all duration-350 pointer-events-auto"
      onClick={() => {
        if (props.roomId === 4) {
          forceSuccess();
          props.setBuildMode(true);
          return;
        }
        if (!props.passwordCorrectForRoom) {
          props.setPasswordMode(true);
        } else {
          props.setBuildMode(true);
        }
      }}
    >
      <TiHome size={24} />
      <TiCog className="absolute bottom-2 right-2 text-gray-500" size={20} />
    </button>
  );
};

const DanceButton = (props) => {
  return (
    <button
      className="p-4 rounded-full bg-gradient-to-b from-blue-500  to-blue-300 hover:scale-110 relative text-white drop-shadow-md cursor-pointer transition-all duration-350 pointer-events-auto"
      onClick={() => socket.emit("dance", props.index)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="1 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
        />
      </svg>
    </button>
  );
};

const RotateButton = (props) => {
  return (
    <button
      className="p-4 rounded-full bg-gradient-to-b from-blue-500  to-blue-300 hover:scale-110 relative text-white drop-shadow-md cursor-pointer transition-all duration-350 pointer-events-auto"
      onClick={() =>
        props.setDraggedItemRotation(
          props.draggedItemRotation === 3 ? 0 : props.draggedItemRotation + 1,
        )
      }
    >
      <TiArrowSync size={24} />
    </button>
  );
};

const ShopButton = (props) => {
  return (
    <button
      className="p-4 rounded-full bg-gradient-to-b from-amber-500  to-amber-300 hover:scale-110 relative text-white drop-shadow-md cursor-pointer transition-all duration-350 pointer-events-auto"
      onClick={() => props.setShopMode(true)}
    >
      <TiShoppingCart size={24} />
    </button>
  );
};

const CancelButton = (props) => {
  return (
    <button
      className="p-4 rounded-full bg-gradient-to-b from-blue-500  to-blue-300 hover:scale-110 relative text-white drop-shadow-md cursor-pointer transition-all duration-350 pointer-events-auto"
      onClick={() => props.setDraggedItem(null)}
    >
      <TiChevronLeft size={24} />
    </button>
  );
};

const CustomizeAvatarButton = (props) => {
  return (
    <button
      className="p-4 rounded-full bg-gradient-to-b from-blue-500  to-blue-300 hover:scale-110 relative text-white drop-shadow-md cursor-pointer transition-all duration-350 pointer-events-auto"
      onClick={() => {
        props.setAvatarMode(true);
      }}
    >
      <TiUser size={24} />
      <TiCog className="absolute bottom-2 right-2 text-gray-500" size={20} />
    </button>
  );
};

const RemoveItemButton = (props) => {
  return (
    <button
      className="p-4 rounded-full bg-gradient-to-b from-red-500  to-red-300 hover:scale-110 relative text-white drop-shadow-md cursor-pointer transition-all duration-350 pointer-events-auto"
      onClick={() => {
        props.setRoomItems((prev) => {
          const newItems = [...prev];
          newItems.splice(props.draggedItem, 1);
          return newItems;
        });
        props.setDraggedItem(null);
      }}
    >
      <TiTrash size={24} />
    </button>
  );
};

export const UI = () => {
  const [buildMode, setBuildMode] = useAtom(buildModeAtom);
  const [shopMode, setShopMode] = useAtom(shopModeAtom);
  const [draggedItem, setDraggedItem] = useAtom(draggedItemAtom);
  const [draggedItemRotation, setDraggedItemRotation] = useAtom(
    draggedItemRotationAtom,
  );
  const [_roomItems, setRoomItems] = useAtom(roomItemsAtom);
  const [passwordMode, setPasswordMode] = useState(false);
  const [avatarMode, setAvatarMode] = useState(false);
  const [avatarUrl, setAvatarUrl] = useAtom(avatarUrlAtom);
  const [roomID, setRoomID] = useAtom(roomIDAtom);
  const [passwordCorrectForRoom, setPasswordCorrectForRoom] = useState(false);
  const [numButtons] = useState(3); // You can adjust this number
  const [isHoveringAvatarCircle, setIsHoveringAvatarCircle] = useState(false);
  useEffect(() => {
    setPasswordCorrectForRoom(false); // PS: this is an ugly shortcut
  }, [roomID]);

  const [isChatting, setIsChatting] = useState(false);

  const ref = useRef();

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {avatarMode && (
          <AvatarCreator
            subdomain="sims-like"
            className="fixed top-0 left-0 z-[999999999] w-full h-full" // have to put a crazy z-index to be on top of HTML generated by Drei
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
        {passwordMode && (
          <PasswordInput
            onClose={() => setPasswordMode(false)}
            onSuccess={() => {
              setBuildMode(true);
              setPasswordCorrectForRoom(true);
            }}
          />
        )}
        <div className="fixed inset-4 flex items-start justify-end flex-col pointer-events-none select-none">
          {roomID && !shopMode && !buildMode && (
            <div className="flex fixed top-2 left-2 items-center gap-2">
              <QuitToLobby
                setRoomID={setRoomID}
                setBuildMode={setBuildMode}
                setShopMode={setShopMode}
              />
            </div>
          )}
          <div className="flex items-end space-x-4 mb-3">
            <div
              onMouseEnter={() => setIsHoveringAvatarCircle(true)}
              onMouseLeave={() => setIsHoveringAvatarCircle(false)}
              className="relative flex items-center justify-start w-full"
            >
              <div className="bg-gradient-to-b from-green-500 to-green-300   overflow-hidden  rounded-full w-[10rem] h-[10rem]">
                <Canvas>
                  <ambientLight intensity={1} />
                  <ChatAvatar
                    avatarUrl={avatarUrl}
                    isChatting={isChatting}
                    position={[0, -1.6, 4.5]}
                    rotation-y={Math.PI / 5}
                  />
                </Canvas>
              </div>

              <div className="absolute -top-4 left-0">
                {roomID && !buildMode && !shopMode && (
                  <BuildButton
                    roomId={roomID}
                    setBuildMode={setBuildMode}
                    setPasswordMode={setPasswordMode}
                    onClose={() => setPasswordMode(false)}
                    onSuccess={() => {
                      setBuildMode(true);
                      setPasswordCorrectForRoom(true);
                    }}
                    passwordCorrectForRoom={passwordCorrectForRoom}
                    setPasswordCorrectForRoom={setPasswordCorrectForRoom}
                  />
                )}
              </div>

              <div className="absolute -bottom-4 left-0">
                {roomID && !buildMode && !shopMode && (
                  <CustomizeAvatarButton setAvatarMode={setAvatarMode} />
                )}
              </div>
              {roomID && !buildMode && !shopMode && (
                <div className="absolute top-14 left-10">
                  {[...Array(numButtons)].map((_, index) => (
                    <CircularButton
                      isHoveringAvatarCircle={isHoveringAvatarCircle}
                      key={index}
                      index={index}
                      total={numButtons}
                    />
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-4 pointer-events-auto">
                {/* BACK */}
                {(buildMode || shopMode) && draggedItem === null && (
                  <BackButton
                    shopMode={shopMode}
                    setShopMode={setShopMode}
                    setBuildMode={setBuildMode}
                  />
                )}
                {/* AVATAR */}
                {/* SHOP */}
                {buildMode && !shopMode && draggedItem === null && (
                  <ShopButton setShopMode={setShopMode} />
                )}

                {/* CANCEL */}
                {buildMode && !shopMode && draggedItem !== null && (
                  <CancelButton setDraggedItem={setDraggedItem} />
                )}

                {/* ROTATE */}
                {buildMode && !shopMode && draggedItem !== null && (
                  <RotateButton
                    draggedItemRotation={draggedItemRotation}
                    setDraggedItemRotation={setDraggedItemRotation}
                  />
                )}
                {/* REMOVE ITEM */}
                {buildMode && !shopMode && draggedItem !== null && (
                  <RemoveItemButton
                    setRoomItems={setRoomItems}
                    setDraggedItem={setDraggedItem}
                    draggedItem={draggedItem}
                  />
                )}
              </div>
              {roomID && !shopMode && !buildMode && (
                <Chat setIsChatting={setIsChatting} />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
