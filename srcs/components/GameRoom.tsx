'use client';

import { useEffect, useState } from 'react';
import { useGameSocket } from '@/hooks/useGameSocket';
import { socket } from '@/lib/socket';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Lock, LockOpen, ClipboardCopy } from "lucide-react";
import { cn } from "@/lib/utils"
import SelectDice from './3dDice/SelectDice';
import { useSocket } from "@/components/SocketProvider";

export default function GameRoom() {
  const [isRolling, setIsRolling] = useState(false);
  const searchParams = useSearchParams();
  const roomCode = searchParams.get('roomCode');
  const { isConnected } = useSocket();
  const [mounted, setMounted] = useState(false);
  const [socketId, setSocketId] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSocketId(socket.id ?? '');
  }, []);
  const {
    diceModel,
    setDiceModel,
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
    playError,
  } = useGameSocket();

  const [diceTrigger, setDiceTrigger] = useState(0);
  const handleRoomRoll = () => {
    rollDice();// acción del socket
    setDiceTrigger((v) => v + 1); // dispara la animación del dado
  };

  useEffect(() => {
    if (isConnected && !waitingRoom && roomCode)
      socket.emit('get_room', roomCode);
  }, [isConnected, waitingRoom, roomCode]);

  if (!isConnected || !socket.id) return <div className="container">Connecting...</div>;
  const myPlayerState =
    waitingRoom?.players.find((p) => p.socketId === socket.id)?.state ?? 'UNLOCKED';
  const myMatchState = matchRoom?.players.find((p) => p.socketId === socket.id)?.state ?? 'UNLOCKED';
  const winnerClass =
    winnerMessage === "🎉 ¡YOU WON!"
      ? "bg-violet-300 text-violet-500 rounded-4xl "
      : winnerMessage === "💀 YOU LOST"
        ? "bg-violet-950"
        : "bg-violet-500 rounded-2xl ";

  const handleCopyRoomCode = async () => {
    if (!waitingRoom?.roomCode) return;

    try {
      await navigator.clipboard.writeText(waitingRoom.roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('No se pudo copiar al portapapeles:', err);
    }
  };
  return (
    <div className="flex flex-col w-screen h-screen p-20 me-20">
      <p className="text-(--t-content)">
        <small>
          {mounted ? `Tu Socket ID: ${socketId}` : 'Tu Socket ID: '}
          {/* Tu Socket ID: {socket.id} */}
        </small>
      </p>

      {waitingRoom && !matchRoom && (
        <div className="flex flex-col items-center">
            <div className="w-full h-full flex flex-col">
              <div className="flex flex-col gap-5 w-full pb-5 md:flex-row">
                <h2>
                  🎲 {waitingRoom.gameType} :
                </h2>
                <div className="flex flex-row">
                  <h1 className="text-(--dark)"> {waitingRoom.roomCode}</h1>
                    <button
                      type="button"
                      onClick={handleCopyRoomCode}
                      className="self-start
                      inline-flex items-center justify-center
                      size-7 rounded-[min(var(--radius-md),12px)]
                      active:not-aria-[haspopup]:translate-y-px
                      [&_svg:not([class*='size-'])]:size-4
                      focus-visible:ring-2  disabled:text-(--light)"
                      disabled={copied}
                    >
                      <ClipboardCopy size={10}/>
                    </button>
                  </div>
                <p className="text-(--t-content)">
                  {waitingRoom.players.length} / 2
                  <small> (max 6)</small>
                  <ArrowRight />
                </p>
              </div>
              <div className="flex flex-col md:flex-row justify-evenly">
                <ul>
                  {waitingRoom.players.map((p) => (
                    <li className="flex flex-row" key={p.playerId}>
                      {p.name} ➡️ <b>{p.state}</b>
                      {p.socketId === socket.id ? <button onClick={toggleReadyStatus} className="flex flex-col items-center p-1 max-w-7 rounded-lg button--secondary">
                        {myPlayerState === 'LOCKED' ? <Lock size={12} /> : <LockOpen size={12} />} </button> : 
                      p.state === 'LOCKED'? <Lock size={12} /> : <LockOpen size={12} />}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2 items-center justify-evenly">
                  <div className="flex flex-row gap-2 items-center">
                    <button
                      onClick={() => startGame(waitingRoom.gameType)}
                      disabled={waitingRoom.players.length === 1 || 
                        !(waitingRoom.players.every((p) => p.state === 'LOCKED'))}
                      className="button button--highlight rounded-sm"
                    >
                      {waitingRoom.players.length === 1? "1 / 2" : "Play"}
                    </button>
                    <button onClick={exitRoom} className="p-3 button--secondary rounded-sm">
                      Exit room
                    </button>
                  </div>
                </div>
                {playError && <p className="text-(--t-error)">{playError}</p>}
              </div>
            </div>
            <SelectDice
              selected={diceModel}
              playerState={myPlayerState}
              onSelect={setDiceModel}
              toggleReadyStatus={toggleReadyStatus}
            />
          {/* <div className="fixed bottom-70 flex flex-col gap-2 items-center">
            <button
              onClick={() => startGame(waitingRoom.gameType)}
              disabled={waitingRoom.players.length === 1 || 
                !(waitingRoom.players.every((p) => p.state === 'LOCKED'))}
              className="p-10 pb-5 pt-5 rounded-3xl button--highlight"
            >
              {waitingRoom.players.length === 1? "1 / 2" : "Play"}
            </button>
            {playError && <p className="text-(--t-error)">{playError}</p>}
          </div>
          <button onClick={exitRoom} className="fixed bottom-20 p-3 button--secondary rounded-3xl">
            Exit room
          </button> */}
        </div>
      )}

      {matchRoom && (
        <div>
          <div className="pb-5">
            <h2>
              Room: {matchRoom.roomCode} | Mode:{' '}
              <span className="text-(--dark)">{matchRoom.gameType}</span>
            </h2>
          </div>
          {winnerMessage && (
            <div
              className={cn("p-5 text-4xl", winnerClass)}>
              {winnerMessage}
            </div>
          )}

          {!winnerMessage && (
            <h3>
              Turn of:{' '}
              <span style={{ color: isMyTurn ? "bg-(--dark)" : 'bf-(--light)' }}>
                {matchRoom.players[matchRoom.turn % matchRoom.players.length]?.name}{' '}
                {isMyTurn ? '(¡TU TURNO!)' : ''}
              </span>
            </h3>
          )}

          <div className="bg-(--light) p-2.5 rounded-lg me-4">
            <h3>📊 Total result summary:</h3>
            <table
              className="w-full justify-evenly"
            // style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}
            >
              <thead>
                <tr style={{ borderBottom: '1px solid #444' }}>
                  <th style={{ padding: '8px' }}>Player</th>
                  <th style={{ padding: '8px' }}>Total score</th>
                  <th style={{ padding: '8px' }}>State</th>
                  <th style={{ padding: '8px' }}>dice</th>
                </tr>
              </thead>
              <tbody>
                {matchRoom.players.map((p) => {
                  const totalScore = getPlayerScore(matchRoom.sum, p.playerId);
                  return (
                    <tr key={p.playerId} style={{ borderBottom: '1px solid #333' }}>
                      <td style={{ padding: '8px' }}>
                        {matchRoom.players[matchRoom.turn % matchRoom.players.length]?.playerId === p.playerId ? '➡️' : ''}
                        {p.name} {p.socketId === socket.id ? ' (You)' : ''}
                      </td>
                      <td className="p-2 text-lg text-(--dark)">
                        <b>{totalScore} pts</b>
                      </td>
                      <td style={{ padding: '8px' }}>{p.state}</td>
                      <td>
                        <b>{p.diceModel}</b>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: '10px', margin: '20px 0', flexWrap: 'wrap' }}>
            <button
              hidden={!(myMatchState === "UNLOCKED")}
              onClick={handleRoomRoll}
              disabled={!isMyTurn || !!winnerMessage || isRolling}
              className="button button--highlight rounded-sm"
              style={{
                cursor: isMyTurn ? 'pointer' : 'not-allowed',
              }}
            >
              {isRolling ? "Tirando..." : "🎲 Throw dice"}
            </button>

            {matchRoom.gameType === 'ADD42' && (
              <button
                onClick={standPlayer}
                disabled={!isMyTurn || !!winnerMessage}
                className="button button--highlight rounded-sm"
              >
                {myMatchState === "UNLOCKED" ? "✋ Stay (Lock)" : "Locked"}
              </button>
            )}

            <button onClick={exitMatch}
              className="button rounded-sm button--secondary">
              Exit match
            </button>
            { isTurn &&
              <ThrowDice
                onClick={handleRoomRoll}
                presetValue={matchRoom.players.find((p) => p.playerId === isTurn)?.diceModel ?? 'default'}
                lastResult={lastRoll}
                triggerRoll={diceTrigger}
                setIsRolling={setIsRolling}
                isRolling={isRolling}
              />
            }
          </div>

          {matchRoom.gameType === 'ADD42' && lastRoll && (

            <div className="bg-(--light) p-3 rounded-lg border-l-4 border-l-(--accent) me-4">
              <h4>Last move ({lastRoll.idPlayer}):</h4>
              <p className="text-(--t-content)">
                Dados sacados:{' '}
                {lastRoll.nums.map((d, idx) => (
                  <span
                    key={`${lastRoll.idPlayer}-${idx}`}
                    style={{ backgroundColor: '#333', padding: '4px 8px', borderRadius: '4px', marginRight: '5px' }}
                  >
                    <b>[{d.value}]</b>
                  </span>
                ))}
              </p>
              <p className="text-(--t-content)">
                Added from this turn: <b>+{lastRoll.nums.reduce((acc, d) => acc + d.value, 0)} pts</b>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
