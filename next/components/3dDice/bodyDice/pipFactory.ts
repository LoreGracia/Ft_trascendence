import {
    Color3,
    Mesh,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Texture,
    TransformNode,
    VertexData,
} from "@babylonjs/core";

import { DiceConfig } from "../modelDice/diceConfig";
import { createFaceIcon } from "./faceIconFactory";

export interface PipsResult {
    pipMeshes: Mesh[];
    overridePipMaterials: StandardMaterial[];
    pipTextures: Texture[];
}

const CODE_DICE_PATTERNS: Record<number, number[]> = {
    1: [4],                    // Centro
    2: [0, 8],                 // Diagonal
    3: [0, 4, 8],              // Diagonal completa
    4: [0, 2, 6, 8],           // Esquinas
    5: [0, 2, 4, 6, 8],        // Esquinas + centro
    6: [0, 1, 2, 6, 7, 8],     // Dos columnas (patrón clásico)
};

const GRID_POSITIONS = [
    { x: -1, y: 1 },   // 0
    { x: 0, y: 1 },    // 1
    { x: 1, y: 1 },    // 2
    { x: -1, y: 0 },   // 3
    { x: 0, y: 0 },    // 4
    { x: 1, y: 0 },    // 5
    { x: -1, y: -1 },  // 6
    { x: 0, y: -1 },   // 7
    { x: 1, y: -1 },   // 8
];

const GRID_SPACING = 0.45;
const BLOCK_SIZE = 0.2;

export const createCodeDicePips = (
    scene: Scene,
    root: TransformNode,
    config: Required<DiceConfig>,
    instanceName: string
): PipsResult => {
    const pipMeshes: Mesh[] = [];
    const overridePipMaterials: StandardMaterial[] = [];
    const pipTextures: Texture[] = [];

    const faceOffset = config.faceOffset;

    // Material para LEDs apagados
    const offMaterial = new StandardMaterial(
        `${instanceName}_led_off`,
        scene
    );
    offMaterial.diffuseColor = config.bodyColor;
    offMaterial.emissiveColor = config.bodyColor;
    offMaterial.backFaceCulling = false;

    // Material para LEDs encendidos (verde neón)
    const onMaterial = new StandardMaterial(
        `${instanceName}_led_on`,
        scene
    );

    // onMaterial.diffuseColor = config.pipColor;
    // onMaterial.emissiveColor = config.emissiveColor;
    // onMaterial.specularColor = new Color3(0.6, 0.8, 0.6);
    // onMaterial.specularPower = 48;
    onMaterial.diffuseColor = config.pipColor;
    onMaterial.emissiveColor = new Color3(0.12, 0.6, 0.25);  // Emissive más fuerte para LEDs
    onMaterial.specularColor = new Color3(0.8, 1, 0.8);      // Brillo especular más intenso
    onMaterial.specularPower = 64;                            // Aumenta el poder del brillo
    onMaterial.backFaceCulling = false;

    overridePipMaterials.push(offMaterial, onMaterial);

    // Definir las 6 caras con sus posiciones y rotaciones
    const faces = [
        {
            number: 1,
            pos: { x: 0, y: 0, z: faceOffset },
            rot: { x: 0, y: 0, z: 0 },
        },
        {
            number: 6,
            pos: { x: 0, y: 0, z: -faceOffset },
            rot: { x: 0, y: Math.PI, z: 0 },
        },
        {
            number: 2,
            pos: { x: faceOffset, y: 0, z: 0 },
            rot: { x: 0, y: Math.PI / 2, z: 0 },
        },
        {
            number: 5,
            pos: { x: -faceOffset, y: 0, z: 0 },
            rot: { x: 0, y: -Math.PI / 2, z: 0 },
        },
        {
            number: 3,
            pos: { x: 0, y: faceOffset, z: 0 },
            rot: { x: -Math.PI / 2, y: 0, z: 0 },
        },
        {
            number: 4,
            pos: { x: 0, y: -faceOffset, z: 0 },
            rot: { x: Math.PI / 2, y: 0, z: 0 },
        },
    ];

    // Crear la matriz de LEDs para cada cara
    for (const face of faces) {
        const faceNumber = face.number;
        const enabledIndices = new Set(
            CODE_DICE_PATTERNS[faceNumber]
        );

        // Contenedor para la cara (matriz 3x3)
        const faceContainer = new TransformNode(
            `${instanceName}_face_${faceNumber}`,
            scene
        );
        faceContainer.position.set(
            face.pos.x,
            face.pos.y,
            face.pos.z
        );
        faceContainer.rotation.set(
            face.rot.x,
            face.rot.y,
            face.rot.z
        );
        faceContainer.parent = root;

        // Crear los 9 LEDs planos (discos) de la matriz
        for (let i = 0; i < 9; i++) {
            const gridPos = GRID_POSITIONS[i];
            const isEnabled = enabledIndices.has(i);
            const material = isEnabled ? onMaterial : offMaterial;

            const led = MeshBuilder.CreatePlane(
                `${instanceName}_code_led_${faceNumber}_${i}`,
                { size: BLOCK_SIZE },
                scene
            );

            led.position.set(
                gridPos.x * GRID_SPACING,
                gridPos.y * GRID_SPACING,
                0.001  // Mínimo desplazamiento para evitar z-fighting
            );

            led.material = material;
            led.parent = faceContainer;

            pipMeshes.push(led);
        }
    }

    return {
        pipMeshes,
        overridePipMaterials,
        pipTextures,
    };
};

const createSquarePyramid = (
    name: string,
    height: number,
    baseSize: number,
    scene: Scene
): Mesh => {
    const mesh = new Mesh(name, scene);

    const half = baseSize / 2;

    const vertices = [
        // Base: cuadrado
        half, 0, half,          // 0
        -half, 0, half,         // 1
        -half, 0, -half,        // 2
        half, 0, -half,         // 3

        // Punta
        0, height, 0,           // 4
    ];

    const indices = [
        // Base (dos triángulos)
        0, 1, 2,
        0, 2, 3,

        // Caras laterales
        0, 4, 1,
        1, 4, 2,
        2, 4, 3,
        3, 4, 0,
    ];

    const normals: number[] = [];

    VertexData.ComputeNormals(vertices, indices, normals);

    const vertexData = new VertexData();
    vertexData.positions = vertices;
    vertexData.indices = indices;
    vertexData.normals = normals;

    vertexData.applyToMesh(mesh);

    return mesh;
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
): Mesh => {
    let pip: Mesh;

    const isZFace =
        Math.abs(Math.abs(z) - config.faceOffset) < 0.001;

    const isXFace =
        Math.abs(Math.abs(x) - config.faceOffset) < 0.001;

    const isYFace =
        Math.abs(Math.abs(y) - config.faceOffset) < 0.001;

    const isTriangle = config.pipStyle === "triangle";

    if (config.pipStyle === "ball") {
        pip = MeshBuilder.CreateSphere(
            `${instanceName}_pip_${pipIndex}`,
            {
                diameter: config.pipRadius * 2,
                segments: 16,
            },
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

    } else if (config.pipStyle === "triangle") {
        const pipDepth = config.pipRadius * 2.5;

        pip = createSquarePyramid(
            `${instanceName}_pip_${pipIndex}`,
            pipDepth,
            config.pipRadius * 2.5,
            scene
        );

        /*
         * Posiciona y orienta la pirámide perpendicular a cada cara.
         * La base (Y=0 local) quedará tocando la superficie del dado.
         */
        if (isZFace) {
            const outward = z > 0 ? 1 : -1;
            // z se mantiene en config.faceOffset (la base toca la cara)
            pip.rotation.x = outward * Math.PI / 2;
        } else if (isXFace) {
            const outward = x > 0 ? 1 : -1;
            // x se mantiene en config.faceOffset (la base toca la cara)
            pip.rotation.z = -outward * Math.PI / 2;
        } else if (isYFace) {
            const outward = y > 0 ? 1 : -1;
            // y se mantiene en config.faceOffset (la base toca la cara)
            pip.rotation.x = outward > 0 ? 0 : Math.PI;
        }
    } else {
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

    pip.position.set(x, y, z);
    pip.material = pipMaterial;

    /*
     * Las pirámides ya tienen su orientación aplicada dentro
     * de su propia rama. No sobrescribimos esa rotación aquí.
     *
     * Esta orientación se mantiene para las bolas y los discos.
     */
    if (!isTriangle) {
        if (isZFace) {
            pip.rotation.y = z > 0 ? 0 : Math.PI;
        } else if (isXFace) {
            pip.rotation.y = x > 0
                ? Math.PI / 2
                : -Math.PI / 2;
        } else if (isYFace) {
            pip.rotation.x = y > 0
                ? -Math.PI / 2
                : Math.PI / 2;
        }
    }

    pip.parent = root;

    return pip;
};

type AddPipFn = (
    x: number,
    y: number,
    z: number,
    colorOverride?: Color3
) => void;

type FacePipBuilder = (
    addPip: AddPipFn,
    faceOffset: number,
    pipOffset: number,
    color?: Color3
) => void;

// Cada función construye el patrón de pips de UNA cara (1-6).
// Separarlas permite que el orquestador (createDicePips)
// sustituya cualquiera de ellas por un icono/emoji
// sin tocar las demás.

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

const FACE_ORDER = [1, 6, 2, 5, 3, 4];

/**
 * Genera las 6 caras de un dado d6:
 *
 * - Crea los pips estándar respetando pipStyle.
 * - Aplica colores individuales mediante facePipColors.
 * - Si faceIcons contiene una entrada para una cara,
 *   crea un icono que sustituye todos sus pips.
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

    const addPip: AddPipFn = (
        x,
        y,
        z,
        colorOverride
    ) => {
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

        const pip = createPip(
            scene,
            root,
            pipMaterialToUse,
            config,
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
        firstPipColor,
        facePipColors,
        faceIcons,
    } = config;

    const faceColor = (
        faceValue: number,
        fallback?: Color3
    ) => facePipColors?.[faceValue - 1] ?? fallback;

    for (const faceNumber of FACE_ORDER) {
        const icon = faceIcons?.[faceNumber];

        if (icon) {
            const {
                mesh,
                material,
                texture,
            } = createFaceIcon(
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

        const fallbackColor =
            faceNumber === 1
                ? firstPipColor
                : undefined;

        FACE_PIP_BUILDERS[faceNumber](
            addPip,
            faceOffset,
            pipOffset,
            faceColor(faceNumber, fallbackColor)
        );
    }

    return {
        pipMeshes,
        overridePipMaterials,
        pipTextures,
    };
};