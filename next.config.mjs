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
		],
	},
};

export default nextConfig;
