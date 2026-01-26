import { Outlet } from 'react-router-dom'

import { Aside } from '@/components/layout-aside/aside'
import { SidebarProvider } from '@/components/ui/sidebar'

const Layout = () => {
  return (
    <SidebarProvider>
      <Aside></Aside>
      <Outlet></Outlet>
    </SidebarProvider>
  )
}

export default Layout
