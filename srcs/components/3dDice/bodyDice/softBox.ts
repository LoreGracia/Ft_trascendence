// per https://playground.babylonjs.com/#PCWRFE

import {Scene, Mesh, MeshBuilder, Vector3} from "@babylonjs/core"

interface SoftBoxOptions {
    size?: number;
    height?: number;
    width?: number;
    depth?: number;
    heightTop?: number;
    widthLeft?: number;
    depthBack?: number;
    heightBottom?: number;
    widthRight?: number;
    depthFront?: number;
    arcSegments?: number;
    radius?: number;
    radiusX?: number;
    radiusY?: number,
    radiusZ?: number;
    radiusXPos?: number;
    radiusYPos?: number,
    radiusZPos?: number;
    radiusXNeg?: number;
    radiusYNeg?: number,
    radiusZNeg?: number;
    stretch?: boolean;
    stretchX?: boolean;
    stretchY?: boolean;
    stretchZ?: boolean;
}

export const createSoftBox = (opt: SoftBoxOptions, scene: Scene): Mesh => {

    const size = opt.size ?? 1;
    const height = opt.height ?? size / 2;
    const width = opt.width ?? size / 2;
    const depth = opt.depth ?? size / 2;
    const heightTop = opt.heightTop ?? height;
    const widthLeft = opt.widthLeft ?? width;
    const depthBack = opt.depthBack ?? depth;
    const heightBottom = opt.heightBottom ?? height;
    const widthRight = opt.widthRight ?? width;
    const depthFront = opt.depthFront ?? depth;

    const arcSegments = Math.max(opt.arcSegments ?? 1, 1);
    const radius = Math.max(opt.radius ?? 0, 0);
    const radiusX = Math.max(opt.radiusX ?? radius, 0);
    const radiusY = Math.max(opt.radiusY ?? radius, 0);
    const radiusZ = Math.max(opt.radiusZ ?? radius, 0);
    const radiusXPos = Math.max(opt.radiusXPos ?? radiusX, 0);
    const radiusYPos = Math.max(opt.radiusYPos ?? radiusY, 0);
    const radiusZPos = Math.max(opt.radiusZPos ?? radiusZ, 0);
    const radiusXNeg = Math.max(opt.radiusXNeg ?? radiusX, 0);
    const radiusYNeg = Math.max(opt.radiusYNeg ?? radiusY, 0);
    const radiusZNeg = Math.max(opt.radiusZNeg ?? radiusZ, 0);

    const stretch = opt.stretch ?? false;
    const stretchX = opt.stretchX ?? stretch;
    const stretchY = opt.stretchY ?? stretch;
    const stretchZ = opt.stretchZ ?? stretch;

    const heightTopInner = Math.max(heightTop - radiusYPos, 0);
    const widthLeftInner = Math.max(widthLeft - radiusXPos, 0);
    const depthBackInner = Math.max(depthBack - radiusZPos, 0);

    const heightBottomInner = Math.max(heightBottom - radiusYNeg, 0);
    const widthRightInner = Math.max(widthRight - radiusXNeg, 0);
    const depthFrontInner = Math.max(depthFront - radiusZNeg, 0);

    console.log(`heightBottomInner:${heightBottomInner}, heightTopInner:${heightTopInner}, widthRightInner:${widthRightInner}, widthLeftInner:${widthLeftInner}, depthFrontInner:${depthFrontInner}, depthBackInner:${depthBackInner}, radiusYNeg:${radiusYNeg}, radiusYPos:${radiusYPos}, radiusXNeg:${radiusXNeg}, radiusXPos:${radiusXPos}`);

    const getArc = (
        offset: number,
        width: number,
        height: number,
        depth: number,
        radiusX: number,
        radiusY: number,
        radiusZ: number,
        innerInc: number,
        outerInc: number,
        stretchX: boolean,
        stretchY: boolean,
        stretchZ: boolean) => {

        const x = stretchX ?
            (Math.abs(width) + radiusX) * Math.cos(offset + outerInc * arc) * Math.cos(innerInc * arc) :
            width + radiusX * Math.cos(offset + outerInc * arc) * Math.cos(innerInc * arc);
        const y = stretchY ?
            (Math.abs(height) + radiusY) * Math.sin(innerInc * arc) :
            height + radiusY * Math.sin(innerInc * arc);
        const z = stretchZ ?
            (Math.abs(depth) + radiusZ) * Math.sin(offset + outerInc * arc) * Math.cos(innerInc * arc) :
            depth + radiusZ * Math.sin(offset + outerInc * arc) * Math.cos(innerInc * arc);

        const ret = new Vector3(x, y, z);

        //console.log(`getArc width:${width},height:${height},depth:${depth},radiusX:${radiusX},radiusY:${radiusY},radiusZ:${radiusZ},innerInc:${innerInc},outerInc:${outerInc},`, ret);

        return ret;
    }

    const paths: Vector3[][] = [];
    const arc = Math.PI / (2 * arcSegments)


    const addSegment = (offset: number, segments: number, width: number, heightTop: number, heightBottom: number, depth: number) => {
        for (let t = 0; t <= segments; t++) {

            const path = [];

            path.push(getArc(offset, 0, -heightBottom, 0, radiusXPos, radiusYPos, radiusZPos, -arcSegments!!, t, stretchX, stretchY, stretchZ));

            for (let a = -arcSegments; a <= 0; a++) {
                const height = a > 0 ? heightTop : -heightBottom;
                path.push(getArc(offset, width, height, depth, radiusXPos, radiusYPos, radiusZPos, a, t, stretchX, stretchY, stretchZ));
            }

            path.push(getArc(offset, width, 0, depth, radiusXPos, radiusYPos, radiusZPos, 0, t, stretchX, stretchY, stretchZ));

            for (let a = 0; a <= arcSegments; a++) {
                const height = a >= 0 ? heightTop : -heightBottom;
                path.push(getArc(offset, width, height, depth, radiusXPos, radiusYPos, radiusZPos, a, t, stretchX, stretchY, stretchZ));
            }

            path.push(getArc(offset, 0, heightTop, 0, radiusXPos, radiusYPos, radiusZPos, arcSegments, t, stretchX, stretchY, stretchZ));

            paths.push(path);

        }
    }

    //const width = angle > 0 ? widthp : -widthn;
    //const depth = Math.floor(t / arcSegments!!) < 2 ? depthp : -depthn;

    if (!stretch && widthLeftInner + widthRightInner > 0) addSegment(0, 0, widthRightInner, heightTopInner, heightBottomInner, 0);
    addSegment(0, arcSegments, widthRightInner, heightTopInner, heightBottomInner, depthBackInner);

    if (!stretch && depthBackInner + depthFrontInner > 0) addSegment(Math.PI / 2, 0, 0, heightTopInner, heightBottomInner, depthBackInner);
    addSegment(Math.PI / 2, arcSegments, -widthLeftInner, heightTopInner, heightBottomInner, depthBackInner);

    if (!stretch && widthLeftInner + widthRightInner > 0) addSegment(Math.PI, 0, -widthLeftInner, heightTopInner, heightBottomInner, 0);
    addSegment(Math.PI, arcSegments, -widthLeftInner, heightTopInner, heightBottomInner, -depthFrontInner);

    if (!stretch && depthBackInner + depthFrontInner > 0) addSegment(3 * Math.PI / 2, 0, 0, heightTopInner, heightBottomInner, -depthFrontInner);
    addSegment(3 * Math.PI / 2, arcSegments, widthRightInner, heightTopInner, heightBottomInner, -depthFrontInner);

    //console.log(paths)

    const ribbon = MeshBuilder.CreateRibbon("ribbon", { pathArray: paths, sideOrientation: Mesh.FRONTSIDE, closeArray: true }, scene);

    return ribbon;
}

