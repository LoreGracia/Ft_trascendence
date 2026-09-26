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
import styles from "./DiceScene.module.css";
import { DiceModel, LastRoll } from "@/types/game";
import { socket } from '@/lib/socket';

interface ThrowDiceProps {
    onClick?: () => void;
    presetValue: DiceModel;
    lastResult: LastRoll | null;
    triggerRoll: number;
    isRolling: boolean;
    setIsRolling: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ThrowDice({ onClick, presetValue, lastResult, triggerRoll, setIsRolling, isRolling }: ThrowDiceProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const engineRef = useRef<Engine | null>(null);
    const sceneRef = useRef<Scene | null>(null);
    const diceInstanceRef = useRef<ReturnType<typeof createDiceInstance> | null>(null);
    const cameraRef = useRef<ArcRotateCamera | null>(null);
    const isFirstPresetRun = useRef(true);

    useEffect(() => {
        if (triggerRoll === 0) return;
        handleRollClick();
    }, [triggerRoll]);

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
        cameraRef.current = camera;
        camera.attachControl(canvas, true);

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
            cameraRef.current?.detachControl();
            cameraRef.current = null;
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
        const canvas = canvasRef.current;
        const camera = cameraRef.current;

        if (!canvas || !camera) return;

        if (isRolling) {
            camera.detachControl();
            cameraRef.current = camera;
            return;
        }

        camera.attachControl(canvas, true);
    }, [isRolling]);

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
    }, [presetValue]);

    useEffect(() => {
        if (!lastResult || !diceInstanceRef.current || !sceneRef.current) return;

        const value = lastResult.nums[0]?.value;
        if (value === undefined) return;

        setIsRolling(true);

        // animateDiceFlight(sceneRef.current, diceInstanceRef.current.root, {
        //     result: value,
        //     onFinish: () => {
        //         setIsRolling(false);
        //     },
        // });
        animateDiceFlight(sceneRef.current, diceInstanceRef.current.root, {
            startPosition: new Vector3(0, 0.0, 0),
            endPosition: new Vector3(0, 0, 0),
            jumpHeight: 1.9,
            durationInFrames: 200,
            rotations: 8,
            result: value,
                onFinish: () => {
                setIsRolling(false);
        }});
    }, [lastResult]);

    const handleRollClick = () => {
        if (isRolling || !diceInstanceRef.current || !sceneRef.current) return;

        setIsRolling(true);
        const fallbackValue = mockRollDice(6);
        animateDiceFlight(sceneRef.current, diceInstanceRef.current.root, {
            startPosition: new Vector3(0, 0.0, 0),
            endPosition: new Vector3(0, 0, 0),
            jumpHeight: 1.9,
            durationInFrames: 200,
            rotations: 8,
            result: fallbackValue,
            onFinish: () => {
                setIsRolling(false);
                socket.emit("has_rolled");
            },
        });
    };

    return (
        <div className="relative overflow-visible w-full max-w-100 h-full max-h-80 md:max-h-150 md:max-w-50">
            <canvas 
                onClick={onClick} 
                ref={canvasRef} 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] md:w-[120%] md:h-[110%] block outline-none select-none" 
                aria-label="3D dice scene" 
            />
        </div>
        // <div className={styles.diceScene}>
        //     <canvas onClick={onClick} ref={canvasRef} className={styles.diceScene__canvas} aria-label="3D dice scene" />
        // </div>
    );
}