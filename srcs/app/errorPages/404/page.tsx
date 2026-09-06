"use client";

import DiceErrorTriple from "@/components/3dDice/DiceErrorTriple";

export default function Error404() {
    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            {/* Canvas full screen */}
            <div className="absolute inset-0 w-full h-full">
                <DiceErrorTriple result1={4} result2={1} result3={4} emoji2="❌" />
            </div>

            {/* Texto en el segundo cuarto (posicionado absoluto) */}
            <div className="absolute top-1/6 left-0 right-0 flex items-center justify-center pointer-events-none z-10">
                <div className="text-center">
                    <p style={{ fontSize: "68px" }} className="text-gray-500 mb-8">
                        Whoa, where are you going?
                    </p>

                    <div className="flex items-center justify-center gap-4 mb-4">
                        <p style={{ fontSize: "38px" }} className="text-gray-500">
                            Error |
                        </p>
                        <h1
                            style={{ fontSize: "100px" }}
                            className="font-bold text-white"
                        >
                            404
                        </h1>
                    </div>

                    <p style={{ fontSize: "58px" }} className="text-gray-400">
                        Page Not Found
                    </p>
                </div>
            </div>
        </div>
    );
}