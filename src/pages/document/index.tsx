import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { debounce } from 'underscore'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'

import { AvatarList } from '@/components/avatar-list'
import { MorePopover } from '@/components/more-popover'
import { SharePopover } from '@/components/share-popover'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import DocEditor from '@/editor'
import * as service from '@/services'
import { queryClient } from '@/utils/query-client'

const doc = new Y.Doc()
const wsHost = import.meta.env.VITE_WS_HOST ?? window.location.hostname
const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
const provider = new WebsocketProvider(`${wsProtocol}://${wsHost}:8082`, `doc-yjs`, doc, { connect: false })

export const Document = () => {
  const params = useParams()
  const { data: page } = useQuery({
    queryKey: ['page', params?.id],
    queryFn: async () => {
      if (!params?.id) {
        return
      }
      return (await service.fetchPageDetail(params?.id)).data
    },
    enabled: !!params?.id,
  })

  const [remoteUsers, setRemoteUsers] = useState<Map<number, { name: string; color: string }>>()

  const handleTitleInput = useMemo(() => {
    return debounce((e: React.FormEvent<HTMLDivElement>) => {
      if (!page) {
        return
      }
      const title = (e.target as HTMLDivElement).innerText
      service.updatePage({
        pageId: page?.pageId,
        title,
      })
      queryClient.invalidateQueries({ queryKey: ['pages'] })
    }, 100)
  }, [page])

  useEffect(() => {
    const changeHandler = () => {
      const states = provider.awareness.getStates()
      // console.log('🚀 ~ changeHandler ~ states:', provider.awareness.doc, doc)
      const users = new Map<number, { name: string; color: string }>()
      const cursors = new Map<number, { x: number; y: number; windowSize: { width: number; height: number } }>()
      for (const [key, value] of states) {
        // 排除自己
        if (key === provider.awareness.clientID) {
          continue
        }
        users.set(key, value.user)
        cursors.set(key, value.cursor)
      }
      setRemoteUsers(users)
    }
    // @TODO: 这里需要优化，避免频繁更新
    provider.awareness.on('change', changeHandler)

    return () => {
      provider.awareness.off('change', changeHandler)
      provider.disconnect()
    }
  }, [])

  useEffect(() => {
    provider.connect()
    return () => provider.disconnect()
  }, [])

  return (
    <SidebarInset className="w-full overflow-hidden">
      <header className="flex flex-row justify-between items-center h-[52px] px-[16px] border-b border-b-zinc-100">
        <div className="flex flex-row items-center gap-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-row flex-auto items-center text-sm">
            <em className="mr-2">{page?.emoji}</em>
            <p className="overflow-hidden whitespace-nowrap max-w-[300px] text-ellipsis" title={page?.title}>
              {page?.title}
            </p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-4">
          {remoteUsers && <AvatarList remoteUsers={remoteUsers} />}
          <SharePopover />
          <MorePopover />
        </div>
      </header>
      <div className="w-[80%] mx-auto">
        {/* 文档标题 */}
        <h1 className="flex flex-row py-12 px-[54px] leading-13 text-4xl font-bold">
          <span className="mr-4">{page?.emoji}</span>
          <div
            contentEditable
            className="inline-block flex-1 outline-none"
            onInput={handleTitleInput}
            dangerouslySetInnerHTML={{ __html: page?.title ?? '' }}
          />
        </h1>
        {/* 文档内容 */}
        {page?.id && <DocEditor key={page?.id} pageId={page.pageId} doc={doc} provider={provider} />}
      </div>
    </SidebarInset>
  )
}
