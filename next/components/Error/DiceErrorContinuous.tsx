"use client";

import { useEffect, useRef } from "react";
import {
    ArcRotateCamera,
    Color4,
    Engine,
    HemisphericLight,
    Scene,
    Animation,
    Vector3,
} from "@babylonjs/core";
import { createDiceInstance } from "@/components/3dDice/bodyDice/diceFactory";
import { DEFAULT_DICE_CONFIG } from "@/components/3dDice/modelDice/modelDice";
import styles from "@/components/3dDice/DiceScene.module.css";

interface DiceErrorContinuousProps {
    result1: number;
    result2: number;
    result3: number;
    emoji1?: string;
    emoji2?: string;
    emoji3?: string;
    faceEmojis1?: Record<number, string>;
    faceEmojis2?: Record<number, string>;
    faceEmojis3?: Record<number, string>;
}

export default function DiceErrorContinuous({
    result1,
    result2,
    result3,
    emoji1,
    emoji2,
    emoji3,
    faceEmojis1,
    faceEmojis2,
    faceEmojis3,
}: DiceErrorContinuousProps) {
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
            "errorContinuousCamera",
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

        // Función helper para construir faceIcons
        const buildFaceIcons = (
            faceEmojis?: Record<number, string>,
            emoji?: string,
            result?: number
        ) => {
            if (faceEmojis) {
                return Object.entries(faceEmojis).reduce(
                    (acc, [face, char]) => ({
                        ...acc,
                        [parseInt(face)]: { type: "emoji", char },
                    }),
                    {}
                );
            }
            if (emoji && result) {
                return { [result]: { type: "emoji", char: emoji } };
            }
            return undefined;
        };

        // Crear 3 dados
        const dice1 = createDiceInstance(scene, {
            ...DEFAULT_DICE_CONFIG,
            position: new Vector3(-3, -3.5, 0),
            rotation: Vector3.Zero(),
            visible: true,
            faceIcons: buildFaceIcons(faceEmojis1, emoji1, result1),
        });

        const dice2 = createDiceInstance(scene, {
            ...DEFAULT_DICE_CONFIG,
            position: new Vector3(0, -3.5, 0),
            rotation: Vector3.Zero(),
            visible: true,
            faceIcons: buildFaceIcons(faceEmojis2, emoji2, result2),
        });

        const dice3 = createDiceInstance(scene, {
            ...DEFAULT_DICE_CONFIG,
            position: new Vector3(3, -3.5, 0),
            rotation: Vector3.Zero(),
            visible: true,
            faceIcons: buildFaceIcons(faceEmojis3, emoji3, result3),
        });

        // Animación infinita de rotación para cada dado
        const createContinuousRotation = (diceRoot: any) => {
            const rotation = new Animation(
                "continuousRotation",
                "rotation",
                60,
                Animation.ANIMATIONTYPE_VECTOR3,
                Animation.ANIMATIONLOOPMODE_CYCLE
            );

            rotation.setKeys([
                { frame: 0, value: new Vector3(0, 0, 0) },
                { frame: 240, value: new Vector3(Math.PI * 2, Math.PI * 2, Math.PI * 2) },
            ]);

            diceRoot.animations = [rotation];
            scene.beginAnimation(diceRoot, 0, 240, true);
        };

        // Iniciar rotaciones
        createContinuousRotation(dice1.root);
        createContinuousRotation(dice2.root);
        createContinuousRotation(dice3.root);

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
    }, [result1, result2, result3, emoji1, emoji2, emoji3, faceEmojis1, faceEmojis2, faceEmojis3]);

    return <canvas ref={canvasRef} className={styles.diceScene__canvas} />;
}