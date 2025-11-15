import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clarity - Your INFJ Productivity Sanctuary",
  description: "A calm, intentional space for tasks, habits, and reflection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
