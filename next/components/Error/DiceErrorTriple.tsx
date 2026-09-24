"use client";

import { useEffect, useRef } from "react";
import {
    ArcRotateCamera,
    Color4,
    Engine,
    HemisphericLight,
    Scene,
    Vector3,
} from "@babylonjs/core";
import { animateDiceFlight } from "@/components/3dDice/animationDice/diceAnimation";
import { createDiceInstance } from "@/components/3dDice/bodyDice/diceFactory";
import { DEFAULT_DICE_CONFIG } from "@/components/3dDice/modelDice/modelDice";
import styles from "@/components/3dDice/DiceScene.module.css";

interface DiceErrorTripleProps {
    result1: number;
    result2: number;
    result3: number;
    emoji1?: string;
    emoji2?: string;
    emoji3?: string;
}

export default function DiceErrorTriple({
    result1,
    result2,
    result3,
    emoji1,
    emoji2,
    emoji3,
}: DiceErrorTripleProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const engineRef = useRef<Engine | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || engineRef.current) return;

        const engine = new Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            alpha: true,
        });

        const scene = new Scene(engine);
        scene.clearColor = new Color4(0, 0, 0, 0);

        const camera = new ArcRotateCamera(
            "errorTripleCamera",
            -Math.PI / 2,
            Math.PI / 2.25,
            16,
            Vector3.Zero(),
            scene
        );
        camera.setTarget(Vector3.Zero());

        const mainLight = new HemisphericLight("mainLight", new Vector3(1, 1, 1), scene);
        mainLight.intensity = 1;

        const fillLight = new HemisphericLight("fillLight", new Vector3(-1, -1, 0), scene);
        fillLight.intensity = 0.4;

        // Crear 3 dados con diferentes posiciones
        const dice1 = createDiceInstance(scene, {
            ...DEFAULT_DICE_CONFIG,
            position: new Vector3(-3, -2.5, 0),
            rotation: Vector3.Zero(),
            visible: false,
            faceIcons: emoji1 ? { [result1]: { type: "emoji", char: emoji1 } } : undefined,
        });

        const dice2 = createDiceInstance(scene, {
            ...DEFAULT_DICE_CONFIG,
            position: new Vector3(0, -2.5, 0),
            rotation: Vector3.Zero(),
            visible: false,
            faceIcons: emoji2 ? { [result2]: { type: "emoji", char: emoji2 } } : undefined,
        });

        const dice3 = createDiceInstance(scene, {
            ...DEFAULT_DICE_CONFIG,
            position: new Vector3(3, -2.5, 0),
            rotation: Vector3.Zero(),
            visible: false,
            faceIcons: emoji3 ? { [result3]: { type: "emoji", char: emoji3 } } : undefined,
        });

        // Animar los 3 dados con delays escalonados
        const delayMs = (frames: number) => (frames * 1000) / 60;

        setTimeout(() => {
            animateDiceFlight(scene, dice1.root, {
                startPosition: new Vector3(-8, 1.5, 0),
                endPosition: new Vector3(-3, -3.5, 0),    // ← Bajado
                jumpHeight: 2,
                durationInFrames: 120,
                rotations: 4,
                result: result1,
            });
        }, delayMs(0));

        setTimeout(() => {
            animateDiceFlight(scene, dice2.root, {
                startPosition: new Vector3(-5, 1.5, 0),
                endPosition: new Vector3(0, -3.5, 0),    // ← Bajado
                jumpHeight: 2,
                durationInFrames: 120,
                rotations: 4,
                result: result2,
            });
        }, delayMs(30));

        setTimeout(() => {
            animateDiceFlight(scene, dice3.root, {
                startPosition: new Vector3(-2, 1.5, 0),
                endPosition: new Vector3(3, -3.5, 0),    // ← Bajado
                jumpHeight: 2,
                durationInFrames: 120,
                rotations: 4,
                result: result3,
            });
        }, delayMs(60));

        engineRef.current = engine;

        engine.runRenderLoop(() => {
            scene.render();
        });

        const handleResize = () => engine.resize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            engine.stopRenderLoop();
            dice1.root?.dispose();
            dice2.root?.dispose();
            dice3.root?.dispose();
            scene.dispose();
            engine.dispose();
            engineRef.current = null;
        };
    }, [result1, result2, result3, emoji1, emoji2, emoji3]);

    return <canvas ref={canvasRef} className={styles.diceScene__canvas} />;
}