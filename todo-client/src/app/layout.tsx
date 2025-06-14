import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo App with gRPC",
  description: "A modern todo application using Next.js and gRPC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
