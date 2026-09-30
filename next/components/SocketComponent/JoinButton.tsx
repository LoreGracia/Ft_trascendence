"use client";
import { useState } from "react";
import { useGameSocket } from "@/hooks/useGameSocket";

export default function JoinButton() {
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const { joinRoom, isJoining, roomCode , joinError } = useGameSocket();

  return (
    <div>
      <div className="row">
        <input
          placeholder="Code"
          maxLength={5}
          value={roomCodeInput}
          onChange={(e) => setRoomCodeInput(e.target.value)}
          className="input ps-4 pb-3 pt-3 rounded-s-2xl min-w-23 max-w-30 bg-(--accent)"
        />
        <button
          onClick={() => joinRoom(roomCodeInput)}
          type="button"
          disabled={roomCodeInput.trim().length !== 5 || roomCode != null}
          className="button rounded-e-2xl bg-(--white) shadow-2sl hover:bg-(--light) disabled:bg-(--light)"
        >
          {isJoining ? "Joining..." : "Join room"}
        </button>
      </div>
      {joinError && <p>{joinError}</p>}
    </div>
  );
}