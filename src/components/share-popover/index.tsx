import { Share2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export function SharePopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm">
          <Share2 size={16} className="" />
          分享
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <p className="text-xs mb-3 text-zinc-500">任何人可以访问该链接</p>
        <Input className="w-full h-8 bg-zinc-100  rounded-md" value="https://www.page.com" disabled />
        <div className="mt-6 text-sm">
          <div className="flex flex-row items-center justify-between mb-4">
            <div className="font-medium">任何人</div>
            <div className="text-xs text-zinc-500">可阅读</div>
          </div>
          <div className="flex flex-row items-center justify-between mb-4">
            <div className="font-medium">登录用户</div>
            <div className="text-xs text-zinc-500">可编辑</div>
          </div>
        </div>
        <Button size="sm" className="w-full">
          复制链接
        </Button>
      </PopoverContent>
    </Popover>
  )
}
