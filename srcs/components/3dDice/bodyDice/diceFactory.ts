import {
    Color3,
    Mesh,
    MeshBuilder,
    Scene,
    StandardMaterial,
    TransformNode,
} from "@babylonjs/core";
import { DiceConfig, mergeDiceConfig } from "../modelDice/diceConfig";
import { createRoundedBox } from "./roundedBox";

export interface DiceInstance {
    root: TransformNode;
    bodyMesh: Mesh;
    bodyMaterial: StandardMaterial;
    pipMaterial: StandardMaterial;
    config: Required<DiceConfig>;
    updateConfig: (next: Partial<DiceConfig>) => void;
    dispose: () => void;
}

let diceInstanceCounter = 0;

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
) => {
    let pip: Mesh;

    // ----------------------------------------
    // Detectamos la cara ORIGINAL
    // ----------------------------------------

    const isZFace =
        Math.abs(Math.abs(z) - config.faceOffset) < 0.001;

    const isXFace =
        Math.abs(Math.abs(x) - config.faceOffset) < 0.001;

    const isYFace =
        Math.abs(Math.abs(y) - config.faceOffset) < 0.001;

    // ----------------------------------------
    // PIP BALL
    // ----------------------------------------

    if (config.pipStyle === "ball") {
        pip = MeshBuilder.CreateSphere(
            `${instanceName}_pip_${pipIndex}`,
            {
                diameter: config.pipRadius * 2,
                segments: 16,
            },
            scene
        );

        // Controla cuánto sobresale la esfera.
        // De momento dejamos 0.25 para probar.
        const ballOffset = config.pipRadius * 0.25;

        if (isZFace) {
            z += z > 0 ? ballOffset : -ballOffset;
        } else if (isXFace) {
            x += x > 0 ? ballOffset : -ballOffset;
        } else if (isYFace) {
            y += y > 0 ? ballOffset : -ballOffset;
        }
    }

    // ----------------------------------------
    // PIP DISC
    // ----------------------------------------

    else {
        pip = MeshBuilder.CreateDisc(
            `${instanceName}_pip_${pipIndex}`,
            {
                radius: config.pipRadius,
                tessellation: 32,
                sideOrientation: Mesh.DOUBLESIDE,
            },
            scene
        );
    }

    // ----------------------------------------
    // POSITION
    // ----------------------------------------

    pip.position.set(x, y, z);

    pip.material = pipMaterial;

    // ----------------------------------------
    // ORIENTATION
    // ----------------------------------------

    if (isZFace) {
        pip.rotation.y = z > 0 ? 0 : Math.PI;
    } else if (isXFace) {
        pip.rotation.y =
            x > 0
                ? Math.PI / 2
                : -Math.PI / 2;
    } else if (isYFace) {
        pip.rotation.x =
            y > 0
                ? -Math.PI / 2
                : Math.PI / 2;
    }

    // ----------------------------------------
    // PARENT
    // ----------------------------------------

    pip.parent = root;

    return pip;
};

export const createDiceInstance = (
    scene: Scene,
    config?: Partial<DiceConfig>
): DiceInstance => {
    const instanceName = `dice_${++diceInstanceCounter}`;

    const root = new TransformNode(
        `${instanceName}_root`,
        scene
    );

    const bodyMaterial = new StandardMaterial(
        `${instanceName}_bodyMaterial`,
        scene
    );

    const pipMaterial = new StandardMaterial(
        `${instanceName}_pipMaterial`,
        scene
    );

    pipMaterial.backFaceCulling = false;

    let bodyMesh: Mesh | null = null;
    let pipMeshes: Mesh[] = [];
    let overridePipMaterials: StandardMaterial[] = [];

    let userConfig: Partial<DiceConfig> = {
        ...config,
    };

    let resolvedConfig = mergeDiceConfig(userConfig);

    // ----------------------------------------
    // MATERIALS
    // ----------------------------------------

    const syncMaterials = () => {
        bodyMaterial.diffuseColor =
            resolvedConfig.bodyColor;

        bodyMaterial.emissiveColor =
            resolvedConfig.emissiveColor;

        pipMaterial.diffuseColor =
            resolvedConfig.pipColor;
    };

    // ----------------------------------------
    // TRANSFORM
    // ----------------------------------------

    const syncTransform = () => {
        root.position.copyFrom(
            resolvedConfig.position
        );

        root.rotation.copyFrom(
            resolvedConfig.rotation
        );

        root.setEnabled(
            resolvedConfig.visible
        );
    };

    // ----------------------------------------
    // GEOMETRY
    // ----------------------------------------

    const rebuildGeometry = () => {
        // BODY

        if (bodyMesh) {
            bodyMesh.dispose();
            bodyMesh = null;
        }

        // PIPS

        pipMeshes.forEach((pipMesh) => {
            pipMesh.dispose();
        });

        pipMeshes = [];

        // SPECIAL MATERIALS

        overridePipMaterials.forEach(
            (material) => {
                material.dispose();
            }
        );

        overridePipMaterials = [];

        // ----------------------------------------
        // BODY
        // ----------------------------------------

        bodyMesh = createRoundedBox(
            `${instanceName}_body`,
            scene,
            {
                size: resolvedConfig.size,
                cornerRadius:
                    resolvedConfig.cornerRadius,
                cornerSegments:
                    resolvedConfig.cornerSegments,
            }
        );

        bodyMesh.parent = root;
        bodyMesh.material = bodyMaterial;

        // ----------------------------------------
        // PIPS
        // ----------------------------------------

        let pipIndex = 0;

        const addPip = (
            x: number,
            y: number,
            z: number,
            pipColorOverride?: Color3
        ) => {
            const pipMaterialToUse =
                pipColorOverride
                    ? (() => {
                        const specialMaterial =
                            new StandardMaterial(
                                `${instanceName}_pipMaterial_${pipIndex}`,
                                scene
                            );

                        specialMaterial.diffuseColor =
                            pipColorOverride;

                        specialMaterial.backFaceCulling =
                            false;

                        overridePipMaterials.push(
                            specialMaterial
                        );

                        return specialMaterial;
                    })()
                    : pipMaterial;

            const pip = createPip(
                scene,
                root,
                pipMaterialToUse,
                resolvedConfig,
                instanceName,
                pipIndex++,
                x,
                y,
                z
            );

            pipMeshes.push(pip);
        };

        const {
            faceOffset,
            pipOffset,
        } = resolvedConfig;

        const firstPipColor =
            resolvedConfig.firstPipColor;

        // ----------------------------------------
        // FACE 1
        // ----------------------------------------

        addPip(
            0,
            0,
            faceOffset,
            firstPipColor
        );

        // ----------------------------------------
        // FACE 6
        // ----------------------------------------

        addPip(
            -pipOffset,
            pipOffset,
            -faceOffset
        );

        addPip(
            pipOffset,
            pipOffset,
            -faceOffset
        );

        addPip(
            -pipOffset,
            0,
            -faceOffset
        );

        addPip(
            pipOffset,
            0,
            -faceOffset
        );

        addPip(
            -pipOffset,
            -pipOffset,
            -faceOffset
        );

        addPip(
            pipOffset,
            -pipOffset,
            -faceOffset
        );

        // ----------------------------------------
        // FACE 2
        // ----------------------------------------

        addPip(
            faceOffset,
            pipOffset,
            -pipOffset
        );

        addPip(
            faceOffset,
            -pipOffset,
            pipOffset
        );

        // ----------------------------------------
        // FACE 5
        // ----------------------------------------

        addPip(
            -faceOffset,
            pipOffset,
            -pipOffset
        );

        addPip(
            -faceOffset,
            pipOffset,
            pipOffset
        );

        addPip(
            -faceOffset,
            0,
            0
        );

        addPip(
            -faceOffset,
            -pipOffset,
            -pipOffset
        );

        addPip(
            -faceOffset,
            -pipOffset,
            pipOffset
        );

        // ----------------------------------------
        // FACE 3
        // ----------------------------------------

        addPip(
            -pipOffset,
            faceOffset,
            -pipOffset
        );

        addPip(
            0,
            faceOffset,
            0
        );

        addPip(
            pipOffset,
            faceOffset,
            pipOffset
        );

        // ----------------------------------------
        // FACE 4
        // ----------------------------------------

        addPip(
            -pipOffset,
            -faceOffset,
            -pipOffset
        );

        addPip(
            pipOffset,
            -faceOffset,
            -pipOffset
        );

        addPip(
            -pipOffset,
            -faceOffset,
            pipOffset
        );

        addPip(
            pipOffset,
            -faceOffset,
            pipOffset
        );
    };

    // ----------------------------------------
    // SYNC
    // ----------------------------------------

    const syncInstance = () => {
        syncMaterials();
        syncTransform();
        rebuildGeometry();
    };

    syncInstance();

    // ----------------------------------------
    // PUBLIC API
    // ----------------------------------------

    return {
        root,

        get bodyMesh() {
            return bodyMesh as Mesh;
        },

        get bodyMaterial() {
            return bodyMaterial;
        },

        get pipMaterial() {
            return pipMaterial;
        },

        get config() {
            return resolvedConfig;
        },

        updateConfig(next: Partial<DiceConfig>) {
            userConfig = {
                ...userConfig,
                ...next,
            };

            resolvedConfig =
                mergeDiceConfig(userConfig);

            syncInstance();
        },

        dispose() {
            bodyMesh?.dispose();

            pipMeshes.forEach((pipMesh) => {
                pipMesh.dispose();
            });

            overridePipMaterials.forEach(
                (material) => {
                    material.dispose();
                }
            );

            bodyMaterial.dispose();
            pipMaterial.dispose();
            root.dispose();
        },
    };
};