


export type MBTIType =
    | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
    | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
    | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
    | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface MBTIProfile {
    type: MBTIType;
    name: string;
    alias: string;
    theme: {
        primary: string; // Tailwind color name or hex
        secondary: string;
        gradient: string; // CSS bg gradient syntax
        style: 'minimalist' | 'bold' | 'elegant' | 'creative' | 'warm' | 'vibrant' | 'structured';
        animation: 'sharp' | 'smooth' | 'bouncy' | 'flowing' | 'steady';
        density: 'compact' | 'balanced' | 'spacious';
    };
    planet: {
        type: 'ringed' | 'cratered' | 'gaseous' | 'terrestrial' | 'ice' | 'volcanic';
        texture: 'smooth' | 'rough' | 'wavy' | 'dots';
        rings?: string; // Color of rings if present
    };
    prompts: string[];
    features: string[]; // IDs of features to highlight
    tags: string[];

    // Detailed Description Fields
    intro: string;
    purpose: string;
    connection: string;
    mission: string;
    strengths: string[];
    weaknesses: string[];
    growth: string;

    // Feature Request: Insightful journal description
    journalStyle: string;

    // Grid Selector V2 Data
    temperament: 'Analysts' | 'Diplomats' | 'Sentinels' | 'Explorers';
    cognitiveFunctions: string[]; // e.g. ['Ni', 'Te', 'Fi', 'Se']

    // Habit Tracker
    habitTitle?: string;
    habitPlaceholder?: string;
}

export const MBTI_DATA: Record<MBTIType, MBTIProfile> = {
    INTJ: {
        type: 'INTJ',
        name: 'The Architect',
        alias: 'Strategist',
        theme: {
            primary: '#3b82f6',
            secondary: '#ef4444',
            gradient: 'from-blue-900 to-slate-900',
            style: 'minimalist',
            animation: 'sharp',
            density: 'compact'
        },
        planet: { type: 'ringed', texture: 'smooth', rings: '#ffffff' },
        prompts: ["What strategic insights did you gain today?", "Which systems need optimization?", "What's your long-term vision?"],
        features: ['goals', 'vision', 'strategy'],
        tags: ['strategy', 'planning', 'goals', 'optimization'],
        intro: "INTJs are analytical problem-solvers, eager to improve systems and processes with their innovative ideas.",
        purpose: "To understand the world through logic and reason, and to improve it through strategic planning.",
        connection: "They connect through intellectual discussions and shared long-term visions.",
        mission: "To implement their ideas and achieve mastery in their chosen field.",
        strengths: ["Strategic Thinking", "High Standards", "Independent"],
        weaknesses: ["Overly Analytical", "Judgmental", "Clueless in Romance"],
        growth: "Focusing on emotional intelligence and accepting that not everything needs to be optimized.",
        journalStyle: "Structured and strategic. Your journal focuses on long-term visioning, system optimization, and logical analysis of daily events to track progress towards mastery.",
        habitTitle: "Systems and routines: the architecture of excellence.",
        habitPlaceholder: "What system will you build?",
        temperament: 'Analysts',
        cognitiveFunctions: ['Ni', 'Te', 'Fi', 'Se']
    },
    INTP: {
        type: 'INTP',
        name: 'The Logician',
        alias: 'Thinker',
        theme: {
            primary: '#10b981',
            secondary: '#8b5cf6',
            gradient: 'from-emerald-900/40 to-purple-900/40',
            style: 'minimalist',
            animation: 'smooth',
            density: 'spacious'
        },
        planet: { type: 'gaseous', texture: 'wavy' },
        prompts: ["What theories fascinated you today?", "What problems did you solve?", "What connections did you discover?"],
        features: ['ideas', 'theory', 'problem-solving'],
        tags: ['theory', 'problem-solving', 'ideas', 'discovery'],
        intro: "INTPs are philosophical innovators, fascinated by logical analysis, systems, and design.",
        purpose: "To deconstruct and reconstruct ideas to find the underlying truth.",
        connection: "They connect by exchanging theories and exploring abstract concepts.",
        mission: "To solve complex problems and contribute to human understanding.",
        strengths: ["Analytical", "Original", "Open-minded"],
        weaknesses: ["Disconnected", "Insensitive", "Dissatisfied"],
        growth: "Translating complex ideas into actionable steps and connecting with others emotionally.",
        journalStyle: "Exploratory and abstract. A space to detangle complex thoughts, map out theories, and document the fascinating connections you discover between seemingly unrelated concepts.",
        habitTitle: "Small experiments, repeated daily, compound into mastery.",
        habitPlaceholder: "What skill will you develop?",
        temperament: 'Analysts',
        cognitiveFunctions: ['Ti', 'Ne', 'Si', 'Fe']
    },
    ENTJ: {
        type: 'ENTJ',
        name: 'The Commander',
        alias: 'Leader',
        theme: {
            primary: '#ef4444',
            secondary: '#475569',
            gradient: 'from-red-900/40 to-slate-900',
            style: 'bold',
            animation: 'sharp',
            density: 'compact'
        },
        planet: { type: 'ringed', texture: 'rough', rings: '#ef4444' },
        prompts: ["What goals did you accomplish?", "How did you lead today?", "What obstacles did you overcome?"],
        features: ['achievement', 'leadership', 'obstacles'],
        tags: ['achievement', 'leadership', 'execution', 'results'],
        intro: "ENTJs are bold, imaginative, and strong-willed leaders, always finding a way - or making one.",
        purpose: "To lead people and organizations towards a grand vision.",
        connection: "They connect through shared ambition and efficient collaboration.",
        mission: "To organize resources and people to achieve ambitious goals.",
        strengths: ["Efficient", "Energetic", "Self-Confident"],
        weaknesses: ["Stubborn", "Intolerant", "Arrogant"],
        growth: "Learning to listen to others' feelings and slowing down to appreciate the moment.",
        journalStyle: "Goal-oriented and efficient. Your journal serves as a war room for tracking objectives, analyzing leadership challenges, and plotting the most direct course to success.",
        habitTitle: "Discipline is the bridge between goals and accomplishment.",
        habitPlaceholder: "What discipline will drive success?",
        temperament: 'Analysts',
        cognitiveFunctions: ['Te', 'Ni', 'Se', 'Fi']
    },
    ENTP: {
        type: 'ENTP',
        name: 'The Debater',
        alias: 'Visionary',
        theme: {
            primary: '#f59e0b',
            secondary: '#3b82f6',
            gradient: 'from-amber-900/40 to-blue-900/40',
            style: 'vibrant',
            animation: 'bouncy',
            density: 'balanced'
        },
        planet: { type: 'gaseous', texture: 'wavy' },
        prompts: ["What new ideas excited you?", "What debates did you win?", "What possibilities emerged?"],
        features: ['debate', 'ideas', 'innovation'],
        tags: ['ideas', 'debate', 'innovation', 'possibility'],
        intro: "ENTPs are smart and curious thinkers who cannot resist an intellectual challenge.",
        purpose: "To explore every possibility and challenge the status quo.",
        connection: "They connect through debate, wit, and brainstorming.",
        mission: "To innovate and disrupt meaningful industries.",
        strengths: ["Knowledgeable", "Quick-thinking", "Charismatic"],
        weaknesses: ["Very Argumentative", "Insensitive", "Difficult to Focus"],
        growth: "Following through on ideas and practicing patience with others.",
        journalStyle: "Dynamic and brainstorming-heavy. A playground for generating endless possibilities, challenging assumptions, and debating ideas with yourself to find novel solutions.",
        habitTitle: "Variety within structure keeps the mind engaged.",
        habitPlaceholder: "What experiment will you try daily?",
        temperament: 'Analysts',
        cognitiveFunctions: ['Ne', 'Ti', 'Fe', 'Si']
    },
    INFJ: {
        type: 'INFJ',
        name: 'The Advocate',
        alias: 'Counselor',
        theme: {
            primary: '#8b5cf6',
            secondary: '#ec4899',
            gradient: 'from-violet-900/30 to-fuchsia-900/30',
            style: 'elegant',
            animation: 'smooth',
            density: 'spacious'
        },
        planet: { type: 'ice', texture: 'smooth' },
        prompts: ["What connections did you deepen today?", "How did you help others grow?", "What felt meaningful?"],
        features: ['meaning', 'connection', 'growth'],
        tags: ['meaning', 'connection', 'growth', 'compassion'],
        intro: "INFJs are quiet and mystical, yet very inspiring and tireless idealists.",
        purpose: "To help others realize their potential and find deep meaning.",
        connection: "They connect through deep empathy and shared values.",
        mission: "To serve humanity and make a lasting positive impact.",
        strengths: ["Creative", "Insightful", "Principled"],
        weaknesses: ["Sensitive to Criticism", "Perfectionistic", "Private"],
        growth: "Balancing idealism with practical action and avoiding burnout.",
        journalStyle: "Deep and reflective. Your journal acts as a sanctuary for processing complex emotions, visualizing future ideals, and finding profound meaning in everyday interactions.",
        habitTitle: "Meaningful rituals nurture the soul's growth.",
        habitPlaceholder: "What meaningful practice calls you?",
        temperament: 'Diplomats',
        cognitiveFunctions: ['Ni', 'Fe', 'Ti', 'Se']
    },
    INFP: {
        type: 'INFP',
        name: 'The Mediator',
        alias: 'Idealist',
        theme: {
            primary: '#06b6d4',
            secondary: '#f97316',
            gradient: 'from-cyan-900/30 to-orange-900/30',
            style: 'creative',
            animation: 'flowing',
            density: 'spacious'
        },
        planet: { type: 'terrestrial', texture: 'wavy' },
        prompts: ["What felt true to you today?", "How did you express yourself?", "What inspired your imagination?"],
        features: ['values', 'creativity', 'authenticity'],
        tags: ['values', 'authentic', 'creative', 'inspiration'],
        intro: "INFPs are poetic, kind and altruistic people, always eager to help a good cause.",
        purpose: "To live authentically and express their inner world.",
        connection: "They connect through shared dreams, art, and emotional intimacy.",
        mission: "To heal the world and inspire others to be themselves.",
        strengths: ["Empathetic", "Generous", "Open-minded"],
        weaknesses: ["Unrealistic", "Self-isolating", "Unfocused"],
        growth: "Taking concrete action on their dreams and developing a thicker skin.",
        journalStyle: "Expressive and authentic. A canvas for your inner world, combining poetry, values-based reflection, and emotional exploration to maintain alignment with your true self.",
        habitTitle: "Gentle consistency aligned with your values.",
        habitPlaceholder: "What habit honors your true self?",
        temperament: 'Diplomats',
        cognitiveFunctions: ['Fi', 'Ne', 'Si', 'Te']
    },
    ENFJ: {
        type: 'ENFJ',
        name: 'The Protagonist',
        alias: 'Mentor',
        theme: {
            primary: '#d946ef',
            secondary: '#10b981',
            gradient: 'from-fuchsia-900/30 to-emerald-900/30',
            style: 'warm',
            animation: 'steady',
            density: 'balanced'
        },
        planet: { type: 'terrestrial', texture: 'smooth' },
        prompts: ["How did you inspire others?", "What relationships deepened?", "How did you make a difference?"],
        features: ['relationships', 'inspiration', 'community'],
        tags: ['leadership', 'inspiration', 'community', 'impact'],
        intro: "ENFJs are charismatic and inspiring leaders, able to mesmerize their listeners.",
        purpose: "To guide others towards a better future and foster harmony.",
        connection: "They connect by nurturing others and building community.",
        mission: "To lead a movement of positive change.",
        strengths: ["Reliable", "Altruistic", "Natural Leaders"],
        weaknesses: ["Overly Idealistic", "Too Selfless", "Sensitive"],
        growth: "Setting boundaries and attending to their own needs.",
        journalStyle: "Relational and inspiring. Focuses on your impact on others, community growth, and tracking how your leadership fosters harmony and collective progress.",
        habitTitle: "Daily practices that help you help others.",
        habitPlaceholder: "What practice helps you grow?",
        temperament: 'Diplomats',
        cognitiveFunctions: ['Fe', 'Ni', 'Se', 'Ti']
    },
    ENFP: {
        type: 'ENFP',
        name: 'The Campaigner',
        alias: 'Champion',
        theme: {
            primary: '#0ea5e9',
            secondary: '#f43f5e',
            gradient: 'from-sky-900/40 to-rose-900/40',
            style: 'vibrant',
            animation: 'bouncy',
            density: 'balanced'
        },
        planet: { type: 'gaseous', texture: 'dots' },
        prompts: ["What adventures did you have?", "What brought you joy?", "What surprised you?"],
        features: ['adventure', 'joy', 'spontaneity'],
        tags: ['adventure', 'joy', 'spontaneous', 'discovery'],
        intro: "ENFPs are enthusiastic, creative and sociable free spirits, who can always find a reason to smile.",
        purpose: "To explore social possibilities and spark joy in others.",
        connection: "They connect through enthusiasm, play, and emotional exploration.",
        mission: "To freedom and creativity for themselves and others.",
        strengths: ["Curious", "Observant", "Energetic"],
        weaknesses: ["Poor Practical Skills", "Difficulty Focusing", "Overthinking"],
        growth: "Focusing on finishing what they start and managing stress.",
        journalStyle: "Spontaneous and vibrant. Captures bursts of inspiration, emotional highs, and new adventures. A free-flowing space to document your journey of discovery.",
        habitTitle: "Playful routines that spark joy and growth.",
        habitPlaceholder: "What exciting habit to explore?",
        temperament: 'Diplomats',
        cognitiveFunctions: ['Ne', 'Fi', 'Te', 'Si']
    },
    ISTJ: {
        type: 'ISTJ',
        name: 'The Logistician',
        alias: 'Inspector',
        theme: {
            primary: '#22c55e',
            secondary: '#c2410c',
            gradient: 'from-green-900/30 to-orange-900/20',
            style: 'structured',
            animation: 'steady',
            density: 'compact'
        },
        planet: { type: 'cratered', texture: 'rough' },
        prompts: ["What responsibilities did you fulfill?", "What systems improved?", "What did you accomplish?"],
        features: ['duty', 'systems', 'accomplishment'],
        tags: ['responsibility', 'tasks', 'systems', 'duty'],
        intro: "ISTJs are practical and fact-minded individuals, whose reliability cannot be doubted.",
        purpose: "To created order and enforce standards.",
        connection: "They connect through shared duty and practical support.",
        mission: "To maintain the institutions and systems that uphold society.",
        strengths: ["Honest", "Direct", "Responsible"],
        weaknesses: ["Stubborn", "Insensitive", "Always by the Book"],
        growth: "Being open to new ways of doing things and expressing emotions.",
        journalStyle: "Methodical and factual. A reliable log of daily accomplishments, duty fulfillment, and habit tracking. Great for maintaining order and reviewing concrete progress.",
        habitTitle: "Reliable habits build a reliable life.",
        habitPlaceholder: "What reliable routine to establish?",
        temperament: 'Sentinels',
        cognitiveFunctions: ['Si', 'Te', 'Fi', 'Ne']
    },
    ISFJ: {
        type: 'ISFJ',
        name: 'The Defender',
        alias: 'Protector',
        theme: {
            primary: '#0ea5e9',
            secondary: '#fb7185',
            gradient: 'from-sky-900/30 to-rose-900/20',
            style: 'warm',
            animation: 'steady',
            density: 'spacious'
        },
        planet: { type: 'ice', texture: 'smooth' },
        prompts: ["Who did you help today?", "What care did you give?", "How did you protect someone?"],
        features: ['care', 'service', 'loyalty'],
        tags: ['care', 'support', 'loyalty', 'service'],
        intro: "ISFJs are very dedicated and warm protectors, always ready to defend their loved ones.",
        purpose: "To protect and care for others.",
        connection: "They connect through acts of service and reliable presence.",
        mission: "To ensure the safety and well-being of their community.",
        strengths: ["Supportive", "Reliable", "Patient"],
        weaknesses: ["Overly Humble", "Taking Things Personally", "Repressing Feelings"],
        growth: "Learning to say no and valuing their own contributions.",
        journalStyle: "Warm and reflective. Captures memories, acts of service, and gratitude. A safe place to process feelings and preserve the meaningful moments shared with loved ones.",
        habitTitle: "Caring for yourself through consistent routines.",
        habitPlaceholder: "What caring habit to nurture?",
        temperament: 'Sentinels',
        cognitiveFunctions: ['Si', 'Fe', 'Ti', 'Ne']
    },
    ESTJ: {
        type: 'ESTJ',
        name: 'The Executive',
        alias: 'Supervisor',
        theme: {
            primary: '#3b82f6',
            secondary: '#dc2626',
            gradient: 'from-blue-900/40 to-red-900/40',
            style: 'bold',
            animation: 'sharp',
            density: 'compact'
        },
        planet: { type: 'ringed', texture: 'rough', rings: '#3b82f6' },
        prompts: ["What did you organize well?", "What goals progressed?", "What efficiency did you create?"],
        features: ['efficiency', 'organization', 'goals'],
        tags: ['goals', 'organization', 'efficiency', 'results'],
        intro: "ESTJs are excellent administrators, unsurpassed at managing things or people.",
        purpose: "To organize people and projects to get things done.",
        connection: "They connect through shared activities and traditions.",
        mission: "To build solid foundations and lead efficiency.",
        strengths: ["Dedicated", "Strong-willed", "Direct"],
        weaknesses: ["Inflexible", "Uncomfortable with Unconventionality", "Judgmental"],
        growth: "Being more patient with others and considering emotional impacts.",
        journalStyle: "Concise and action-oriented. Focuses on project management, resource organization, and tracking concrete results. A tool for maximizing efficiency and accountability.",
        habitTitle: "Efficient systems for maximum productivity.",
        habitPlaceholder: "What efficient habit to implement?",
        temperament: 'Sentinels',
        cognitiveFunctions: ['Te', 'Si', 'Ne', 'Fi']
    },
    ESFJ: {
        type: 'ESFJ',
        name: 'The Consul',
        alias: 'Provider',
        theme: {
            primary: '#f97316',
            secondary: '#a855f7',
            gradient: 'from-orange-900/30 to-purple-900/30',
            style: 'warm',
            animation: 'steady',
            density: 'balanced'
        },
        planet: { type: 'terrestrial', texture: 'smooth' },
        prompts: ["What social moments mattered?", "How did you bring people together?", "What harmony did you create?"],
        features: ['social', 'community', 'harmony'],
        tags: ['community', 'connection', 'harmony', 'social'],
        intro: "ESFJs are extraordinarily caring, social and popular people, always eager to help.",
        purpose: "To support and encourage others.",
        connection: "They connect through social gathering and emotional support.",
        mission: "To create harmony and ensure everyone feels included.",
        strengths: ["Strong Practical Skills", "Warm", "Loyal"],
        weaknesses: ["Worried about Social Status", "Inflexible", "Vulnerable to Criticism"],
        growth: "Focusing on the big picture and not seeking constant validation.",
        journalStyle: "Social and harmonic. Documents social interactions, community events, and the well-being of your circle. Helps you track commitments and celebrate shared successes.",
        habitTitle: "Habits that strengthen you and your community.",
        habitPlaceholder: "What habit strengthens your day?",
        temperament: 'Sentinels',
        cognitiveFunctions: ['Fe', 'Si', 'Ne', 'Ti']
    },
    ISTP: {
        type: 'ISTP',
        name: 'The Virtuoso',
        alias: 'Craftsman',
        theme: {
            primary: '#64748b',
            secondary: '#06b6d4',
            gradient: 'from-slate-800 to-cyan-900/30',
            style: 'minimalist',
            animation: 'sharp',
            density: 'compact'
        },
        planet: { type: 'cratered', texture: 'rough' },
        prompts: ["What did you build or fix?", "What skills did you use?", "What problems did you solve?"],
        features: ['skills', 'fixing', 'problems'],
        tags: ['building', 'fixing', 'skills', 'technical'],
        intro: "ISTPs are bold and practical experimenters, masters of all kinds of tools.",
        purpose: "To master their craft and understand how things work.",
        connection: "They connect through shared activities and side-by-side problem solving.",
        mission: "To troubleshoot and solve practical problems.",
        strengths: ["Optimistic", "Creative", "Practical"],
        weaknesses: ["Stubborn", "Insensitive", "Private"],
        growth: "Communicating feelings and planning for the future.",
        journalStyle: "Practical and problem-solving focused. A log of skills learned, projects built, and technical solutions found. Minimalist and to the point.",
        habitTitle: "Practical skills honed through daily practice.",
        habitPlaceholder: "What practical skill to practice?",
        temperament: 'Explorers',
        cognitiveFunctions: ['Ti', 'Se', 'Ni', 'Fe']
    },
    ISFP: {
        type: 'ISFP',
        name: 'The Adventurer',
        alias: 'Artist',
        theme: {
            primary: '#10b981',
            secondary: '#f59e0b',
            gradient: 'from-emerald-900/30 to-amber-900/30',
            style: 'creative',
            animation: 'flowing',
            density: 'spacious'
        },
        planet: { type: 'terrestrial', texture: 'wavy' },
        prompts: ["What beauty did you experience?", "What did you create?", "What moment brought peace?"],
        features: ['beauty', 'creativity', 'peace'],
        tags: ['beauty', 'creative', 'peace', 'sensory'],
        intro: "ISFPs are flexible and charming artists, always eager to explore and experience something new.",
        purpose: "To express themselves and appreciate beauty.",
        connection: "They connect through shared experiences and artistic expression.",
        mission: "To live in the moment and disrupt expectations.",
        strengths: ["Charming", "Sensitive to Others", "imaginative"],
        weaknesses: ["Fiercely Independent", "Unpredictable", "Easily Stressed"],
        growth: "Planning for the long term and handling conflict directly.",
        journalStyle: "Sensory and aesthetic. Records moments of beauty, artistic inspiration, and present-moment experiences. A visual and emotional diary of your unique journey.",
        habitTitle: "Authentic rituals that honor who you are.",
        habitPlaceholder: "What authentic habit feels right?",
        temperament: 'Explorers',
        cognitiveFunctions: ['Fi', 'Se', 'Ni', 'Te']
    },
    ESTP: {
        type: 'ESTP',
        name: 'The Entrepreneur',
        alias: 'Dynamo',
        theme: {
            primary: '#f59e0b',
            secondary: '#0ea5e9',
            gradient: 'from-amber-900/40 to-sky-900/40',
            style: 'bold',
            animation: 'bouncy',
            density: 'balanced'
        },
        planet: { type: 'volcanic', texture: 'rough' },
        prompts: ["What risks did you take?", "What excitement happened?", "What progress did you make?"],
        features: ['risk', 'excitement', 'action'],
        tags: ['action', 'risk', 'excitement', 'progress'],
        intro: "ESTPs are smart, energetic and very perceptive people, who truly enjoy living on the edge.",
        purpose: "To act and react in the moment.",
        connection: "They connect through high-energy activities and excitement.",
        mission: "To solve problems immediately and take action.",
        strengths: ["Bold", "Rational", "Original"],
        weaknesses: ["Insensitive", "Impatient", "Risk-prone"],
        growth: "Considering long-term consequences and the feelings of others.",
        journalStyle: "Active and immediate. Captures bold moves, risks taken, and immediate results. A fast-paced log of your adventures and entrepreneurial wins.",
        habitTitle: "Quick wins that add up to big results.",
        habitPlaceholder: "What action to take daily?",
        temperament: 'Explorers',
        cognitiveFunctions: ['Se', 'Ti', 'Fe', 'Ni']
    },
    ESFP: {
        type: 'ESFP',
        name: 'The Entertainer',
        alias: 'Performer',
        theme: {
            primary: '#d946ef',
            secondary: '#0ea5e9',
            gradient: 'from-fuchsia-900/40 to-sky-900/40',
            style: 'vibrant',
            animation: 'bouncy',
            density: 'spacious'
        },
        planet: { type: 'gaseous', texture: 'dots' },
        prompts: ["What fun did you have?", "Who did you connect with?", "What made you smile?"],
        features: ['fun', 'connection', 'joy'],
        tags: ['fun', 'connection', 'joy', 'experience'],
        intro: "ESFPs are spontaneous, energetic and enthusiastic people - life is never boring around them.",
        purpose: "To encourage others and enjoy life.",
        connection: "They connect through fun, laughter, and shared attention.",
        mission: "To put on a show and ensure everyone is having a good time.",
        strengths: ["Bold", "Original", "Aesthetics"],
        weaknesses: ["Sensitive", "Conflict-Averse", "Easily Bored"],
        growth: "Taking commitment seriously and planning for the future.",
        journalStyle: "Vibrant and social. A celebration of life's fun moments, social connections, and experiences. Focuses on joy, performance, and the excitement of the here and now.",
        habitTitle: "Fun habits that make every day better.",
        habitPlaceholder: "What fun habit to enjoy?",
        temperament: 'Explorers',
        cognitiveFunctions: ['Se', 'Fi', 'Te', 'Ni']
    }
};
