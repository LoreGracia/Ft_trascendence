"use client";
import { Plus } from "lucide-react";
import "@/components/Input/Input.css";
import type { GameType } from "@/types/game";
import { useGameSocket } from "@/hooks/useGameSocket";

type CreateRoomButtonProps = {
  mode: GameType;
};

export default function CreateRoomButton({ mode }: CreateRoomButtonProps) {
  const { roomCode, isCreating, createRoom } = useGameSocket();

  const handleCreateRoom = () => createRoom(mode);

  return (
    <div>
      <button
        type="button"
        onClick={handleCreateRoom}
        disabled={isCreating || roomCode != null}
        className="button button-round button--highlight whitespace-nowrap"
      >
        <Plus />
        {(isCreating && roomCode === null)? "Creating..." : "Create room"}
      </button>
    </div>
  );
}