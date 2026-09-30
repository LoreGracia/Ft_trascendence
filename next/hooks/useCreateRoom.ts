"use client";
//am I using this right now?
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { createRoom } from "@/services/room";
import type { GameType, WaitingRoom } from "@/types/game";

export const useCreateRoom = () => {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => { //Cambiando code por waiting room se arregla el problema de las URL con [object, object]. Estaba passando el objeto, no el codigo. 
    const handleRoomCreated = (room: WaitingRoom) => {
      setRoomCode(room.roomCode);
      setIsCreating(false);
    };

    socket.on("room_created", handleRoomCreated);

    return () => {
      socket.off("room_created", handleRoomCreated);
    };
  }, []);

  const handleCreateRoom = (mode?: GameType) => {
    if (!socket.connected) {
      return;
    }

    setIsCreating(true);
    createRoom(mode as GameType);
  };

  return {
    roomCode,
    isCreating,
    createRoom: handleCreateRoom,
  };
};
