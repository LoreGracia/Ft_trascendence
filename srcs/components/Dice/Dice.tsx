"use client";

import { useEffect, useRef } from "react";

import { initDice } from "@/dice/main";

export default function Dice3D() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const selectorRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        if (!canvasRef.current || !selectorRef.current) return;

        const dispose = initDice(canvasRef.current, selectorRef.current);

        return () => {
            dispose?.();
        };
    }, []);

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100vh",
            }}
        >
            <canvas
                ref={canvasRef}
                id="renderCanvas"
                style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    touchAction: "none",
                }}
            />

            <select
                ref={selectorRef}
                id="diceTypeSelector"
                defaultValue="default"
                style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    zIndex: 10,
                    padding: "8px 12px",
                    borderRadius: 6,
                }}
            >
                <optgroup label="Básicos">
                    <option value="default">Default</option>
                    <option value="redDice">Rojo</option>
                    <option value="blueDice">Azul</option>
                    <option value="greenDice">Verde</option>
                    <option value="goldDice">Dorado</option>
                    <option value="blackDice">Negro</option>
                </optgroup>

                <optgroup label="Legendarios">
                    <option value="legendary:universe">Universe</option>
                    <option value="legendary:nature">Nature</option>
                    <option value="legendary:magician">Magician</option>
                    <option value="legendary:warrior">Warrior</option>
                    <option value="legendary:code">Code</option>
                </optgroup>
            </select>
        </div>
    );
}
