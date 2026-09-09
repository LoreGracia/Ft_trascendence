'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameSocket } from '@/hooks/useGameSocket';
import { socket } from '@/lib/socket';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Lock, LockOpen } from "lucide-react";
import { cn } from "@/lib/utils"
import SelectDice from './3dDice/SelectDice';

export default function GameRoom() {
  const searchParams = useSearchParams();
  const roomCode = searchParams.get('roomCode');
  const router = useRouter();
  const {
    diceModel,
    setDiceModel,
    waitingRoom,
    matchRoom,
    lastRoll,
    winnerMessage,
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
  useEffect(() => {
    if (!socket.id) {
      router.push('/landing');
    }
  }, [socket.id, router]);

  if (!socket.id) return <div>Redirecting...</div>;
  useEffect(() => {
    console.log('Effect run — roomCode:', roomCode, 'waitingRoom:', waitingRoom);
    if (!waitingRoom && roomCode) {
      if (socket.connected) {
        console.log('Emitting get_room now', roomCode);
        socket.emit('get_room', roomCode);
      } else {
        const onConnect = () => {
          console.log('Socket connected — emitting get_room', roomCode);
          socket.emit('get_room', roomCode);
        };
        socket.on('connect', onConnect);
        return () => {socket.off('connect', onConnect)};
      }
    }
  }, [waitingRoom, roomCode]); // <- longitud y orden CONSTANTES
  const myPlayerState =
    waitingRoom?.players.find((p) => p.id === socket.id)?.state ?? 'UNLOCKED';
  const myMatchState = matchRoom?.players.find((p) => p.id === socket.id)?.state ?? 'UNLOCKED';
  const winnerClass =
    winnerMessage === "🎉 ¡YOU WON!"
      ? "bg-violet-300 text-violet-500 rounded-4xl "
      : winnerMessage === "💀 YOU LOST"
      ? "bg-violet-950"
      : "bg-violet-500 rounded-2xl ";
  return (
    <div className="w-full h-full p-20">
      <p className="text-(--t-content)">
        <small>
          Tu Socket ID: <code>{socket.id}</code>
        </small>
      </p>

      {waitingRoom && !matchRoom && (
        <div className="flex flex-col items-center">
          <div className="w-full h-full flex flex-col justify-evenly">
            <div className="flex flex-row items-center gap-5 w-full pb-5">
            <h2>
              🎲 {waitingRoom.gameType} : 
            </h2>
              <h1 className="text-(--dark)"> {waitingRoom.roomCode} </h1>
              <p className="text-(--t-content)">
                {waitingRoom.players.length} / 2
                <small> (max 6)</small> 
                <ArrowRight/>
              </p>
            </div>
            <ul className="pb-20">
              {waitingRoom.players.map((p) => (
                <li className="flex flex-row" key={p.id}>
                  {p.id} ➡️ <b>{p.state}</b>
                  {p.id === socket.id ? <button onClick={toggleReadyStatus} className="flex flex-col items-center p-1 max-w-7 rounded-lg button--secondary">
                {myPlayerState === 'LOCKED' ? <Lock size={12}/> : <LockOpen size={12}/>}
              </button> : ''} 
                </li>
              ))}
            </ul>
          </div>
          <SelectDice
            // roomCode="test-room"
            selected={diceModel}
            playerState={myPlayerState}
            onSelect={setDiceModel}
            />
          <div className="fixed bottom-60 flex flex-col gap-2 items-center">
          <button
            onClick={() => startGame(waitingRoom.gameType)}
            disabled={waitingRoom.players.length === 1 }
            className="p-10 pb-5 pt-5 rounded-3xl button--highlight"
            >
            Play
          </button>
           {playError && <p className="text-(--t-error)">{playError}</p>}
           </div>
          <button onClick={exitRoom} className="fixed bottom-20 p-3 button--secondary rounded-3xl">
            Exit room
          </button>
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
              <span style={{ color: isMyTurn ? "bg-(--dark)": 'bf-(--light)' }}>
                {matchRoom.players[matchRoom.turn % matchRoom.players.length]?.id}{' '}
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
                  const totalScore = getPlayerScore(matchRoom.sum, p.id);
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #333' }}>
                      <td style={{ padding: '8px' }}>
                        {matchRoom.players[matchRoom.turn % matchRoom.players.length]?.id === p.id? '➡️' : ''}
                        {p.id} {p.id === socket.id ? ' (You)' : ''}
                        {matchRoom.players[matchRoom.turn % matchRoom.players.length]?.id === p.id? '➡️' : ''}
                        {p.id} {p.id === socket.id ? ' (You)' : ''}
                      </td>
                      <td className="p-2 text-lg text-(--dark)">
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
              onClick={rollDice}
              disabled={!isMyTurn || !!winnerMessage}
              className="button button--highlight rounded-sm"
              style={{
                cursor: isMyTurn ? 'pointer' : 'not-allowed',
              }}
            >
              🎲 Throw dice
            </button>

            {matchRoom.gameType === 'ADD42' && (
              <button
                onClick={standPlayer}
                disabled={!isMyTurn || !!winnerMessage}
                className="button button--highlight rounded-sm"
                // style={{ padding: '12px 24px', fontSize: '16px', backgroundColor: '#e67e22', color: 'white' }}
                className="button button--highlight rounded-sm"
                // style={{ padding: '12px 24px', fontSize: '16px', backgroundColor: '#e67e22', color: 'white' }}
              >
              {myMatchState === "UNLOCKED"? "✋ Stay (Lock)" : "Locked"}
              </button>
            )}

            <button onClick={exitMatch}
              className="button rounded-sm button--secondary">
              Exit match
            </button>
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
                Added from this turn: <b>+{lastRoll.nums.reduce((acc, d) => acc + d.value, 0)} pts</b>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
