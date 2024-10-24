import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { io } from "socket.io-client";

export const socket = io("http://localhost:3001");
export const charactersAtom = atom([]);
export const mapAtom = atom([]);
export const userAtom = atom([]);

export const SocketManager = () => {
  const [_characters, setCharacters] = useAtom(charactersAtom);
  const [_map, setMap] = useAtom(mapAtom);
  const [_user, setUser] = useAtom(userAtom);
  useEffect(() => {
    function onConnect() {
      console.log("connected");
    }
    function onDisconnect() {
      console.log("disconnected");
    }
    function onHello(values) {
      setMap(values.map);
      setUser(values.id);
      setCharacters(values.characters);
    }

    function onCharacters(value) {
      console.log("characters", value);
      setCharacters(value);
    }

    function onPlayerMove(character) {
      setCharacters((prev) => {
        return prev.map((c) => {
          if (c.id === character.id) {
            return character;
          }
          return c;
        });
      });
    }

    function onMapUpdate(values) {
      setMap(values.map);
      setCharacters(values.characters);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("hello", onHello);
    socket.on("characters", onCharacters);
    socket.on("playerMove", onPlayerMove);
    socket.on("mapUpdate", onMapUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("hello", onHello);
      socket.off("characters", onCharacters);
      socket.off("playerMove", onPlayerMove);
      socket.off("mapUpdate", onMapUpdate);
    };
  }, []);
};
