import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: "Nebula Workspace | 极简工作台",
	description: "Nebula Workspace Dashboard",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="zh-CN">
			<body className={`${inter.variable} antialiased min-h-screen font-sans bg-[#f8fafc]`}>
				<div className="flex min-h-screen">
					<Sidebar />
					<main className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
						<Header />
						<div className="flex-1 overflow-y-auto bg-[#fafbfc]">
							{children}
						</div>
					</main>
				</div>
			</body>
		</html>
	);
}
