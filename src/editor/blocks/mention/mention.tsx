import { createReactInlineContentSpec } from '@blocknote/react'

import { MentionContent } from './MentionContent'

// The Mention inline content.
export const Mention = createReactInlineContentSpec(
  {
    type: 'mention',
    propSchema: {
      id: {
        default: 'Unknown',
      },
      title: {
        default: 'Unknown',
      },
      icon: {
        default: 'Unknown',
      },
    },
    content: 'none',
  },
  {
    render: props => {
      const { id } = props.inlineContent.props
      return <MentionContent pageId={id} />
    },
  }
)
