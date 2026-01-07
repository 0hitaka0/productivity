import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import {
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    CheckSquare,
    Code,
    Type
} from 'lucide-react'

// Define the items
const getSuggestionItems = ({ query }: { query: string }) => {
    return [
        {
            title: 'Text',
            description: 'Just start writing with plain text.',
            icon: Type,
            command: ({ editor, range }: any) => {
                console.log("[SlashCommand] Executing Text command. Range:", range);
                console.log("[SlashCommand] State before:", editor.getJSON());
                editor.chain().focus().deleteRange(range).setParagraph().run()
                console.log("[SlashCommand] State after:", editor.getJSON());
            },
        },
        {
            title: 'Heading 1',
            description: 'Big section heading.',
            icon: Heading1,
            command: ({ editor, range }: any) => {
                console.log("[SlashCommand] Executing Heading 1 command. Range:", range);
                console.log("[SlashCommand] State before:", editor.getJSON());
                editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
                console.log("[SlashCommand] State after:", editor.getJSON());
            },
        },
        {
            title: 'Heading 2',
            description: 'Medium section heading.',
            icon: Heading2,
            command: ({ editor, range }: any) => {
                console.log("[SlashCommand] Executing Heading 2 command");
                editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
            },
        },
        {
            title: 'Heading 3',
            description: 'Small section heading.',
            icon: Heading3,
            command: ({ editor, range }: any) => {
                console.log("[SlashCommand] Executing Heading 3 command");
                editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
            },
        },
        {
            title: 'Bullet List',
            description: 'Create a simple bulleted list.',
            icon: List,
            command: ({ editor, range }: any) => {
                console.log("[SlashCommand] Executing Bullet List command");
                editor.chain().focus().deleteRange(range).toggleBulletList().run()
            },
        },
        {
            title: 'Numbered List',
            description: 'Create a list with numbering.',
            icon: ListOrdered,
            command: ({ editor, range }: any) => {
                console.log("[SlashCommand] Executing Numbered List command");
                editor.chain().focus().deleteRange(range).toggleOrderedList().run()
            },
        },
        {
            title: 'Quote',
            description: 'Capture a quote.',
            icon: Quote,
            command: ({ editor, range }: any) => {
                console.log("[SlashCommand] Executing Quote command");
                editor.chain().focus().deleteRange(range).setBlockquote().run()
            },
        },
    ].filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
}

// React Component for the Menu
const CommandList = React.forwardRef(({ items, command }: any, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        console.log("[SlashCommand] Menu Rendered with items:", items.length);
    }, [items]);

    const selectItem = useCallback(
        (index: number) => {
            const item = items[index]
            if (item) {
                console.log("[SlashCommand] Menu Item Clicked:", item.title);
                command(item)
            }
        },
        [command, items]
    )

    useEffect(() => {
        setSelectedIndex(0)
    }, [items])

    React.useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === 'ArrowUp') {
                setSelectedIndex((selectedIndex + items.length - 1) % items.length)
                return true
            }
            if (event.key === 'ArrowDown') {
                setSelectedIndex((selectedIndex + 1) % items.length)
                return true
            }
            if (event.key === 'Enter') {
                selectItem(selectedIndex)
                return true
            }
            return false
        },
    }))

    return (
        <div className="z-50 min-w-[300px] overflow-hidden rounded-lg border border-slate-700 bg-[#0a0a0f]/95 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-100">
            <div className="p-1 max-h-[300px] overflow-y-auto">
                {items.map((item: any, index: number) => {
                    const Icon = item.icon
                    return (
                        <button
                            key={index}
                            type="button"
                            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${index === selectedIndex ? 'bg-slate-700/50 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                }`}
                            onClick={() => selectItem(index)}
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-700/50 bg-slate-800/50">
                                <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-slate-200">{item.title}</span>
                                <span className="text-xs text-slate-500">{item.description}</span>
                            </div>
                        </button>
                    )
                })}
                {items.length === 0 && (
                    <div className="p-3 text-center text-sm text-slate-500">
                        No commands found
                    </div>
                )}
            </div>
        </div>
    )
})
CommandList.displayName = 'CommandList'

// Tiptap Extension
export const SlashCommand = Extension.create({
    name: 'slashCommand',

    addOptions() {
        return {
            suggestion: {
                char: '/',
                command: ({ editor, range, props }: any) => {
                    console.log("[SlashCommand] Command Function Called. Item:", props.title);
                    props.command({ editor, range })
                },
            },
        }
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ]
    },
})

// Configuration for the suggestion engine
export const suggestion = {
    items: getSuggestionItems,
    render: () => {
        let component: ReactRenderer
        let popup: any

        return {
            onStart: (props: any) => {
                console.log("[SlashCommand] onStart triggered ('/' typed)");
                component = new ReactRenderer(CommandList, {
                    props,
                    editor: props.editor,
                })

                if (!props.clientRect) {
                    return
                }

                // @ts-ignore
                popup = tippy('body', {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                })
            },

            onUpdate(props: any) {
                component.updateProps(props)

                if (!props.clientRect) {
                    return
                }

                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                })
            },

            onKeyDown(props: any) {
                if (props.event.key === 'Escape') {
                    popup[0].hide()
                    return true
                }

                // @ts-ignore
                return component.ref?.onKeyDown(props)
            },

            onExit() {
                popup[0].destroy()
                component.destroy()
            },
        }
    },
}
