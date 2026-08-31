"use client";

import { Check } from "lucide-react";

import type { GameType } from "@/types/game";

type ToggleModeButtonProps = {
  selected: GameType;
  onChange: (mode: GameType) => void;
};

export default function ToggleModeButton({
  selected,
  onChange,
}: ToggleModeButtonProps) {
  return (
    <div className="flex flex-col gap-6 justify-center">
      <div className="row overflow-hidden rounded-4xl ring ring-(--light)">
        <button
          className={`button ${
            selected === "FREE_PLAY"
              ? "bg-(--light)"
              : "bg-(--white) hover:bg-(--dark)/20"
          }`}
          onClick={() => onChange("FREE_PLAY")}
        >
          {selected === "FREE_PLAY" && <Check />}
          Fast-play
        </button>

        <button
          className={`button ${
            selected === "ADD42"
              ? "bg-(--light)"
              : "bg-(--white) hover:bg-(--dark)/20"
          }`}
          onClick={() => onChange("ADD42")}
        >
          {selected === "ADD42" && <Check />}
          42
        </button>
      </div>

      <div className="box bg-(--light) max-w-1">
        {selected === "FREE_PLAY" ? (
          <p>
            Roll the dice
            <br />
            Biggest wins!
            <br />
            Equal? Retry!
          </p>
        ) : (
          <p>
            The first one to reach 42 wins.
            <br />
            Do not get over 42
            <br />
            or you will get black holed.
            <br />
            Now roll, roll, ROLL!
          </p>
        )}
      </div>
    </div>
  );
}
