import { ArcRotateCamera, Scene, Vector3 } from "@babylonjs/core";

interface OrbitCameraOptions {
    alpha?: number;
    beta?: number;
    radius?: number;
    lowerRadiusLimit?: number;
    upperRadiusLimit?: number;
    wheelPrecision?: number;
}

const DEFAULT_OPTIONS: Required<OrbitCameraOptions> = {
    alpha: -Math.PI / 2,
    beta: Math.PI / 2.5,
    radius: 10,
    lowerRadiusLimit: 6,
    upperRadiusLimit: 16,
    wheelPrecision: 40,
};

/**
 * Crea una ArcRotateCamera con control de ratón/touch ya activado,
 * pensada para el canvas "hero" donde el jugador inspecciona el dado.
 */
export const createOrbitCamera = (
    scene: Scene,
    canvas: HTMLCanvasElement,
    name = "diceCamera",
    options: OrbitCameraOptions = {}
) => {
    const { alpha, beta, radius, lowerRadiusLimit, upperRadiusLimit, wheelPrecision } = {
        ...DEFAULT_OPTIONS,
        ...options,
    };

    const camera = new ArcRotateCamera(name, alpha, beta, radius, Vector3.Zero(), scene);

    camera.lowerRadiusLimit = lowerRadiusLimit;
    camera.upperRadiusLimit = upperRadiusLimit;
    camera.wheelPrecision = wheelPrecision;
    camera.panningSensibility = 0; // bloquea el desplazamiento lateral, solo permite orbitar

    camera.attachControl(canvas, true);

    return camera;
};