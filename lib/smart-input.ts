import { addDays, nextMonday, setHours, setMinutes, startOfDay } from 'date-fns';

interface ParsedTask {
    title: string;
    priority?: 'critical' | 'high' | 'medium' | 'low';
    dueDate?: Date;
    tags: string[];
    isRecurring?: boolean;
    recurrenceRule?: string;
}

export function parseTaskInput(input: string): ParsedTask {
    let title = input;
    const tags: string[] = [];
    let priority: ParsedTask['priority'] | undefined;
    let dueDate: Date | undefined;

    // 1. Parse Tags (#tag)
    const tagRegex = /#(\w+)/g;
    const tagMatches = title.match(tagRegex);
    if (tagMatches) {
        tags.push(...tagMatches.map(t => t.substring(1))); // Remove #
        title = title.replace(tagRegex, '').trim();
    }

    // 2. Parse Priority (!p)
    if (title.match(/!(critical|crit)/i)) {
        priority = 'critical';
        title = title.replace(/!(critical|crit)/i, '').trim();
    } else if (title.match(/!(high|h)/i)) {
        priority = 'high';
        title = title.replace(/!(high|h)/i, '').trim();
    } else if (title.match(/!(medium|med|m)/i)) {
        priority = 'medium';
        title = title.replace(/!(medium|med|m)/i, '').trim();
    } else if (title.match(/!(low|l)/i)) {
        priority = 'low';
        title = title.replace(/!(low|l)/i, '').trim();
    }

    // 3. Parse Dates (Simple keywords)
    const lowerTitle = title.toLowerCase();
    const today = startOfDay(new Date());

    if (lowerTitle.includes('today')) {
        dueDate = setHours(today, 18); // Default to 6pm
        title = title.replace(/\btoday\b/i, '').trim();
    } else if (lowerTitle.includes('tomorrow') || lowerTitle.includes('tmrw')) {
        dueDate = setHours(addDays(today, 1), 9); // Default to 9am
        title = title.replace(/\b(tomorrow|tmrw)\b/i, '').trim();
    } else if (lowerTitle.includes('next week')) {
        dueDate = setHours(nextMonday(today), 9);
        title = title.replace(/\bnext week\b/i, '').trim();
    }

    // Time parsing (at 5pm, @5pm)
    // Very basic regex for 12h format
    const timeRegex = /(?:at|@)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i;
    const timeMatch = title.match(timeRegex);
    if (timeMatch && dueDate) {
        // If we found a date keyword, update its time
        // If no date keyword found, assume today? Let's say yes.
        const [fullMatch, hourStr, minStr, meridiem] = timeMatch;
        let hour = parseInt(hourStr);
        const min = minStr ? parseInt(minStr) : 0;

        if (meridiem && meridiem.toLowerCase() === 'pm' && hour < 12) hour += 12;
        if (meridiem && meridiem.toLowerCase() === 'am' && hour === 12) hour = 0;

        dueDate = setHours(setMinutes(dueDate, min), hour);
        title = title.replace(timeRegex, '').trim();
    } else if (timeMatch && !dueDate) {
        // Assume today if only time given
        let hour = parseInt(timeMatch[1]);
        const min = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        const meridiem = timeMatch[3];

        if (meridiem && meridiem.toLowerCase() === 'pm' && hour < 12) hour += 12;
        if (meridiem && meridiem.toLowerCase() === 'am' && hour === 12) hour = 0;

        // If time has passed today, maybe tomorrow? For simplicity, just today.
        dueDate = setHours(setMinutes(today, min), hour);
        title = title.replace(timeRegex, '').trim();
    }

    // Clean up extra spaces
    title = title.replace(/\s+/g, ' ').trim();

    return {
        title,
        priority,
        dueDate,
        tags
    };
}
