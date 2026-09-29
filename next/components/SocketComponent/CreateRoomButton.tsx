"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Plus } from "lucide-react";
import "@/components/Input/Input.css";
import type { GameType } from "@/types/game";
import { useCreateRoom } from "@/hooks/useCreateRoom";
import { useJoinRoom } from "@/hooks/useJoinRoom";

type CreateRoomButtonProps = {
  mode: GameType;
};

export default function CreateRoomButton({ mode }: CreateRoomButtonProps) {
  const router = useRouter();
  const { roomCode, isCreating, createRoom } = useCreateRoom();
  const { joinedRoomCode } = useJoinRoom();

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
        disabled={isCreating || joinedRoomCode != null}
        className="button button-round button--highlight whitespace-nowrap disabled:bg-amber-400"
      >
        <Plus />
        {isCreating ? "Creating..." : "Create room"}
      </button>
    </div>
  );
}