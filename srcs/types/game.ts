// src/types/game.ts

export type PlayerState = "UNLOCKED" | "LOCKED" | "WIN" | "TIE" | string;

export type GameType = "FREE_PLAY" | "ADD42";

export interface Player {
  id: string;
  state: PlayerState;
}

export type WaitingRoom = {
  roomCode: string;
	gameType: GameType;
  players: Player[];
  state?: 'OPEN' | 'CLOSED';
};

export interface MatchRoom extends WaitingRoom {
  roomCode: string;
  players: Player[];
  dices: number[];
  rolls: LastRoll[];
  sum: Record<string, number> | Map<string, number>;
  turn: number;
}

export type DiceRoll = {
  value: number;
};

export interface LastRoll {
  idPlayer: string;
  gameType: GameType;
  nums: DiceRoll[];
}
