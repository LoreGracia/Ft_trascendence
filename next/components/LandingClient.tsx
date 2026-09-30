
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameSocket } from '@/hooks/useGameSocket';
import { socket } from '@/lib/socket';
import ToggleModeButton from "@/components/button/ToggleModeButton";
import JoinButton from "@/components/SocketComponent/JoinButton";
import CreateRoomButton from "@/components/SocketComponent/CreateRoomButton";


export default function LandingClient() {
  const router = useRouter();
  const { gameType, setGameType, doubleRoomError } = useGameSocket();
  const [mounted, setMounted] = useState(false);
  const [sid, setSid] = useState('');
  const { roomCode} = useGameSocket();

  useEffect(() => {
    setMounted(true);
    if (socket?.id) setSid(socket.id);
    const onConnect = () => setSid(socket.id ?? '');
    socket?.on?.('connect', onConnect);
    return () => {socket?.off?.('connect', onConnect)};
  }, []);

    useEffect(() => {
    if (roomCode) {
      router.push(`/lobby?roomCode=${encodeURIComponent(roomCode)}`);
    }
  }, [roomCode, router]);

  return (
    <div className="column flex-wrap"> 
      <ToggleModeButton
        selected={gameType}
        onChange={setGameType}
      />
      <div className="flex flex-row gap-4 mt-5 text-base font-medium">
        <CreateRoomButton mode={gameType}/>
        <JoinButton/>
      </div>
      {doubleRoomError && <p className='text-(--t-error)'>{doubleRoomError}</p>}
      <p className="text-(--t-content)">
        <small>
          Tu Socket ID: <code>{mounted ? sid : ''}</code>
        </small>
      </p>
    </div>
  );
}
