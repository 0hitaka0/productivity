import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: 'default' | 'glow' | 'interactive';
    className?: string;
}

export function GlassCard({ children, variant = 'default', className, ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                "rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-[20px]",
                "transition-all duration-300",
                variant === 'glow' && "shadow-[0_0_30px_rgba(255,255,255,0.05)]",
                variant === 'interactive' && "hover:bg-white/[0.06] hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] cursor-pointer",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
