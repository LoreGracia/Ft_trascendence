"use client";

import { useEffect, useRef, useState } from "react";
import { Engine, Scene, HemisphericLight, Vector3, Color4 } from "@babylonjs/core";
import { createDiceInstance } from "@/components/3dDice/bodyDice/diceFactory";
import { PRESET_OPTIONS, getDicePreset } from "@/components/3dDice/select/diceOptions";
import DiceCarouselItem from "@/components/3dDice/select/diceCarouselItem";
import { createOrbitCamera } from "@/components/3dDice/utils/diceCamera";
import { useDiceSocket } from "@/components/3dDice/connect/useDiceSocket";
import styles from "./DiceScene.module.css";

interface SelectDiceProps {
    /** Código de la sala/partida — lo necesita useDiceSocket para roll_dice/select_dice */
    roomCode: string;
    /** Se dispara cada vez que el usuario elige un dado; conéctalo al backend cuando toque. */
    onSelect?: (value: string) => void;
}

export default function SelectDice({ roomCode, onSelect }: SelectDiceProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const engineRef = useRef<Engine | null>(null);
    const sceneRef = useRef<Scene | null>(null);
    const diceInstanceRef = useRef<ReturnType<typeof createDiceInstance> | null>(null);
    const [selectedPreset, setSelectedPreset] = useState("default");

    const { selectDice } = useDiceSocket(roomCode);

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

        createOrbitCamera(scene, canvas);

        const light = new HemisphericLight("mainLight", new Vector3(0, 1, 0), scene);
        light.intensity = 0.9;
        const fillLight = new HemisphericLight("fillLight", new Vector3(0, -1, 0), scene);
        fillLight.intensity = 0.35;

        diceInstanceRef.current = createDiceInstance(scene, getDicePreset(selectedPreset));

        engine.runRenderLoop(() => {
            scene.render();
        });

        const handleResize = () => {
            engine.resize();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            diceInstanceRef.current?.dispose();
            scene.dispose();
            engine.dispose();
        };
    }, []);

    useEffect(() => {
        const scene = sceneRef.current;
        if (!scene) return;

        diceInstanceRef.current?.dispose();
        diceInstanceRef.current = createDiceInstance(scene, getDicePreset(selectedPreset));
    }, [selectedPreset]);

    const handlePick = (value: string) => {
        setSelectedPreset(value);
        selectDice(value);
        onSelect?.(value);
    };

    return (
        <div className={styles.diceScene}>
            <canvas ref={canvasRef} className={styles.diceScene__canvas} aria-label="3D dice scene" />

            <h2 className={styles.diceScene__title}>Selecciona tu dado</h2>

            <div className={styles.diceScene__carousel}>
                {PRESET_OPTIONS.map((option) => (
                    <DiceCarouselItem
                        key={option.value}
                        label={option.label}
                        presetValue={option.value}
                        selected={option.value === selectedPreset}
                        onSelect={() => handlePick(option.value)}
                    />
                ))}
            </div>
        </div>
    );
}