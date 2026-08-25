import {
    Engine,
    Scene,
    ArcRotateCamera,
    HemisphericLight,
    Vector3,
    Mesh,
    MeshBuilder,
    StandardMaterial,
    Color3,
    TransformNode,
} from "@babylonjs/core";
import { rollDice } from "./diceRoll";
import { animateDiceFlight } from "./diceAnimation";
import { createHud, setResult, setBusy } from "./hud(Borrar)";
import { DiceConfig, mergeDiceConfig, DICE_PRESETS, DICE_LEGENDARY_PRESETS } from "./diceConfig";
import { createRoundedBox } from "./roundedBox";

// ==================== CONFIGURACIÓN GLOBAL ====================

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true);

const CAMERA_CONFIG = {
    alpha: -Math.PI / 2,
    beta: Math.PI / 2.5,
    radius: 10,
    target: Vector3.Zero(),
};

const LIGHT_CONFIG = {
    direction: new Vector3(0, 1, 0),
    intensity: 0.9,
};

// ==================== UTILIDADES ====================

const createCamera = (scene: Scene): ArcRotateCamera => {
    const camera = new ArcRotateCamera(
        "camera",
        CAMERA_CONFIG.alpha,
        CAMERA_CONFIG.beta,
        CAMERA_CONFIG.radius,
        CAMERA_CONFIG.target,
        scene
    );

    camera.attachControl(canvas, true);
    return camera;
};

const createLight = (scene: Scene): HemisphericLight => {
    const light = new HemisphericLight("light", LIGHT_CONFIG.direction, scene);
    light.intensity = LIGHT_CONFIG.intensity;

    const fillLight = new HemisphericLight("fillLight", new Vector3(0, -1, 0), scene);
    fillLight.intensity = 0.35;

    return light;
};

// ==================== CREACIÓN MODULAR DE DADO ====================

/**
 * Crea los materiales para un dado con colores personalizados.
 */
const createDiceMaterials = (scene: Scene, config: Required<DiceConfig>) => {
    const matCuerpo = new StandardMaterial(`matCuerpo_${Math.random()}`, scene);
    matCuerpo.diffuseColor = config.bodyColor;
    matCuerpo.emissiveColor = config.emissiveColor;

    const matPunto = new StandardMaterial(`matPunto_${Math.random()}`, scene);
    matPunto.diffuseColor = config.pipColor;
    matPunto.backFaceCulling = false;

    return { matCuerpo, matPunto };
};

/**
 * Crea un pip (punto) en una posición específica con orientación correcta.
 */
const createPip = (
    scene: Scene,
    dadoRoot: TransformNode,
    matPunto: StandardMaterial,
    config: Required<DiceConfig>,
    x: number,
    y: number,
    z: number
) => {
    const p = MeshBuilder.CreateDisc(
        "pip",
        { radius: config.pipRadius, tessellation: 32, sideOrientation: Mesh.DOUBLESIDE },
        scene
    );

    p.position.set(x, y, z);
    p.material = matPunto;

    // Orientar el pip según la cara del cubo
    if (Math.abs(Math.abs(z) - config.faceOffset) < 0.001) {
        p.rotation.y = z > 0 ? 0 : Math.PI;
    } else if (Math.abs(Math.abs(x) - config.faceOffset) < 0.001) {
        p.rotation.y = x > 0 ? Math.PI / 2 : -Math.PI / 2;
    } else if (Math.abs(Math.abs(y) - config.faceOffset) < 0.001) {
        p.rotation.x = y > 0 ? -Math.PI / 2 : Math.PI / 2;
    }

    p.parent = dadoRoot;
};

/**
 * Crea la geometría completa del dado (cuerpo + puntos) con configuración personalizada.
 */
const createDado = (scene: Scene, config?: Partial<DiceConfig>): TransformNode => {
    const cfg = mergeDiceConfig(config);
    const { faceOffset, pipOffset, size, cornerRadius, cornerSegments } = cfg;
    const { matCuerpo, matPunto } = createDiceMaterials(scene, cfg);

    const dadoRoot = new TransformNode("dadoRoot", scene);
    dadoRoot.position.copyFrom(cfg.position);
    dadoRoot.rotation.copyFrom(cfg.rotation);
    dadoRoot.setEnabled(cfg.visible);

    // Cuerpo del cubo (redondeado si cornerRadius > 0)
    const cuerpo = cornerRadius > 0
        ? createRoundedBox(scene, size, cornerRadius, cornerSegments)
        : MeshBuilder.CreateBox("dado", { size }, scene);
    cuerpo.parent = dadoRoot;
    cuerpo.material = matCuerpo;

    // Cara +Z => 1 punto
    createPip(scene, dadoRoot, matPunto, cfg, 0, 0, faceOffset);

    // Cara -Z => 6 puntos
    createPip(scene, dadoRoot, matPunto, cfg, -pipOffset, pipOffset, -faceOffset);
    createPip(scene, dadoRoot, matPunto, cfg, pipOffset, pipOffset, -faceOffset);
    createPip(scene, dadoRoot, matPunto, cfg, -pipOffset, 0, -faceOffset);
    createPip(scene, dadoRoot, matPunto, cfg, pipOffset, 0, -faceOffset);
    createPip(scene, dadoRoot, matPunto, cfg, -pipOffset, -pipOffset, -faceOffset);
    createPip(scene, dadoRoot, matPunto, cfg, pipOffset, -pipOffset, -faceOffset);

    // Cara +X => 2 puntos
    createPip(scene, dadoRoot, matPunto, cfg, faceOffset, pipOffset, -pipOffset);
    createPip(scene, dadoRoot, matPunto, cfg, faceOffset, -pipOffset, pipOffset);

    // Cara -X => 5 puntos
    createPip(scene, dadoRoot, matPunto, cfg, -faceOffset, pipOffset, -pipOffset);
    createPip(scene, dadoRoot, matPunto, cfg, -faceOffset, pipOffset, pipOffset);
    createPip(scene, dadoRoot, matPunto, cfg, -faceOffset, 0, 0);
    createPip(scene, dadoRoot, matPunto, cfg, -faceOffset, -pipOffset, -pipOffset);
    createPip(scene, dadoRoot, matPunto, cfg, -faceOffset, -pipOffset, pipOffset);

    // Cara +Y => 3 puntos
    createPip(scene, dadoRoot, matPunto, cfg, -pipOffset, faceOffset, -pipOffset);
    createPip(scene, dadoRoot, matPunto, cfg, 0, faceOffset, 0);
    createPip(scene, dadoRoot, matPunto, cfg, pipOffset, faceOffset, pipOffset);

    // Cara -Y => 4 puntos
    createPip(scene, dadoRoot, matPunto, cfg, -pipOffset, -faceOffset, -pipOffset);
    createPip(scene, dadoRoot, matPunto, cfg, pipOffset, -faceOffset, -pipOffset);
    createPip(scene, dadoRoot, matPunto, cfg, -pipOffset, -faceOffset, pipOffset);
    createPip(scene, dadoRoot, matPunto, cfg, pipOffset, -faceOffset, pipOffset);

    return dadoRoot;
};

/**
 * Factory para crear una instancia de dado en la escena con configuración personalizada.
 */
export const createDiceInstance = (scene: Scene, config?: Partial<DiceConfig>): TransformNode => {
    return createDado(scene, config);
};

// ==================== INICIALIZACIÓN DE LA APP ====================

const createScene = (): { scene: Scene; diceRoot: TransformNode } => {
    const scene = new Scene(engine);

    createCamera(scene);
    createLight(scene);
    const diceRoot = createDado(scene);

    return { scene, diceRoot };
};

const { scene, diceRoot: initialDiceRoot } = createScene();
let diceRoot: TransformNode | null = initialDiceRoot;

const currentRoll: { value: number | null } = {
    value: null,
};

const { resultText, rollButton } = createHud();

// ==================== SELECTOR DE TIPO DE DADO ====================

const diceTypeSelector = document.getElementById("diceTypeSelector") as HTMLSelectElement;

const swapDice = (value: string) => {
    // Destruir el dado actual (cuerpo + pips + materiales) antes de crear el nuevo
    diceRoot?.dispose(false, true);

    const preset = value.startsWith("legendary:")
        ? DICE_LEGENDARY_PRESETS[value.replace("legendary:", "") as keyof typeof DICE_LEGENDARY_PRESETS]
        : DICE_PRESETS[value as keyof typeof DICE_PRESETS];

    diceRoot = createDiceInstance(scene, preset);
};

diceTypeSelector.addEventListener("change", (e) => {
    swapDice((e.target as HTMLSelectElement).value);
});

rollButton.addEventListener("click", () => {
    currentRoll.value = rollDice(6);
    setResult(resultText, "Resultado: tirando...");
    setBusy(rollButton, true);

    if (diceRoot) {
        animateDiceFlight(scene, diceRoot, {
            result: currentRoll.value ?? undefined,
            onFinish: () => {
                setResult(resultText, `Resultado: ${currentRoll.value}`);
                setBusy(rollButton, false);
                console.log(`La animacion termino. Resultado guardado: ${currentRoll.value}`);
            },
        });
    } else {
        setResult(resultText, `Resultado: ${currentRoll.value}`);
        setBusy(rollButton, false);
    }
});

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});