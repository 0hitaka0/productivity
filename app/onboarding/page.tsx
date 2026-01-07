"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { MbtiGridSelector } from '@/components/mbti-grid-selector';
import { StarsBackground } from '@/components/ui/stars-background';
import { TransitionOverlay } from '@/components/transition-overlay';
import { MbtiConfirmationModal } from '@/components/mbti-confirmation-modal';
import { MBTIType, MBTI_DATA } from '@/lib/mbti-data';

export default function OnboardingPage() {
    const router = useRouter();
    const [pendingType, setPendingType] = React.useState<MBTIType | null>(null);
    const [isTransitioning, setIsTransitioning] = React.useState(false);

    // Removed localStorage checks to prevent "saved user" issue

    const handleSelect = (type: MBTIType) => {
        setPendingType(type);
    };

    const handleConfirm = async () => {
        if (!pendingType) return;

        try {
            // Use cookie-based authentication (automatically handled by browser)
            const res = await fetch('/api/user/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mbtiType: pendingType }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    router.push('/login');
                    throw new Error('Session expired. Redirecting to login...');
                }
                throw new Error(data.error || `Server error (${res.status})`);
            }

            // Trigger Transition
            setIsTransitioning(true);

            // Clean up old local storage artifacts to prevent conflicts
            if (typeof window !== 'undefined') {
                localStorage.removeItem('mbti-confirmed');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user-profile');
            }

            // Sync with Provider/Local State (Optional purely for UI reactivity if needed, but risky)
            // For now, rely on refresh.

            // Navigate after transition
            setTimeout(() => {
                router.push('/dashboard?welcome=true');
                router.refresh();
            }, 2500);

        } catch (error: any) {
            console.error('Failed to save selection', error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <main className="relative min-h-screen w-full bg-[#0a0a0a] overflow-x-hidden">
            <div className="fixed inset-0 bg-[#000000] z-0">
                <StarsBackground />
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-purple-900/10 to-transparent" />
            </div>

            <div className="relative z-10 py-12">
                <MbtiGridSelector onSelect={handleSelect} selectedType={pendingType} />
            </div>

            <MbtiConfirmationModal
                isOpen={!!pendingType && !isTransitioning}
                selectedType={pendingType ? MBTI_DATA[pendingType] : MBTI_DATA['INTJ']}
                onConfirm={handleConfirm}
                onCancel={() => {
                    console.log('handleCancel called');
                    setPendingType(null);
                }}
            />

            <TransitionOverlay
                isActive={isTransitioning}
                type={pendingType}
            />
        </main>
    );
}
