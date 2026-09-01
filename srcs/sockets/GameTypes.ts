import { GameRules } from "./Product"

export type GameType = "FREE_PLAY" | "ADD42"
export type WaitingRoomStatus = "OPEN" | "CLOSED";
export type PLAYER_STATE = "LOCKED" | "UNLOCKED";
export type PLAYER_ENDGAME = "WIN" | "LOSE" | "TIE";

export interface Players {
	id: string;
	state: PLAYER_STATE | PLAYER_ENDGAME;
}

export enum Dices {
	d6 = 6,
}

export interface RoundRoll {
	diceType: Dices;
	value: number;
}

export interface RollResult {
	idPlayer: string;
	gameType: GameType;
	nums: RoundRoll[];
}

export interface BaseRoom {
	roomCode: string;
	gameType: GameType;
	players: Players[];
}

export interface WaitingRoom extends BaseRoom {
	state: WaitingRoomStatus;
}

export interface MatchRoom extends BaseRoom {
	rules: GameRules;
	dices: Dices[];
	rolls: RollResult[];
	sum: Record<string, number>;
	turn: number;
}
