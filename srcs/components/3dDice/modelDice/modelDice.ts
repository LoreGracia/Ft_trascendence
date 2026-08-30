import { Color3, Vector3 } from "@babylonjs/core";
import type { DiceConfig } from "./diceConfig";

/**
 * Valores por defecto para la configuración del dado index.
 */
export const INDEX_DICE_CONFIG: Required<DiceConfig> = {
    size: 2,
    pipRadius: 0.13,
    faceOffset: 1.02,
    pipOffset: 0.52,
    pipStyle: "disc",
    cornerRadius: 0.30,
    cornerSegments: 12,

    bodyColor: new Color3(0.95, 0.95, 0.92),
    bodyTexture: undefined,

    pipColor: new Color3(0.08, 0.08, 0.08),
    firstPipColor: new Color3(0.8, 0.08, 0.08),
    facePipColors: undefined,
    faceIcons: undefined,
    faceIconSize: 0.8,
    emissiveColor: new Color3(0, 0, 0),

    position: Vector3.Zero(),
    rotation: Vector3.Zero(),
    visible: true,
};

/**
 * Valores por defecto para la configuración del dado.
 */
export const DEFAULT_DICE_CONFIG: Required<DiceConfig> = {
    size: 2,
    pipRadius: 0.13,
    faceOffset: 1.02,
    pipOffset: 0.52,
    pipStyle: "disc",
    cornerRadius: 0.30,
    cornerSegments: 12,

    bodyColor: new Color3(0.95, 0.95, 0.92),
    bodyTexture: undefined,
    bodyAlpha: 1.0,
    pipAlpha: 1.0,
    pipColor: new Color3(0.08, 0.08, 0.08),
    firstPipColor: undefined,
    facePipColors: undefined,
    faceIcons: undefined,
    faceIconSize: 0.8,
    emissiveColor: new Color3(0, 0, 0),

    position: Vector3.Zero(),
    rotation: Vector3.Zero(),
    visible: true,
};

/**
 * Presets para dados personalizados comunes.
 */
export const DICE_PRESETS: Record<string, DiceConfig> = {
    default: {
        ...DEFAULT_DICE_CONFIG,
        faceIcons: {
            1: { type: "emoji", char: "🃏" },
        },
    },

    redDice: {
        ...DEFAULT_DICE_CONFIG,
        bodyColor: new Color3(0.8, 0.1, 0.1),
    },

    blueDice: {
        ...DEFAULT_DICE_CONFIG,
        bodyColor: new Color3(0.1, 0.3, 0.8),
    },

    greenDice: {
        ...DEFAULT_DICE_CONFIG,
        bodyColor: new Color3(0.1, 0.7, 0.3),
    },

    goldDice: {
        ...DEFAULT_DICE_CONFIG,
        bodyColor: new Color3(0.9, 0.8, 0.2),
        pipColor: new Color3(0.2, 0.15, 0.05),
    },

    blackDice: {
        ...DEFAULT_DICE_CONFIG,
        bodyColor: new Color3(0.15, 0.15, 0.15),
        pipColor: new Color3(0.95, 0.95, 0.92),
    },
};

/**
 * Dados "legendarios": skins curados con temática propia.
 */
export const DICE_LEGENDARY_PRESETS: Record<string, DiceConfig> = {
    universe: {
        ...DEFAULT_DICE_CONFIG,

        pipStyle: "ball",

        bodyTexture: "/textures/universe.jpg",

        pipColor: new Color3(0.85, 0.87, 0.95),
        emissiveColor: new Color3(0, 0, 0),
        cornerRadius: 0.18,
    },

    pride: {
        ...DEFAULT_DICE_CONFIG,
        pipStyle: "ball",
        bodyColor: new Color3(0.92, 0.92, 0.92),
        emissiveColor: new Color3(0, 0, 0),
        facePipColors: [
            new Color3(0.9, 0.15, 0.15),  // cara 1 — rojo
            new Color3(0.95, 0.55, 0.1),  // cara 2 — naranja
            new Color3(0.95, 0.85, 0.15), // cara 3 — amarillo
            new Color3(0.15, 0.75, 0.3),  // cara 4 — verde
            new Color3(0.15, 0.4, 0.9),   // cara 5 — azul
            new Color3(0.55, 0.15, 0.75), // cara 6 — violeta
        ],
    },

    // magician: {
    //     ...DEFAULT_DICE_CONFIG,

    //     bodyColor: new Color3(0.025, 0.002, 0.08),
    //     bodyAlpha: 0.88,

    //     pipColor: new Color3(0.95, 1.0, 0.0),
    //     pipAlpha: 1.0,

    //     emissiveColor: new Color3(0.85, 0.01, 1.0),

    //     cornerRadius: 0.16,
    // },

    magician: {
        ...DEFAULT_DICE_CONFIG,

        // Cuerpo: violeta muy oscuro
        bodyColor: new Color3(157, 0, 255),
        bodyAlpha: 0.88,

        // Pips: amarillo limón fluorescente
        pipColor: new Color3(0.85, 1.0, 0.02),
        pipAlpha: 1.0,

        // Luz interior: violeta intenso
        emissiveColor: new Color3(0.75, 0.01, 1.0),

        cornerRadius: 0.16,
    },

    warrior: {
        ...DEFAULT_DICE_CONFIG,
        bodyColor: new Color3(0.35, 0.04, 0.04),
        pipColor: new Color3(0.78, 0.74, 0.62),
        emissiveColor: new Color3(0, 0, 0),
        cornerRadius: 0.04,
    },

    code: {
        ...DEFAULT_DICE_CONFIG,
        bodyColor: new Color3(0.03, 0.03, 0.03),
        pipColor: new Color3(0.1, 0.95, 0.35),
        emissiveColor: new Color3(0.02, 0.18, 0.06),
        cornerRadius: 0.1,
    },
};