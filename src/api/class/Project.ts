import type { BaseEntity, PageResponse } from '@/api/class/Common'

/**
 * @name: Project
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 7/10/2024 2:53 PM
 * @version: 1.0
 */
export interface Project extends BaseEntity {
  name: string
  progress: number
  type: boolean
  isEnable: boolean
}

export interface GetAllProjectResponse extends PageResponse {
  list: Project[]
}
