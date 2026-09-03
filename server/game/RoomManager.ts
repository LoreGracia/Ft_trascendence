import { WaitingRoom, Players, MatchRoom, GameType, BaseRoom } from "./GameTypes";
import { Socket, Server } from "socket.io";
import { matchRooms, turnTimeouts, waitingRooms } from "../sockets/index";

const SAFE_ALPHABET = "2345679ACEFHJKMNPRTUWXYZ" as const;
const TURN_TIME_LIMIT = 30000;

// export function reconnectPlayer(playerIdent: string, socket: Socket) {
// 	for (const room of waitingRooms.values()) {
// 		room.players.forEach((player, index) => {
// 			if (player.playerId === playerIdent)
// 				socket.
// 		})
// 	}
// }

export function generateRoomCode(length: number = 5): string {
	const bytes = new Uint8Array(length);
	crypto.getRandomValues(bytes);
	let code = '';
	for (let i = 0; i < length; i++) {
		code += SAFE_ALPHABET[bytes[i] % SAFE_ALPHABET.length];
	}
	return code;
}

export function createWaitingRoom(playerId: string, socketId: string, game: GameType): WaitingRoom {
	const room: WaitingRoom = {
		roomCode: generateRoomCode(),
		gameType: game,
		players: [{ playerId: playerId, socketId: socketId, state: "UNLOCKED" }],
		state: "OPEN",
	};
	return room;
}

export function addPlayerToRoom(playerId: string, socketId: string, room: WaitingRoom): boolean {
	if (room.state === "OPEN") {
		room.players.push({ playerId: playerId, socketId: socketId, state: "UNLOCKED" });
		console.log(`Room ${room.roomCode}: player ${playerId} joined on socket ${socketId}.`);
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
	room.players = room.players.filter(p => p.playerId !== playerId);
}

export function changePlayerStatus(room: WaitingRoom | MatchRoom, playerId: string): void {
	const player = room.players.find(p => p.playerId === playerId);
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

export function exitWaitingRoom(io: Server, socket: Socket, roomCode: string) {
	const room = waitingRooms.get(roomCode);
	if (!room) {
		console.log(`Room ${roomCode} no longer exists.`);
		return;
	}
	exitRoom(socket.data.userId, room);
	socket.leave(roomCode);
	console.log(`Room ${roomCode}: player ${socket.data.userId} left.`);
	if (room.players.length === 0) {
		waitingRooms.delete(roomCode);
		console.log(`Room ${roomCode}: room deleted.`);
	} else {
		io.to(roomCode).emit("player_joined", room);
	}
}

export function exitMatchRoom(io: Server, socket: Socket, roomCode: string) {
	const match = matchRooms.get(roomCode);
	if (match) {
		const currentPlayer = match.players[match.turn % match.players.length].playerId;
		exitRoom(socket.data.userId, match);
		socket.leave(roomCode);
		console.log(`Room ${roomCode}: player ${socket.data.userId} with socket ${socket.id} left.`);
		if (match.players.length === 0) {
			matchRooms.delete(roomCode);
			clearTurnTimeout(roomCode);
			console.log(`Room ${roomCode}: room deleted.`);
		} else if (match.rules.isGameWon(match)) {
			clearTurnTimeout(roomCode);
			matchRooms.delete(roomCode);
			io.to(roomCode).emit("match_won", { match });
		} else {
			if (socket.data.userId === currentPlayer) {
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
			io.to(roomCode).emit("match_won", { match, lastRoll: match.rolls[match.rolls.length - 1] });
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
