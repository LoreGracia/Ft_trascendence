import {
    Color3,
    Mesh,
    MeshBuilder,
    Scene,
    StandardMaterial,
    TransformNode,
} from "@babylonjs/core";
import { DiceConfig, mergeDiceConfig } from "../modelDice/diceConfig";

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

const createDiceMaterials = (scene: Scene, instanceName: string, config: Required<DiceConfig>) => {
    const bodyMaterial = new StandardMaterial(`${instanceName}_bodyMaterial`, scene);
    bodyMaterial.diffuseColor = config.bodyColor;
    bodyMaterial.emissiveColor = config.emissiveColor;

    const pipMaterial = new StandardMaterial(`${instanceName}_pipMaterial`, scene);
    pipMaterial.diffuseColor = config.pipColor;
    pipMaterial.backFaceCulling = false;

    return { bodyMaterial, pipMaterial };
};

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
    const pip = MeshBuilder.CreateDisc(
        `${instanceName}_pip_${pipIndex}`,
        { radius: config.pipRadius, tessellation: 32, sideOrientation: Mesh.DOUBLESIDE },
        scene
    );

    pip.position.set(x, y, z);
    pip.material = pipMaterial;

    if (Math.abs(Math.abs(z) - config.faceOffset) < 0.001) {
        pip.rotation.y = z > 0 ? 0 : Math.PI;
    } else if (Math.abs(Math.abs(x) - config.faceOffset) < 0.001) {
        pip.rotation.y = x > 0 ? Math.PI / 2 : -Math.PI / 2;
    } else if (Math.abs(Math.abs(y) - config.faceOffset) < 0.001) {
        pip.rotation.x = y > 0 ? -Math.PI / 2 : Math.PI / 2;
    }

    pip.parent = root;
    return pip;
};

export const createDiceInstance = (scene: Scene, config?: Partial<DiceConfig>): DiceInstance => {
    const instanceName = `dice_${++diceInstanceCounter}`;
    const root = new TransformNode(`${instanceName}_root`, scene);

    const bodyMaterial = new StandardMaterial(`${instanceName}_bodyMaterial`, scene);
    const pipMaterial = new StandardMaterial(`${instanceName}_pipMaterial`, scene);
    pipMaterial.backFaceCulling = false;

    let bodyMesh: Mesh | null = null;
    let pipMeshes: Mesh[] = [];
    let overridePipMaterials: StandardMaterial[] = [];
    let userConfig: Partial<DiceConfig> = { ...config };
    let resolvedConfig = mergeDiceConfig(userConfig);

    const syncMaterials = () => {
        bodyMaterial.diffuseColor = resolvedConfig.bodyColor;
        bodyMaterial.emissiveColor = resolvedConfig.emissiveColor;
        pipMaterial.diffuseColor = resolvedConfig.pipColor;
    };

    const syncTransform = () => {
        root.position.copyFrom(resolvedConfig.position);
        root.rotation.copyFrom(resolvedConfig.rotation);
        root.setEnabled(resolvedConfig.visible);
    };

    const rebuildGeometry = () => {
        if (bodyMesh) {
            bodyMesh.dispose();
            bodyMesh = null;
        }

        pipMeshes.forEach((pipMesh) => pipMesh.dispose());
        pipMeshes = [];
        overridePipMaterials.forEach((material) => material.dispose());
        overridePipMaterials = [];

        bodyMesh = MeshBuilder.CreateBox(`${instanceName}_body`, { size: resolvedConfig.size }, scene);
        bodyMesh.name = `${instanceName}_body`;
        bodyMesh.parent = root;
        bodyMesh.material = bodyMaterial;

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

        const { faceOffset, pipOffset } = resolvedConfig;
        const firstPipColor = resolvedConfig.firstPipColor;

        addPip(0, 0, faceOffset, firstPipColor);

        addPip(-pipOffset, pipOffset, -faceOffset);
        addPip(pipOffset, pipOffset, -faceOffset);
        addPip(-pipOffset, 0, -faceOffset);
        addPip(pipOffset, 0, -faceOffset);
        addPip(-pipOffset, -pipOffset, -faceOffset);
        addPip(pipOffset, -pipOffset, -faceOffset);

        addPip(faceOffset, pipOffset, -pipOffset);
        addPip(faceOffset, -pipOffset, pipOffset);

        addPip(-faceOffset, pipOffset, -pipOffset);
        addPip(-faceOffset, pipOffset, pipOffset);
        addPip(-faceOffset, 0, 0);
        addPip(-faceOffset, -pipOffset, -pipOffset);
        addPip(-faceOffset, -pipOffset, pipOffset);

        addPip(-pipOffset, faceOffset, -pipOffset);
        addPip(0, faceOffset, 0);
        addPip(pipOffset, faceOffset, pipOffset);

        addPip(-pipOffset, -faceOffset, -pipOffset);
        addPip(pipOffset, -faceOffset, -pipOffset);
        addPip(-pipOffset, -faceOffset, pipOffset);
        addPip(pipOffset, -faceOffset, pipOffset);
    };

    const syncInstance = () => {
        syncMaterials();
        syncTransform();
        rebuildGeometry();
    };

    syncInstance();

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
            syncInstance();
        },
        dispose() {
            bodyMesh?.dispose();
            pipMeshes.forEach((pipMesh) => pipMesh.dispose());
            overridePipMaterials.forEach((material) => material.dispose());
            bodyMaterial.dispose();
            pipMaterial.dispose();
            root.dispose();
        },
    };
};
