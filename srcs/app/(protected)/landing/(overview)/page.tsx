'use client';

import { useState } from 'react';
import LandingClient from "@/components/LandingClient";
import ThrowDice from "@/components/3dDice/ThrowDice";
import { useGameSocket } from '@/hooks/useGameSocket';

export default function GameSelection() {
  const [isRolling, setIsRolling] = useState(false);
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
        <div className="flex flex-col items-center">
          <ThrowDice
            presetValue='default'
            lastResult={lastRoll}
            triggerRoll={diceTrigger}
            setIsRolling={setIsRolling}
            isRolling={isRolling}
          />
          <button
            onClick={handleRoomRoll}
            disabled={isRolling}
            className="button button--highlight rounded-sm"
          >
            {isRolling ? "Tirando..." : "🎲 Throw dice"}
          </button>
        </div>
    </div>
  );
}