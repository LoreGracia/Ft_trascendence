"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Plus } from "lucide-react";
import "@/components/Input/Input.css";
import type { GameType } from "@/types/game";
import { useCreateRoom } from "@/hooks/useCreateRoom";

type CreateRoomButtonProps = {
  mode: GameType;
};

export default function CreateRoomButton({ mode }: CreateRoomButtonProps) {
  const router = useRouter();
  const { roomCode, isCreating, createRoom } = useCreateRoom();

  useEffect(() => {
    if (roomCode) {
      router.push(`/lobby?roomCode=${encodeURIComponent(roomCode)}`);
    }
  }, [roomCode, router]);

  const handleCreateRoom = () => createRoom(mode);

  return (
    <div>
      <button
        type="button"
        onClick={handleCreateRoom}
        disabled={isCreating}
        className="button button-round button--highlight whitespace-nowrap"
      >
        <Plus />
        {isCreating ? "Creando..." : "Crear sala"}
      </button>
    </div>
  );
}