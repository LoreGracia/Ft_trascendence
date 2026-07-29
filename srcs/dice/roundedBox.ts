import { CSG, Mesh, MeshBuilder, Scene } from "@babylonjs/core";

/**
 * Crea un cubo con aristas/esquinas redondeadas.
 *
 * Construido como la suma de Minkowski de una caja con una esfera:
 * caja central + 12 cilindros (aristas) + 8 esferas (esquinas), fusionados con CSG.
 * Es un cálculo pesado (CSG union), pero se ejecuta una sola vez al crear el dado,
 * no en cada frame del render loop.
 */
export const createRoundedBox = (
    scene: Scene,
    size: number,
    cornerRadius: number,
    segments: number = 8
): Mesh => {
    const r = Math.min(Math.max(cornerRadius, 0), size / 2 - 0.001);
    const inner = size / 2 - r; // semi-extensión del núcleo central
    const signs = [-1, 1];
    const tempMeshes: Mesh[] = [];

    // Núcleo central
    tempMeshes.push(
        MeshBuilder.CreateBox("core", { width: inner * 2, height: inner * 2, depth: inner * 2 }, scene)
    );

    // 8 esquinas
    for (const sx of signs) {
        for (const sy of signs) {
            for (const sz of signs) {
                const corner = MeshBuilder.CreateSphere("corner", { diameter: r * 2, segments }, scene);
                corner.position.set(sx * inner, sy * inner, sz * inner);
                tempMeshes.push(corner);
            }
        }
    }

    // 12 aristas (cilindros), 4 por cada eje
    const length = inner * 2;
    const tessellation = segments * 2;

    for (const sy of signs) {
        for (const sz of signs) {
            const edge = MeshBuilder.CreateCylinder("edgeX", { height: length, diameter: r * 2, tessellation }, scene);
            edge.rotation.z = Math.PI / 2;
            edge.position.set(0, sy * inner, sz * inner);
            tempMeshes.push(edge);
        }
    }
    for (const sx of signs) {
        for (const sz of signs) {
            const edge = MeshBuilder.CreateCylinder("edgeY", { height: length, diameter: r * 2, tessellation }, scene);
            edge.position.set(sx * inner, 0, sz * inner);
            tempMeshes.push(edge);
        }
    }
    for (const sx of signs) {
        for (const sy of signs) {
            const edge = MeshBuilder.CreateCylinder("edgeZ", { height: length, diameter: r * 2, tessellation }, scene);
            edge.rotation.x = Math.PI / 2;
            edge.position.set(sx * inner, sy * inner, 0);
            tempMeshes.push(edge);
        }
    }

    // Fusionar todo con CSG
    let csg = CSG.FromMesh(tempMeshes[0]);
    for (let i = 1; i < tempMeshes.length; i++) {
        csg = csg.union(CSG.FromMesh(tempMeshes[i]));
    }

    const rounded = csg.toMesh("dado", null, scene);

    // Limpiar meshes temporales (la geometría ya está fusionada en "rounded")
    tempMeshes.forEach((m) => m.dispose());

    return rounded;
};
