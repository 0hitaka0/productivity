import { Sidebar } from "@/components/layout/sidebar";
import { CosmicBackground } from "@/components/ui/cosmic-background";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CosmicBackground>
            <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                    <div className="container mx-auto max-w-7xl p-6 md:p-8 space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </CosmicBackground>
    );
}
