"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";

const HomePage = () => {
	const [decodedToken, setDecodedToken] = useState<string | JwtPayload | null>(
		null
	);

	useEffect(() => {
		const token = Cookies.get("token");
		if (token) {
			const decoded = jwt.decode(token);
			console.log("Decoded Token----------------------", decoded);
			setDecodedToken(decoded);
		}
	}, []);
	return (
		<div>
			<pre className="py-6 px-4 whitespace-pre-wrap break-all">
				{decodedToken
					? JSON.stringify(decodedToken, null, 2)
					: "No token found"}
			</pre>
		</div>
	);
};

export default HomePage;
