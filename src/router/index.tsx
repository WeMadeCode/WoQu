import { createBrowserRouter, Navigate } from 'react-router-dom'

import { Document } from '@/components/document'
import { DocumentList } from '@/components/document-list'
import Layout from '@/layout'
import Login from '@/login'

import { Auth } from './auth'

// 这里是为了解决 react-router-dom 的类型问题

type PickRouter<T> = T extends (...args: any[]) => infer R ? R : never

type A = typeof createBrowserRouter

export const router: PickRouter<A> = createBrowserRouter([
  {
    path: '/',
    element: (
      <Auth>
        <Layout />
      </Auth>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="/doc" replace />,
      },
      {
        path: 'doc',
        element: <DocumentList />,
      },
      {
        path: 'doc/:id',
        element: <Document />,
      },
    ],
  },
  {
    path: '/account/login',
    element: <Login />,
  },
])
