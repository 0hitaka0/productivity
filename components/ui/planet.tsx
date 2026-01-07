"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MBTI_DATA, MBTIType } from '@/lib/mbti-data';

interface PlanetProps {
    type: MBTIType;
    isActive: boolean;
    onClick: () => void;
    index: number;
}

export function Planet({ type, isActive, onClick, index }: PlanetProps) {
    const data = MBTI_DATA[type];
    const planetConfig = data.planet || { type: 'terrestrial', texture: 'smooth' };

    // Base Gradients based on planet type
    let background = `radial-gradient(circle at 30% 30%, ${data.theme.primary}, #1a1a1a)`;
    if (planetConfig.type === 'gaseous') {
        background = `radial-gradient(circle at 30% 30%, ${data.theme.primary}E6, ${data.theme.secondary}99, #1a1a1a)`;
    } else if (planetConfig.type === 'ice') {
        background = `radial-gradient(circle at 20% 20%, #f1f5f9, ${data.theme.primary}CC, #1a1a1a)`;
    } else if (planetConfig.type === 'volcanic') {
        background = `radial-gradient(circle at 40% 40%, ${data.theme.primary}, #7f1d1d, #1a1a1a)`;
    }

    const glow = `0 0 80px -20px ${data.theme.primary}66`;
    const atmosphere = `inset -10px -10px 20px rgba(0,0,0,0.5), inset 10px 10px 20px rgba(255,255,255,0.1)`;

    const getTexture = () => {
        switch (planetConfig.texture) {
            case 'rough': return `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.2'/%3E%3C/svg%3E")`;
            case 'dots': return `radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)`;
            case 'wavy': return `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)`;
            default: return 'none';
        }
    };

    return (
        <motion.div
            className="absolute flex flex-col items-center justify-center cursor-pointer"
            initial={false}
            animate={{
                scale: isActive ? 1.1 : 0.5,
                zIndex: isActive ? 50 : 10 - Math.abs(index),
                z: isActive ? 100 : 0,
                filter: isActive ? 'blur(0px) brightness(1.1)' : 'blur(4px) brightness(0.6)',
                x: isActive ? 0 : (index === 1 ? '75%' : index === -1 ? '-75%' : index * 65 + '%'),
                opacity: isActive ? 1 : (Math.abs(index) > 2 ? 0 : 0.3),
            }}
            transition={{ type: "spring", stiffness: 150, damping: 25 }}
            onClick={onClick}
            style={{
                width: 240,
                height: 240,
                left: 'calc(50% - 120px)',
                top: 'calc(50% - 120px)',
            }}
        >
            <div
                className="w-full h-full rounded-full relative transition-transform duration-500 overflow-hidden"
                style={{
                    background: background,
                    boxShadow: isActive ? glow : 'none',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}
            >
                <div className="absolute inset-0 opacity-50 mix-blend-overlay" style={{ background: getTexture(), backgroundSize: planetConfig.texture === 'dots' ? '20px 20px' : 'cover' }}></div>
                {planetConfig.type === 'cratered' && (
                    <>
                        <div className="absolute top-[20%] left-[30%] w-6 h-6 rounded-full bg-black/10 shadow-[inner_1px_1px_3px_rgba(0,0,0,0.3)]"></div>
                        <div className="absolute bottom-[30%] right-[20%] w-10 h-10 rounded-full bg-black/10 shadow-[inner_1px_1px_3px_rgba(0,0,0,0.3)]"></div>
                    </>
                )}
                <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: atmosphere }}></div>
            </div>
        </motion.div>
    );
}
