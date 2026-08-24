import Reacr from 'react';

function JoinRoom() {
  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white", padding: "20px" }}>
      <h1>Unirse a una Sala</h1>
      <p>Introduce el código de la sala a la que te quieres unir:</p>
      
      <input type="text" placeholder="Código de sala" />
      <button>Entrar</button>
    </div>
  );
}

export default JoinRoom;