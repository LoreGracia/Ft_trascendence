'use client';

import { useEffect, useState } from 'react';
import { useGameSocket } from '@/hooks/useGameSocket';
import { socket } from '@/lib/socket';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, ClipboardCopy } from "lucide-react";
import { cn } from "@/lib/utils"
import SelectDice from './3dDice/SelectDice';
import { useSocket } from "@/components/SocketProvider";
import ThrowDice from "@/components/3dDice/ThrowDice";
import { Avatar } from './Avatar/Avatar';

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
    if (winnerMessage && !isMyTurn) return;
    console.log("1 ROLLDICE");
    rollDice();// acción del socket
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
      ? "bg-linear-to-t from-violet-300 to-violet-100 text-violet-500 rounded-4xl "
      : winnerMessage === "💀 YOU LOST"
        ? " bg-linear-to-t from-violet-900 to-0"
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
    <div className="flex flex-col h-full pt-20 pb-15 p-10 md:p-20">
      <p className="text-(--t-content)">
        <small>
          {mounted ? `Tu Socket ID: ${socketId}` : 'Tu Socket ID: '}
        </small>
      </p>

      {waitingRoom && !matchRoom && (
        <div className="flex flex-col items-center h-full">
          <div className="w-full h-full flex flex-col">
            <div className="flex flex-row w-full md:mb-5 gap-5">
              <h2 className="text-(--t-content)">
                {waitingRoom.gameType} 🎲
              </h2>
              <div className="flex flex-row">
                <h1
                  className="text-(--dark)"
                  onClick={handleCopyRoomCode}
                > {waitingRoom.roomCode}
                </h1>
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
                  <p className="hidden md:visible ms-10 text-(--t-content)">
                    {waitingRoom.players.length} / 2
                    <small> (max 6)</small>
                    <ArrowRight />
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-evenly">
                <ul className="flex flex-row gap-5 items-center justify-evenly">
                  {waitingRoom.players.map((p) => (
                    <li className="flex flex-col items-center justify-evenly mt-5" key={p.playerId}>
                      <div className='[&_svg]:size-5 md:[&_svg]:size-10'>
                        <Avatar image={p.userImage} name={p.name}/>
                      </div>
                      <h2 className="text-2xl">{p.name}</h2>
                      {p.state === 'UNLOCKED'? "🤔" : "👍" }
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2 items-center justify-evenly pt-5 md:pt-0">
                  <div className="flex flex-wrap gap-2 items-center">
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
        </div>
      )}

      {matchRoom && (
        <div  className="flex flex-col items-center h-full justify-evenly">
          <div className="pb-5">
            <h2>
              Room: {matchRoom.roomCode} | Mode:{' '}
              <span className="text-(--dark)">{matchRoom.gameType}</span>
            </h2>
          </div>
          {!isRolling && winnerMessage && (
            <div
              className={cn("flex items-center justify-evenly p-5 text-4xl", winnerClass)}>
              {winnerMessage}
            </div>
          )}

          {!winnerMessage && (
            <h3>
              Turn of:{' '}
              <span style={{ color: isMyTurn ? "bg-(--dark)" : 'bf-(--light)' }} className="m-auto">
                {matchRoom.players[matchRoom.turn % matchRoom.players.length]?.name}{' '}
                {isMyTurn ? '(¡YOURS!)' : ''}
              </span>
            </h3>
          )}

          <ul className="flex flex-wrap md:flex-row gap-5 items-center justify-evenly">
            {matchRoom.players.map((p) => {
              const totalScore = getPlayerScore(matchRoom.sum, p.playerId);
              return (
              <li className={cn("flex flex-col items-center justify-evenly mt-5 rounded-2xl p-2 pl-5 pr-5",
                matchRoom.players[matchRoom.turn % matchRoom.players.length]?.playerId === p.playerId && !winnerMessage?
                'bg-(--light)' : '',
                p.state === "WIN"? "bg-linear-to-t from-0 to-violet-300" : ""
              )}
              key={p.playerId}>
                <b className="p-2 text-xl text-(--black)">{totalScore} pts</b>
                <p className={cn(p.state === "WIN"? "" : "hidden", "absolut")}
                >👑</p>
                <Avatar image={p.userImage} name={p.name} size="md"/>
                <h2 className="text-2xl">{p.name}</h2>
                <p className="p-5 pb-2 pt-2 bg-(--light) rounded-2xl text-2xl truncate">
                  {p.state === "WIN"
                  ? "₍₍⚞(˶>ᗜ<˶)⚟⁾⁾"
                  : (p.state === "TIE"
                  ? "˙𐃷˙"
                  : (p.state === "LOSE"
                  ? "(⸝⸝⩌ ⤙ ⩌⸝⸝)"
                  : (p.state === 'UNLOCKED'? "৻(•̀ ᗜ•́ ৻)" : "(≖⩊≖)")))}
              </p>
              </li>
            );})}
            </ul>


          <div className="flex flex-wrap gap-2.5 mt-10 mb-10 justify-evenly items-center">
            <button
              hidden={!(myMatchState === "UNLOCKED")}
              onClick={handleRoomRoll}
              disabled={!isMyTurn || !!winnerMessage || isRolling}
              className="button button--highlight rounded-sm"
              style={{
                cursor: isMyTurn ? 'pointer' : 'not-allowed',
              }}
            >
              {isRolling ? "Tirando..." : "Throw 🎲"}
            </button>

            {matchRoom.gameType === 'ADD42' && (
              <button
                onClick={standPlayer}
                disabled={!isMyTurn || !!winnerMessage}
                className="button button--highlight rounded-sm"
                aria-label="You won't throw anymore"
              >
                {myMatchState === "UNLOCKED" ? "✋ Stay" : "Locked"}
              </button>
            )}
            <button onClick={exitMatch}
              className="button rounded-sm button--secondary">
              Exit match
            </button>
          </div>
            { isTurn &&
              <div  className="flex justify-evenly items-center w-full h-full min-h-30 max-h-40 md:max-h-80 md:flex-row-reverse">
              <ThrowDice
                // onClick={handleRoomRoll}
                presetValue={matchRoom.players.find((p) => matchRoom.turn % matchRoom.players.length)?.diceModel ?? 'default'}
                lastResult={lastRoll}
                triggerRoll={diceTrigger}
                setIsRolling={setIsRolling}
                isRolling={isRolling}
              />
              </div>
            }
        </div>
      )}
    </div>
  );
}
