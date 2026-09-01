"use client";

import { socket } from "@/lib/socket";
import type { GameType } from "@/types/game";

// export function createRoom(): void {
//   socket.emit("create_room");
// }
// import type { GameType } from "@/components/button/ToggleModeButton";

export const createRoom = (mode: GameType) => {
  console.log("[room] emit create_room", mode);

  socket.emit("create_room", mode);
};


export function joinRoom(roomCode: string): void {
  const code = roomCode.trim();

  if (!code) return;

  socket.emit("join_room", code);
}

export function exitRoom(roomCode?: string): void {
  if (!roomCode) return;

  socket.emit("exit_room", roomCode);
}

export function changePlayerStatus(roomCode?: string): void {
  if (!roomCode) return;

  socket.emit("change_player_status", roomCode);
}

export function startGame(
  gameType: GameType,
  roomCode?: string
): void {
  if (!roomCode) return;

  socket.emit("start_game", gameType, roomCode);
}

export function rollDice(roomCode?: string): void {
  if (!roomCode) return;

  socket.emit("roll_dice", roomCode);
}

export function standPlayer(roomCode?: string): void {
  if (!roomCode) return;

  socket.emit("player_locked", roomCode);
}