'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useMBTI } from '@/components/providers/mbti-provider';
import { cn } from '@/lib/utils';

interface Star {
    x: number;
    y: number;
    size: number;
    baseX: number;
    baseY: number;
    density: number;
    alpha: number;
    speed: number;
}

const TEMPERAMENT_COLORS = {
    Analysts: { nebula: 'rgba(139, 92, 246, 0.05)', star: '230, 210, 255' },    // Purple (Reduced opacity)
    Diplomats: { nebula: 'rgba(16, 185, 129, 0.05)', star: '210, 255, 230' },   // Green
    Sentinels: { nebula: 'rgba(6, 182, 212, 0.05)', star: '210, 240, 255' },    // Blue
    Explorers: { nebula: 'rgba(245, 158, 11, 0.05)', star: '255, 240, 210' },   // Orange
    Default: { nebula: 'rgba(99, 102, 241, 0.03)', star: '255, 255, 255' }
};

export function CosmicBackground({ children }: { children: React.ReactNode }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { type, profile } = useMBTI();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Determine colors based on temperament
    const temperament = profile?.temperament || 'Default';
    const colors = TEMPERAMENT_COLORS[temperament as keyof typeof TEMPERAMENT_COLORS] || TEMPERAMENT_COLORS.Default;

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        let stars: Star[] = [];
        const starCount = Math.floor((dimensions.width * dimensions.height) / 4000); // Reduced density for cleaner look

        // Mouse interaction state
        let mouse = { x: -1000, y: -1000 };

        // Create stars
        for (let i = 0; i < starCount; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            stars.push({
                x,
                y,
                size: Math.random() * 1.5 + 0.5,
                baseX: x,
                baseY: y,
                density: (Math.random() * 20) + 1,
                alpha: Math.random() * 0.5 + 0.1, // Softer alpha
                speed: Math.random() * 0.02 // Slower drift (dreamy)
            });
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Nebula (Very soft, barely visible)
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, canvas.width
            );
            gradient.addColorStop(0, colors.nebula);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw & Update stars
            stars.forEach(star => {
                // Interactive repel
                const dx = mouse.x - star.x;
                const dy = mouse.y - star.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxDistance = 150; // Interaction radius
                const force = (maxDistance - distance) / maxDistance;

                // Repel logic
                if (distance < maxDistance) {
                    star.x -= forceDirectionX * force * 2; // Gentler repel
                    star.y -= forceDirectionY * force * 2;
                } else {
                    // Return to base (slowly)
                    if (star.x !== star.baseX) {
                        const dx = star.x - star.baseX;
                        star.x -= dx * 0.02; // Slower return
                    }
                    if (star.y !== star.baseY) {
                        const dy = star.y - star.baseY;
                        star.y -= dy * 0.02;
                    }
                }

                // Twinkle
                const flicker = Math.sin(Date.now() * 0.0005 * star.speed + star.density); // Slower flicker
                const dynamicAlpha = Math.max(0.1, Math.min(0.8, star.alpha + flicker * 0.2));

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

                // Glow Effect
                ctx.shadowBlur = star.size * 2;
                ctx.shadowColor = `rgba(${colors.star}, 0.5)`;

                ctx.fillStyle = `rgba(${colors.star}, ${dynamicAlpha})`;
                ctx.fill();

                // Reset shadow for performance (optional, but good practice if mixed drawing)
                ctx.shadowBlur = 0;
            });

            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, [dimensions, colors]);

    return (
        <div className="relative w-full min-h-screen bg-black overflow-hidden text-slate-200">
            {/* Canvas for Stars */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 z-0 pointer-events-none"
            />

            {/* Content Wrapper */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
}
