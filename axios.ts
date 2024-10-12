import axios from "axios";

export const AXIOS = axios.create({
	baseURL: process.env.BASE_DOMAIN,
	headers: { "Content-Type": "application/json" },
	// timeout: 5000,
	withCredentials: true,
});
