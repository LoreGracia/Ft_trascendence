import { Color3, Vector3 } from "@babylonjs/core";
import { DEFAULT_DICE_CONFIG } from "./modelDice";

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
    pipStyle?: "disc" | "ball" | "triangle";
    cornerRadius?: number;
    cornerSegments?: number;

    // Apariencia
    bodyColor?: Color3;
    bodyTexture?: string;
    bodyAlpha?: number;
    pipAlpha?: number;
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
        bodyAlpha:
            custom.bodyAlpha ?? DEFAULT_DICE_CONFIG.bodyAlpha,
        pipAlpha:
            custom.pipAlpha ?? DEFAULT_DICE_CONFIG.pipAlpha,
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