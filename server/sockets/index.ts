import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { MatchRoom, WaitingRoom, RollResult, GameType } from "../game/game-types";
import { createMatch, generateRoll, isPlayerTurn, isGameWon, isPlayerBusted } from "../game/DiceGame";
import { 
	createWaitingRoom, 
	addPlayerToRoom, 
	exitRoom, 
	closeRoom,
	validateLockedPlayers,
	changePlayerStatus,
	advanceToUnlocked,
} from "../game/RoomManager"

const waitingRooms = new Map<string, WaitingRoom>();
const matchRooms = new Map<string, MatchRoom>();
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

	// Pantalla Inicial
	socket.on("create_room", () => {
		const newRoom = createWaitingRoom(socket.id);
		waitingRooms.set(newRoom.roomCode, newRoom);
		socket.join(newRoom.roomCode);
		socket.emit("room_created", newRoom.roomCode);
		console.log(`Room ${newRoom.roomCode}: created by player ${socket.id}`);
	});

	socket.on("join_room", (roomCode: string) => {
		const room = waitingRooms.get(roomCode);
		if(room) {
			if (!addPlayerToRoom(socket.id, room))
				socket.emit("join_error");
			else {
				socket.join(roomCode);
				io.to(roomCode).emit("player_joined", room);
				if (room.players.length === 6)
					closeRoom(room);
			}
		} else {
			console.log("Invalid Room."); // Esto se transformara a algun aviso a lore.
			socket.emit("join_error");
		}
	});

	// Waiting Room Or Match Room
	socket.on("exit_room", (roomCode: string) => {
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

	// Per passar de locked a unlocked.
	socket.on("change_player_status", (roomCode: string) => {
		const room = waitingRooms.get(roomCode);
		if (room) {
			changePlayerStatus(room, socket.id);
			io.to(roomCode).emit("player_status_changed", room);
			console.log(`Room ${room.roomCode}: player ${socket.id} locked.`);
		}
		// else
		// 	error
	});

	socket.on("start_game", (gameType: GameType, roomCode: string) => {
		const room = waitingRooms.get(roomCode);
		if (room) {
			if (validateLockedPlayers(room)) {
				const newMatch = createMatch(gameType, room);
				matchRooms.set(newMatch.roomCode, newMatch);
				// newMatch.players[0].state = "UNLOCKED";
				io.to(roomCode).emit("game_started", newMatch)
				waitingRooms.delete(roomCode);
				// send initial game data to db.

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
			if (isGameWon(match)) {
				io.to(roomCode).emit("match_won", { match });
				return;
			}
			console.log(`Room ${match.roomCode}: player ${socket.id} locked.`); //Block buttons from here. He cant play anymore.
			advanceToUnlocked(match);
			io.to(roomCode).emit("player_status_changed", match);
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
		if (match.gameType == "ADD42")
			isPlayerBusted(match, socket.id);
		if (isGameWon(match)) {
			io.to(roomCode).emit("dice_rolled", { match, roll });
			io.to(roomCode).emit("match_won", { match, lastRoll: roll });
			return;
		} 
		advanceToUnlocked(match);
		io.to(roomCode).emit("dice_rolled", { match, roll });
	});


});

server.listen(3001, () => {
	console.log("Fuck u.");
});