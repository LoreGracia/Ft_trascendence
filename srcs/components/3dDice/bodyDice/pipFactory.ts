import {
    Color3,
    Mesh,
    MeshBuilder,
    Scene,
    StandardMaterial,
    TransformNode,
} from "@babylonjs/core";
import { DiceConfig } from "../modelDice/diceConfig";

export interface PipsResult {
    pipMeshes: Mesh[];
    overridePipMaterials: StandardMaterial[];
}

/**
 * Crea un único pip (disco o esfera, según config.pipStyle), posicionado
 * y orientado sobre la cara correspondiente del dado.
 *
 * Punto único donde añadir nuevos estilos de pip: solo hace falta un
 * nuevo caso en el if/else de geometría, sin tocar diceFactory.ts.
 */
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

        const ballOffset = config.pipRadius * 0.25;
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

/**
 * Genera los 21 pips de un dado d6 estándar (una posición por cara),
 * respetando el pipStyle y el color especial del primer pip. Devuelve
 * tanto las mallas como los materiales "override" creados para pips
 * con color propio, para que el caller pueda hacer dispose() de todo.
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
    let pipIndex = 0;

    const addPip = (x: number, y: number, z: number, pipColorOverride?: Color3) => {
        const pipMaterialToUse = pipColorOverride
            ? (() => {
                const specialMaterial = new StandardMaterial(
                    `${instanceName}_pipMaterial_${pipIndex}`,
                    scene
                );
                specialMaterial.diffuseColor = pipColorOverride;
                specialMaterial.backFaceCulling = false;
                overridePipMaterials.push(specialMaterial);
                return specialMaterial;
            })()
            : pipMaterial;

        const pip = createPip(scene, root, pipMaterialToUse, config, instanceName, pipIndex++, x, y, z);
        pipMeshes.push(pip);
    };

    const { faceOffset, pipOffset, firstPipColor } = config;

    // FACE 1
    addPip(0, 0, faceOffset, firstPipColor);

    // FACE 6
    addPip(-pipOffset, pipOffset, -faceOffset);
    addPip(pipOffset, pipOffset, -faceOffset);
    addPip(-pipOffset, 0, -faceOffset);
    addPip(pipOffset, 0, -faceOffset);
    addPip(-pipOffset, -pipOffset, -faceOffset);
    addPip(pipOffset, -pipOffset, -faceOffset);

    // FACE 2
    addPip(faceOffset, pipOffset, -pipOffset);
    addPip(faceOffset, -pipOffset, pipOffset);

    // FACE 5
    addPip(-faceOffset, pipOffset, -pipOffset);
    addPip(-faceOffset, pipOffset, pipOffset);
    addPip(-faceOffset, 0, 0);
    addPip(-faceOffset, -pipOffset, -pipOffset);
    addPip(-faceOffset, -pipOffset, pipOffset);

    // FACE 3
    addPip(-pipOffset, faceOffset, -pipOffset);
    addPip(0, faceOffset, 0);
    addPip(pipOffset, faceOffset, pipOffset);

    // FACE 4
    addPip(-pipOffset, -faceOffset, -pipOffset);
    addPip(pipOffset, -faceOffset, -pipOffset);
    addPip(-pipOffset, -faceOffset, pipOffset);
    addPip(pipOffset, -faceOffset, pipOffset);

    return { pipMeshes, overridePipMaterials };
};