/** @type {import('next').NextConfig} */
const nextConfig = {
	// async redirects() {
	// 	return [
	// 		{
	// 			source: "/",
	// 			destination: "/home",
	// 			permanent: true, // 301 (permanent) or 302 (temporary) redirection
	// 		},
	// 	];
	// },
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "i.imgur.com",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
			},
			{
				protocol: "https",
				hostname: "cdn-icons-png.flaticon.com",
			},
		],
	},
};

export default nextConfig;
