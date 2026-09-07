// import { RoomCode, ExitButton } from "@/components/SocketComponent";
import RoomCode from "@/components/SocketComponent/RoomCode";
import ExitButton from "@/components/SocketComponent/ExitButton";
import { redirect } from "next/navigation";
import GameClient from "@/components/GameComponent";
import GameRoom from "@/components/GameRoom";
import type { WaitingRoom } from '@/types/game';

type Props = { roomCode : string };

export default function Lobby( {roomCode} : Props ) {
//   searchParams,
// }: {
//   searchParams?: Promise<{ roomCode?: string }>;
// }) {
//   const params = await searchParams;
//   const roomCode = params?.roomCode ?? "";
//   if (!roomCode) {
//     redirect("/login");
  // }
  return (
	<div>
    {/* <GameClient/> */}
    <GameRoom/>
	</div>
	
  )
}