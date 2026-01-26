import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'

import { BlockNoteSchema, defaultInlineContentSpecs, type PartialBlock } from '@blocknote/core'
import { filterSuggestionItems } from '@blocknote/core/extensions'
import * as locales from '@blocknote/core/locales'
import { BlockNoteView } from '@blocknote/mantine'
import { type DefaultReactSuggestionItem, SuggestionMenuController, useCreateBlockNote } from '@blocknote/react'
import { useQuery } from '@tanstack/react-query'
import { type FC, useState } from 'react'
import type { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'

import { Mention } from '@/editor/blocks/mention'
import * as service from '@/services'
import type { User } from '@/types/api'

const schema = BlockNoteSchema.create({
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    mention: Mention,
  },
})

const getMentionMenuItems = async (editor: typeof schema.BlockNoteEditor, pageId?: string) => {
  const items: DefaultReactSuggestionItem[] = []
  // 获取远程页面
  const res = await service.fetchPageList()
  const pages = res.data.pages

  for (const page of pages) {
    if (page.pageId !== pageId) {
      items.push({
        icon: <span>{page.emoji}</span>,
        title: page.title,
        onItemClick: () => {
          editor.insertInlineContent([
            {
              type: 'mention',
              props: {
                id: page.pageId,
                title: page.title,
                icon: page.emoji,
              },
            },
            ' ', // add a space after the mention
          ])
        },
      })
    }
  }

  return items
}

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
    schema: schema,
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

  const getSlashMenuItems = async (query: string) => {
    const items = await getMentionMenuItems(editor, pageId)
    return filterSuggestionItems(items, query)
  }

  return (
    <BlockNoteView editor={editor}>
      <SuggestionMenuController triggerCharacter="@" getItems={getSlashMenuItems} />
    </BlockNoteView>
  )
}

export default DocEditor
