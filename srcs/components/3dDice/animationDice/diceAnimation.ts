import {
    Animation,
    CubicEase,
    EasingFunction,
    Vector3,
    Scene,
    TransformNode,
} from "@babylonjs/core";

const frameRate = 60;

// La camara mira principalmente la cara +Z al final de la tirada.
const RESULT_ROTATIONS: Record<number, Vector3> = {
    1: new Vector3(0, 0, 0),
    2: new Vector3(0, -Math.PI / 2, 0),
    3: new Vector3(Math.PI / 2, 0, 0),
    4: new Vector3(-Math.PI / 2, 0, 0),
    5: new Vector3(0, Math.PI / 2, 0),
    6: new Vector3(0, Math.PI, 0),
};

const getOppositeResult = (result: number): number => 7 - result;

export interface AnimateDiceOptions {
    startPosition?: Vector3;
    endPosition?: Vector3;
    jumpHeight?: number;
    durationInFrames?: number;
    rotations?: number;
    result?: number;
    onFinish?: () => void;
}

export const animateDiceFlight = (
    scene: Scene,
    diceRoot: TransformNode,
    {
        startPosition = new Vector3(-8, 0, 0),
        endPosition = new Vector3(0, 0, 0),
        jumpHeight = 2.5,
        durationInFrames = 120,
        rotations = 4,
        result,
        onFinish,
    }: AnimateDiceOptions = {}
) => {
    const positionAnimation = new Animation(
        "diceFlightPosition",
        "position",
        frameRate,
        Animation.ANIMATIONTYPE_VECTOR3,
        Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const midPosition = startPosition.add(endPosition).scale(0.5);
    midPosition.y += jumpHeight;

    positionAnimation.setKeys([
        { frame: 0, value: startPosition },
        { frame: durationInFrames * 0.5, value: midPosition },
        { frame: durationInFrames, value: endPosition },
    ]);

    const ease = new CubicEase();
    ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    positionAnimation.setEasingFunction(ease);

    const rotationAnimation = new Animation(
        "diceFlightRotation",
        "rotation",
        frameRate,
        Animation.ANIMATIONTYPE_VECTOR3,
        Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    rotationAnimation.setKeys([
        { frame: 0, value: new Vector3(0, 0, 0) },
        {
            frame: durationInFrames,
            value: new Vector3(Math.PI * rotations, Math.PI * rotations, Math.PI * rotations),
        },
    ]);

    diceRoot.position.copyFrom(startPosition);
    diceRoot.setEnabled(true);
    // @ts-ignore animations property exists on Node types at runtime
    (diceRoot as any).animations = [positionAnimation, rotationAnimation];

    scene.beginAnimation(diceRoot as any, 0, durationInFrames, false, 1, () => {
        diceRoot.position.copyFrom(endPosition);
        const visibleResult = result ? getOppositeResult(result) : undefined;

        if (visibleResult && RESULT_ROTATIONS[visibleResult]) {
            diceRoot.rotation.copyFrom(RESULT_ROTATIONS[visibleResult]);
        }
        if (typeof onFinish === "function") {
            onFinish();
        }
    });
};
