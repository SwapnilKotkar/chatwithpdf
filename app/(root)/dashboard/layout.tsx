export default async function DaashbordLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div className="h-full">{children}</div>;
}
