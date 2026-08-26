import { Color3, Vector3 } from "@babylonjs/core";

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
    cornerRadius?: number;   // 0 = aristas vivas (cubo normal)
    cornerSegments?: number; // suavidad del redondeo (más = más caro)

    // Colores
    bodyColor?: Color3;
    pipColor?: Color3;
    emissiveColor?: Color3; // luz propia del dado (0,0,0 = sin brillo)

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
    pipRadius: 0.11,
    faceOffset: 0.86,
    pipOffset: 0.38,
    cornerRadius: 0.04,
    cornerSegments: 4,
    bodyColor: new Color3(0.95, 0.95, 0.92),
    pipColor: new Color3(0.08, 0.08, 0.08),
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
    pipRadius: 0.11,
    faceOffset: 0.86,
    pipOffset: 0.38,
    cornerRadius: 0.04,
    cornerSegments: 4,
    bodyColor: new Color3(0.95, 0.95, 0.92),
    pipColor: new Color3(0.08, 0.08, 0.08),
    emissiveColor: new Color3(0, 0, 0),
    position: Vector3.Zero(),
    rotation: Vector3.Zero(),
    visible: true,
};

/**
 * Presets para dados personalizados comunes.
 */
export const DICE_PRESETS = {
    default: DEFAULT_DICE_CONFIG,
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
 * Dados "legendarios": skins curados con temática propia, con luz propia
 * (emissiveColor) para diferenciarse claramente de los presets básicos.
 */
export const DICE_LEGENDARY_PRESETS = {
    universe: {
        ...DEFAULT_DICE_CONFIG,
        bodyColor: new Color3(0.05, 0.03, 0.12),
        pipColor: new Color3(0.85, 0.87, 0.95),
        emissiveColor: new Color3(0.08, 0.04, 0.22),
        cornerRadius: 0.18,
    },
    nature: {
        ...DEFAULT_DICE_CONFIG,
        bodyColor: new Color3(0.16, 0.32, 0.14),
        pipColor: new Color3(0.86, 0.78, 0.6),
        emissiveColor: new Color3(0, 0, 0),
        cornerRadius: 0.3,
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
        cornerRadius: custom.cornerRadius ?? DEFAULT_DICE_CONFIG.cornerRadius,
        cornerSegments: custom.cornerSegments ?? DEFAULT_DICE_CONFIG.cornerSegments,
        bodyColor: custom.bodyColor ?? DEFAULT_DICE_CONFIG.bodyColor,
        pipColor: custom.pipColor ?? DEFAULT_DICE_CONFIG.pipColor,
        emissiveColor: custom.emissiveColor ?? DEFAULT_DICE_CONFIG.emissiveColor,
        position: custom.position ?? DEFAULT_DICE_CONFIG.position,
        rotation: custom.rotation ?? DEFAULT_DICE_CONFIG.rotation,
        visible: custom.visible ?? DEFAULT_DICE_CONFIG.visible,
    };
};
