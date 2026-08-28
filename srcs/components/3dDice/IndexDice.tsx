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
import { INDEX_DICE_CONFIG } from "@/components/3dDice/modelDice/diceConfig";
import styles from "./DiceScene.module.css";

export default function IndexDice() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const engineRef = useRef<Engine | null>(null);
    const sceneRef = useRef<Scene | null>(null);
    const rootRef = useRef<TransformNode | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || engineRef.current || sceneRef.current) return;

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
            "indexDiceCamera",
            -Math.PI / 2,
            Math.PI / 2.5,
            9,
            Vector3.Zero(),
            scene
        );
        camera.setTarget(Vector3.Zero());

        const mainLight = new HemisphericLight("mainLight", new Vector3(1, 1, 1), scene);
        mainLight.intensity = 1;

        const fillLight = new HemisphericLight("fillLight", new Vector3(-1, -1, 0), scene);
        fillLight.intensity = 0.4;

        const dice = createDiceInstance(scene, {
            ...INDEX_DICE_CONFIG,
            position: new Vector3(0, 0, 0),
            rotation: Vector3.Zero(),
            visible: true,
        });
        rootRef.current = dice.root;

        const randomResult = Math.floor(Math.random() * 6) + 1;

        animateDiceFlight(scene, dice.root, {
            startPosition: new Vector3(-8, 1.5, 0),
            endPosition: new Vector3(0, 0, 0),
            jumpHeight: 2.1,
            durationInFrames: 150,
            rotations: 4,
            result: randomResult,
        });

        engine.runRenderLoop(() => {
            scene.render();
        });

        const handleResize = () => {
            engine.resize();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            engine.stopRenderLoop();
            rootRef.current?.dispose();
            sceneRef.current?.dispose();
            engineRef.current?.dispose();
            rootRef.current = null;
            sceneRef.current = null;
            engineRef.current = null;
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.diceScene__canvas} aria-label="Independent dice demo" />;
}

