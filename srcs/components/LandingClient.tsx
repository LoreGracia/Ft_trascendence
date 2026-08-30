
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameSocket } from '@/hooks/useGameSocket';
import { socket } from '@/lib/socket';
import type { WaitingRoom } from '@/types/game';

type Props = {
  onEnterRoom?: (room: WaitingRoom) => void;
};

export default function LandingClient({ onEnterRoom }: Props) {
  const router = useRouter();
  const { roomCodeInput, setRoomCodeInput, createRoom, joinRoom, waitingRoom } = useGameSocket();
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
    <div style={{ border: '1px solid #444', padding: '15px', borderRadius: '8px' }}>
      <h2>Unirse o Crear Sala</h2>
      <button onClick={createRoom} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        Crear Sala
      </button>
      <hr style={{ margin: '15px 0', borderColor: '#333' }} />
      <input
        placeholder="Código de sala"
        value={roomCodeInput}
        onChange={(e) => setRoomCodeInput(e.target.value)}
        style={{ padding: '8px', marginRight: '10px' }}
      />
      <button onClick={joinRoom} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        Unirse
      </button>

      <p style={{ marginTop: '10px' }}>
        <small>
          Tu Socket ID: <code>{mounted ? sid : ''}</code>
        </small>
      </p>
    </div>
  );
}
