import { StarsBackground } from "@/components/ui/stars-background";
import { MBTI_DATA, MBTIType } from "@/lib/mbti-data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function MBTITypesPage() {
    const types = Object.keys(MBTI_DATA) as MBTIType[];

    return (
        <div className="relative min-h-screen w-full bg-black text-white p-8">
            <StarsBackground />

            <Link href="/" className="fixed top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-20">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Main</span>
            </Link>

            <div className="max-w-7xl mx-auto pt-24 pb-20 animate-fade-in">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        The 16 Archetypes
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Explore the different cognitive styles and find where you belong.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {types.map((type) => {
                        const data = MBTI_DATA[type];
                        return (
                            <div
                                key={type}
                                className="group relative p-6 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-all hover:bg-zinc-900/60 backdrop-blur-sm"
                            >
                                {/* Glow effect on hover */}
                                <div
                                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                                    style={{ background: `radial-gradient(circle at center, ${data.theme.primary}, transparent 70%)` }}
                                />

                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-3xl font-bold tracking-wider text-white" style={{ textShadow: `0 0 20px ${data.theme.primary}40` }}>
                                            {type}
                                        </h2>
                                        <div
                                            className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]"
                                            style={{ backgroundColor: data.theme.primary, color: data.theme.primary }}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-slate-200">{data.name}</h3>
                                        <p className="text-sm text-slate-500 uppercase tracking-widest">{data.alias}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {data.tags.slice(0, 3).map((tag: string) => (
                                            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/5 text-slate-400 border border-white/5">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
