// src/lib/game.utils.ts
import type { LastRoll } from "@/types/game";

export function getPlayerScore(
  sumData: Map<string, number> | Record<string, number> | undefined,
  playerId: string
): number {
  if (!sumData) return 0;

  if (sumData instanceof Map) {
    return sumData.get(playerId) ?? 0;
  }

  if (typeof sumData === "object") {
    return sumData[playerId] ?? 0;
  }

  return 0;
}

export function getRollTotal(roll: LastRoll): number {
  return roll.nums.reduce(
    (total, dice) => total + dice.value,
    0
  );
}
