"use client"
import { useState } from "react";
type OverlayType = "fast-play" | "42"

export default function ToggleModeButton() {
    const [selected, setSelected] = useState<OverlayType>("fast-play");

    return (
        <div className="flex flex-col gap-5 justify-center">
        <div className="row overflow-hidden">
            <button
            className={`button button--secondary rounded-s-2xl
            ${
              selected === "fast-play"
                ? "bg-(--light)"
                : ""
            }`}
            onClick={() => setSelected("fast-play")}
            >
                fast-play
            </button>
            <button
            className={`button rounded-e-2xl button--secondary
                        ${
              selected === "42"
                ? "bg-(--light)"
                : ""
            }`}
            onClick={() => setSelected("42")}
            >
                42
            </button>
        </div>
            <div className="box box--primary">
                {selected === "fast-play" ? (
                // <h1>Fast-play</h1>
                <p>Roll the dice 
                    <br/>
                    Biggest wins!
                    <br/>
                    Equal? Retry!
                </p>
                ) : (
                <p>The first one to reach 42 wins.
                <br/>
                Do not get over 42 or you will get balck holed.
                <br/>
                Now roll, roll, ROLL!
                </p>
                )}
            </div>
        </div>
    );
}