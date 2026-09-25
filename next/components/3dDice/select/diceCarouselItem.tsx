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
import { createDiceInstance } from "@/components/3dDice/bodyDice/diceFactory";
import { getDicePreset } from "./diceOptions";
import styles from "../DiceScene.module.css";

interface DiceCarouselItemProps {
    label: string;
    presetValue: string;
    selected: boolean;
    onSelect: () => void;
}

export default function DiceCarouselItem({
    label,
    presetValue,
    selected,
    onSelect,
}: DiceCarouselItemProps) {
    const containerRef = useRef<HTMLButtonElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const engineRef = useRef<Engine | null>(null);
    const sceneRef = useRef<Scene | null>(null);
    const diceInstanceRef = useRef<ReturnType<typeof createDiceInstance> | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Solo activa el render cuando el ítem entra en el viewport del carrusel.
    useEffect(() => {
        const node = containerRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.4 }
        );
        observer.observe(node);

        return () => observer.disconnect();
    }, []);

    // Crea/destruye la mini escena Babylon.js según visibilidad.
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isVisible) return;

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

        new ArcRotateCamera(
            "miniDiceCamera",
            -Math.PI / 2,
            Math.PI / 2.5,
            6,
            Vector3.Zero(),
            scene
        );

        const light = new HemisphericLight("miniDiceLight", new Vector3(0, 1, 0), scene);
        light.intensity = 0.9;

        diceInstanceRef.current = createDiceInstance(scene, getDicePreset(presetValue));

        engine.runRenderLoop(() => {
            scene.render();
        });

        return () => {
            diceInstanceRef.current?.dispose();
            scene.dispose();
            engine.dispose();
            engineRef.current = null;
            sceneRef.current = null;
            diceInstanceRef.current = null;
        };
    }, [isVisible, presetValue]);

    return (
        <button
            type="button"
            ref={containerRef}
            onClick={onSelect}
            aria-pressed={selected}
            aria-label={label}
            className={`${styles.diceCarouselItem} ${selected ? styles["diceCarouselItem--selected"] : ""
                }`}
        >
            <canvas ref={canvasRef} className={styles.diceCarouselItem__canvas} aria-hidden="true" />
            <span className={styles.diceCarouselItem__label}>{label}</span>
        </button>
    );
}