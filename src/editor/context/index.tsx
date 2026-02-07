import { createContext, useContext, useMemo, useState } from 'react'

import type { BlockNoteEditor } from '..'

interface EditorContextType {
  editor?: BlockNoteEditor
  setEditor?: (editor: BlockNoteEditor) => void
}
interface EditorProviderProps {
  children: React.ReactNode
}

export const EditorContext = createContext<EditorContextType | undefined>(undefined)

export const EditorProvider = ({ children }: EditorProviderProps) => {
  const [editor, setEditor] = useState<BlockNoteEditor>()

  const contextValue = useMemo<EditorContextType>(
    () => ({
      editor,
      setEditor,
    }),
    [editor, setEditor]
  )
  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>
}

export const useEditorContext = () => {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditorContext 必须在 EditorProvider 内部使用')
  }
  return context
}
