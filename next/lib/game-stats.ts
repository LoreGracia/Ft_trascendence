export interface GameStat {
	gameType: 'FREE_PLAY' | 'ADD42'
	gamesPlayed: number
	wins: number
	losses: number
	ties: number
	totalPoints: number
};

export const DEFAULT_STATS: GameStat[] = [
	{ gameType: "FREE_PLAY", gamesPlayed: 0, wins: 0, losses: 0, ties: 0, totalPoints: 0 },
	{ gameType: "ADD42",     gamesPlayed: 0, wins: 0, losses: 0, ties: 0, totalPoints: 0 },
];