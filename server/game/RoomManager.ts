import { WaitingRoom, Players, MatchRoom, GameType } from "./GameTypes";
import { Socket, Server } from "socket.io";
import { matchRooms, turnTimeouts } from "../sockets/index";

const SAFE_ALPHABET = "2345679ACEFHJKMNPRTUWXYZ" as const;
const TURN_TIME_LIMIT = 30000;


export function generateRoomCode(length: number = 5): string {
	const bytes = new Uint8Array(length);
	crypto.getRandomValues(bytes);
	let code = '';
	for (let i = 0; i < length; i++) {
		code += SAFE_ALPHABET[bytes[i] % SAFE_ALPHABET.length];
	}
	return code;
}

export function createWaitingRoom(playerId: string, game: GameType): WaitingRoom {
	const room: WaitingRoom = {
		roomCode: generateRoomCode(),
		gameType: game,
		players: [{ id: playerId, state: "UNLOCKED" }],
		state: "OPEN",
	};
	return room;
}

export function addPlayerToRoom(playerId: string, room: WaitingRoom): boolean {
	if (room.state === "OPEN") {
		room.players.push({ id: playerId, state: "UNLOCKED" });
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

export function exitRoom(playerId: string, room: WaitingRoom | MatchRoom) {
	room.players = room.players.filter(p => p.id !== playerId);
}

export function changePlayerStatus(room: WaitingRoom | MatchRoom, playerId: string): void {
	const player = room.players.find(p => p.id === playerId);
	if (!player) return;
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

	let attempts = 0;
	while (
		match.players[match.turn % match.players.length].state === "LOCKED" &&
		attempts < match.players.length
	) {
		match.turn++;
		attempts++;
	}
}

export function exitMatchRoom(io: Server, socket: Socket, roomCode: string) {
	const match = matchRooms.get(roomCode);
	if (match) {
		const currentPlayer = match.players[match.turn % match.players.length].id;
		exitRoom(socket.id, match);
		socket.leave(roomCode);
		console.log(`Room ${roomCode}: player ${socket.id} left.`);
		if (match.players.length === 0) {
			matchRooms.delete(roomCode);
			clearTurnTimeout(roomCode);
			console.log(`Room ${roomCode}: room deleted.`);
		} else if (match.rules.isGameWon(match)) {
			clearTurnTimeout(roomCode);
			matchRooms.delete(roomCode);
			io.to(roomCode).emit("match_won", { match });
		} else {
			if (socket.id === currentPlayer) {
				clearTurnTimeout(roomCode);
				advanceToUnlocked(match);
			}
			resetTurnTimeout(io, roomCode);
			io.to(roomCode).emit("player_status_changed", match);
		}
	}
	else
		console.log("Room no longer exists.")
}

export function resetTurnTimeout(io: Server, roomCode: string) {
	clearTurnTimeout(roomCode);
	const match = matchRooms.get(roomCode);
	if (!match) return;

	const timeout = setTimeout(() => {
		match.players[match.turn % match.players.length].state = "LOCKED";
		advanceToUnlocked(match);
		io.to(roomCode).emit("turn_timeout", { match });
		io.to(roomCode).emit("player_status_changed", match);
		if (match.rules.isGameWon(match)) {
			io.to(roomCode).emit("match_won", { match, lastRoll: match.rolls[match.rolls.length] });
			clearTurnTimeout(roomCode);
			matchRooms.delete(roomCode);
			return;
		}
	}, TURN_TIME_LIMIT);
	turnTimeouts.set(roomCode, timeout);
}

export function clearTurnTimeout(roomCode: string) {
	if (turnTimeouts.has(roomCode)) {
		clearTimeout(turnTimeouts.get(roomCode)!);
		turnTimeouts.delete(roomCode);
	}
}
