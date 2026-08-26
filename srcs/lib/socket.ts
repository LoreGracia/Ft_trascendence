import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

  console.log("[socket] URL:", SOCKET_URL);
export const socket = io(SOCKET_URL, {
  autoConnect: true,
});
