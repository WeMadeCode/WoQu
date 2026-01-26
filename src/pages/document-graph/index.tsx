import '@xyflow/react/dist/style.css'

import { useQuery } from '@tanstack/react-query'
import { applyEdgeChanges, applyNodeChanges, Background, Controls, Edge, EdgeChange, Node, NodeChange, ReactFlow } from '@xyflow/react'
import * as d3 from 'd3-force'
import { Loader } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import * as srv from '@/services'

import { GraphEdge } from './Edge'
import { GraphNode } from './Node'

const nodesTypes = {
  graph: GraphNode,
}

const edgeTypes = {
  graph: GraphEdge,
}

export function DocumentGraph() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const simulationTickEnd = useRef(false)

  const { data: pages = [] } = useQuery({
    queryKey: ['pageGraph'],
    queryFn: async () => {
      return (await srv.fetchPageGraph()).data
    },
  })
  console.log('🚀 ~ DocGraph ~ pages:', pages)

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    const { id } = node
    setNodes(nodes.map(node => ({ ...node, selected: node.id === id })))
    setEdges(edges.map(edge => ({ ...edge, selected: edge.source === id || edge.target === id })))
  }

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes(nds => applyNodeChanges(changes, nds)), [setNodes])
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges(eds => applyEdgeChanges(changes, eds)), [setEdges])

  useEffect(() => {
    // 转换数据为 @xyflow/react 所需的节点和边
    const initialNodes = pages.map(page => {
      return {
        id: page.pageId,
        type: 'graph',
        data: {
          emoji: page.emoji,
          title: page.title,
        },
        width: 100,
        height: 100,
        x: 0,
        y: 0,
      }
    })

    const initialEdges = []
    for (let pi = 0; pi < pages.length; pi++) {
      const page = pages[pi]
      for (const link of page.links || []) {
        const index = pages.findIndex(p => p.pageId === link)
        if (index === -1) {
          continue
        }
        initialEdges.push({
          id: `${page.id}-${link}`,
          data: {
            links: page.links,
          },
          source: pi,
          target: index,
        })
      }
    }

    // 使用 d3-force 来设置弹性布局
    const simulation = d3
      .forceSimulation(initialNodes)
      .force('charge', d3.forceManyBody().strength(-50))
      .force('collide', d3.forceCollide(80))
      .force('link', d3.forceLink(initialEdges).strength(1).distance(200).iterations(100))
      .force('center', d3.forceCenter(700, 400))
      .force('radial', d3.forceRadial(0, 700, 400))

    // 如果我们需要在模拟结束时执行一些操作，可以监听 end 事件
    simulation.on('end', () => {
      simulationTickEnd.current = true
      console.log('simulation end')
    })

    // 模拟每一帧时，更新节点的位置
    simulation.on('tick', () => {
      const forceNodes = simulation.nodes().map(node => ({ ...node, position: { x: node.x, y: node.y } }))
      setNodes(forceNodes)
    })

    // @ts-expect-error force edge type
    const flowEdges = initialEdges.map(edge => ({ ...edge, type: 'graph', source: edge?.source.id, target: edge?.target.id }))
    setEdges(flowEdges)

    return () => {
      simulation.stop()
    }
  }, [pages])

  return (
    <SidebarInset>
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-row items-center p-6 gap-2">
          <SidebarTrigger />
          <h1 className="text-xl text-zinc-500">文档图谱</h1>
        </div>
        <div className="w-full h-full relative">
          {!simulationTickEnd.current && (
            <div className="w-full h-full flex justify-center items-center bg-zinc-50 opacity-30 absolute z-10">
              <div className="flex flex-col items-center gap-2">
                <Loader className="w-8 h-8 animate-spin" />
                <p className="text-sm">加载中...</p>
              </div>
            </div>
          )}
          <ReactFlow
            nodesDraggable
            proOptions={{
              hideAttribution: true,
            }}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodesTypes}
            edgeTypes={edgeTypes}
            onNodeClick={handleNodeClick}
            onNodeDragStart={handleNodeClick}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </SidebarInset>
  )
}
