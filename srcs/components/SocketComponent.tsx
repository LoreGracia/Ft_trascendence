"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import "@/components/Input/Input.css";

import type {
  GameType,
} from "@/types/game";

type CreateRoomButtonProps = {
  mode: GameType;
};

import { useCreateRoom } from "@/hooks/useCreateRoom";

export function CreateRoomButton({ mode }: CreateRoomButtonProps) {
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
        <Plus/>
        {isCreating ? "Creando..." : "Crear sala"}
      </button>
      {/* {roomCode && (
        <p>
          Código: {roomCode}
        </p>
      )} */}
    </div>
  );
}

export function RoomCode({ roomCode }: { roomCode: string }) {
  return (
    <div>
      Código: {roomCode ?? "—"}
    </div>
  );
}

import { useJoinRoom } from "@/hooks/useJoinRoom";

export function JoinButton() {
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
        disabled={!roomCodeInput? true: false}
        className="button rounded-e-2xl bg-(--white) shadow-2sl hover:bg-(--light) disabled:bg-(--light)"
        >
          {isJoining ? "Uniéndose..." : "Join room"}
        </button>
      </div>
      {error && <p>{error}</p>}
    </div>
  );
}

import { useExitRoom } from "@/hooks/useExitRoom";

export function ExitButton({ currentRoomCode }: { currentRoomCode?: string }) {
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

//
// export function DiceGame() {
//   const [roomCodeInput, setRoomCodeInput] = useState("");
//   const [waitingRoom, setWaitingRoom] = useState<Room | null>(null);
//   const [matchRoom, setMatchRoom] = useState<MatchRoom | null>(null);
//   const [lastRoll, setLastRoll] = useState<LastRoll | null>(null);
//   const [winnerMessage, setWinnerMessage] = useState("");

//   useEffect(() => {
//     const handleRoomCreated = (code: string) => {
//       setWaitingRoom({
//         roomCode: code,
//         players: [
//           {
//             id: socket.id ?? "",
//             state: "UNLOCKED",
//           },
//         ],
//       });
//     };

//     const handlePlayerJoined = (roomData: Room) => {
//       setWaitingRoom(roomData);
//     };

//     const handlePlayerStatusChanged = (
//       data: Room | MatchRoom
//     ) => {
//       if ("gameType" in data) {
//         setMatchRoom(data);
//       } else {
//         setWaitingRoom(data);
//       }
//     };

//     const handleGameStarted = (matchData: MatchRoom) => {
//       setWaitingRoom(null);
//       setMatchRoom(matchData);
//     };

//     const handleDiceRolled = ({
//       match,
//       roll,
//     }: DiceRolledData) => {
//       setMatchRoom(match);
//       setLastRoll(roll);
//     };

//     const handleMatchWon = (data: MatchWonData) => {
//       if (!data) return;

//       const finalMatch =
//         data.match ?? (data as MatchRoom);

//       if (!finalMatch?.players) return;

//       if (data.lastRoll) {
//         setLastRoll(data.lastRoll);
//       }

//       setMatchRoom(finalMatch);

//       const me = finalMatch.players.find(
//         (player) => player.id === socket.id
//       );

//       if (me?.state === "WIN") {
//         setWinnerMessage("🎉 ¡HAS GANADO!");
//       } else if (me?.state === "TIE") {
//         setWinnerMessage("🤝 ¡EMPATE!");
//       } else {
//         setWinnerMessage("💀 HAS PERDIDO");
//       }
//     };

//     const handleJoinError = () => {
//       alert("No se pudo unirse a la sala.");
//     };

//     const handleGameNotStarted = () => {
//       alert(
//         "Todos los jugadores deben estar en estado LOCKED/listos."
//       );
//     };

//     const handleErrorTurn = (message: string) => {
//       alert(message);
//     };

//     socket.on("room_created", handleRoomCreated);
//     socket.on("player_joined", handlePlayerJoined);
//     socket.on(
//       "player_status_changed",
//       handlePlayerStatusChanged
//     );
//     socket.on("game_started", handleGameStarted);
//     socket.on("dice_rolled", handleDiceRolled);
//     socket.on("match_won", handleMatchWon);
//     socket.on("join_error", handleJoinError);
//     socket.on("game_not_started", handleGameNotStarted);
//     socket.on("error_turn", handleErrorTurn);

//     return () => {
//       socket.off("room_created", handleRoomCreated);
//       socket.off("player_joined", handlePlayerJoined);
//       socket.off(
//         "player_status_changed",
//         handlePlayerStatusChanged
//       );
//       socket.off("game_started", handleGameStarted);
//       socket.off("dice_rolled", handleDiceRolled);
//       socket.off("match_won", handleMatchWon);
//       socket.off("join_error", handleJoinError);
//       socket.off(
//         "game_not_started",
//         handleGameNotStarted
//       );
//       socket.off("error_turn", handleErrorTurn);
//     };
//   }, []);

//   const currentRoomCode =
//     waitingRoom?.roomCode ?? matchRoom?.roomCode;

//   const isMyTurn = matchRoom
//     ? matchRoom.players[
//         matchRoom.turn % matchRoom.players.length
//       ]?.id === socket.id
//     : false;

//   // const handleExitRoom = () => {
//   //   exitRoom(currentRoomCode);

//   //   setWaitingRoom(null);
//   //   setMatchRoom(null);
//   //   setLastRoll(null);
//   //   setWinnerMessage("");
//   // };

//   const handleReady = () => {
//     changePlayerStatus(waitingRoom?.roomCode);
//   };

//   const handleStartGame = (gameType: GameType) => {
//     startGame(gameType, waitingRoom?.roomCode);
//   };

//   const handleRollDice = () => {
//     if (!isMyTurn || winnerMessage) return;

//     rollDice(matchRoom?.roomCode);
//   };

//   const handleStand = () => {
//     if (!isMyTurn || winnerMessage) return;

//     standPlayer(matchRoom?.roomCode);
//   };

//   return (
//     <div>
//       {/* Tu UI actual */}
//     </div>
//   );
// }