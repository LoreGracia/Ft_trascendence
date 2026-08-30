import { WaitingRoom, MatchRoom, GameType, RollResult, RoundRoll, Dices, Players } from "./game-types";

const MIN_RAND = 1;

export function randomRollFromInterval(max: number) {
	return Math.floor(Math.random() * (max - MIN_RAND + 1) + MIN_RAND);
}

function shuffle(original: Players[]): Players[] {
	const shuffled: Players[] = [...original];

	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}

	return shuffled;
}

function initSum(players: Players[]): Record<string, number> {
	const res : Record<string, number> = {};
	for (const player of players) {
		res[player.id] = 0;
	}
	return res;
}

export function createMatch(gameType: GameType, room: WaitingRoom): MatchRoom { 
	const newOrder = shuffle(room.players);
	for (const player of newOrder)
		player.state = "UNLOCKED";
	return {
		roomCode:	room.roomCode,
		gameType:	room.gameType,
		players:	newOrder,
		dices:		[Dices.d6],
		rolls:		[],
		sum:		initSum(newOrder),
		turn:		0,
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

function highestRollSum(sum: Record<string, number>): number {
	const scores = Object.values(sum);
	return Math.max(...scores);
}

function countRepetitions(numbers: number[], target: number): number {
  return numbers.filter(num => num === target).length;
}

function updateStateToEndgame(match: MatchRoom, winScore: number) {
	const scores = Object.values(match.sum);
	const reps = countRepetitions(scores, winScore);
	for (const player of match.players) {
		const playerScore = match.sum[player.id] ?? 0;

		if (playerScore != winScore)
			player.state = "LOSE";
		else if (reps > 1)
			player.state = "TIE";
		else
			player.state = "WIN";
	}
}

function verifyFreePlayWin(match: MatchRoom): boolean {
	if (match.turn + 1 >= match.players.length) {
		updateStateToEndgame(match, highestRollSum(match.sum));
		return true;
	}
	return false;
}

function allPlayersStand(players: Players[]): boolean {
	for (let i = 0; i < players.length; ++i)
		if (players[i].state != "LOCKED")
			return false;
	return true;
}

function findClosestTo42(sum: Record<string, number>): number {
	let max: number = -1;

	for (const score of Object.values(sum)) {
		if (score <= 42 && score > max) {
			max = score;
		}
	}
	return max;
}

function verifyAdd42Win(match: MatchRoom): boolean {
	const scores: number[] = Object.values(match.sum); 
	if (scores.includes(42)) {
		updateStateToEndgame(match, 42);
		return true;
	} else if (allPlayersStand(match.players)) {
		updateStateToEndgame(match, findClosestTo42(match.sum));
		return true;
	}
	return false;
}

export function isGameWon(match: MatchRoom): boolean {
	switch (match.gameType) {
		case "FREE_PLAY":
			return verifyFreePlayWin(match);
		case "ADD42":
			return verifyAdd42Win(match);
		default:
			console.log("Naughty, naughty... you shouldnt be here: isGameWon");
			return false;
		}
}