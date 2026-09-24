import RoomCode from "@/components/SocketComponent/RoomCode";
import ExitButton from "@/components/SocketComponent/ExitButton";
import { redirect } from "next/navigation";
import GameClient from "@/components/GameComponent";
import GameRoom from "@/components/GameRoom";

export default function Lobby() {
  return (
	<>
    <GameRoom/>
	</>
	
  )
}