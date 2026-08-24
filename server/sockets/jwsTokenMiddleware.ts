// import { Socket } from "socket.io";

// export const doHandshake = ( socket: Socket, next: (err?: Error) => void) => {
//     const token = socket.handshake.auth.token;

//     if  (!isValidToken(token)) {
//         return next(new Error("Unauthorised: no auth token detected."));
//     }

//     // socket.data.user = getUserByToken(token); <- Per si volem guardar info del user en el socket.
//     next();
// }