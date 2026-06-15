import { ThemeProvider, createTheme } from '@mui/material/styles'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import {
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonStrikethrough,
  MenuButtonUnderline,
  MenuControlsContainer,
  MenuDivider,
  RichTextEditor as MuiRichTextEditor,
} from 'mui-tiptap'
import { useMemo } from 'react'
import './richTextEditor.css'

const editorTheme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
    },
  },
})

type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function isRichTextEmpty(html: string) {
  if (!html.trim()) return true

  const text = html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()

  return text.length === 0
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  className,
}: RichTextEditorProps) {
  const extensions = useMemo(
    () => [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    [placeholder],
  )

  return (
    <ThemeProvider theme={editorTheme}>
      <MuiRichTextEditor
        className={className ? `rich-text-editor ${className}` : 'rich-text-editor'}
        extensions={extensions}
        content={value || ''}
        shouldRerenderOnTransaction
        onUpdate={({ editor }) => onChange(editor.getHTML())}
        renderControls={() => (
          <MenuControlsContainer>
            <MenuButtonBold />
            <MenuButtonItalic />
            <MenuButtonUnderline />
            <MenuButtonStrikethrough />
            <MenuDivider />
            <MenuButtonBulletedList />
            <MenuButtonOrderedList />
          </MenuControlsContainer>
        )}
        sx={{
          '& .MuiTiptap-RichTextField-content': {
            minHeight: '100px',
          },
        }}
      />
    </ThemeProvider>
  )
}
