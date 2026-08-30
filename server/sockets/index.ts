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

const waitingRooms = new Map<string, WaitingRoom>();
export const matchRooms = new Map<string, MatchRoom>();
export const turnTimeouts = new Map<string, NodeJS.Timeout>();
const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket: Socket) => {
	console.log(`${socket.id} has accessed the server.`);

	socket.on("create_room", (game: GameType) => {
		const newRoom = createWaitingRoom(socket.id, game);
		waitingRooms.set(newRoom.roomCode, newRoom);
		socket.join(newRoom.roomCode);
		socket.emit("room_created", newRoom.roomCode);
		console.log(`Room ${newRoom.roomCode}: created by player ${socket.id}`);
	});

	socket.on("join_room", (roomCode: string) => {
		const room = waitingRooms.get(roomCode);
		if (room) {
			if (!addPlayerToRoom(socket.id, room))
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
		if (room) {
			exitRoom(socket.id, room);
			socket.leave(roomCode);
			console.log(`Room ${roomCode}: player ${socket.id} left.`);
			if (room.players.length === 0) {
				waitingRooms.delete(roomCode);
				console.log(`Room ${roomCode}: room deleted.`);
			} else
				io.to(roomCode).emit("player_joined", room);
		}
		else
			console.log("Room no longer exists.")
	});

	socket.on("exit_match_room", (roomCode: string) => {
		exitMatchRoom(io, socket, roomCode);
	});

	// Per passar de locked a unlocked.
	socket.on("change_player_status", (roomCode: string) => {
		const room = waitingRooms.get(roomCode);
		if (room) {
			changePlayerStatus(room, socket.id);
			io.to(roomCode).emit("player_status_changed", room);
			console.log(`Room ${room.roomCode}: player ${socket.id} locked.`);
		}
		else
			console.log("Room no longer exists.")
	});

	socket.on("start_game", (roomCode: string) => {
		const room = waitingRooms.get(roomCode);
		if (room) {
			if (validateLockedPlayers(room)) {
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
			changePlayerStatus(match, socket.id);
			io.to(roomCode).emit("player_status_changed", match);
			if (match.rules.isGameWon(match)) {
				clearTurnTimeout(roomCode);
				matchRooms.delete(roomCode);
				io.to(roomCode).emit("match_won", { match });
				return;
			}
			console.log(`Room ${match.roomCode}: player ${socket.id} locked.`);
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
		if (!isPlayerTurn(match, socket.id)) {
			socket.emit("error_turn", "Not your turn.");
			return;
		}
		const roll: RollResult = generateRoll(match, socket.id);
		match.rolls.push(roll);

		match.rules.evaluateRoll(match, socket.id);

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
		console.log(`Socket ${socket.id} desconected. Reason: ${reason}`);
		for (const [roomCode, match] of matchRooms.entries()) {
			if (match.players.some(p => p.id === socket.id)) {
				exitMatchRoom(io, socket, roomCode);
				break;
			}
		}
	});
});

server.listen(3001, () => {
	console.log("Fuck u.");
});