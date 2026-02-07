import { QueryClientProvider } from '@tanstack/react-query'
import { setDefaultOptions } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { queryClient } from '@/utils/query-client'

import { EditorProvider } from './editor/context'
import { router } from './router'

setDefaultOptions({ locale: zhCN })

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <EditorProvider>
        <Toaster position="top-center" />
        <RouterProvider router={router} />
      </EditorProvider>
    </QueryClientProvider>
  )
}

export default App
