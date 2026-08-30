export type GameType = "FREE_PLAY" | "ADD42"
export type WaitingRoomStatus = "OPEN" | "CLOSED";
export type PLAYER_STATE = "LOCKED" | "UNLOCKED";
export type PLAYER_ENDGAME = "WIN" | "LOSE" | "TIE";

export interface Players {
	id:		string;
	state:	PLAYER_STATE | PLAYER_ENDGAME;
}

export interface WaitingRoom {
	roomCode:	string;
	players:	Players[];
	state:		WaitingRoomStatus;
	gameType:	GameType;
}

export enum Dices { 
	d6 = 6,
}

export interface RoundRoll {
	diceType:	Dices;
	value:		number;
}

export interface RollResult {
	idPlayer:	string;
	gameType:	GameType;
	nums:		RoundRoll[];
}

export interface MatchRoom {
	roomCode:	string;
	gameType:	GameType;
	players:	Players[];
	dices:		Dices[];
	rolls:		RollResult[];
	sum:		Record<string, number>;
	turn:		number;
}