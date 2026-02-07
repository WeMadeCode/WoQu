// import { docxDefaultSchemaMappings, DOCXExporter } from '@blocknote/xl-docx-exporter'
import more from '@/assets/more.svg'
import pdfIcon from '@/assets/pdf.svg'
import wordIcon from '@/assets/word.svg'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useEditorContext } from '@/editor/context'

export function MorePopover() {
  // 从上下文获取编辑器实例
  const { editor } = useEditorContext()
  // const editor = useBlockNoteEditor()
  console.log('1-------', editor)
  // Exports the editor content to DOCX and downloads it.
  const onDownloadClick = async () => {
    // 在这里如何 拿到全局创建的编辑器？
    // const exporter = new DOCXExporter(editor.state.schema, docxDefaultSchemaMappings)
    // const blob = await exporter.toBlob(editor.document)
    // const link = document.createElement('a')
    // link.href = window.URL.createObjectURL(blob)
    // link.download = 'My Document (blocknote export).docx'
    // document.body.appendChild(link)
    // link.dispatchEvent(
    //   new MouseEvent('click', {
    //     bubbles: true,
    //     cancelable: true,
    //     view: window,
    //   })
    // )
    // link.remove()
    // window.URL.revokeObjectURL(link.href)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <img src={more} alt="more" className="w-6 h-6 cursor-pointer hover:bg-zinc-200 rounded-md transition-colors duration-200" />
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={15} className="w-auto min-w-[200px] p-1.5">
        <div
          onClick={onDownloadClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer hover:bg-zinc-100 transition-all duration-200 group border border-transparent hover:border-zinc-200"
        >
          <img src={wordIcon} alt="word" className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
          <span className="text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors font-medium">下载为Word文档</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer hover:bg-zinc-100 transition-all duration-200 group border border-transparent hover:border-zinc-200">
          <img src={pdfIcon} alt="pdf" className="w-5 h-5 text-red-600 group-hover:text-red-700 transition-colors" />
          <span className="text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors font-medium">下载为PDF文档</span>
        </div>
      </PopoverContent>
    </Popover>
  )
}
