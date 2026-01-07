import { MBTIType } from './mbti-data';

export interface Prompt {
    id: string;
    category: 'processing' | 'values' | 'problem-solving' | 'compassion' | 'gratitude' | 'growth';
    text: string;
    mbtiTypes?: MBTIType[]; // If undefined, applies to all
}

export const PROMPTS: Prompt[] = [
    // General Prompts
    { id: 'gen-1', category: 'processing', text: "How did you feel today? What triggered it?" },
    { id: 'gen-2', category: 'gratitude', text: "What 3 things are you grateful for today?" },
    { id: 'gen-3', category: 'problem-solving', text: "What challenge did you face? What might you try differently?" },

    // INFP - The Mediator (Fi-Ne)
    { id: 'infp-1', category: 'values', text: "How did today reflect your authentic self? Where could you honor your values more?", mbtiTypes: ['INFP'] },
    { id: 'infp-2', category: 'growth', text: "Did you find meaning in a small moment today?", mbtiTypes: ['INFP'] },

    // INFJ - The Advocate (Ni-Fe)
    { id: 'infj-1', category: 'growth', text: "What deeper pattern did you notice in your interactions today?", mbtiTypes: ['INFJ'] },
    { id: 'infj-2', category: 'compassion', text: "How did you help others grow today? Did you remember to nurture yourself?", mbtiTypes: ['INFJ'] },

    // INTJ - The Architect (Ni-Te)
    { id: 'intj-1', category: 'problem-solving', text: "What strategic insights did you gain today? Which systems need optimization?", mbtiTypes: ['INTJ'] },
    { id: 'intj-2', category: 'growth', text: "Did you move closer to your long-term vision today?", mbtiTypes: ['INTJ'] },

    // INTP - The Logician (Ti-Ne)
    { id: 'intp-1', category: 'processing', text: "What new concept or idea sparked your curiosity today?", mbtiTypes: ['INTP'] },
    { id: 'intp-2', category: 'problem-solving', text: "Was there a logic puzzle or inconsistency you untangled?", mbtiTypes: ['INTP'] },

    // ENTJ - The Commander (Te-Ni)
    { id: 'entj-1', category: 'values', text: "How effective were you in executing your plans today? What was the bottleneck?", mbtiTypes: ['ENTJ'] },
    { id: 'entj-2', category: 'growth', text: "Did you lead with clarity? How did you empower your team?", mbtiTypes: ['ENTJ'] },

    // ENTP - The Debater (Ne-Ti)
    { id: 'entp-1', category: 'processing', text: "What convention did you question today? What alternative did you see?", mbtiTypes: ['ENTP'] },
    { id: 'entp-2', category: 'problem-solving', text: "What interesting debate or brainstorming session energized you?", mbtiTypes: ['ENTP'] },

    // ENFJ - The Protagonist (Fe-Ni)
    { id: 'enfj-1', category: 'compassion', text: "How did you inspire others today? What relationships deepened?", mbtiTypes: ['ENFJ'] },
    { id: 'enfj-2', category: 'values', text: "Did you ensure everyone felt included and heard?", mbtiTypes: ['ENFJ'] },

    // ENFP - The Campaigner (Ne-Fi)
    { id: 'enfp-1', category: 'growth', text: "What new possibility excited you today? Did you follow your inspiration?", mbtiTypes: ['ENFP'] },
    { id: 'enfp-2', category: 'processing', text: "How did you connect with your emotions and the people around you?", mbtiTypes: ['ENFP'] },

    // ISFJ - The Defender (Si-Fe)
    { id: 'isfj-1', category: 'gratitude', text: "What simple comfort did you enjoy today? Who did you support?", mbtiTypes: ['ISFJ'] },
    { id: 'isfj-2', category: 'values', text: "Did you feel appreciated for your contributions?", mbtiTypes: ['ISFJ'] },

    // ISTJ - The Logistician (Si-Te)
    { id: 'istj-1', category: 'processing', text: "Did everything go according to plan? What detail was crucial?", mbtiTypes: ['ISTJ'] },
    { id: 'istj-2', category: 'growth', text: "Did you maintain your standards of quality today?", mbtiTypes: ['ISTJ'] },

    // ISFP - The Adventurer (Fi-Se)
    { id: 'isfp-1', category: 'processing', text: "What beauty did you notice in potential unexpected places today?", mbtiTypes: ['ISFP'] },
    { id: 'isfp-2', category: 'values', text: "Did you feel free to express yourself creatively?", mbtiTypes: ['ISFP'] },

    // ISTP - The Virtuoso (Ti-Se)
    { id: 'istp-1', category: 'problem-solving', text: "What problem did you troubleshoot hands-on today?", mbtiTypes: ['ISTP'] },
    { id: 'istp-2', category: 'processing', text: "Did you get enough time to recharge and tinker alone?", mbtiTypes: ['ISTP'] },

    // ESFJ - The Consul (Fe-Si)
    { id: 'esfj-1', category: 'compassion', text: "Who did you care for today? Did you feel connected to your community?", mbtiTypes: ['ESFJ'] },
    { id: 'esfj-2', category: 'values', text: "Did you help maintain harmony in your group?", mbtiTypes: ['ESFJ'] },

    // ESTJ - The Executive (Te-Si)
    { id: 'estj-1', category: 'values', text: "Did you enforce order and efficiency today? What was achieved?", mbtiTypes: ['ESTJ'] },
    { id: 'estj-2', category: 'growth', text: "Did you lead by example? Was the team organized?", mbtiTypes: ['ESTJ'] },

    // ESFP - The Entertainer (Se-Fi)
    { id: 'esfp-1', category: 'processing', text: "What fun experience did you share with others today?", mbtiTypes: ['ESFP'] },
    { id: 'esfp-2', category: 'growth', text: "Did you seize the moment and enjoy the present?", mbtiTypes: ['ESFP'] },

    // ESTP - The Entrepreneur (Se-Ti)
    { id: 'estp-1', category: 'problem-solving', text: "What challenge excited you? What did you learn from taking action?", mbtiTypes: ['ESTP'] },
    { id: 'estp-2', category: 'processing', text: "Did you take a risk today? Was it worth it?", mbtiTypes: ['ESTP'] },
];

export function getPromptsForType(type: MBTIType): Prompt[] {
    const specific = PROMPTS.filter(p => p.mbtiTypes?.includes(type));
    const general = PROMPTS.filter(p => !p.mbtiTypes);
    // Prioritize specific prompts, shuffle mixed
    return [...specific, ...general];
}

export function getRandomPrompt(type: MBTIType): Prompt {
    const prompts = getPromptsForType(type);
    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
}
