import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'

import type { PartialBlock } from '@blocknote/core'
import * as locales from '@blocknote/core/locales'
import { BlockNoteView } from '@blocknote/mantine'
import { SuggestionMenuController, useCreateBlockNote } from '@blocknote/react'
import { useQuery } from '@tanstack/react-query'
import { type FC, useState } from 'react'
import type { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'

import type { User } from '@/types/api'

interface DocEditorProps {
  pageId: string
  initialContent?: PartialBlock[]
  doc: Y.Doc
  provider: WebsocketProvider
}

export const DocEditor: FC<DocEditorProps> = (props: DocEditorProps) => {
  const { pageId, doc, provider } = props

  const { data: currentUser } = useQuery<User>({
    queryKey: ['currentUser'],
  })

  const [randomColor] = useState(() => {
    const storedColor = sessionStorage.getItem('pagedoc-user-color')
    if (storedColor) {
      return storedColor
    }
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)

    const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    sessionStorage.setItem('pagedoc-user-color', color)
    return color
  })

  const editor = useCreateBlockNote({
    collaboration: {
      provider: provider,
      fragment: doc.getXmlFragment(`document-store-${pageId}`),
      user: {
        name: currentUser?.username ?? '',
        color: randomColor,
      },
    },
    dictionary: locales.zh,
    tables: {
      splitCells: true,
      cellBackgroundColor: true,
      cellTextColor: true,
      headers: true,
    },
  })

  return <BlockNoteView editor={editor}></BlockNoteView>
}

export default DocEditor
