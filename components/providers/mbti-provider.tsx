"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MBTIType, MBTIProfile, MBTI_DATA } from "@/lib/mbti-data";
import { updateUserMBTI, getUserMBTI } from "@/actions/user";

interface MBTIContextType {
    type: MBTIType;
    profile: MBTIProfile;
    setType: (type: MBTIType) => void;
}

const MBTIContext = createContext<MBTIContextType | undefined>(undefined);

export function MBTIProvider({ children }: { children: React.ReactNode }) {
    // Default to INFJ as per user preference history
    const [currentType, setCurrentType] = useState<MBTIType>('INFJ');
    const [mounted, setMounted] = useState(false);

    // ... imports

    useEffect(() => {
        // Load from local storage first for speed
        const saved = localStorage.getItem('clarity-mbti-type');
        if (saved && MBTI_DATA[saved as MBTIType]) {
            setCurrentType(saved as MBTIType);
        }

        // Then fetch from DB to sync
        getUserMBTI().then(res => {
            if (res.success) {
                if (res.data && MBTI_DATA[res.data as MBTIType]) {
                    const dbType = res.data as MBTIType;
                    if (dbType !== saved) {
                        setCurrentType(dbType);
                        localStorage.setItem('clarity-mbti-type', dbType);
                    }
                } else {
                    // DB has no type (New User), but we have saved local state (Old User potentially)
                    // Reset to default to avoid confusion
                    setCurrentType('INFJ');
                    localStorage.removeItem('clarity-mbti-type');
                }
            }
        });

        setMounted(true);
    }, []);

    const handleSetType = async (type: MBTIType) => {
        setCurrentType(type);
        localStorage.setItem('clarity-mbti-type', type);
        // Persist to DB
        await updateUserMBTI(type);
    };

    // Apply CSS Variables based on theme
    useEffect(() => {
        if (!mounted) return;
        const profile = MBTI_DATA[currentType];
        const root = document.documentElement;

        // Very basic variable injection - in a real app would likely convert hex to rgb
        // For now, we use style injection or class manipulation could work too.
        // We will stick to using the JS context to pass values to components mostly, 
        // but can try to set some global vars.

        // This is a simplified approach. 
        // Ideally we would parse the hex colors to RGB for Tailwind opacity support.
        // For now, let's just expose the primary color for Inline Styles usage if needed.
        root.style.setProperty('--mbti-primary', profile.theme.primary);

    }, [currentType, mounted]);


    return (
        <MBTIContext.Provider value={{
            type: currentType,
            profile: MBTI_DATA[currentType],
            setType: handleSetType
        }}>
            {children}
        </MBTIContext.Provider>
    );
}

export function useMBTI() {
    const context = useContext(MBTIContext);
    if (!context) {
        throw new Error("useMBTI must be used within an MBTIProvider");
    }
    return context;
}
