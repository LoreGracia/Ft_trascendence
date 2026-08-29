import { Mesh, Scene, Vector3, VertexData } from "@babylonjs/core";

interface RoundedBoxOptions {
    size: number;
    cornerRadius: number;
    cornerSegments: number;
}

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

interface FaceAxes {
    normal: Vector3;
    u: Vector3;
    v: Vector3;
}

const FACES: FaceAxes[] = [
    { normal: new Vector3(1, 0, 0), u: new Vector3(0, 0, 1), v: new Vector3(0, 1, 0) },
    { normal: new Vector3(-1, 0, 0), u: new Vector3(0, 0, -1), v: new Vector3(0, 1, 0) },
    { normal: new Vector3(0, 1, 0), u: new Vector3(1, 0, 0), v: new Vector3(0, 0, -1) },
    { normal: new Vector3(0, -1, 0), u: new Vector3(1, 0, 0), v: new Vector3(0, 0, 1) },
    { normal: new Vector3(0, 0, 1), u: new Vector3(1, 0, 0), v: new Vector3(0, 1, 0) },
    { normal: new Vector3(0, 0, -1), u: new Vector3(-1, 0, 0), v: new Vector3(0, 1, 0) },
];

const addFace = (
    positions: number[],
    indices: number[],
    face: FaceAxes,
    halfSize: number,
    segments: number
) => {
    const base = positions.length / 3;
    const row = segments + 1;

    for (let iy = 0; iy <= segments; iy++) {
        for (let ix = 0; ix <= segments; ix++) {
            const u = (ix / segments) * 2 - 1;
            const v = (iy / segments) * 2 - 1;
            positions.push(
                face.normal.x * halfSize + face.u.x * u * halfSize + face.v.x * v * halfSize,
                face.normal.y * halfSize + face.u.y * u * halfSize + face.v.y * v * halfSize,
                face.normal.z * halfSize + face.u.z * u * halfSize + face.v.z * v * halfSize
            );
        }
    }

    // Comprueba una vez por cara hacia qué lado queda el triángulo con el
    // orden de índices "por defecto", y elige el sentido de bobinado que
    // apunte hacia fuera. Así no hace falta adivinar a mano el winding
    // correcto para cada una de las 6 caras (fácil de equivocarse y dejar
    // el dado invisible o mal iluminado).
    const i0 = base;
    const i1 = base + 1;
    const i2 = base + row;
    const p0 = [positions[i0 * 3], positions[i0 * 3 + 1], positions[i0 * 3 + 2]];
    const p1 = [positions[i1 * 3], positions[i1 * 3 + 1], positions[i1 * 3 + 2]];
    const p2 = [positions[i2 * 3], positions[i2 * 3 + 1], positions[i2 * 3 + 2]];
    const e1 = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
    const e2 = [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]];
    const cross = [
        e1[1] * e2[2] - e1[2] * e2[1],
        e1[2] * e2[0] - e1[0] * e2[2],
        e1[0] * e2[1] - e1[1] * e2[0],
    ];
    const dot = cross[0] * face.normal.x + cross[1] * face.normal.y + cross[2] * face.normal.z;
    const clockwise = dot < 0;

    for (let iy = 0; iy < segments; iy++) {
        for (let ix = 0; ix < segments; ix++) {
            const a = base + iy * row + ix;
            const b = a + 1;
            const c = a + row;
            const d = c + 1;

            if (clockwise) {
                indices.push(a, b, c, b, d, c);
            } else {
                indices.push(a, c, b, c, d, b);
            }
        }
    }
};

/**
 * Crea una caja con aristas/esquinas redondeadas, con el centro de cada
 * cara perfectamente plano (mismo faceOffset de siempre). A diferencia de
 * MeshBuilder.CreateBox (solo 8 vértices, sin geometría intermedia que
 * curvar), esta caja se subdivide en una rejilla por cara; solo se curvan
 * los vértices que caen fuera de la "caja interior" (halfSize - cornerRadius).
 */
export const createRoundedBox = (
    name: string,
    scene: Scene,
    { size, cornerRadius, cornerSegments }: RoundedBoxOptions
): Mesh => {
    const halfSize = size / 2;
    const radius = clamp(cornerRadius, 0, halfSize * 0.99);
    const innerExtent = halfSize - radius;
    const segments = Math.max(1, Math.round(cornerSegments));

    const positions: number[] = [];
    const indices: number[] = [];

    FACES.forEach((face) => addFace(positions, indices, face, halfSize, segments));

    if (radius > 0) {
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];

            const cx = clamp(x, -innerExtent, innerExtent);
            const cy = clamp(y, -innerExtent, innerExtent);
            const cz = clamp(z, -innerExtent, innerExtent);

            const dx = x - cx;
            const dy = y - cy;
            const dz = z - cz;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist > 1e-6) {
                const scale = radius / dist;
                positions[i] = cx + dx * scale;
                positions[i + 1] = cy + dy * scale;
                positions[i + 2] = cz + dz * scale;
            }
        }
    }

    const normals: number[] = [];
    VertexData.ComputeNormals(positions, indices, normals);

    const vertexData = new VertexData();
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.normals = normals;

    const mesh = new Mesh(name, scene);
    vertexData.applyToMesh(mesh, true);

    return mesh;
};