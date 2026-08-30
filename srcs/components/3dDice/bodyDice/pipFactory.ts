import {
    Color3,
    Mesh,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Texture,
    TransformNode,
} from "@babylonjs/core";
import { DiceConfig } from "../modelDice/diceConfig";
import { createFaceIcon } from "./faceIconFactory";

export interface PipsResult {
    pipMeshes: Mesh[];
    overridePipMaterials: StandardMaterial[];
    pipTextures: Texture[];
}

const createPip = (
    scene: Scene,
    root: TransformNode,
    pipMaterial: StandardMaterial,
    config: Required<DiceConfig>,
    instanceName: string,
    pipIndex: number,
    x: number,
    y: number,
    z: number
): Mesh => {
    let pip: Mesh;

    const isZFace = Math.abs(Math.abs(z) - config.faceOffset) < 0.001;
    const isXFace = Math.abs(Math.abs(x) - config.faceOffset) < 0.001;
    const isYFace = Math.abs(Math.abs(y) - config.faceOffset) < 0.001;

    if (config.pipStyle === "ball") {
        pip = MeshBuilder.CreateSphere(
            `${instanceName}_pip_${pipIndex}`,
            { diameter: config.pipRadius * 2, segments: 16 },
            scene
        );

        const ballOffset = config.pipRadius * 0.05;
        if (isZFace) {
            z += z > 0 ? ballOffset : -ballOffset;
        } else if (isXFace) {
            x += x > 0 ? ballOffset : -ballOffset;
        } else if (isYFace) {
            y += y > 0 ? ballOffset : -ballOffset;
        }
    } else {
        pip = MeshBuilder.CreateDisc(
            `${instanceName}_pip_${pipIndex}`,
            { radius: config.pipRadius, tessellation: 32, sideOrientation: Mesh.DOUBLESIDE },
            scene
        );
    }

    pip.position.set(x, y, z);
    pip.material = pipMaterial;

    if (isZFace) {
        pip.rotation.y = z > 0 ? 0 : Math.PI;
    } else if (isXFace) {
        pip.rotation.y = x > 0 ? Math.PI / 2 : -Math.PI / 2;
    } else if (isYFace) {
        pip.rotation.x = y > 0 ? -Math.PI / 2 : Math.PI / 2;
    }

    pip.parent = root;
    return pip;
};

type AddPipFn = (x: number, y: number, z: number, colorOverride?: Color3) => void;
type FacePipBuilder = (addPip: AddPipFn, faceOffset: number, pipOffset: number, color?: Color3) => void;

// Cada función construye el patrón de pips de UNA cara (1-6). Separarlas
// permite que el orquestador (createDicePips) sustituya cualquiera de
// ellas por un icono/emoji sin tocar las demás.
const FACE_PIP_BUILDERS: Record<number, FacePipBuilder> = {
    1: (addPip, faceOffset, _pipOffset, color) => {
        addPip(0, 0, faceOffset, color);
    },
    6: (addPip, faceOffset, pipOffset, color) => {
        addPip(-pipOffset, pipOffset, -faceOffset, color);
        addPip(pipOffset, pipOffset, -faceOffset, color);
        addPip(-pipOffset, 0, -faceOffset, color);
        addPip(pipOffset, 0, -faceOffset, color);
        addPip(-pipOffset, -pipOffset, -faceOffset, color);
        addPip(pipOffset, -pipOffset, -faceOffset, color);
    },
    2: (addPip, faceOffset, pipOffset, color) => {
        addPip(faceOffset, pipOffset, -pipOffset, color);
        addPip(faceOffset, -pipOffset, pipOffset, color);
    },
    5: (addPip, faceOffset, pipOffset, color) => {
        addPip(-faceOffset, pipOffset, -pipOffset, color);
        addPip(-faceOffset, pipOffset, pipOffset, color);
        addPip(-faceOffset, 0, 0, color);
        addPip(-faceOffset, -pipOffset, -pipOffset, color);
        addPip(-faceOffset, -pipOffset, pipOffset, color);
    },
    3: (addPip, faceOffset, pipOffset, color) => {
        addPip(-pipOffset, faceOffset, -pipOffset, color);
        addPip(0, faceOffset, 0, color);
        addPip(pipOffset, faceOffset, pipOffset, color);
    },
    4: (addPip, faceOffset, pipOffset, color) => {
        addPip(-pipOffset, -faceOffset, -pipOffset, color);
        addPip(pipOffset, -faceOffset, -pipOffset, color);
        addPip(-pipOffset, -faceOffset, pipOffset, color);
        addPip(pipOffset, -faceOffset, pipOffset, color);
    },
};

const FACE_ORDER = [1, 6, 2, 5, 3, 4]; // mismo orden que tenía el archivo original

/**
 * Genera las 6 caras de un dado d6: para cada una, o bien los pips
 * estándar (respetando pipStyle y color por cara vía facePipColors), o
 * bien, si config.faceIcons trae una entrada para esa cara, un único
 * plano con imagen/emoji que sustituye a los pips de esa cara entera.
 */
export const createDicePips = (
    scene: Scene,
    root: TransformNode,
    pipMaterial: StandardMaterial,
    config: Required<DiceConfig>,
    instanceName: string
): PipsResult => {
    const pipMeshes: Mesh[] = [];
    const overridePipMaterials: StandardMaterial[] = [];
    const pipTextures: Texture[] = [];
    let pipIndex = 0;

    const addPip: AddPipFn = (x, y, z, colorOverride) => {
        const pipMaterialToUse = colorOverride
            ? (() => {
                const specialMaterial = new StandardMaterial(
                    `${instanceName}_pipMaterial_${pipIndex}`,
                    scene
                );
                specialMaterial.diffuseColor = colorOverride;
                specialMaterial.backFaceCulling = false;
                overridePipMaterials.push(specialMaterial);
                return specialMaterial;
            })()
            : pipMaterial;

        const pip = createPip(scene, root, pipMaterialToUse, config, instanceName, pipIndex++, x, y, z);
        pipMeshes.push(pip);
    };

    const { faceOffset, pipOffset, firstPipColor, facePipColors, faceIcons } = config;

    const faceColor = (faceValue: number, fallback?: Color3) =>
        facePipColors?.[faceValue - 1] ?? fallback;

    for (const faceNumber of FACE_ORDER) {
        const icon = faceIcons?.[faceNumber];

        if (icon) {
            const { mesh, material, texture } = createFaceIcon(
                scene,
                root,
                config,
                instanceName,
                faceNumber,
                icon
            );
            pipMeshes.push(mesh);
            overridePipMaterials.push(material);
            pipTextures.push(texture as Texture);
            continue;
        }

        const fallbackColor = faceNumber === 1 ? firstPipColor : undefined;
        FACE_PIP_BUILDERS[faceNumber](addPip, faceOffset, pipOffset, faceColor(faceNumber, fallbackColor));
    }

    return { pipMeshes, overridePipMaterials, pipTextures };
};