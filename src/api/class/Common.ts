/**
 * @name: Common
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 7/10/2024 2:55 PM
 * @version: 1.0
 */
export interface PageResponse {
  totalCount: number
  pageSize: number
  page: number
  pageTotal: number
}

export interface BaseEntity {
  id: number
  description?: string
  createUserId: number
  createDate: string
  modifyUserId?: number
  modifyDate?: string
  isDeleted: boolean
}
