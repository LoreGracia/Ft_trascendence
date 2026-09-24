import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import {
	MatchRoom,
	WaitingRoom,
	RollResult,
	GameType
} from "../game/GameTypes";
import {
	generateRoll,
	isPlayerTurn,
} from "../game/DiceGame";
import {
	createWaitingRoom,
	addPlayerToRoom,
	exitRoom,
	closeRoom,
	validateLockedPlayers,
	changePlayerStatus,
	advanceToUnlocked,
	exitWaitingRoom,
	exitMatchRoom,
	clearTurnTimeout,
	resetTurnTimeout,
} from "../game/RoomManager";
import { getGameFactory } from "../game/Product";
import { validateToken } from "./TokenValidation";
import { setEmptyGameDb, updateGameDb } from "../lib/user"

export const waitingRooms = new Map<string, WaitingRoom>();
export const matchRooms = new Map<string, MatchRoom>();
export const turnTimeouts = new Map<string, NodeJS.Timeout>();
export const disconnectionTimeouts = new Map<string, NodeJS.Timeout>();
const app = express();
const TIME_TO_DISCONNECT = 30000;

app.use(cors());

interface SocketData {
	userId: string;
	userName: string;
}

const server = http.createServer(app);
const io = new Server<any, any, any, SocketData>(server, {
	cors: {
		origin: process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

io.use(async (socket: Socket, next) => {
	const token = socket.handshake.auth?.token;
	if (!token)
		return next(new Error("Authentication error: Token missing"));
	try {
		const payload = await validateToken(token);
		const userId = payload.sub;
		const userName =
			typeof payload.name === "string" ? payload.name : "Jugador";
		const userImage = payload.image;

		if (typeof userId !== "string" || userId.length === 0) {
			return next(new Error("Authentication error: Invalid subject in token payload"));
		}
		socket.data.userId = userId;
		socket.data.userName = userName;
		socket.data.userImage = userImage;
		next();
	} catch (err) {
		return next(new Error("Authentication error: Invalid or expired token"));
	}
});

io.on("connection", (socket: Socket) => {

	if (disconnectionTimeouts.has(socket.data.userId)) {
		clearTimeout(disconnectionTimeouts.get(socket.data.userId));
		disconnectionTimeouts.delete(socket.data.userId);
	}
	for (const [roomCode, match] of matchRooms) {
		const player = match.players.find(p => p.playerId === socket.data.userId);
		if (player) {
			player.socketId = socket.id;
			player.userImage = socket.data.userImage;
			socket.join(roomCode);
			io.to(roomCode).emit("player_status_changed", match);
			break;
		}
	}
	for (const [roomCode, room] of waitingRooms) {
		const player = room.players.find(p => p.playerId === socket.data.userId);
		if (player) {
			player.socketId = socket.id;
			player.userImage = socket.data.userImage;
			socket.join(roomCode);
			io.to(roomCode).emit("player_joined", room);
			break;
		}
	}

	socket.on("create_room", (game: GameType) => {
		const newRoom = createWaitingRoom(socket.data.userId, socket.id, socket.data.userName, game);
		waitingRooms.set(newRoom.roomCode, newRoom);
		socket.join(newRoom.roomCode);
		socket.emit("room_created", newRoom);
	});

	socket.on("join_room", (roomCode: string) => {
		const room = waitingRooms.get(roomCode);
		if (room) {
			if (!addPlayerToRoom(socket.data.userId, socket.id, socket.data.userName, room))
				socket.emit("join_error");
			else {
				socket.join(roomCode);
				io.to(roomCode).emit("player_joined", room);
				if (room.players.length === 6)
					closeRoom(room);
			}
		} else
			socket.emit("join_error");
	});

	socket.on('get_room', (roomCode: string) => {
		const room = waitingRooms.get(roomCode);
		if (room) socket.emit('player_joined', room);
		const match = matchRooms.get(roomCode);
		if (match) socket.emit('player_status_changed', match);
	});

	// Waiting Room
	socket.on("exit_waiting_room", (roomCode: string) => {
		exitWaitingRoom(io, socket, roomCode);
	});

	socket.on("exit_match_room", (roomCode: string) => {
		exitMatchRoom(io, socket, roomCode);
	});

	socket.on("change_player_status", (roomCode: string, diceModel: string) => {
		const room = waitingRooms.get(roomCode);
		if (room) {
			changePlayerStatus(room, socket.data.userId, diceModel);
			io.to(roomCode).emit("player_status_changed", room);
		}
		else
			console.log("Room no longer exists.")
	});

	socket.on("start_game", async (roomCode: string) => {
		const room = waitingRooms.get(roomCode);
		if (room) {
			if (validateLockedPlayers(room)) {
				closeRoom(room);
				const factory = getGameFactory(room.gameType);
				const newMatch = factory.createMatch(room);
				matchRooms.set(newMatch.roomCode, newMatch);
				newMatch.matchDbId = await setEmptyGameDb(newMatch);
				io.to(roomCode).emit("game_started", newMatch)
				waitingRooms.delete(roomCode);
				resetTurnTimeout(io, newMatch.roomCode);
			}
			else
				io.to(roomCode).emit("game_not_started", room);
		}
	});

	socket.on("player_locked", (roomCode: string) => {
		const match = matchRooms.get(roomCode);
		const player = match?.players.find(p => p.playerId === socket.data.userId);
		if (match) {
			changePlayerStatus(match, socket.data.userId, player?.diceModel ?? 'default');
			io.to(roomCode).emit("player_status_changed", match);
			if (match.rules.isGameWon(match)) {
				clearTurnTimeout(roomCode);
				io.to(roomCode).emit("match_won", { match });
				updateGameDb(match);
				return;
			}
			advanceToUnlocked(match);
			io.to(roomCode).emit("player_status_changed", match);
			resetTurnTimeout(io, match.roomCode);
		}
	});

	socket.on("roll_dice", (roomCode: string) => {
		const match = matchRooms.get(roomCode);
		if (!match) {
			return;
		}
		if (!isPlayerTurn(match, socket.data.userId)) {
			socket.emit("error_turn", "Not your turn.");
			return;
		}
		const roll: RollResult = generateRoll(match, socket.data.userId);
		match.rolls.push(roll);

		match.rules.evaluateRoll(match, socket.data.userId);

		if (match.rules.isGameWon(match)) {
			clearTurnTimeout(roomCode);
			io.to(roomCode).emit("dice_rolled", { match, roll });
			io.to(roomCode).emit("match_won", { match, lastRoll: roll });
			updateGameDb(match);
			return;
		}
		advanceToUnlocked(match);
		io.to(roomCode).emit("dice_rolled", { match, roll });
		resetTurnTimeout(io, match.roomCode);
	});

	socket.on("disconnect", (reason: string) => {
		const userId = socket.data.userId;

		if (!userId) return;

		if (disconnectionTimeouts.has(userId)) {
			clearTimeout(disconnectionTimeouts.get(userId));
			disconnectionTimeouts.delete(userId);
		}

		const roomTargets = [
			{ map: waitingRooms, exitFn: exitWaitingRoom },
			{ map: matchRooms, exitFn: exitMatchRoom }
		];

		for (const { map, exitFn } of roomTargets) {
			for (const [roomCode, room] of map.entries()) {
				if (room.players.some(p => p.playerId === userId)) {
					const timeout = setTimeout(() => {
						const player = map.get(roomCode)?.players.find(p => p.playerId === userId);
						if (player?.socketId === socket.id) {
							exitFn(io, socket, roomCode);
						}
						disconnectionTimeouts.delete(userId);
					}, TIME_TO_DISCONNECT);
					disconnectionTimeouts.set(userId, timeout);
					return;
				}
			}
		}
	});
});

server.listen(3001, () => {
	console.log("Fuck u.");
});