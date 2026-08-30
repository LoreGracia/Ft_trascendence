import { Color3, Vector3 } from "@babylonjs/core";

/**
 * Un icono que sustituye los pips de una cara entera: imagen de archivo
 * (con transparencia) o un emoji renderizado en una textura generada.
 */
export type FaceIcon =
    | { type: "image"; src: string }
    | { type: "emoji"; char: string };

/**
 * Configuración personalizable para un dado 3D.
 * Todos los valores tienen defaults sensatos.
 */
export interface DiceConfig {
    // Geometría
    size?: number;
    pipRadius?: number;
    faceOffset?: number;
    pipOffset?: number;
    pipStyle?: "disc" | "ball";
    cornerRadius?: number;
    cornerSegments?: number;

    // Apariencia
    bodyColor?: Color3;
    bodyTexture?: string;
    pipColor?: Color3;
    firstPipColor?: Color3;
    facePipColors?: Color3[]; // índice 0 = cara 1 ... índice 5 = cara 6
    faceIcons?: Partial<Record<number, FaceIcon>>; // clave = número de cara (1-6)
    faceIconSize?: number; // tamaño del plano del icono, relativo a "size" (0..1)
    emissiveColor?: Color3;

    // Posición y orientación inicial
    position?: Vector3;
    rotation?: Vector3;

    // Visibilidad
    visible?: boolean;
}

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
export const DICE_PRESETS = {
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
export const DICE_LEGENDARY_PRESETS = {
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
        cornerRadius: 0.42, // cuerpo blando: muy redondeado, por debajo del
        // límite seguro para pipOffset (0.52) que ya
        // vimos que evita que los pips asomen
        facePipColors: [
            new Color3(0.9, 0.15, 0.15),  // cara 1 — rojo
            new Color3(0.95, 0.55, 0.1),  // cara 2 — naranja
            new Color3(0.95, 0.85, 0.15), // cara 3 — amarillo
            new Color3(0.15, 0.75, 0.3),  // cara 4 — verde
            new Color3(0.15, 0.4, 0.9),   // cara 5 — azul
            new Color3(0.55, 0.15, 0.75), // cara 6 — violeta
        ],
    },

    magician: {
        ...DEFAULT_DICE_CONFIG,
        bodyColor: new Color3(0.28, 0.05, 0.42),
        pipColor: new Color3(0.85, 0.68, 0.15),
        emissiveColor: new Color3(0.18, 0.02, 0.28),
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

/**
 * Merge de configuración: aplica valores customizados sobre los defaults.
 */
export const mergeDiceConfig = (
    custom?: Partial<DiceConfig>
): Required<DiceConfig> => {
    if (!custom) return DEFAULT_DICE_CONFIG;

    return {
        size: custom.size ?? DEFAULT_DICE_CONFIG.size,
        pipRadius: custom.pipRadius ?? DEFAULT_DICE_CONFIG.pipRadius,
        faceOffset: custom.faceOffset ?? DEFAULT_DICE_CONFIG.faceOffset,
        pipOffset: custom.pipOffset ?? DEFAULT_DICE_CONFIG.pipOffset,
        pipStyle: custom.pipStyle ?? DEFAULT_DICE_CONFIG.pipStyle,

        cornerRadius:
            custom.cornerRadius ?? DEFAULT_DICE_CONFIG.cornerRadius,

        cornerSegments:
            custom.cornerSegments ?? DEFAULT_DICE_CONFIG.cornerSegments,

        bodyColor:
            custom.bodyColor ?? DEFAULT_DICE_CONFIG.bodyColor,

        bodyTexture:
            custom.bodyTexture ?? DEFAULT_DICE_CONFIG.bodyTexture,

        pipColor:
            custom.pipColor ?? DEFAULT_DICE_CONFIG.pipColor,

        firstPipColor:
            custom.firstPipColor ?? DEFAULT_DICE_CONFIG.firstPipColor,

        facePipColors:
            custom.facePipColors ?? DEFAULT_DICE_CONFIG.facePipColors,

        faceIcons:
            custom.faceIcons ?? DEFAULT_DICE_CONFIG.faceIcons,

        faceIconSize:
            custom.faceIconSize ?? DEFAULT_DICE_CONFIG.faceIconSize,

        emissiveColor:
            custom.emissiveColor ?? DEFAULT_DICE_CONFIG.emissiveColor,

        position:
            custom.position ?? DEFAULT_DICE_CONFIG.position,

        rotation:
            custom.rotation ?? DEFAULT_DICE_CONFIG.rotation,

        visible:
            custom.visible ?? DEFAULT_DICE_CONFIG.visible,
    };
};