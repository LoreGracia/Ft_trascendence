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
    <div className="container pt-30 md:pt-0 container-two">
        <LandingClient/>
        <ThrowDice
          onClick={handleRoomRoll}
          presetValue='default'
          lastResult={lastRoll}
          triggerRoll={diceTrigger}
          setIsRolling={setIsRolling}
          isRolling={isRolling}
        />
    </div>
  );
}