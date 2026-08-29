"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
    Engine,
    Scene,
    ArcRotateCamera,
    HemisphericLight,
    Vector3,
    Color4,
} from "@babylonjs/core";
import { createDiceInstance } from "@/components/3dDice/bodyDice/diceFactory";
import { DICE_PRESETS, DICE_LEGENDARY_PRESETS } from "@/components/3dDice/modelDice/diceConfig";
import styles from "./DiceScene.module.css";

const PRESET_OPTIONS = [
    { value: "default", label: "Default", group: "Básicos" },
    { value: "redDice", label: "Rojo", group: "Básicos" },
    { value: "blueDice", label: "Azul", group: "Básicos" },
    { value: "greenDice", label: "Verde", group: "Básicos" },
    { value: "goldDice", label: "Dorado", group: "Básicos" },
    { value: "blackDice", label: "Negro", group: "Básicos" },
    { value: "legendary:universe", label: "Universe", group: "Legendarios" },
    { value: "legendary:nature", label: "Nature", group: "Legendarios" },
    { value: "legendary:magician", label: "Magician", group: "Legendarios" },
    { value: "legendary:warrior", label: "Warrior", group: "Legendarios" },
    { value: "legendary:code", label: "Code", group: "Legendarios" },
];

const getDicePreset = (value: string) => {
    if (value.startsWith("legendary:")) {
        const presetKey = value.replace("legendary:", "") as keyof typeof DICE_LEGENDARY_PRESETS;
        return DICE_LEGENDARY_PRESETS[presetKey] ?? DICE_PRESETS.default;
    }

    return DICE_PRESETS[value as keyof typeof DICE_PRESETS] ?? DICE_PRESETS.default;
};

export default function SelectDice() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const engineRef = useRef<Engine | null>(null);
    const sceneRef = useRef<Scene | null>(null);
    const diceInstanceRef = useRef<ReturnType<typeof createDiceInstance> | null>(null);
    const [selectedPreset, setSelectedPreset] = useState("");
    const [selectKey, setSelectKey] = useState(0);

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

    const handlePresetChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedPreset(event.target.value);
        // Remonta el <select> para que vuelva a mostrar el placeholder
        // en vez de quedarse con la opción elegida.
        setSelectKey((prevKey) => prevKey + 1);
    };

    const selectedOption = PRESET_OPTIONS.find((option) => option.value === selectedPreset);

    return (
        <div className={styles.diceScene}>
            <div className={styles.diceScene__controls}>
                <select
                    key={selectKey}
                    className={styles.diceScene__select}
                    defaultValue=""
                    onChange={handlePresetChange}
                    aria-label="Select dice style"
                >
                    <option value="" disabled hidden>
                        Selecciona tu dado
                    </option>
                    <optgroup label="Básicos">
                        {PRESET_OPTIONS.filter((option) => option.group === "Básicos").map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </optgroup>
                    <optgroup label="Legendarios">
                        {PRESET_OPTIONS.filter((option) => option.group === "Legendarios").map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </optgroup>
                </select>
            </div>
            <canvas ref={canvasRef} className={styles.diceScene__canvas} aria-label="3D dice scene" />
            {selectedOption && (
                <div className={styles.diceScene__status} style={{ textAlign: "center" }}>
                    {selectedOption.label}
                </div>
            )}
        </div>
    );
}