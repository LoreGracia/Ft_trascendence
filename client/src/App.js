import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from "react";

// Conexión única con el backend
const socket = io.connect("http://localhost:3001");

function App() {
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [waitingRoom, setWaitingRoom] = useState(null);
  const [matchRoom, setMatchRoom] = useState(null);
  const [lastRoll, setLastRoll] = useState(null);
  const [winnerMessage, setWinnerMessage] = useState("");

  // --- HANDLERS (EMISORES DE EVENTOS) ---
  const createRoom = () => socket.emit("create_room");
  
  const joinRoom = () => {
    if (roomCodeInput.trim()) socket.emit("join_room", roomCodeInput);
  };

  const exitRoom = () => {
    const code = waitingRoom?.roomCode || matchRoom?.roomCode;
    if (code) {
      socket.emit("exit_room", code);
      setWaitingRoom(null);
      setMatchRoom(null);
      setLastRoll(null);
      setWinnerMessage("");
    }
  };

  const toggleReadyStatus = () => {
    if (waitingRoom) socket.emit("change_player_status", waitingRoom.roomCode);
  };

  const startGame = (gameType) => {
    if (waitingRoom) socket.emit("start_game", gameType, waitingRoom.roomCode);
  };

  const rollDice = () => {
    if (matchRoom) socket.emit("roll_dice", matchRoom.roomCode);
  };

  const standPlayer = () => {
    if (matchRoom) socket.emit("player_locked", matchRoom.roomCode);
  };

  // --- HELPER PARA EXTRAER PUNTUACIÓN DE MAP O OBJETO ---
  const getPlayerScore = (sumData, playerId) => {
    if (!sumData) return 0;
    // Si viene como Map serializado de JS o como Objeto literal JSON
    if (sumData instanceof Map) return sumData.get(playerId) ?? 0;
    if (typeof sumData === 'object') return sumData[playerId] ?? 0;
    return 0;
  };

  // --- LISTENERS (LISTENERS DE SOCKET.IO) ---
  useEffect(() => {
    socket.on("room_created", (code) => {
      setWaitingRoom({ roomCode: code, players: [{ id: socket.id, state: "UNLOCKED" }] });
    });

    socket.on("player_joined", (roomData) => setWaitingRoom(roomData));
    socket.on("player_status_changed", (data) => {
      if (data.gameType) setMatchRoom(data);
      else setWaitingRoom(data);
    });

    socket.on("game_started", (matchData) => {
      setWaitingRoom(null);
      setMatchRoom(matchData);
    });

    socket.on("dice_rolled", ({ match, roll }) => {
      setMatchRoom(match);
      setLastRoll(roll);
    });

    socket.on("match_won", (data) => {
      // Protección contra undefined
      if (!data) return;

      const finalMatch = data.match || data;
      if (!finalMatch || !finalMatch.players) return;

      if (data.lastRoll) setLastRoll(data.lastRoll);
      setMatchRoom(finalMatch);
      
      const me = finalMatch.players.find(p => p.id === socket.id);
      if (me?.state === "WIN") setWinnerMessage("🎉 ¡HAS GANADO!");
      else if (me?.state === "TIE") setWinnerMessage("🤝 ¡EMPATE!");
      else setWinnerMessage("💀 HAS PERDIDO");
  });

    socket.on("join_error", () => alert("No se pudo unirse a la sala."));
    socket.on("game_not_started", () => alert("Todos los jugadores deben estar en estado LOCKED/listos."));
    socket.on("error_turn", (msg) => alert(msg));

    return () => {
      socket.off("room_created");
      socket.off("player_joined");
      socket.off("player_status_changed");
      socket.off("game_started");
      socket.off("dice_rolled");
      socket.off("match_won");
      socket.off("join_error");
      socket.off("game_not_started");
      socket.off("error_turn");
    };
  }, []);

  const isMyTurn = matchRoom 
    ? matchRoom.players[matchRoom.turn % matchRoom.players.length]?.id === socket.id 
    : false;

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "white", padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🎲 Dice Game Tester</h1>
      <p><small>Tu Socket ID: <code>{socket.id}</code></small></p>

      {/* 1. LOBBY INICIAL */}
      {!waitingRoom && !matchRoom && (
        <div style={{ border: "1px solid #444", padding: "15px", borderRadius: "8px" }}>
          <h2>Unirse o Crear Sala</h2>
          <button onClick={createRoom} style={{ padding: "8px 16px", cursor: "pointer" }}>Crear Sala</button>
          <hr style={{ margin: "15px 0", borderColor: "#333" }} />
          <input 
            placeholder="Código de sala" 
            value={roomCodeInput} 
            onChange={(e) => setRoomCodeInput(e.target.value)} 
            style={{ padding: "8px", marginRight: "10px" }}
          />
          <button onClick={joinRoom} style={{ padding: "8px 16px", cursor: "pointer" }}>Unirse</button>
        </div>
      )}

      {/* 2. SALA DE ESPERA */}
      {waitingRoom && !matchRoom && (
        <div style={{ border: "1px solid #00a8ff", padding: "15px", borderRadius: "8px" }}>
          <h2>Sala de Espera: <span style={{ color: "#00a8ff" }}>{waitingRoom.roomCode}</span></h2>
          <h3>Jugadores ({waitingRoom.players.length}):</h3>
          <ul>
            {waitingRoom.players.map(p => (
              <li key={p.id}>
                {p.id} {p.id === socket.id ? " (Tú)" : ""} ➡️ <b>{p.state}</b>
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button onClick={toggleReadyStatus} style={{ backgroundColor: "#e1b12c", padding: "8px" }}>
              Cambiar Estado (Listo / No listo)
            </button>
            <button onClick={() => startGame("FREE_PLAY")} style={{ backgroundColor: "#44bd32", color: "white", padding: "8px" }}>
              Iniciar FREE_PLAY
            </button>
            <button onClick={() => startGame("ADD42")} style={{ backgroundColor: "#8c7ae6", color: "white", padding: "8px" }}>
              Iniciar ADD42
            </button>
            <button onClick={exitRoom} style={{ backgroundColor: "#c23616", color: "white", padding: "8px" }}>
              Salir
            </button>
          </div>
        </div>
      )}

      {/* 3. PARTIDA EN CURSO */}
      {matchRoom && (
        <div style={{ border: "1px solid #44bd32", padding: "15px", borderRadius: "8px" }}>
          <h2>Partida: {matchRoom.roomCode} | Modo: <span style={{ color: "#fbc531" }}>{matchRoom.gameType}</span></h2>
          
          {winnerMessage && (
            <div style={{ backgroundColor: "#27ae60", color: "white", padding: "15px", borderRadius: "5px", fontSize: "20px", marginBottom: "15px" }}>
              {winnerMessage}
            </div>
          )}

          <h3>Turno de: <span style={{ color: isMyTurn ? "#44bd32" : "#e74c3c" }}>
            {matchRoom.players[matchRoom.turn % matchRoom.players.length]?.id} {isMyTurn ? "(¡TU TURNO!)" : ""}
          </span></h3>

          {/* TABLA DE PUNTUACIONES Y SUMA TOTAL */}
          <div style={{ backgroundColor: "#1e1e1e", padding: "10px", borderRadius: "6px", margin: "15px 0" }}>
            <h3>📊 SUMA TOTAL DE RESULTADOS:</h3>
            <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #444" }}>
                  <th style={{ padding: "8px" }}>Jugador</th>
                  <th style={{ padding: "8px" }}>Suma Total Acumulada</th>
                  <th style={{ padding: "8px" }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {matchRoom.players.map(p => {
                  const totalScore = getPlayerScore(matchRoom.sum, p.id);
                  return (
                    <tr key={p.id} style={{ borderBottom: "1px solid #333" }}>
                      <td style={{ padding: "8px" }}>
                        {p.id} {p.id === socket.id ? " (Tú)" : ""}
                      </td>
                      <td style={{ padding: "8px", fontSize: "18px", color: "#00ffcc" }}>
                        <b>{totalScore} pts</b>
                      </td>
                      <td style={{ padding: "8px" }}>{p.state}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ACCIONES */}
          <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
            <button 
              onClick={rollDice} 
              disabled={!isMyTurn || !!winnerMessage}
              style={{ padding: "12px 24px", fontSize: "16px", backgroundColor: isMyTurn ? "#44bd32" : "#555", color: "white", cursor: isMyTurn ? "pointer" : "not-allowed" }}
            >
              🎲 Tirar Dados
            </button>

            {matchRoom.gameType === "ADD42" && (
              <button 
                onClick={standPlayer} 
                disabled={!isMyTurn || !!winnerMessage}
                style={{ padding: "12px 24px", fontSize: "16px", backgroundColor: "#e67e22", color: "white" }}
              >
                ✋ Plantarse (Lock)
              </button>
            )}

            <button onClick={exitRoom} style={{ backgroundColor: "#c23616", color: "white" }}>
              Salir de la partida
            </button>
          </div>

          {/* ÚLTIMA TIRADA Y SUMA DE ESA TIRADA */}
          {lastRoll && (
            <div style={{ background: "#222", padding: "12px", borderRadius: "5px", borderLeft: "4px solid #00a8ff" }}>
              <h4>Último movimiento ({lastRoll.idPlayer}):</h4>
              <p>
                Dados sacados: {lastRoll.nums.map((d, idx) => (
                  <span key={idx} style={{ backgroundColor: "#333", padding: "4px 8px", borderRadius: "4px", marginRight: "5px" }}>
                    <b>[{d.value}]</b>
                  </span>
                ))}
              </p>
              <p>
                Suma de este turno: <b>+{lastRoll.nums.reduce((acc, d) => acc + d.value, 0)} pts</b>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;