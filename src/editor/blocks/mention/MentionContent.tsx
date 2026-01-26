import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { type Page } from '@/types/page'

interface MentionContentProps {
  pageId: string
}

export function MentionContent(props: MentionContentProps) {
  const { pageId } = props
  const { data: pages } = useQuery<Page[]>({
    queryKey: ['pages'],
  })

  const page = useMemo(() => {
    return pages?.find(page => page.pageId === pageId)
  }, [pageId, pages])

  return (
    <Link to={`/doc/${pageId}`} className={`px-2 py-[3px] mx-1 bg-purple-200 rounded-full`}>
      <span className="mr-1">{page?.emoji}</span>
      {page?.title}
    </Link>
  )
}
