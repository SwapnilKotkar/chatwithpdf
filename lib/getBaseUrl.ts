const getBaseUrl = () =>
	process.env.NODE_ENV === "development"
		? "http://localhost:3000"
		: process.env.BASE_DOMAIN;

export default getBaseUrl;
