"use client";

export default function RoomCode({ roomCode }: { roomCode: string }) {
  return <div>Code: {roomCode ?? "—"}</div>;
}