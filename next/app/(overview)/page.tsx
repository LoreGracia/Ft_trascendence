"use client";
import Link from "next/link";
import PatternControl from "@/components/Pattern/PatternControl";
import IndexDice from "@/components/3dDice/IndexDice";
import SelectDice from "@/components/3dDice/SelectDice";
import ThrowDice from "@/components/3dDice/ThrowDice";
import { useState } from "react";
import { useGameSocket } from '@/hooks/useGameSocket';

export default function Home() {
  const [isRolling, setIsRolling] = useState(false);
  const {
    lastRoll,
    rollDice,
  } = useGameSocket();
  const [diceTrigger, setDiceTrigger] = useState(0);
  const [paused, setPaused] = useState(false);
  const handleRoomRoll = () => {
    rollDice();// acción del socket
    setDiceTrigger((v) => v + 1); // dispara la animación del dado
  };
  return (
    <>
      <PatternControl paused={paused} onToggle={() => setPaused(!paused)} />
      <main className="flex flex-col-reverse justify-evenly items-center md:flex-row-reverse h-full">
        <IndexDice />
        {/*
            <IndexDice/>
          
            {/* <IndexDice />
            <SelectDice />
            <ThrowDice /> 
            <SelectDice roomCode="test-room" />
            <ThrowDice presetValue="default" roomCode="test-room" /> */}

        <div className="column">

          <h1>This is Dice</h1>

          <p className="text-(--t-content)">Welcome</p>

          <div className="flex flex-row gap-4 text-base font-medium">
            <Link
              className="button button-round button--secondary"
              href="/login"
              target="_self"
              rel="noopener noreferrer"
            >
              Log in
            </Link>
            <Link
              className="button button-round button--highlight"
              href="/signup"
              target="_self"
              rel="noopener noreferrer"
            >
              Sign up
            </Link>
          </div>
        </div>
      </main>
      <div className="fixed bottom-2 left-0 right-0 text-center text-xs opacity-70 z-50">
        <Link href="/terms" className="hover:underline">
          Terms, conditions and privacy policy
        </Link>
      </div>
    </>
  );
}
