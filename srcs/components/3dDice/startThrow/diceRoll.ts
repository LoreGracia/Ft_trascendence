// TODO (BACKEND): estas funciones generaban el resultado en el cliente.
// Por seguridad, el valor real de la tirada llega del backend vía el evento
// "dice_rolled" del socket (ver components/3dDice/connect/useDiceSocket.ts).
// Se dejan aquí únicamente como fallback/mock para seguir probando la
// animación mientras el socket real no esté conectado.
// BORRAR este archivo (y su uso en ThrowDice.tsx) tras el merge con backend.

export function rollDice(sides: number = 6): number {
    return Math.floor(Math.random() * sides) + 1;
}

export function rollDiceWithMessage(sides: number = 6): number {
    const result = rollDice(sides);
    console.log(`Tirada del dado: ${result}`);
    return result;
}
