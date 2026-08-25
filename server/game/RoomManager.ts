import { WaitingRoom, Players, MatchRoom } from "./game-types";

const SAFE_ALPHABET = "2345679ACEFHJKMNPRTUWXYZ" as const;


export function generateRoomCode(length: number = 5): string {
	const bytes = new Uint8Array(length);
	crypto.getRandomValues(bytes);

	let code = '';

	for (let i = 0; i < length; i++) {
		code += SAFE_ALPHABET[bytes[i] % SAFE_ALPHABET.length];
	}
	return code;
}

export function createWaitingRoom(playerId: string): WaitingRoom {
	const room: WaitingRoom = {
		roomCode: generateRoomCode(),
		players: [{ id:playerId, state:"UNLOCKED" }],
		state: "OPEN",
	};
	return room;
}

export function addPlayerToRoom(playerId: string, room: WaitingRoom): boolean {
	if (room.state === "OPEN") {
		room.players.push({ id:playerId, state:"UNLOCKED" });
		console.log(`Room ${room.roomCode}: player ${playerId} joined.`);
		return true
	} else { 
		console.log("Room Closed."); // Esto se transformara a algun aviso a lore.
		return false;
	}
}

export function closeRoom(room: WaitingRoom): void {
	room.state = "CLOSED";
}

export function openRoom(room: WaitingRoom): void {
	room.state = "OPEN";
}

export function exitRoom(playerId: string, room: WaitingRoom) {
	room.players = room.players.filter(p => p.id !== playerId);
}

export function changePlayerStatus(room: WaitingRoom | MatchRoom, playerId: string): void {
	const player = room.players.find(p => p.id === playerId);
	if (!player) return ;
	player.state = player.state === "LOCKED" ? "UNLOCKED" : "LOCKED";
}

function countLockedPlayers(list: Players[]): number {
	let count: number = 0;
	for (let i = 0; i < list.length; ++i) {
		if (list[i].state === "LOCKED")
			count++;
	}
	return count;
}

export function validateLockedPlayers(room: WaitingRoom): boolean {
	if (room.players.length === countLockedPlayers(room.players))
		return true;
	return false;
}

export function advanceToUnlocked(match: MatchRoom): void {
	match.turn++;

	if (match.gameType === "ADD42") {
		let attempts = 0;
		while (
			match.players[match.turn % match.players.length].state === "LOCKED" && 
			attempts < match.players.length
		) {
			match.turn++;
			attempts++;
		}
	}
}