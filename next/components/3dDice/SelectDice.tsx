"use client";

import { useEffect, useRef, useState } from "react";
import { Engine, Scene, HemisphericLight, Vector3, Color4 } from "@babylonjs/core";
import { createDiceInstance } from "@/components/3dDice/bodyDice/diceFactory";
import { PRESET_OPTIONS, getDicePreset } from "@/components/3dDice/select/diceOptions";
import DiceCarouselItem from "@/components/3dDice/select/diceCarouselItem";
import { createOrbitCamera } from "@/components/3dDice/utils/diceCamera";
import styles from "./DiceScene.module.css";
import { DiceModel } from "@/types/game";

interface SelectDiceProps {
    /** Código de la sala/partida — lo necesita useDiceSocket para roll_dice/select_dice */
    selected?: DiceModel;
    playerState: string;
    /** Se dispara cada vez que el usuario elige un dado; conéctalo al backend cuando toque. */
    onSelect?: (value: DiceModel) => void;
    toggleReadyStatus?: () => void;
}

export default function SelectDice({ selected, playerState, onSelect, toggleReadyStatus }: SelectDiceProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const engineRef = useRef<Engine | null>(null);
    const sceneRef = useRef<Scene | null>(null);
    const diceInstanceRef = useRef<ReturnType<typeof createDiceInstance> | null>(null);
    const [selectedPreset, setSelectedPreset] = useState("default");

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

        // createOrbitCamera(scene, canvas);
        const camera = createOrbitCamera(scene, canvas, undefined, { radius: 0.5, beta: Math.PI / 2.3 });

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

    const handlePick = (value: DiceModel) => {
        setSelectedPreset(value);
        selected === value;
        onSelect?.(value);
    };
    const carouselRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const onWheel = (event: WheelEvent) => {
        if (Math.abs(event.deltaY) > 0) {
            event.preventDefault();
            carousel.scrollLeft += event.deltaY;
        }
        };

        carousel.addEventListener("wheel", onWheel, { passive: false });
        return () => carousel.removeEventListener("wheel", onWheel);
    }, []);

    return (
        <div className="flex w-full flex-col items-center">
            <div className="flex relative w-full h-full min-h-40 max-h-60 max-w-90 md:min-h-70">
                <canvas ref={canvasRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] md:w-[120%] md:h-[120%] outline-none" aria-label="3D dice scene" />
            </div>
            <button
                onClick={toggleReadyStatus}
                className={playerState === 'UNLOCKED' ? "p-2 mb-3 md:mb-10 rounded-lg button--highlight z-50" : "p-2 mb-10 rounded-lg button--secondary"}>
                {playerState === 'LOCKED' ? "Not ready" : "Ready"}
            </button>
            {playerState === "UNLOCKED" &&
            <div className="flex flex-col w-full">
                <h2 className="text-(--dark) size-5 pb-4 m-0 text-center w-full">Select your dice</h2>
                <div ref={carouselRef} className={styles.diceScene__carousel}>
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
            </div>}
        </div>
    );
}