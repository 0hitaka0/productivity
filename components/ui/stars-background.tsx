"use client";

import React, { useRef, useEffect } from "react";

interface Star {
    x: number;
    y: number;
    radius: number;
    color: string;
    vx: number;
    vy: number;
}

export function StarsBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // Mouse tracking via ref to avoid re-renders
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("mousemove", handleMouseMove);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let stars: Star[] = [];

        const initStars = () => {
            stars = [];
            const numStars = Math.floor((canvas.width * canvas.height) / 8000);
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5,
                    color: `rgba(255, 255, 255, ${Math.random() * 0.6 + 0.4})`,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                });
            }
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                // Boundary checks
                if (star.x < 0) star.x = canvas.width;
                if (star.x > canvas.width) star.x = 0;
                if (star.y < 0) star.y = canvas.height;
                if (star.y > canvas.height) star.y = 0;

                const dx = mouseRef.current.x - star.x;
                const dy = mouseRef.current.y - star.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 200;

                if (dist < maxDist) {
                    const force = (maxDist - dist) / maxDist;
                    // Move stars when user directs cursor: stronger, smoother push
                    const angle = Math.atan2(dy, dx);
                    // Push away from cursor more effectively
                    star.vx -= Math.cos(angle) * force * 0.5;
                    star.vy -= Math.sin(angle) * force * 0.5;
                }

                // Add slight friction to return to normal speed naturally
                star.vx *= 0.98;
                star.vy *= 0.98;

                // Minimum movement to keep them "flying around"
                if (Math.abs(star.vx) < 0.1) star.vx += (Math.random() - 0.5) * 0.05;
                if (Math.abs(star.vy) < 0.1) star.vy += (Math.random() - 0.5) * 0.05;

                star.x += star.vx;
                star.y += star.vy;

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = star.color;
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        }
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full bg-black z-[-1]" />;
}
