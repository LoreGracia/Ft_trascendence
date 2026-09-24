"use client";

import { useEffect, useRef, useState } from "react";
import {
    Engine,
    Scene,
    ArcRotateCamera,
    HemisphericLight,
    Vector3,
    Color4,
} from "@babylonjs/core";
import { rollDice as mockRollDice } from "@/components/3dDice/startThrow/diceRoll";
import { animateDiceFlight } from "@/components/3dDice/animationDice/diceAnimation";
import { createDiceInstance } from "@/components/3dDice/bodyDice/diceFactory";
import { getDicePreset } from "@/components/3dDice/select/diceOptions";
import { useDiceSocket } from "@/components/3dDice/connect/useDiceSocket";
import styles from "./DiceScene.module.css";

interface ThrowDiceProps {
    presetValue: string;
    roomCode: string;
}

export default function ThrowDice({ presetValue, roomCode }: ThrowDiceProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const engineRef = useRef<Engine | null>(null);
    const sceneRef = useRef<Scene | null>(null);
    const diceInstanceRef = useRef<ReturnType<typeof createDiceInstance> | null>(null);
    const isFirstPresetRun = useRef(true);
    const [resultText, setResultText] = useState("Resultado: -");
    const [isRolling, setIsRolling] = useState(false);

    const { rollDice, lastResult } = useDiceSocket(roomCode);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const engine = new Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            alpha: true,
            premultipliedAlpha: true,
        });
        const scene = new Scene(engine);
        scene.clearColor = new Color4(0, 0, 0, 0);
        engineRef.current = engine;
        sceneRef.current = scene;

        const camera = new ArcRotateCamera(
            "diceCamera",
            -Math.PI / 2,
            Math.PI / 2.5,
            10,
            Vector3.Zero(),
            scene
        );
        // camera.attachControl(canvas, true);

        const light = new HemisphericLight("mainLight", new Vector3(0, 1, 0), scene);
        light.intensity = 0.9;
        const fillLight = new HemisphericLight("fillLight", new Vector3(0, -1, 0), scene);
        fillLight.intensity = 0.35;

        diceInstanceRef.current = createDiceInstance(scene, getDicePreset(presetValue));

        engine.runRenderLoop(() => {
            scene.render();
        });

        requestAnimationFrame(() => {
            engine.resize();
        });

        const handleResize = () => {
            engine.resize();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            diceInstanceRef.current?.dispose();
            diceInstanceRef.current = null;
            scene.dispose();
            engine.dispose();
            sceneRef.current = null;
            engineRef.current = null;
            isFirstPresetRun.current = true;
        };
    }, []);

    useEffect(() => {
        const scene = sceneRef.current;
        if (!scene) return;

        // El dado inicial ya lo crea el efecto de montaje con este mismo
        // presetValue — nos saltamos la primera ejecución para no crear
        // (y destruir) un dado extra de forma redundante justo al montar.
        if (isFirstPresetRun.current) {
            isFirstPresetRun.current = false;
            return;
        }

        diceInstanceRef.current?.dispose();
        diceInstanceRef.current = createDiceInstance(scene, getDicePreset(presetValue));
        setResultText("Resultado: -");
    }, [presetValue]);

    useEffect(() => {
        if (!lastResult || !diceInstanceRef.current || !sceneRef.current) return;

        const value = lastResult.nums[0]?.value;
        if (value === undefined) return;

        setIsRolling(true);
        setResultText("Resultado: tirando...");

        animateDiceFlight(sceneRef.current, diceInstanceRef.current.root, {
            result: value,
            onFinish: () => {
                setResultText(`Resultado: ${value}`);
                setIsRolling(false);
            },
        });
    }, [lastResult]);

    const handleRollClick = () => {
        if (isRolling || !diceInstanceRef.current || !sceneRef.current) return;

        rollDice();

        setIsRolling(true);
        setResultText("Resultado: tirando...");
        const fallbackValue = mockRollDice(6);
        animateDiceFlight(sceneRef.current, diceInstanceRef.current.root, {
            result: fallbackValue,
            onFinish: () => {
                setResultText(`Resultado: ${fallbackValue}`);
                setIsRolling(false);
            },
        });
    };

    return (
        <div className={styles.diceScene}>
            <div className={styles.diceScene__controls}>
                <button
                    type="button"
                    className={styles.diceScene__button}
                    onClick={handleRollClick}
                    disabled={isRolling}
                >
                    {isRolling ? "Tirando..." : "Lanzar dado"}
                </button>
            </div>
            <canvas ref={canvasRef} className={styles.diceScene__canvas} aria-label="3D dice scene" />
            <div className={styles.diceScene__status}>{resultText}</div>
        </div>
    );
}