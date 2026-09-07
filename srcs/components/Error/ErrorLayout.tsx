"use client";

import { ReactNode } from "react";

interface ErrorLayoutProps {
    children: ReactNode;
    textContent: ReactNode;
}

export default function ErrorLayout({ children, textContent }: ErrorLayoutProps) {
    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            {/* Canvas full screen */}
            <div className="absolute inset-0 w-full h-full">
                {children}
            </div>

            {/* Texto posicionado */}
            <div className="absolute top-1/6 left-0 right-0 flex items-center justify-center pointer-events-none z-10">
                {textContent}
            </div>
        </div>
    );
}