"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { socket } from "@/lib/socket";
import { exitRoom as emitExitRoom } from "@/services/room";

export const useExitRoom = () => {
  const router = useRouter();

  const [exitedRoomCode, setExitedRoomCode] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exitRoom = (roomCode?: string) => {
    const code = roomCode?.trim();

    if (!code) {
      setError("Falta el código de la sala");
      return;
    }

    if (!socket.connected) {
      setError("Socket no conectado");
      return;
    }

    setIsExiting(true);
    setError(null);

    emitExitRoom(code);
    setExitedRoomCode(code);

    router.push("/landing");
    setIsExiting(false);
  };

  return {
    exitedRoomCode,
    isExiting,
    error,
    exitRoom,
  };
};