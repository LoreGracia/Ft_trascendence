// src/types/game.ts

export type PlayerState = "UNLOCKED" | "LOCKED" | "WIN" | "TIE" | string;

export type GameType = "FREE_PLAY" | "ADD42";

export interface Player {
  id: string;
  state: PlayerState;
}

export interface Room {
  roomCode: string;
  players: Player[];
}

export interface MatchRoom extends Room {
  gameType: GameType;
  turn: number;
  sum?: Map<string, number> | Record<string, number>;
}

export interface Dice {
  value: number;
}

export interface LastRoll {
  idPlayer: string;
  nums: Dice[];
}

export interface DiceRolledData {
  match: MatchRoom;
  roll: LastRoll;
}

export interface MatchWonData {
  match?: MatchRoom;
  lastRoll?: LastRoll;
  players?: Player[];
  roomCode?: string;
  gameType?: GameType;
  turn?: number;
  sum?: Map<string, number> | Record<string, number>;
}
