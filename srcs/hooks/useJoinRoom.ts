"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { joinRoom as emitJoinRoom } from "@/services/room";

export const useJoinRoom = () => {
  const [joinedRoomCode, setJoinedRoomCode] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handlePlayerJoined = (room: { roomCode: string }) => {
      setJoinedRoomCode(room.roomCode);
      setIsJoining(false);
      setError(null);
    };

    const handleJoinError = () => {
      setIsJoining(false);
      setError("No se pudo unir a la sala");
    };

    socket.on("player_joined", handlePlayerJoined);
    socket.on("join_error", handleJoinError);

    return () => {
      socket.off("player_joined", handlePlayerJoined);
      socket.off("join_error", handleJoinError);
    };
  }, []);

  const joinRoom = (roomCode: string) => {
    const code = roomCode.trim();

    if (!code) return;
    if (!socket.connected) {
      setError("Socket no conectado");
      return;
    }

    setIsJoining(true);
    setError(null);
    emitJoinRoom(code);
  };

  return {
    joinedRoomCode,
    isJoining,
    error,
    joinRoom,
  };
};