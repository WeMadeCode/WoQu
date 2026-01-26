import type { CreatePagePayload, PageGraphRes, PageListRes, UpdatePagePayload } from '@/types/api'
import { request } from '@/utils/request'

/**
 * 获取页面列表
 * @returns
 */
export const fetchPageList = async (): Promise<PageListRes> => {
  return await request.get('/page')
}

/**
 * 获取页面详情
 */
export const fetchPageDetail = async (pageId: string) => {
  return await request.get(`/page/${pageId}`)
}

/**
 * 删除页面
 * @param data
 * @returns
 */
export const removePage = async (pageId: string) => {
  return await request.delete(`/page`, { data: { pageId } })
}

/**
 * 创建页面
 * @param data
 * @returns
 */
export const createPage = async (data: CreatePagePayload) => {
  return await request.post('/page', data)
}

/**
 * 更新页面
 */
export const updatePage = async (data: UpdatePagePayload) => {
  return await request.put('/page', data)
}

/**
 * 获取页面图谱
 */
export const fetchPageGraph = async (): Promise<PageGraphRes> => {
  return await request.get('/page/graph')
}
