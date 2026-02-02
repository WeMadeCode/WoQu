import { useBlockNoteEditor } from '@blocknote/react'
import { docxDefaultSchemaMappings, DOCXExporter } from '@blocknote/xl-docx-exporter'

import download from '@/assets/download.svg'
import more from '@/assets/more.svg'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export function MorePopover() {
  const editor = useBlockNoteEditor()
  // Exports the editor content to DOCX and downloads it.
  const onDownloadClick = async () => {
    // 在这里如何 拿到全局创建的编辑器？

    const exporter = new DOCXExporter(editor.state.schema, docxDefaultSchemaMappings)
    const blob = await exporter.toBlob(editor.document)

    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = 'My Document (blocknote export).docx'
    document.body.appendChild(link)
    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    )
    link.remove()
    window.URL.revokeObjectURL(link.href)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <img src={more} alt="more" className="w-6 h-6 cursor-pointer hover:bg-zinc-200 rounded-md" />
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={15} className="w-auto min-w-[200px]">
        <div onClick={onDownloadClick} className="p-1 hover:bg-zinc-200 cursor-pointer rounded-md flex items-center">
          <img src={download} alt="download" className="w-6 h-6 mr-2" />
          <span className="text-sm text-gray-500">下载为Word文档</span>
        </div>
        <div className="p-1 hover:bg-zinc-200 cursor-pointer rounded-md flex items-center">
          <img src={download} alt="download" className="w-6 h-6 mr-2" />
          <span className="text-sm text-gray-500">下载为PDF文档</span>
        </div>
      </PopoverContent>
    </Popover>
  )
}
