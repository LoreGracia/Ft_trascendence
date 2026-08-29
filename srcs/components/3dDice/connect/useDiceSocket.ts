"use client";

import { useCallback, useEffect, useState } from "react";
import type { Socket } from "socket.io-client";

// ---------------------------------------------------------------------------
// TODO (pendiente merge de rama): sustituir estas dos líneas por:
//   import { socket } from "@/lib/socket";
//
// Confirmado el shape real en lib/socket.ts:
//   export const socket = io(SOCKET_URL, { autoConnect: true });
// No es un hook, es una instancia ya conectada — se importa y se usa directo.
// ---------------------------------------------------------------------------
const socket: Socket | null = null;

interface RollResult {
    playerId: string;
    value: number;
}

interface DiceRolledPayload {
    match: unknown;
    roll: RollResult;
}

interface PlayersDiceState {
    [playerId: string]: string;
}

export function useDiceSocket(roomCode: string) {
    const [playersDice, setPlayersDice] = useState<PlayersDiceState>({});
    const [lastResult, setLastResult] = useState<RollResult | null>(null);

    useEffect(() => {
        if (!socket) return;

        const handleDiceRolled = ({ roll }: DiceRolledPayload) => {
            setLastResult(roll);
        };
        socket.on("dice_rolled", handleDiceRolled);

        // TODO (BACKEND — pendiente, ver PR/rama de backend):
        // añadir handler "select_dice" en index.ts + campo de preset en
        // MatchRoom/WaitingRoom (game-types.ts) + emit "dice_selected".
        const handleDiceSelected = ({
            playerId,
            preset,
        }: {
            playerId: string;
            preset: string;
        }) => {
            setPlayersDice((prev) => ({ ...prev, [playerId]: preset }));
        };
        socket.on("dice_selected", handleDiceSelected);

        return () => {
            socket.off("dice_rolled", handleDiceRolled);
            socket.off("dice_selected", handleDiceSelected);
        };
    }, []);

    const rollDice = useCallback(() => {
        socket?.emit("roll_dice", roomCode);
    }, [roomCode]);

    const selectDice = useCallback(
        (preset: string) => {
            socket?.emit("select_dice", { roomCode, preset });
        },
        [roomCode]
    );

    return { selectDice, rollDice, playersDice, lastResult };
}