
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameSocket } from '@/hooks/useGameSocket';
import { socket } from '@/lib/socket';
import type { WaitingRoom } from '@/types/game';
import ToggleModeButton from "@/components/button/ToggleModeButton";
import { JoinButton, CreateRoomButton } from "@/components/SocketComponent";

type Props = {
  onEnterRoom?: (room: WaitingRoom) => void;
};

export default function LandingClient({ onEnterRoom }: Props) {
  const router = useRouter();
  const { roomCodeInput, gameType, setRoomCodeInput, setGameType, createRoom, joinRoom, waitingRoom } = useGameSocket();
  const [mounted, setMounted] = useState(false);
  const [sid, setSid] = useState('');

  useEffect(() => {
    setMounted(true);
    if (socket?.id) setSid(socket.id);
    const onConnect = () => setSid(socket.id ?? '');
    socket?.on?.('connect', onConnect);
    return () => {socket?.off?.('connect', onConnect)};
  }, []);

  useEffect(() => {
    if (waitingRoom?.roomCode) {
      if (onEnterRoom) onEnterRoom(waitingRoom);
      else router.push(`/lobby?roomCode=${encodeURIComponent(waitingRoom.roomCode)}`);
    }
  }, [waitingRoom, onEnterRoom, router]);
  return (
    <div className="box items-center flex-wrap"> 
      <ToggleModeButton
          selected={gameType}
          onChange={setGameType}
        />
        <div className="flex flex-row gap-4 mt-5 text-base font-medium">
          <CreateRoomButton mode={gameType} />
          <JoinButton/>
        </div>
      <p >
        <small>
          Tu Socket ID: <code>{mounted ? sid : ''}</code>
        </small>
      </p>
    </div>
  );
}
