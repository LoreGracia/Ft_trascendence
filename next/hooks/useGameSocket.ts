'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { socket } from '@/lib/socket';
import type { GameType, LastRoll, MatchRoom, WaitingRoom, DiceModel } from '@/types/game';
import { useRouter } from 'next/navigation';

const getPlayerScore = (sumData: MatchRoom['sum'] | undefined, playerId: string): number => {
  if (!sumData) return 0;
  if (sumData instanceof Map) return sumData.get(playerId) ?? 0;
  if (typeof sumData === 'object') return (sumData as Record<string, number>)[playerId] ?? 0;
  return 0;
};

export function useGameSocket() {
  const router = useRouter();
  const [gameType, setGameType] = useState<GameType>("FREE_PLAY");
  const [diceModel, setDiceModel] = useState<DiceModel>("default");
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [waitingRoom, setWaitingRoom] = useState<WaitingRoom | null>(null);
  const [matchRoom, setMatchRoom] = useState<MatchRoom | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [lastRoll, setLastRoll] = useState<LastRoll | null>(null);
  const [winnerMessage, setWinnerMessage] = useState('');
  const [doubleRoomError, setDoubleRoomError] = useState<string | null>(null);
  const [isTurn, setTurn] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [playError, setPlayError] = useState<string | null>(null);

  const createRoom = (mode?: GameType) => {
    if (!socket.connected) return;

    setIsCreating(true);
    socket.emit("create_room", mode);
  };

  const joinRoom = (roomCode: string) => {
    if (!roomCode) return;
    if (!socket.connected) {
      setJoinError("Socket not conected");
      return;
    }
    setIsJoining(true);
    setJoinError(null);
    socket.emit('join_room', roomCode);
  };

  const exitRoom = useCallback(() => {
    const code = waitingRoom?.roomCode || matchRoom?.roomCode;
    if (code) {
      socket.emit('exit_waiting_room', code);
      setWaitingRoom(null);
      setMatchRoom(null);
      setLastRoll(null);
      setWinnerMessage('');
      router.push(`/landing`);
      socket.emit("get_roomCode");
    }
  }, [waitingRoom, matchRoom]);

  const exitMatch = useCallback(() => {
    const code = waitingRoom?.roomCode || matchRoom?.roomCode;
    if (code) {
      socket.emit('exit_match_room', code);
      setWaitingRoom(null);
      setMatchRoom(null);
      setLastRoll(null);
      setWinnerMessage('');
      router.push(`/landing`);
      socket.emit("get_roomCode");
    }
  }, [waitingRoom, matchRoom]);

  const toggleReadyStatus = useCallback(() => {
    if (waitingRoom)
      socket.emit('change_player_status', waitingRoom.roomCode, diceModel.toString());
  }, [waitingRoom, diceModel]);

  const startGame = useCallback(
    (gameType: GameType) => {
      if (waitingRoom) {
        setGameType(gameType);
        socket.emit('start_game', waitingRoom.roomCode);
      }
    },
    [waitingRoom],
  );

  const rollDice = useCallback(() => {
    if (matchRoom) socket.emit('roll_dice', matchRoom.roomCode);
  }, [matchRoom]);

  const standPlayer = useCallback(() => {
    if (matchRoom)
      socket.emit('player_locked', matchRoom.roomCode);
  }, [matchRoom]);

  useEffect(() => {
    const handleRoomCreated = (code: WaitingRoom) => {
      setWaitingRoom(code);
      setRoomCode(code.roomCode);
      setIsCreating(false);
      router.push(`/lobby?roomCode=${code.roomCode}`);
    };

    const handlePlayerJoined = (roomData: WaitingRoom) => {
      setWaitingRoom(roomData);
      setRoomCode(roomData.roomCode);
      setIsJoining(false);
      setJoinError(null);
      router.push(`/lobby?roomCode=${roomData.roomCode}`);
    }

    const handleRoomCode = (roomCode: string | null) => setRoomCode(roomCode);

    const handlePlayerStatusChanged = (data: WaitingRoom | MatchRoom) => {
      if (data.state === 'OPEN') {
        setWaitingRoom(data as WaitingRoom);
      }
      else
        setMatchRoom(data as MatchRoom);
    };

    const handleGameStarted = (matchData: MatchRoom) => {
      setWaitingRoom(null);
      setMatchRoom(matchData);
      setWinnerMessage('');
    };

    const handleRoll = ({ roll }: { roll: LastRoll }) => {
      setLastRoll(roll);
      setTurn(roll.idPlayer);
    };


    const handleDiceRolled = ({ match }: { match: MatchRoom; }) => {
      setMatchRoom(match);
    };

    const handleMatchWon = (data: { match?: MatchRoom } | MatchRoom) => {
      const payload = data as { match?: MatchRoom };
      const finalMatch = 'match' in payload ? payload.match : (data as MatchRoom);

      if (!finalMatch || !finalMatch.players) return;

      // if ('lastRoll' in payload && payload.lastRoll) setLastRoll(payload.lastRoll);

      setMatchRoom(finalMatch);

      const me = finalMatch.players.find((p) => p.socketId === socket.id);
      if (me?.state === 'WIN') setWinnerMessage('🎉 ¡YOU WON!');
      else if (me?.state === 'TIE') setWinnerMessage('🤝 ¡DRAW!');
      else setWinnerMessage('💀 YOU LOST');
    };

    const handlePlayError = () => {
      setPlayError("All players must be locked");
    };

    const handleDoubleRoomError = () => {
      setDoubleRoomError("You are already in a room");
    };

    const handleJoinError = () => {
      setIsJoining(false);
      setJoinError("Unable to join room");
    };

    socket.on('room_created', handleRoomCreated);
    socket.on('player_joined', handlePlayerJoined);
    socket.on('player_roomCode', handleRoomCode);
    socket.on('player_status_changed', handlePlayerStatusChanged);
    socket.on('game_started', handleGameStarted);
    socket.on('dice_rolled', handleDiceRolled);
    socket.on('roll_number', handleRoll);
    socket.on('match_won', handleMatchWon);
    socket.on('doubleRoom_error', handleDoubleRoomError);
    socket.on('game_not_started', handlePlayError);
    // socket.on('game_not_started', () => alert('Todos los jugadores deben estar en estado LOCKED/listos.'));
    socket.on('error_turn', (msg: string) => alert(msg));
    socket.on("join_error", handleJoinError);

    return () => {
      socket.off('room_created', handleRoomCreated);
      socket.off('player_joined', handlePlayerJoined);
      socket.off('player_roomCode', handleRoomCode);
      socket.off('player_status_changed', handlePlayerStatusChanged);
      socket.off('game_started', handleGameStarted);
      socket.off('dice_rolled', handleDiceRolled);
      socket.off('roll_number', handleRoll);
      socket.off('match_won', handleMatchWon);
      socket.off('doubleRoom_error', handleDoubleRoomError);
      socket.off('game_not_started', handlePlayError);
      socket.off('error_turn');
      socket.off("join_error", handleJoinError);

    };
  }, []);

  const isMyTurn = useMemo(
    () =>
      matchRoom
        ? matchRoom.players[matchRoom.turn % matchRoom.players.length]?.socketId === socket.id
        : false,
    [matchRoom],
  );


  return {
    roomCodeInput,
    roomCode,
    setRoomCodeInput,
    gameType,
    setGameType,
    diceModel,
    setDiceModel,
    isCreating,
    createRoom,
    isJoining,
    joinRoom,
    waitingRoom,
    matchRoom,
    lastRoll,
    winnerMessage,
    isTurn,
    isMyTurn,
    exitRoom,
    exitMatch,
    toggleReadyStatus,
    startGame,
    rollDice,
    standPlayer,
    getPlayerScore,
    joinError,
    playError,
    doubleRoomError
  };
}
