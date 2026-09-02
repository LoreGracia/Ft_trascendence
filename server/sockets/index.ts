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
	exitMatchRoom,
	clearTurnTimeout,
	resetTurnTimeout
} from "../game/RoomManager";
import { getGameFactory } from "../game/Product";
import { validateToken } from "./TokenValidation";

const waitingRooms = new Map<string, WaitingRoom>();
export const matchRooms = new Map<string, MatchRoom>();
export const turnTimeouts = new Map<string, NodeJS.Timeout>();
const app = express();
// const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

io.use(async (socket: Socket, next) => {
	const token = socket.handshake.auth?.token;
	if (!token)
		return next(new Error("Authentication error: Token missing"));
	try {
		const payload = await validateToken(token);
		socket.data.userId = payload.id;
		next();
	} catch (err) {
		next(new Error("Authentication error: Token missing"));
	}
});

io.on("connection", (socket: Socket) => {
	console.log(`${socket.id} has accessed the server.`);

	socket.on("create_room", (game: GameType) => {
		const newRoom = createWaitingRoom(socket.data.userId, socket.id, game);
		waitingRooms.set(newRoom.roomCode, newRoom);
		socket.join(newRoom.roomCode);
		socket.emit("room_created", newRoom.roomCode);
		console.log(`Room ${newRoom.roomCode}: created by player ${socket.data.userId}`);
	});

	socket.on("join_room", (roomCode: string) => {
		const room = waitingRooms.get(roomCode);
		if (room) {
			if (!addPlayerToRoom(socket.data.userId, socket.id, room))
				socket.emit("join_error");
			else {
				socket.join(roomCode);
				io.to(roomCode).emit("player_joined", room);
				if (room.players.length === 6)
					closeRoom(room);
			}
		} else {
			console.log("Invalid Room.");
			socket.emit("join_error");
		}
	});

	socket.on('get_room', (roomCode: string) => {
		const room = waitingRooms.get(roomCode);
		if (room) socket.emit('player_joined', room);
		const match = matchRooms.get(roomCode);
		if (match) socket.emit('player_status_changed', match);
	});

	// Waiting Room
	socket.on("exit_waiting_room", (roomCode: string) => {
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
	});

	socket.on("exit_match_room", (roomCode: string) => {
		exitMatchRoom(io, socket, roomCode);
	});

	// Per passar de locked a unlocked.
	socket.on("change_player_status", (roomCode: string) => {
		const room = waitingRooms.get(roomCode);
		if (room) {
			changePlayerStatus(room, socket.data.userId);
			io.to(roomCode).emit("player_status_changed", room);
			console.log(`Room ${room.roomCode}: player ${socket.data.userId} with socket ${socket.id} locked.`);
		}
		else
			console.log("Room no longer exists.")
	});

	socket.on("start_game", (roomCode: string) => {
		const room = waitingRooms.get(roomCode);
		if (room) {
			if (validateLockedPlayers(room)) {
				closeRoom(room);
				const factory = getGameFactory(room.gameType);
				const newMatch = factory.createMatch(room);
				matchRooms.set(newMatch.roomCode, newMatch);
				io.to(roomCode).emit("game_started", newMatch)
				waitingRooms.delete(roomCode);
				// send initial game data to db.
				resetTurnTimeout(io, newMatch.roomCode);
			}
			else {
				io.to(roomCode).emit("game_not_started", room);
				console.log(`Room ${roomCode}: not all players are locked.`);
			}
		}
	});

	socket.on("player_locked", (roomCode: string) => {
		const match = matchRooms.get(roomCode);
		if (match) {
			changePlayerStatus(match, socket.data.userId);
			io.to(roomCode).emit("player_status_changed", match);
			if (match.rules.isGameWon(match)) {
				clearTurnTimeout(roomCode);
				matchRooms.delete(roomCode);
				io.to(roomCode).emit("match_won", { match });
				return;
			}
			console.log(`Room ${match.roomCode}: player ${socket.data.userId} with socket ${socket.id} locked.`);
			advanceToUnlocked(match);
			io.to(roomCode).emit("player_status_changed", match);
			resetTurnTimeout(io, match.roomCode);
		}
	});

	socket.on("roll_dice", (roomCode: string) => {
		const match = matchRooms.get(roomCode);
		if (!match) {
			console.log("Incorrect Match.")
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
			matchRooms.delete(roomCode);
			io.to(roomCode).emit("dice_rolled", { match, roll });
			io.to(roomCode).emit("match_won", { match, lastRoll: roll });
			return;
		}
		advanceToUnlocked(match);
		io.to(roomCode).emit("dice_rolled", { match, roll });
		resetTurnTimeout(io, match.roomCode);
	});

	socket.on("disconnect", (reason: string) => {
		console.log(`Player ${socket.data.userId} with socket ${socket.id} desconected. Reason: ${reason}`);
		for (const [roomCode, match] of matchRooms.entries()) {
			if (match.players.some(p => p.playerId === socket.data.userId)) {
				exitMatchRoom(io, socket, roomCode);
				break;
			}
		}
	});
});

server.listen(3001, () => {
	console.log("Fuck u.");
});