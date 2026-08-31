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
	shuffledPlayers.forEach(p => (initialSum[p.id] = 0));

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

function doRoll(room: MatchRoom, playerId: string): RoundRoll[] {
	const allTurnRolls: RoundRoll[] = [];
	for (let i = 0; i < room.dices.length; i++) {
		const singleRoll: RoundRoll = {
			diceType: room.dices[i],
			value: randomRollFromInterval(room.dices[i])
		};
		allTurnRolls.push(singleRoll);
		updateSum(room, playerId, singleRoll.value);
	}
	return allTurnRolls;
}

export function generateRoll(match: MatchRoom, playerId: string): RollResult {
	return {
		idPlayer: playerId,
		gameType: match.gameType,
		nums: doRoll(match, playerId),
	};
}

function updateSum(room: MatchRoom, playerId: string, toAdd: number) {
	const prev: number = room.sum[playerId] ?? 0;
	room.sum[playerId] = prev + toAdd;
}

export function isPlayerTurn(match: MatchRoom, playerId: string): boolean {
	const currentPlayer = match.players[match.turn % match.players.length];
	if (currentPlayer.id !== playerId) {
		console.log(`Room ${match.roomCode}: player ${playerId} not your turn.`);
		return false;
	}
	if (match.gameType != "FREE_PLAY" && currentPlayer.state === "LOCKED") {
		console.log(`Room ${match.roomCode}: player ${playerId} passed.`);
		return false;
	}
	return true;
}

export function isPlayerBusted(match: MatchRoom, playerId: string) {
	const player = match.players.find(p => p.id === playerId)!;
	const playerSum = match.sum[playerId] ?? 0;
	if (playerSum > 42)
		player.state = "LOCKED";
}

// function allDicesToZero(match: MatchRoom): RoundRoll[] {
// 	const allTurnRolls: RoundRoll[] = [];
// 	for (let i = 0; i < match.dices.length; i++) {
// 		const singleRoll: RoundRoll = {
// 			diceType: match.dices[i],
// 			value: 0
// 		}
// 		allTurnRolls.push(singleRoll);
// 	}
// 	return allTurnRolls;
// }

// export function generateEmptyRoll(match: MatchRoom): RollResult {
// 	const roll: RollResult = {
// 		idPlayer: match.players[match.turn % match.players.length].id,
// 		gameType: match.gameType,
// 		nums: allDicesToZero(match),
// 	}
// 	return roll;
// }