/**
 * Ejemplos de uso de la API modular para crear dados personalizados.
 * 
 * Esta es una referencia de cómo usar `createDiceInstance` para crear dados
 * con diferentes configuraciones.
 */

import { Scene, Color3, Vector3 } from "@babylonjs/core";
import { createDiceInstance } from "../bodyDice/diceFactory";
import { DICE_PRESETS, DICE_LEGENDARY_PRESETS } from "../modelDice/diceConfig";

/**
 * Ejemplo 1: Crear un dado con colores personalizados
 * (Solo necesitas pasar los valores que quieres cambiar)
 */
export const createCustomColoredDice = (scene: Scene) => {
    const customDice = createDiceInstance(scene, {
        bodyColor: new Color3(0.2, 0.5, 0.9), // Azul personalizado
        pipColor: new Color3(0.9, 0.9, 0.2), // Puntos amarillos
    });
    return customDice;
};

/**
 * Ejemplo 2: Crear un dado rojo desplazado a la izquierda
 */
export const createRedDiceLeft = (scene: Scene) => {
    const redDice = createDiceInstance(scene, {
        bodyColor: new Color3(0.8, 0.1, 0.1),
        position: new Vector3(-5, 0, 0),
    });
    return redDice;
};

/**
 * Ejemplo 3: Crear un dado azul desplazado a la derecha
 */
export const createBlueDiceRight = (scene: Scene) => {
    const blueDice = createDiceInstance(scene, {
        bodyColor: new Color3(0.1, 0.3, 0.8),
        position: new Vector3(5, 0, 0),
    });
    return blueDice;
};

/**
 * Ejemplo 4: Crear un dado más pequeño
 */
export const createSmallDice = (scene: Scene) => {
    const smallDice = createDiceInstance(scene, {
        size: 1, // Mitad del tamaño por defecto (2)
        pipRadius: 0.065, // Ajustar tamaño de los puntos
        position: new Vector3(0, -3, 0),
    });
    return smallDice;
};

/**
 * Ejemplo 5: Usar presets predefinidos
 */
export const createPresetDice = (scene: Scene, presetName: "redDice" | "blueDice" | "greenDice" | "goldDice" | "blackDice") => {
    const preset = DICE_PRESETS[presetName];
    const dice = createDiceInstance(scene, preset);
    return dice;
};

/**
 * Ejemplo 6: Crear múltiples dados en fila con diferentes colores
 */
export const createDiceRow = (scene: Scene, count: number = 3) => {
    const diceInstances = [];
    const spacing = 6;
    const colors = [
        { body: new Color3(0.8, 0.1, 0.1), pip: new Color3(1, 1, 1) },      // Rojo
        { body: new Color3(0.1, 0.3, 0.8), pip: new Color3(1, 1, 1) },      // Azul
        { body: new Color3(0.1, 0.7, 0.3), pip: new Color3(1, 1, 1) },      // Verde
    ];

    for (let i = 0; i < count; i++) {
        const colorConfig = colors[i % colors.length];
        const dice = createDiceInstance(scene, {
            bodyColor: colorConfig.body,
            pipColor: colorConfig.pip,
            position: new Vector3((i - count / 2) * spacing, 0, 0),
        });
        diceInstances.push(dice);
    }

    return diceInstances;
};

/**
 * Ejemplo 7: Crear un dado legendario por nombre temático
 */
export const createLegendaryDice = (
    scene: Scene,
    theme: keyof typeof DICE_LEGENDARY_PRESETS,
    position?: Vector3
) => {
    const preset = DICE_LEGENDARY_PRESETS[theme];
    return createDiceInstance(scene, { ...preset, position });
};

