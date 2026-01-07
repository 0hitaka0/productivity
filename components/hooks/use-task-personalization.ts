"use client";

import { useMBTI } from "@/components/providers/mbti-provider";
import { MBTIType } from "@/lib/mbti-data";

interface TaskPersonalization {
    defaultView: 'list' | 'board';
    suggestedGrouping: 'priority' | 'status' | 'none';
    emptyStatePrompt: string;
    focusModeQuote: string;
    theme: {
        priorityIconStyle: 'star' | 'circle' | 'planet';
        showProgressRings: boolean;
    };
}

const PERSONALIZATION_MAP: Record<MBTIType, TaskPersonalization> = {
    // Analysts (INTJ, INTP, ENTJ, ENTP)
    "INTJ": {
        defaultView: 'list',
        suggestedGrouping: 'priority',
        emptyStatePrompt: "Strategize your next move. The void awaits your command.",
        focusModeQuote: "Efficiency is doing better what is already being done.",
        theme: { priorityIconStyle: 'planet', showProgressRings: true }
    },
    "INTP": {
        defaultView: 'board',
        suggestedGrouping: 'status',
        emptyStatePrompt: "Explore possibilities. What system shall we build today?",
        focusModeQuote: "The world is full of obvious things which nobody by any chance ever observes.",
        theme: { priorityIconStyle: 'star', showProgressRings: false }
    },
    "ENTJ": {
        defaultView: 'list',
        suggestedGrouping: 'priority',
        emptyStatePrompt: "Command the day. What objectives must be seized?",
        focusModeQuote: "Productivity is never an accident.",
        theme: { priorityIconStyle: 'planet', showProgressRings: true }
    },
    "ENTP": {
        defaultView: 'board',
        suggestedGrouping: 'none',
        emptyStatePrompt: "Challenge the status quo. What new idea needs tracking?",
        focusModeQuote: "Innovation distinguishes between a leader and a follower.",
        theme: { priorityIconStyle: 'star', showProgressRings: false }
    },

    // Diplomats (INFJ, INFP, ENFJ, ENFP)
    "INFJ": {
        defaultView: 'list',
        suggestedGrouping: 'priority',
        emptyStatePrompt: "Align with your purpose. What matters most right now?",
        focusModeQuote: "The only limit to our realization of tomorrow will be our doubts of today.",
        theme: { priorityIconStyle: 'star', showProgressRings: true }
    },
    "INFP": {
        defaultView: 'board',
        suggestedGrouping: 'status',
        emptyStatePrompt: "Listen to your inner voice. What feels right to do?",
        focusModeQuote: "Not all those who wander are lost.",
        theme: { priorityIconStyle: 'circle', showProgressRings: false }
    },
    "ENFJ": {
        defaultView: 'list',
        suggestedGrouping: 'priority',
        emptyStatePrompt: "Empower others. Who needs your help today?",
        focusModeQuote: "We rise by lifting others.",
        theme: { priorityIconStyle: 'planet', showProgressRings: true }
    },
    "ENFP": {
        defaultView: 'board',
        suggestedGrouping: 'none',
        emptyStatePrompt: "Follow your inspiration. Where is the potential?",
        focusModeQuote: "Creativity is intelligence having fun.",
        theme: { priorityIconStyle: 'star', showProgressRings: false }
    },

    // Sentinels (ISTJ, ISFJ, ESTJ, ESFJ)
    "ISTJ": {
        defaultView: 'list',
        suggestedGrouping: 'date',
        emptyStatePrompt: "Maintain order. What is the next logical step?",
        focusModeQuote: "Order and simplification are the first steps toward the mastery of a subject.",
        theme: { priorityIconStyle: 'circle', showProgressRings: true }
    },
    "ISFJ": {
        defaultView: 'list',
        suggestedGrouping: 'date',
        emptyStatePrompt: "Support and protect. What acts of service are needed?",
        focusModeQuote: "Small details make a huge difference.",
        theme: { priorityIconStyle: 'circle', showProgressRings: true }
    },
    "ESTJ": {
        defaultView: 'list',
        suggestedGrouping: 'priority',
        emptyStatePrompt: "Execute with precision. What is the plan?",
        focusModeQuote: "Good order is the foundation of all things.",
        theme: { priorityIconStyle: 'planet', showProgressRings: true }
    },
    "ESFJ": {
        defaultView: 'list',
        suggestedGrouping: 'priority',
        emptyStatePrompt: "Connect and care. Who are we coordinating with?",
        focusModeQuote: "Alone we can do so little; together we can do so much.",
        theme: { priorityIconStyle: 'circle', showProgressRings: true }
    },

    // Explorers (ISTP, ISFP, ESTP, ESFP)
    "ISTP": {
        defaultView: 'board',
        suggestedGrouping: 'status',
        emptyStatePrompt: "Analyze and fix. What problem are we solving?",
        focusModeQuote: "Fix it, create it, make it better.",
        theme: { priorityIconStyle: 'star', showProgressRings: false } // Minimalist
    },
    "ISFP": {
        defaultView: 'board',
        suggestedGrouping: 'none',
        emptyStatePrompt: "Express yourself. What beauty will we create?",
        focusModeQuote: "Art is not a thing; it is a way.",
        theme: { priorityIconStyle: 'circle', showProgressRings: false }
    },
    "ESTP": {
        defaultView: 'board',
        suggestedGrouping: 'priority',
        emptyStatePrompt: "Act now. What adventure awaits?",
        focusModeQuote: "Life is either a daring adventure or nothing.",
        theme: { priorityIconStyle: 'star', showProgressRings: true }
    },
    "ESFP": {
        defaultView: 'board',
        suggestedGrouping: 'none',
        emptyStatePrompt: "Entertain and enjoy. What fun is on the agenda?",
        focusModeQuote: "To live is the rarest thing in the world.",
        theme: { priorityIconStyle: 'circle', showProgressRings: false }
    }
} as any; // Cast for now to avoid strict typing needed on partial string matches if types differ slightly

// Fallback
const DEFAULT_PERSONALIZATION: TaskPersonalization = {
    defaultView: 'list',
    suggestedGrouping: 'priority',
    emptyStatePrompt: "What needs to be done?",
    focusModeQuote: "Let's be productive.",
    theme: { priorityIconStyle: 'circle', showProgressRings: true }
};

export function useTaskPersonalization() {
    const { type } = useMBTI();

    // Ensure type matches or fallback
    const config = PERSONALIZATION_MAP[type as MBTIType] || DEFAULT_PERSONALIZATION;

    return {
        type,
        config
    };
}
