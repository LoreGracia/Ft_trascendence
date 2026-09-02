import { WaitingRoom, MatchRoom, RollResult, RoundRoll, Dices } from "./GameTypes";
import { GameRules } from "./Product"

const MIN_RAND = 1;

export function randomRollFromInterval(max: number) {
	return Math.floor(Math.random() * (max - MIN_RAND + 1) + MIN_RAND);
}

export function createMatchRoom(room: WaitingRoom, rules: GameRules): MatchRoom {
	const shuffledPlayers = [...room.players].sort(() => Math.random() - 0.5);
	shuffledPlayers.forEach(p => (p.state = "UNLOCKED"));

	const initialSum: Record<string, number> = {};
	shuffledPlayers.forEach(p => (initialSum[p.playerId] = 0));

	return {
		roomCode: room.roomCode,
		gameType: room.gameType,
		players: shuffledPlayers,
		rules: rules,
		dices: [Dices.d6],
		rolls: [],
		sum: initialSum,
		turn: 0,
	};
}

function doRoll(room: MatchRoom, playerIdent: string): RoundRoll[] {
	const allTurnRolls: RoundRoll[] = [];
	for (let i = 0; i < room.dices.length; i++) {
		const singleRoll: RoundRoll = {
			diceType: room.dices[i],
			value: randomRollFromInterval(room.dices[i])
		};
		allTurnRolls.push(singleRoll);
		updateSum(room, playerIdent, singleRoll.value);
	}
	return allTurnRolls;
}

export function generateRoll(match: MatchRoom, playerIdent: string): RollResult {
	return {
		idPlayer: playerIdent,
		gameType: match.gameType,
		nums: doRoll(match, playerIdent),
	};
}

function updateSum(room: MatchRoom, playerId: string, toAdd: number) {
	const prev: number = room.sum[playerId] ?? 0;
	room.sum[playerId] = prev + toAdd;
}

export function isPlayerTurn(match: MatchRoom, playerIdent: string): boolean {
	const currentPlayer = match.players[match.turn % match.players.length];
	if (currentPlayer.playerId !== playerIdent) {
		console.log(`Room ${match.roomCode}: player ${playerIdent} not your turn.`);
		return false;
	}
	if (match.gameType != "FREE_PLAY" && currentPlayer.state === "LOCKED") {
		console.log(`Room ${match.roomCode}: player ${playerIdent} passed.`);
		return false;
	}
	return true;
}

export function isPlayerBusted(match: MatchRoom, playerIdent: string) {
	const player = match.players.find(p => p.playerId === playerIdent)!;
	const playerSum = match.sum[playerIdent] ?? 0;
	if (playerSum > 42)
		player.state = "LOCKED";
}