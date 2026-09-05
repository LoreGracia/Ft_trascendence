"use client";

import DiceResult from "@/components/3dDice/DiceResult";

export default function Error404() {
    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-black pt-20 w-full">
            <div className="text-center w-full">
                <p style={{ fontSize: "64px" }} className="text-gray-500 mb-8">
                    Whoa, where are you going?
                </p>
                <h1
                    style={{ fontSize: "144px" }}
                    className="font-bold text-white mb-4 mx-auto"
                >
                    404
                </h1>
                <p style={{ fontSize: "64px" }} className="text-gray-400 mb-20">
                    Page Not Found
                </p>
            </div>

            {/* 3 Dados lado a lado */}
            <div className="flex flex-row gap-8 justify-center w-full">
                <div style={{ width: "200px", height: "200px" }}>
                    <DiceResult result={4} />
                </div>
                <div style={{ width: "200px", height: "200px" }}>
                    <DiceResult result={1} emoji="❌" />
                </div>
                <div style={{ width: "200px", height: "200px" }}>
                    <DiceResult result={4} />
                </div>
            </div>
        </div>
    );
}