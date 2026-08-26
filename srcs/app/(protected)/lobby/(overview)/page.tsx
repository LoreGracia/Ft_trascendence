import { RoomCode } from "@/components/SocketComponent";

export default async function Lobby({
  searchParams,
}: {
  searchParams?: Promise<{ roomCode?: string }>;
}) {
  const params = await searchParams;
  const roomCode = params?.roomCode ?? "";

  return (
	<div>
	  <RoomCode roomCode={roomCode ?? ""} />
	  <h2>Lobby</h2>
	  <p>Aqui verias los ususrios en la misma room</p>
	</div>
	
  )
}