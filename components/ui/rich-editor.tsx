"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/button'
import { Bold, Italic, Strikethrough, List, ListOrdered, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SlashCommand, suggestion } from './slash-command'

interface RichEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    editable?: boolean;
}

export function RichEditor({ content, onChange, placeholder, editable = true }: RichEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: placeholder || 'Write something... (Type "/" for commands)',
                emptyEditorClass: 'is-editor-empty before:text-slate-600 before:content-[attr(data-placeholder)] before:float-left before:pointer-events-none',
            }),
            SlashCommand.configure({
                suggestion: suggestion,
            }),
        ],
        content: content,
        editable: editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] text-slate-300',
            },
        },
        immediatelyRender: false,
    })

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-col gap-2">
            {editable && (
                <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-purple-500/20 mb-2">
                    <EditorButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        icon={Bold}
                    />
                    <EditorButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        icon={Italic}
                    />
                    <EditorButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        icon={Strikethrough}
                    />
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <EditorButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        icon={List}
                    />
                    <EditorButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        icon={ListOrdered}
                    />
                    <EditorButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        icon={Quote}
                    />
                </div>
            )}
            <EditorContent editor={editor} className="min-h-[200px]" />
        </div>
    )
}

function EditorButton({ onClick, isActive, icon: Icon }: { onClick: () => void, isActive: boolean, icon: any }) {
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className={cn(
                "h-8 w-8 p-0 hover:bg-white/10 hover:text-purple-300",
                isActive ? "bg-purple-500/20 text-purple-200" : "text-slate-400"
            )}
        >
            <Icon className="h-4 w-4" />
        </Button>
    )
}
