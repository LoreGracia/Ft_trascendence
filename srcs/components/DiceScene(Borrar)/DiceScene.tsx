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
import { rollDice } from "@/dice/diceRoll";
import { animateDiceFlight } from "@/dice/diceAnimation";
import { createDiceInstance } from "@/dice/diceFactory";
import { DICE_PRESETS, DICE_LEGENDARY_PRESETS } from "@/dice/diceConfig";
import styles from "./DiceScene(Borrar).module.css";

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

export default function DiceScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const diceInstanceRef = useRef<ReturnType<typeof createDiceInstance> | null>(null);
  const [selectedPreset, setSelectedPreset] = useState("default");
  const [resultText, setResultText] = useState("Resultado: -");
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 0); // rojo
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
    camera.attachControl(canvas, true);

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
    const nextValue = event.target.value;
    setSelectedPreset(nextValue);
    setResultText("Resultado: -");
  };

  const handleRollClick = () => {
    if (isRolling || !diceInstanceRef.current || !sceneRef.current) return;

    const nextRoll = rollDice(6);
    setIsRolling(true);
    setResultText("Resultado: tirando...");

    animateDiceFlight(sceneRef.current, diceInstanceRef.current.root, {
      result: nextRoll,
      onFinish: () => {
        setResultText(`Resultado: ${nextRoll}`);
        setIsRolling(false);
      },
    });
  };

  return (
    <div className={styles.diceScene}>
      <div className={styles.diceScene__status}>{resultText}</div>
      <div className={styles.diceScene__controls}>
        <select
          className={styles.diceScene__select}
          value={selectedPreset}
          onChange={handlePresetChange}
          aria-label="Select dice style"
        >
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
    </div>
  );
}