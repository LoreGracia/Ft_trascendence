"use client";
import { useExitRoom } from "@/hooks/useExitRoom";

export default function ExitButton({ currentRoomCode }: { currentRoomCode?: string }) {
  const { exitRoom, isExiting, error } = useExitRoom();

  return (
    <div>
      <button
        type="button"
        onClick={() => exitRoom(currentRoomCode)}
        disabled={isExiting || !currentRoomCode}
        className="button button-round button--secondary absolute bottom-4"
      >
        {isExiting ? "Saliendo..." : "Salir de la sala"}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}