import type { BaseEntity, PageResponse } from '@/api/class/Common'

/**
 * @name: Resource
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 7/18/2024 9:46 AM
 * @version: 1.0
 */
export interface Resource extends BaseEntity {
  name: string
  uuidName: string
  url: string
  format: string
  accessLevel: string
  type: string
}

export interface GetAllResourceResponse extends PageResponse {
  list: Resource[]
}
