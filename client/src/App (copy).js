import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:3001");

function App() {
	const [side, setSide] = useState("");
	const [roll, setRoll] = useState("");

	const [inputRoomCode, setInputRoomCode] = useState("");
	const [currentRoom, setCurrentRoom] = useState(null);
	const createRoom = () => {
		socket.emit("create_room");
	};

	const joinRoom = () => {
		if (inputRoomCode.trim() !== "") {
      socket.emit("join_room", inputRoomCode);
    }
	};

	const exitRoom = () => {
		if (currentRoom) {
			socket.emit("exit_room", currentRoom.roomCode);
      setCurrentRoom(null);
		}
	};

	const sendDice = () => {
		socket.emit("send_roll", side);
	};
  useEffect(() => {
    // Recibir resultado del dado
    socket.on("return_roll", (data) => {
      setRoll(data);
    });

    // Cuando creamos sala, recibimos el código y guardamos la info
    socket.on("room_created", (roomCode) => {
      setCurrentRoom({ roomCode, players: [socket.id] });
    });

    // Cuando nos unimos o alguien se une a la sala
    socket.on("player_joined", (roomData) => {
      setCurrentRoom(roomData);
    });

    // Limpieza de listeners al desmontar el componente
    return () => {
      socket.off("return_roll");
      socket.off("room_created");
      socket.off("player_joined");
    };
  }, []);

  return (
    <div 
      className="App"
      style={{ 
        backgroundColor: "black", 
        minHeight: "100vh", 
        color: "white", 
        padding: "20px" 
      }}
    >
      {/* SECCIÓN DE GESTIÓN DE SALAS */}
      <div style={{ border: "1px solid #444", padding: "15px", marginBottom: "20px", borderRadius: "8px" }}>
        <h2>Gestión de Salas</h2>

        {!currentRoom ? (
          /* Si NO estás en ninguna sala */
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button onClick={createRoom}>Crear Sala</button>

            <span style={{ margin: "0 10px" }}>|</span>

            <input 
              placeholder="Código de sala" 
              value={inputRoomCode}
              onChange={(e) => setInputRoomCode(e.target.value)}
            />
            <button onClick={joinRoom}>Unirse a Sala</button>
          </div>
        ) : (
          /* Si YA estás dentro de una sala */
          <div>
            <h3>SALA ACTIVA: <span style={{ color: "#00ffcc" }}>{currentRoom.roomCode}</span></h3>
            <p>Jugadores en la sala ({currentRoom.players?.length}):</p>
            <ul>
              {currentRoom.players?.map((id) => (
                <li key={id}>{id} {id === socket.id ? "(Tú)" : ""}</li>
              ))}
            </ul>
            <button onClick={exitRoom} style={{ backgroundColor: "#ff4444", color: "white" }}>
              Salir de la sala
            </button>
            {/* <button onClick={play_game(FreePlay)} style={{ backgroundColor: "#8c1fada3", color: "white" }}>Free Play</button>
            <button onClick={play_game(Add42)} style={{ backgroundColor: "#44ffbeaf", color: "white" }}>Add 42</button> */}
          </div>
        )}
      </div>

      {/* SECCIÓN DEL DADO */}
      <div style={{ border: "1px solid #444", padding: "15px", borderRadius: "8px" }}>
        <h2>Lanzador de Dados</h2>
        <input 
          placeholder="Set dice sides here." 
          onChange={(e) => setSide(e.target.value)}
        />
        <button onClick={sendDice}> Roll </button>
        <h1> Roll Result: {roll} </h1>
      </div>
    </div>
  );
}

export default App;
