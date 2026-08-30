import {
    Color3,
    Mesh,
    Scene,
    StandardMaterial,
    Texture,
    TransformNode,
} from "@babylonjs/core";

import {
    DiceConfig,
    mergeDiceConfig,
} from "../modelDice/diceConfig";

import { createRoundedBox } from "./roundedBox";
import { createSoftBox } from "./softBox";
import { createDicePips } from "./pipFactory";

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

export const createDiceInstance = (
    scene: Scene,
    config?: Partial<DiceConfig>
): DiceInstance => {

    const instanceName = `dice_${++diceInstanceCounter}`;

    const root = new TransformNode(
        `${instanceName}_root`,
        scene
    );

    // ----------------------------------------
    // MATERIALS
    // ----------------------------------------

    const bodyMaterial = new StandardMaterial(
        `${instanceName}_bodyMaterial`,
        scene
    );

    const pipMaterial = new StandardMaterial(
        `${instanceName}_pipMaterial`,
        scene
    );

    pipMaterial.backFaceCulling = false;

    let bodyTexture: Texture | null = null;

    // ----------------------------------------
    // STATE
    // ----------------------------------------

    let bodyMesh: Mesh | null = null;

    let pipMeshes: Mesh[] = [];

    let overridePipMaterials: StandardMaterial[] = [];

    let pipTextures: Texture[] = [];

    let userConfig: Partial<DiceConfig> = {
        ...config,
    };

    let resolvedConfig = mergeDiceConfig(userConfig);

    // ----------------------------------------
    // DEBUG CONFIG
    // ----------------------------------------

    console.log("🌌 CONFIG DADO", resolvedConfig);

    // ----------------------------------------
    // MATERIAL SYNC
    // ----------------------------------------

    const syncMaterials = () => {

        console.log("🎲 DICE MATERIAL", {
            bodyTexture: resolvedConfig.bodyTexture,
            bodyColor: resolvedConfig.bodyColor,
            pipStyle: resolvedConfig.pipStyle,
        });

        // ----------------------------------------
        // BODY TEXTURE
        // ----------------------------------------

        if (bodyTexture) {
            bodyTexture.dispose();
            bodyTexture = null;
        }

        if (resolvedConfig.bodyTexture) {

            console.log(
                "🌌 CARGANDO TEXTURA:",
                resolvedConfig.bodyTexture
            );

            bodyTexture = new Texture(
                resolvedConfig.bodyTexture,
                scene,
                true,
                false,
                Texture.TRILINEAR_SAMPLINGMODE,
                () => {
                    console.log(
                        "✅ TEXTURA CARGADA:",
                        resolvedConfig.bodyTexture
                    );
                },
                (message) => {
                    console.error(
                        "❌ ERROR CARGANDO TEXTURA:",
                        resolvedConfig.bodyTexture,
                        message
                    );
                }
            );

            bodyMaterial.diffuseTexture = bodyTexture;

            bodyMaterial.diffuseColor = new Color3(1, 1, 1);
            bodyMaterial.emissiveColor = new Color3(0, 0, 0);

        } else {

            console.log(
                "🎨 DADO SIN TEXTURA, USANDO COLOR:",
                resolvedConfig.bodyColor
            );

            bodyMaterial.diffuseTexture = null;
            bodyMaterial.diffuseColor = resolvedConfig.bodyColor;
            bodyMaterial.emissiveColor = resolvedConfig.emissiveColor;

            bodyMaterial.alpha = resolvedConfig.bodyAlpha;

            if (resolvedConfig.bodyAlpha < 1) {
                bodyMaterial.transparencyMode = 2;
            }
        }

        // ----------------------------------------
        // PIPS
        // ----------------------------------------

        pipMaterial.diffuseColor = resolvedConfig.pipColor;
        pipMaterial.emissiveColor = resolvedConfig.pipColor;
        pipMaterial.alpha = resolvedConfig.pipAlpha;

        if (resolvedConfig.pipAlpha < 1) {
            pipMaterial.transparencyMode = 2;
        }
    };

    // ----------------------------------------
    // TRANSFORM SYNC
    // ----------------------------------------

    const syncTransform = () => {
        root.position.copyFrom(resolvedConfig.position);
        root.rotation.copyFrom(resolvedConfig.rotation);
        root.setEnabled(resolvedConfig.visible);
    };

    // ----------------------------------------
    // GEOMETRY
    // ----------------------------------------

    const rebuildGeometry = () => {

        if (bodyMesh) {
            bodyMesh.dispose();
            bodyMesh = null;
        }

        pipMeshes.forEach((pipMesh) => pipMesh.dispose());
        pipMeshes = [];

        bodyMesh = resolvedConfig.cornerRadius > 0
            ? createSoftBox({ radius: 0.1, arcSegments: 20 }, scene)
            : MeshBuilder.CreateBox(`${instanceName}_body`, { size: resolvedConfig.size }, scene);
        bodyMesh.name = `${instanceName}_body`;
        bodyMesh.parent = root;
        bodyMesh.material = bodyMaterial;

        let pipIndex = 0;
        const addPip = (x: number, y: number, z: number) => {
            const pip = createPip(
                scene,
                root,
                pipMaterial,
                resolvedConfig,
                instanceName,
                pipIndex++,
                x,
                y,
                z
            );
            pipMeshes.push(pip);
        };
        overridePipMaterials.forEach((material) => material.dispose());
        overridePipMaterials = [];

        pipTextures.forEach((texture) => texture.dispose());
        pipTextures = [];

        // ------------------------------------
        // BODY
        // ------------------------------------

        bodyMesh = createRoundedBox(
            `${instanceName}_body`,
            scene,
            {
                size: resolvedConfig.size,
                cornerRadius: resolvedConfig.cornerRadius,
                cornerSegments: resolvedConfig.cornerSegments,
            }
        );

        bodyMesh.parent = root;
        bodyMesh.material = bodyMaterial;

        // ------------------------------------
        // PIPS
        // ------------------------------------

        const {
            pipMeshes: newPipMeshes,
            overridePipMaterials: newOverrideMaterials,
            pipTextures: newPipTextures,
        } = createDicePips(scene, root, pipMaterial, resolvedConfig, instanceName);

        pipMeshes = newPipMeshes;
        overridePipMaterials = newOverrideMaterials;
        pipTextures = newPipTextures;
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
    // INSTANCE API
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
            userConfig = { ...userConfig, ...next };
            resolvedConfig = mergeDiceConfig(userConfig);
            console.log("🔄 CONFIG ACTUALIZADA", resolvedConfig);
            syncInstance();
        },

        dispose() {
            bodyMesh?.dispose();
            pipMeshes.forEach((pipMesh) => pipMesh.dispose());
            overridePipMaterials.forEach((material) => material.dispose());
            pipTextures.forEach((texture) => texture.dispose());

            if (bodyTexture) {
                bodyTexture.dispose();
                bodyTexture = null;
            }

            bodyMaterial.dispose();
            pipMaterial.dispose();
            root.dispose();
        },
    };
};