import { Players } from "./GameTypes"

export function countRepetitions(numbers: number[], target: number): number {
	return numbers.filter(num => num === target).length;
}

export function highestRollSum(sum: Record<string, number>): number {
	const scores = Object.values(sum);
	return Math.max(...scores);
}

export function allPlayersStand(players: Players[]): boolean {
	for (let i = 0; i < players.length; ++i)
		if (players[i].state != "LOCKED")
			return false;
	return true;
}

export function waitForSocketEvent(socket: any, eventName: string, timeoutMs: number): Promise<boolean> {
	return new Promise((resolve) => {
		const timer = setTimeout(() => {
			socket.off(eventName, listener);
			resolve(false);
		}, timeoutMs);

		const listener = () => {
			clearTimeout(timer);
			resolve(true);
		};

		socket.once(eventName, listener);
	});
}