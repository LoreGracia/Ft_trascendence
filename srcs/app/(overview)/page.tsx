"use client";
import Link from "next/link";
import PatternControl from "@/components/Pattern/PatternControl";
import DiceScene from "@/components/3dDice/DiceScene";
import { useState } from "react";

export default function Home() {
  const [paused, setPaused] = useState(false);

  return (
    <>
      <PatternControl paused={paused} onToggle={() => setPaused(!paused)} />
      <main className="container container-two">
        <section className="column">
          <DiceScene/>
        </section>
        <section className="column gap-8">
          <div className="row">
            <h1>This is Dice</h1>
            <p>Welcome</p>
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
                href="/signin"
                target="_self"
                rel="noopener noreferrer"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
