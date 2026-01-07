"use client";

import { useMBTI } from "@/components/providers/mbti-provider";
import { MBTIType } from "@/lib/mbti-data";
import { useRouter } from "next/navigation";
import { StarsBackground } from "@/components/ui/stars-background";
import { PlanetSelector } from "@/components/planet-selector";

export default function LandingPage() {
    const { setType } = useMBTI();
    const router = useRouter();

    const handleSelect = (type: MBTIType) => {
        setType(type);
        router.push(`/mbti-types/${type.toLowerCase()}`);
    };

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden text-white perspective-1000">
            {/* Removed bg-black to let stars show through properly */}
            <StarsBackground />

            {/* Header */}
            <div className="absolute top-10 w-full flex justify-between px-12 z-20">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                        <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity="0.5" />
                            <circle cx="12" cy="12" r="5" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-[0.2em]">CLARITY</span>
                </div>
                <div className="flex items-center gap-8 z-50">
                    <nav className="hidden md:flex gap-8 text-xs uppercase tracking-[0.2em] text-slate-400 font-medium">
                        <a href="https://www.16personalities.com/free-personality-test" target="_blank" className="hover:text-white transition-colors duration-300">Take Personality Test</a>
                        <a href="/about" className="hover:text-white transition-colors duration-300">About</a>
                    </nav>

                    <div className="flex items-center gap-4 pl-8 border-l border-white/10">
                        <a href="/login" className="text-xs uppercase tracking-[0.1em] text-white/70 hover:text-white transition-colors">
                            Login
                        </a>
                        <a href="/signup" className="relative px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-[0.1em] rounded-full backdrop-blur-md border border-white/10 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] group overflow-hidden">
                            <span className="relative z-10">Sign Up</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </a>
                    </div>
                </div>
            </div>

            {/* Orbit Lines Background */}
            <div className="absolute inset-0 flex items-center justify-center z-0 opacity-10 pointer-events-none">
                <div className="absolute w-[500px] h-[500px] rounded-full border border-white/10"></div>
                <div className="absolute w-[800px] h-[800px] rounded-full border border-white/5"></div>
            </div>

            {/* Reusable Planet Selector */}
            <div className="z-10 w-full">
                <PlanetSelector onSelect={handleSelect} buttonText="Explore" />
            </div>
        </div>
    );
}
