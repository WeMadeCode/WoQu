import { createReactBlockSpec } from '@blocknote/react'
export const AI = createReactBlockSpec(
  {
    type: 'ai',
    propSchema: {},
    content: 'none',
  },
  {
    render: props => {
      return (
        <div className="text-2xl font-bold text-center">
          <div className="text-3xl">AI 人工智能</div>
          <div className="text-xl">AI 人工智能是未来的趋势</div>
          <div>{props.block.type}</div>
        </div>
      )
    },
  }
)
