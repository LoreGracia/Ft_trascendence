'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameSocket } from '@/hooks/useGameSocket';
import { socket } from '@/lib/socket';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Lock, LockOpen } from "lucide-react";

export default function GameRoom() {
  const searchParams = useSearchParams();
  const roomCode = searchParams.get('roomCode');
  const router = useRouter();
  const {
    waitingRoom,
    matchRoom,
    lastRoll,
    winnerMessage,
    isMyTurn,
    exitRoom,
    toggleReadyStatus,
    startGame,
    rollDice,
    standPlayer,
    getPlayerScore,
    playError,
  } = useGameSocket();
  console.log(`Pasa 1  ${roomCode}`);
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
          {/* <button
            onClick={() => startGame('FREE_PLAY')}
            disabled={waitingRoom.players.length === 1}
            className="button rounded-3xl button--highlight"
            >
            Iniciar FREE_PLAY
          </button>
          <button
            onClick={() => startGame('ADD42')}
            className="button rounded-3xl button--highlight"
            disabled={waitingRoom.players.length === 1}
            >
            Iniciar ADD42
          </button> */}
          <button onClick={exitRoom} className="fixed bottom-20 p-3 button--secondary rounded-3xl">
            Exit room
          </button>
        </div>
      )}

      {matchRoom && (
        <div style={{ border: '1px solid #44bd32', padding: '15px', borderRadius: '8px' }}>
          <h2>
            Partida: {matchRoom.roomCode} | Modo:{' '}
            <span style={{ color: '#fbc531' }}>{matchRoom.gameType}</span>
          </h2>

          {winnerMessage && (
            <div
              style={{
                backgroundColor: '#27ae60',
                color: 'white',
                padding: '15px',
                borderRadius: '5px',
                fontSize: '20px',
                marginBottom: '15px',
              }}
            >
              {winnerMessage}
            </div>
          )}

          <h3>
            Turno de:{' '}
            <span style={{ color: isMyTurn ? '#44bd32' : '#e74c3c' }}>
              {matchRoom.players[matchRoom.turn % matchRoom.players.length]?.id}{' '}
              {isMyTurn ? '(¡TU TURNO!)' : ''}
            </span>
          </h3>

          <div style={{ backgroundColor: '#1e1e1e', padding: '10px', borderRadius: '6px', margin: '15px 0' }}>
            <h3>📊 SUMA TOTAL DE RESULTADOS:</h3>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #444' }}>
                  <th style={{ padding: '8px' }}>Jugador</th>
                  <th style={{ padding: '8px' }}>Suma Total Acumulada</th>
                  <th style={{ padding: '8px' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {matchRoom.players.map((p) => {
                  const totalScore = getPlayerScore(matchRoom.sum, p.id);
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #333' }}>
                      <td style={{ padding: '8px' }}>
                        {p.id} {p.id === socket.id ? ' (Tú)' : ''}
                      </td>
                      <td style={{ padding: '8px', fontSize: '18px', color: '#00ffcc' }}>
                        <b>{totalScore} pts</b>
                      </td>
                      <td style={{ padding: '8px' }}>{p.state}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: '10px', margin: '20px 0', flexWrap: 'wrap' }}>
            <button
              onClick={rollDice}
              disabled={!isMyTurn || !!winnerMessage}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                backgroundColor: isMyTurn ? '#44bd32' : '#555',
                color: 'white',
                cursor: isMyTurn ? 'pointer' : 'not-allowed',
              }}
            >
              🎲 Tirar Dados
            </button>

            {matchRoom.gameType === 'ADD42' && (
              <button
                onClick={standPlayer}
                disabled={!isMyTurn || !!winnerMessage}
                style={{ padding: '12px 24px', fontSize: '16px', backgroundColor: '#e67e22', color: 'white' }}
              >
                ✋ Plantarse (Lock)
              </button>
            )}

            <button onClick={exitRoom} style={{ backgroundColor: '#c23616', color: 'white' }}>
              Salir de la partida
            </button>
          </div>

          {lastRoll && (
            <div style={{ background: '#222', padding: '12px', borderRadius: '5px', borderLeft: '4px solid #00a8ff' }}>
              <h4>Último movimiento ({lastRoll.idPlayer}):</h4>
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
                Suma de este turno: <b>+{lastRoll.nums.reduce((acc, d) => acc + d.value, 0)} pts</b>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
