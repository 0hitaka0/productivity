import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-lavender-50/30 to-sage-50 dark:from-midnight-950 dark:via-midnight-900 dark:to-midnight-800">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="container mx-auto p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
