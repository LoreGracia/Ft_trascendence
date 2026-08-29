'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { socket } from '@/lib/socket';
import type { GameType, LastRoll, MatchRoom, WaitingRoom } from '@/types/game';

const getPlayerScore = (sumData: MatchRoom['sum'] | undefined, playerId: string): number => {
  if (!sumData) return 0;
  if (sumData instanceof Map) return sumData.get(playerId) ?? 0;
  if (typeof sumData === 'object') return (sumData as Record<string, number>)[playerId] ?? 0;
  return 0;
};

export function useGameSocket() {
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [waitingRoom, setWaitingRoom] = useState<WaitingRoom | null>(null);
  const [matchRoom, setMatchRoom] = useState<MatchRoom | null>(null);
  const [lastRoll, setLastRoll] = useState<LastRoll | null>(null);
  const [winnerMessage, setWinnerMessage] = useState('');

  const createRoom = useCallback(() => {
    socket.emit('create_room');
  }, []);

  const joinRoom = useCallback(() => {
    if (roomCodeInput.trim()) socket.emit('join_room', roomCodeInput);
  }, [roomCodeInput]);

  const exitRoom = useCallback(() => {
    const code = waitingRoom?.roomCode || matchRoom?.roomCode;
    if (code) {
      socket.emit('exit_room', code);
      setWaitingRoom(null);
      setMatchRoom(null);
      setLastRoll(null);
      setWinnerMessage('');
    }
  }, [waitingRoom, matchRoom]);

  const toggleReadyStatus = useCallback(() => {
    if (waitingRoom) socket.emit('change_player_status', waitingRoom.roomCode);
  }, [waitingRoom]);

  const startGame = useCallback(
    (gameType: GameType) => {
      if (waitingRoom) socket.emit('start_game', gameType, waitingRoom.roomCode);
    },
    [waitingRoom],
  );

  const rollDice = useCallback(() => {
    if (matchRoom) socket.emit('roll_dice', matchRoom.roomCode);
  }, [matchRoom]);

  const standPlayer = useCallback(() => {
    if (matchRoom) socket.emit('player_locked', matchRoom.roomCode);
  }, [matchRoom]);

  useEffect(() => {
    const handleRoomCreated = (code: string) => {
      setWaitingRoom({ roomCode: code, players: [{ id: socket.id ?? '', state: 'UNLOCKED' }] });
    };

    const handlePlayerJoined = (roomData: WaitingRoom) => setWaitingRoom(roomData);

    const handlePlayerStatusChanged = (data: WaitingRoom | MatchRoom) => {
      if ('gameType' in data) setMatchRoom(data as MatchRoom);
      else setWaitingRoom(data as WaitingRoom);
    };

    const handleGameStarted = (matchData: MatchRoom) => {
      setWaitingRoom(null);
      setMatchRoom(matchData);
      setWinnerMessage('');
    };

    const handleDiceRolled = ({ match, roll }: { match: MatchRoom; roll: LastRoll }) => {
      setMatchRoom(match);
      setLastRoll(roll);
    };

    const handleMatchWon = (data: { match?: MatchRoom; lastRoll?: LastRoll } | MatchRoom) => {
      const payload = data as { match?: MatchRoom; lastRoll?: LastRoll };
      const finalMatch = 'match' in payload ? payload.match : (data as MatchRoom);

      if (!finalMatch || !finalMatch.players) return;

      if ('lastRoll' in payload && payload.lastRoll) setLastRoll(payload.lastRoll);

      setMatchRoom(finalMatch);

      const me = finalMatch.players.find((p) => p.id === socket.id);
      if (me?.state === 'WIN') setWinnerMessage('🎉 ¡HAS GANADO!');
      else if (me?.state === 'TIE') setWinnerMessage('🤝 ¡EMPATE!');
      else setWinnerMessage('💀 HAS PERDIDO');
    };

    socket.on('room_created', handleRoomCreated);
    socket.on('player_joined', handlePlayerJoined);
    socket.on('player_status_changed', handlePlayerStatusChanged);
    socket.on('game_started', handleGameStarted);
    socket.on('dice_rolled', handleDiceRolled);
    socket.on('match_won', handleMatchWon);
    socket.on('join_error', () => alert('No se pudo unirse a la sala.'));
    socket.on('game_not_started', () => alert('Todos los jugadores deben estar en estado LOCKED/listos.'));
    socket.on('error_turn', (msg: string) => alert(msg));

    return () => {
      socket.off('room_created', handleRoomCreated);
      socket.off('player_joined', handlePlayerJoined);
      socket.off('player_status_changed', handlePlayerStatusChanged);
      socket.off('game_started', handleGameStarted);
      socket.off('dice_rolled', handleDiceRolled);
      socket.off('match_won', handleMatchWon);
      socket.off('join_error');
      socket.off('game_not_started');
      socket.off('error_turn');
    };
  }, []);

  const isMyTurn = useMemo(
    () =>
      matchRoom
        ? matchRoom.players[matchRoom.turn % matchRoom.players.length]?.id === socket.id
        : false,
    [matchRoom],
  );

  return {
    roomCodeInput,
    setRoomCodeInput,
    waitingRoom,
    matchRoom,
    lastRoll,
    winnerMessage,
    isMyTurn,
    createRoom,
    joinRoom,
    exitRoom,
    toggleReadyStatus,
    startGame,
    rollDice,
    standPlayer,
    getPlayerScore,
  };
}
