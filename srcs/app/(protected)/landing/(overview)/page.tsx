'use client';

import { useState } from 'react';
import LandingClient from "@/components/LandingClient";
import ThrowDice from "@/components/3dDice/ThrowDice";
import { useGameSocket } from '@/hooks/useGameSocket';

export default function GameSelection() {
  const {
    lastRoll,
    rollDice,
  } = useGameSocket();
  const [diceTrigger, setDiceTrigger] = useState(0);
  const handleRoomRoll = () => {
    rollDice();// acción del socket
    setDiceTrigger((v) => v + 1); // dispara la animación del dado
  };
  return (
    <div className="container container-two">
        <LandingClient/>
        <button
          onClick={handleRoomRoll}
          className="button button--highlight rounded-sm"
        >
          🎲 Throw dice
          {/* {isRolling ? "Tirando..." : "🎲 Throw dice"} */}
        </button>
        <ThrowDice
          presetValue='default'
          lastResult={lastRoll}
          triggerRoll={diceTrigger}
        />
    </div>
  );
}