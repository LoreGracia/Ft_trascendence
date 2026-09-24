import {
    DynamicTexture,
    Mesh,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Texture,
    TransformNode,
    Vector3,
} from "@babylonjs/core";
import { DiceConfig, FaceIcon } from "../modelDice/diceConfig";

export interface FaceIconResult {
    mesh: Mesh;
    material: StandardMaterial;
    texture: Texture | DynamicTexture;
}

interface FaceTransform {
    position: Vector3;
    rotationY?: number;
    rotationX?: number;
}

// Misma convención de orientación que ya usan los pips en pipFactory.ts:
// cara 1 = +Z, cara 6 = -Z, cara 2 = +X, cara 5 = -X, cara 3 = +Y, cara 4 = -Y.
const buildFaceTransform = (faceNumber: number, faceOffset: number): FaceTransform => {
    switch (faceNumber) {
        case 1: return { position: new Vector3(0, 0, faceOffset), rotationY: 0 };
        case 6: return { position: new Vector3(0, 0, -faceOffset), rotationY: Math.PI };
        case 2: return { position: new Vector3(faceOffset, 0, 0), rotationY: Math.PI / 2 };
        case 5: return { position: new Vector3(-faceOffset, 0, 0), rotationY: -Math.PI / 2 };
        case 3: return { position: new Vector3(0, faceOffset, 0), rotationX: -Math.PI / 2 };
        case 4: return { position: new Vector3(0, -faceOffset, 0), rotationX: Math.PI / 2 };
        default:
            throw new Error(`Cara de dado inválida: ${faceNumber} (debe ser 1-6)`);
    }
};

const createEmojiTexture = (scene: Scene, name: string, char: string): DynamicTexture => {
    const textureSize = 256;
    const texture = new DynamicTexture(name, textureSize, scene, true);
    texture.hasAlpha = true;

    const ctx = texture.getContext() as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, textureSize, textureSize);
    ctx.font = `${textureSize * 0.7}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(char, textureSize / 2, textureSize / 2 + textureSize * 0.05);

    texture.update();
    return texture;
};

/**
 * Sustituye los pips de una cara por una única imagen o emoji, centrado
 * en esa cara. Usa la misma orientación por cara que los pips, así que
 * ocupa exactamente el mismo hueco visual.
 */
export const createFaceIcon = (
    scene: Scene,
    root: TransformNode,
    config: Required<DiceConfig>,
    instanceName: string,
    faceNumber: number,
    icon: FaceIcon
): FaceIconResult => {
    const { faceOffset, size, faceIconSize } = config;
    const transform = buildFaceTransform(faceNumber, faceOffset);

    const planeSize = size * faceIconSize;
    const mesh = MeshBuilder.CreatePlane(
        `${instanceName}_faceIcon_${faceNumber}`,
        { size: planeSize, sideOrientation: Mesh.DOUBLESIDE },
        scene
    );

    mesh.position.copyFrom(transform.position);
    if (transform.rotationY !== undefined) mesh.rotation.y = transform.rotationY;
    if (transform.rotationX !== undefined) mesh.rotation.x = transform.rotationX;
    mesh.parent = root;

    const material = new StandardMaterial(
        `${instanceName}_faceIconMaterial_${faceNumber}`,
        scene
    );
    material.backFaceCulling = false;

    const texture: Texture | DynamicTexture =
        icon.type === "image"
            ? (() => {
                const imageTexture = new Texture(icon.src, scene, true, false, Texture.TRILINEAR_SAMPLINGMODE);
                imageTexture.hasAlpha = true;
                return imageTexture;
            })()
            : createEmojiTexture(scene, `${instanceName}_faceIconTexture_${faceNumber}`, icon.char);

    material.diffuseTexture = texture;
    material.useAlphaFromDiffuseTexture = true;
    mesh.material = material;

    return { mesh, material, texture };
};