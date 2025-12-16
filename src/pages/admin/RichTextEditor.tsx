import React, { useState, useRef } from 'react'
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RichTextEditorProps {
  value: string
  onChange: (val: string) => void
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const insertMarkdown = (
    before: string,
    after: string = '',
    placeholder: string = ''
  ) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const textToInsert = selectedText || placeholder

    const newText =
      value.substring(0, start) +
      before +
      textToInsert +
      after +
      value.substring(end)

    onChange(newText)

    setTimeout(() => {
      textarea.focus()
      const newCursor = start + before.length + textToInsert.length + after.length
      textarea.setSelectionRange(newCursor, newCursor)
    }, 0)
  }

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const newText = value.substring(0, start) + text + value.substring(start)
    onChange(newText)

    setTimeout(() => {
      textarea.focus()
      const newPos = start + text.length
      textarea.setSelectionRange(newPos, newPos)
    }, 0)
  }

  const handleBold = () => insertMarkdown('**', '**', 'bold text')
  const handleItalic = () => insertMarkdown('*', '*', 'italic text')
  const handleH1 = () => insertMarkdown('\n# ', '\n', 'Heading 1')
  const handleH2 = () => insertMarkdown('\n## ', '\n', 'Heading 2')
  const handleH3 = () => insertMarkdown('\n### ', '\n', 'Heading 3')
  const handleBulletList = () => insertMarkdown('\n- ', '\n', 'List item')
  const handleNumberedList = () => insertMarkdown('\n1. ', '\n', 'List item')
  const handleQuote = () => insertMarkdown('\n> ', '\n', 'Quote')
  const handleCode = () => insertMarkdown('\n```\n', '\n```\n', 'code')

  const handleLink = () => {
    if (linkText && linkUrl) {
      insertAtCursor(`[${linkText}](${linkUrl})`)
      setLinkText('')
      setLinkUrl('')
      setShowLinkDialog(false)
    } else {
      setShowLinkDialog(true)
    }
  }

  const handleImage = () => {
    if (imageUrl) {
      insertAtCursor(`\n![${imageAlt}](${imageUrl})\n`)
      setImageUrl('')
      setImageAlt('')
      setShowImageDialog(false)
    } else {
      setShowImageDialog(true)
    }
  }

  const toolbarButtons = [
    { icon: Bold, label: 'Bold', action: handleBold },
    { icon: Italic, label: 'Italic', action: handleItalic },
    { icon: Heading1, label: 'H1', action: handleH1 },
    { icon: Heading2, label: 'H2', action: handleH2 },
    { icon: Heading3, label: 'H3', action: handleH3 },
    { icon: List, label: 'Bullet List', action: handleBulletList },
    { icon: ListOrdered, label: 'Numbered List', action: handleNumberedList },
    { icon: Quote, label: 'Quote', action: handleQuote },
    { icon: Code, label: 'Code Block', action: handleCode },
    { icon: LinkIcon, label: 'Link', action: handleLink },
    { icon: ImageIcon, label: 'Image', action: handleImage },
  ]

  return (
    <div className="border border-[#252525] rounded-lg overflow-hidden bg-[#0A0A0A]">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-[#252525] bg-[#080808]">
        {toolbarButtons.map((btn, index) => {
          const Icon = btn.icon
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={btn.action}
              className="text-[#606060] hover:text-white hover:bg-[#151515] h-8 w-8 p-0"
              title={btn.label}
            >
              <Icon className="w-4 h-4" />
            </Button>
          )
        })}
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
        placeholder="Write your post content in Markdown..."
        className="w-full min-h-[400px] p-4 bg-[#0A0A0A] text-white font-mono text-sm resize-y focus:outline-none"
        style={{ fontFamily: 'ui-monospace, monospace' }}
      />

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="p-4 border-t border-[#252525] bg-[#080808]">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Link text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#252525] text-white text-sm rounded"
            />
            <input
              type="url"
              placeholder="URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#252525] text-white text-sm rounded"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleLink}>Insert Link</Button>
              <Button size="sm" variant="outline" onClick={() => setShowLinkDialog(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="p-4 border-t border-[#252525] bg-[#080808]">
          <div className="space-y-3">
            <input
              type="url"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#252525] text-white text-sm rounded"
            />
            <input
              type="text"
              placeholder="Alt text (optional)"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#252525] text-white text-sm rounded"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleImage}>Insert Image</Button>
              <Button size="sm" variant="outline" onClick={() => setShowImageDialog(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}