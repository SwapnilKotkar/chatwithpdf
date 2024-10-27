"use client";

import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	ReactNode,
} from "react";
import jwt, { JwtPayload } from "jsonwebtoken";
import Cookies from "js-cookie";
import { User } from "@/types";
import { useRouter } from "next/navigation";

interface SessionContextType {
	user: User | null;
	setUser: (user: User | null) => void;
	logout: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
	const router = useRouter();

	const [user, setUser] = useState<User | null>(null);

	console.log("sessionprovider_SessionProvider", user);

	useEffect(() => {
		const token = Cookies.get("token");
		if (token) {
			try {
				const token = Cookies.get("token");
				if (token) {
					const decoded = jwt.decode(token) as User;
					console.log(
						"SessionProvider Decoded Token----------------------",
						decoded
					);
					setUser(decoded);
				}
			} catch (error) {
				console.error("Failed to decode token", error);
				setUser(null);
			}
		}
	}, []);

	const logout = () => {
		Cookies.remove("token");
		setUser(null);

		router.push("/");
		console.log("User signed out");
	};

	return (
		<SessionContext.Provider value={{ user, setUser, logout }}>
			{children}
		</SessionContext.Provider>
	);
};

export const useSession = (): SessionContextType => {
	const context = useContext(SessionContext);
	if (!context) {
		throw new Error("useSession must be used within a SessionProvider");
	}
	return context;
};
