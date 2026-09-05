"use client";

import { useEffect, useRef } from "react";
import {
    ArcRotateCamera,
    Color4,
    Engine,
    HemisphericLight,
    Scene,
    TransformNode,
    Vector3,
} from "@babylonjs/core";
import { animateDiceFlight } from "@/components/3dDice/animationDice/diceAnimation";
import { createDiceInstance } from "@/components/3dDice/bodyDice/diceFactory";
import { DEFAULT_DICE_CONFIG } from "@/components/3dDice/modelDice/modelDice";
import styles from "./DiceScene.module.css";

interface DiceResultProps {
    result: number;
    emoji?: string;         // 1-6: número en el que debe parar
    startPosition?: Vector3;
    endPosition?: Vector3;
    preset?: string;         // "default", "warrior", "code", etc.
}

export default function DiceResult({
    result,
    emoji,
    startPosition = new Vector3(-4, 1.5, 0),
    endPosition = new Vector3(0, 0, 0),
    preset = "default",
}: DiceResultProps) {
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
            "diceCamera",
            -Math.PI / 2,
            Math.PI / 2.5,
            6,
            Vector3.Zero(),
            scene
        );
        camera.setTarget(Vector3.Zero());

        const mainLight = new HemisphericLight("mainLight", new Vector3(1, 1, 1), scene);
        mainLight.intensity = 1;

        const fillLight = new HemisphericLight("fillLight", new Vector3(-1, -1, 0), scene);
        fillLight.intensity = 0.4;

        const dice = createDiceInstance(scene, {
            ...DEFAULT_DICE_CONFIG,
            position: startPosition,
            rotation: Vector3.Zero(),
            visible: true,
            preset,
            faceIcons: emoji ? {
                [result || 1]: { type: "emoji", char: emoji }
            } : undefined,
        });

        animateDiceFlight(scene, dice.root, {
            startPosition,
            endPosition,
            jumpHeight: 2,
            durationInFrames: 120,
            rotations: 4,
            result,
        });

        engineRef.current = engine;

        engine.runRenderLoop(() => {
            scene.render();
        });

        const handleResize = () => engine.resize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            engine.stopRenderLoop();
            dice.root?.dispose();
            scene.dispose();
            engine.dispose();
            engineRef.current = null;
        };
    }, [result, startPosition, endPosition, preset]);

    return <canvas ref={canvasRef} className={styles.diceScene__canvas} />;
}