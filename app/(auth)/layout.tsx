import type { Metadata } from "next";
import "../globals.css";
import { Inter as FontSans, Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

const poppins = Poppins({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-poppins",
	subsets: ["latin"],
	display: "swap",
	adjustFontFallback: false,
});

export const metadata: Metadata = {
	title: {
		default: "User Auth",
		template: "%s - User Authentication App",
	},
	description: "User authentication system",
	openGraph: {
		type: "website",
		url: "https://example.com",
		title: "User Auth",
		description: "User authentication system",
		images: [
			{
				url: "https://example.com/image.jpg",
				width: 800,
				height: 600,
				alt: "User Auth",
			},
		],
	},
	twitter: {
		site: "@example",
		creator: "@example",
		title: "User Auth",
		description: "User authentication system",
		images: [
			{
				url: "https://example.com/image.jpg",
				width: 1800,
				height: 1600,
				alt: "User Auth",
			},
		],
	},
};

export default async function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn(
					"h-[100vh] bg-background font-sans subpixel-antialiased",
					poppins.variable
				)}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="light-blue"
					enableSystem
					disableTransitionOnChange
					themes={[
						"light",
						"dark",
						"light-green",
						"dark-green",
						"light-rose",
						"dark-rose",
						"light-yellow",
						"dark-yellow",
						"light-blue",
						"dark-blue",
					]}
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
