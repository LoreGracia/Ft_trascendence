"use client"
import { useState } from "react";
import { Check } from "lucide-react";
type OverlayType = "fast-play" | "42"

export default function ToggleModeButton() {
    const [selected, setSelected] = useState<OverlayType>("fast-play");

    return (
        <div className="flex flex-col gap-6 justify-center">
        <div
            className="row overflow-hidden rounded-4xl
            ring ring-(--light)">
            <button
            className={`button
            ${
              selected === "fast-play"
                ? "bg-(--light)"
                : "bg-(--white) hover:bg-(--dark)/20"
            }`}
            onClick={() => setSelected("fast-play")}
            >
                {selected === "fast-play" && <Check className=""/> }
                Fast-play
            </button>
            <button
            className={`button
                        ${
              selected === "42"
                ? "bg-(--light)"
                : "bg-(--white)  hover:bg-(--dark)/20"
            }`}
            onClick={() => setSelected("42")}
            >
                {selected === "42" && <Check className=""/> }
                42
            </button>
        </div>
            <div className="box  bg-(--light) max-w-1">
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
                Do not get over 42 
                <br/>
                or you will get black holed.
                <br/>
                Now roll, roll, ROLL!
                </p>
                )}
            </div>
        </div>
    );
}