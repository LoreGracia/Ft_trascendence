import { RoomCode, ExitButton } from "@/components/SocketComponent";
import { redirect } from "next/navigation";

export default async function Lobby({
  searchParams,
}: {
  searchParams?: Promise<{ roomCode?: string }>;
}) {
  const params = await searchParams;
  const roomCode = params?.roomCode ?? "";
  if (!roomCode) {
    redirect("/login");
  }
  return (
	<div>
	  <RoomCode roomCode={roomCode ?? ""} />
	  <h2>Lobby</h2>
	  <p>Aqui verias los ususrios en la misma room</p>
    <ExitButton currentRoomCode={roomCode ?? ""}/>
	</div>
	
  )
}