"use client";
//am I using this right now?
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { createRoom } from "@/services/room";
import type { GameType } from "@/types/game";

export const useCreateRoom = () => {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const handleRoomCreated = (code: string) => {
      console.log("[room] room_created:", code);

      setRoomCode(code);
      setIsCreating(false);
    };

    socket.on("room_created", handleRoomCreated);

    return () => {
      socket.off("room_created", handleRoomCreated);
    };
  }, []);

  const handleCreateRoom = (mode?: GameType) => {
    console.log("[room] createRoom()");
    console.log("[room] socket.connected:", socket.connected);
    console.log("[room] socket.id:", socket.id);

    if (!socket.connected) {
      console.error("[room] Socket no conectado");
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
