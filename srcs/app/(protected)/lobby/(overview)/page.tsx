import { RoomCode, ExitButton } from "@/components/SocketComponent";
import { redirect } from "next/navigation";
import GameClient from "@/components/GameComponent";
import GameRoom from "@/components/GameRoom";
import type { GameType } from '@/types/game';

export default function Lobby() {
//   searchParams,
// }: {
//   searchParams?: Promise<{ roomCode?: string }>;
// }) {
//   const params = await searchParams;
//   const roomCode = params?.roomCode ?? "";
  // if (!roomCode) {
  //   redirect("/login");
  // }
  return (
	<main>
    {/* <GameClient/> */}
    <GameRoom/>
	</main>
	
  )
}