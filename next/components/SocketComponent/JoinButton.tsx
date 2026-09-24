"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useJoinRoom } from "@/hooks/useJoinRoom";

export default function JoinButton() {
  const router = useRouter();
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const { joinRoom, isJoining, joinedRoomCode, error } = useJoinRoom();

  useEffect(() => {
    if (joinedRoomCode) {
      router.push(`/lobby?roomCode=${encodeURIComponent(joinedRoomCode)}`);
    }
  }, [joinedRoomCode, router]);

  return (
    <div>
      <div className="row">
        <input
          placeholder="Code"
          maxLength={5}
          value={roomCodeInput}
          onChange={(e) => setRoomCodeInput(e.target.value)}
          className="input ps-4 pb-3 pt-3 rounded-s-2xl min-w-23 max-w-30"
        />
        <button
          onClick={() => joinRoom(roomCodeInput)}
          type="submit"
          disabled={!roomCodeInput ? true : false}
          className="button rounded-e-2xl bg-(--white) shadow-2sl hover:bg-(--light) disabled:bg-(--light)"
        >
          {isJoining ? "Uniéndose..." : "Join room"}
        </button>
      </div>
      {error && <p>{error}</p>}
    </div>
  );
}