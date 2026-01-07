"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge"; // Check if badge exists or create simple span
import { createTag, getTags } from "@/actions/tags";

interface TagSelectorProps {
    selectedTagIds: string[];
    onChange: (ids: string[]) => void;
    onTagsLoaded?: (tags: any[]) => void;
}

export function TagSelector({ selectedTagIds, onChange, onTagsLoaded }: TagSelectorProps) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const [availableTags, setAvailableTags] = React.useState<any[]>([]);

    // Fetch tags on open or input change
    React.useEffect(() => {
        if (open) {
            getTags(inputValue).then(res => {
                if (res.success) {
                    setAvailableTags(res.data);
                    if (onTagsLoaded) onTagsLoaded(res.data);
                }
            });
        }
    }, [open, inputValue]);

    const handleSelect = (tagId: string) => {
        if (selectedTagIds.includes(tagId)) {
            onChange(selectedTagIds.filter(id => id !== tagId));
        } else {
            onChange([...selectedTagIds, tagId]);
        }
    };

    const handleCreate = async () => {
        if (!inputValue.trim()) return;
        const res = await createTag(inputValue);
        if (res.success) {
            setAvailableTags([...availableTags, res.data]);
            handleSelect(res.data.id);
            setInputValue("");
        }
    };

    // Derived state for display
    const selectedTags = availableTags.filter(t => selectedTagIds.includes(t.id));
    // Also need to handle cases where selectedTagIds includes IDs not in availableTags (initial load)
    // Ideally we pass `initialTags` or fetch them all. For now let's hope availableTags covers it or we fetch specifically.
    // Actually, availableTags comes from search. If initially closed, it might be empty.
    // We ideally need the full objects of selected tags passed in, not just IDs, to display them nicely when closed.
    // BUT, for MVP, we just display the ID or fetch all initially.
    // Let's modify availableTags to fetch ALL initially.

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={open}
                    className="h-8 justify-start text-xs font-normal text-slate-500 hover:text-slate-300 px-2"
                >
                    <Plus className="mr-2 h-3 w-3" />
                    {selectedTagIds.length > 0 ? `${selectedTagIds.length} tags` : "Add Tags"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-zinc-900 border-zinc-800">
                <Command className="bg-transparent">
                    <CommandInput
                        placeholder="Search tags..."
                        value={inputValue}
                        onValueChange={setInputValue}
                        className="text-white"
                    />
                    <CommandList>
                        <CommandEmpty className="p-2">
                            <Button variant="ghost" size="sm" onClick={handleCreate} className="w-full justify-start text-xs text-purple-400">
                                <Plus className="mr-2 h-3 w-3" /> Create "{inputValue}"
                            </Button>
                        </CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto custom-scrollbar">
                            {availableTags.map((tag) => (
                                <CommandItem
                                    key={tag.id}
                                    value={tag.name}
                                    onSelect={() => handleSelect(tag.id)}
                                    className="text-slate-300 aria-selected:bg-white/10"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedTagIds.includes(tag.id) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {tag.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
