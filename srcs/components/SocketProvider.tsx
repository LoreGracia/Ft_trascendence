"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { authClient } from "@/lib/auth-client";

interface SocketContextType {
	isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ isConnected: false });

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const { data: session } = authClient.useSession();

	useEffect(() => {
		let isCancelled = false;

		const onConnect = () => {
			setIsConnected(true);
		};

		const onDisconnect = (reason: string) => {
			setIsConnected(false);
		};

		const onConnectError = (error: Error) => {
			setIsConnected(false);
		};

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("connect_error", onConnectError);

		const syncSocketAuth = async () => {
			try {
				const { data, error } = await authClient.token();
				if (error) {
					console.warn("[socket] Error obtaining JWT:", error.message);
				}
				const token = data?.token ?? null;

				if (isCancelled) return;

				if (!token) {
					if (socket.connected) {
						socket.disconnect();
					}
					setIsConnected(false);
					return;
				}

				const currentToken =
					typeof socket.auth === "object" && socket.auth !== null
						? socket.auth.token
						: undefined;
				socket.auth = { token };

				if (socket.connected && currentToken !== token) {
					socket.disconnect();
				}
				if (!socket.connected)
					socket.connect();
			} catch (err) {
				console.warn("[socket] Sync Error:", err);
			}
		};

		syncSocketAuth();

		return () => {
			isCancelled = true;
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("connect_error", onConnectError);
		};
	}, [session]);

	return (
		<SocketContext.Provider value={{ isConnected }}>
			{children}
		</SocketContext.Provider>
	);
}