import type { BaseEntity, PageResponse } from '@/api/class/Common'

/**
 * @name: Scenario
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 7/12/2024 10:02 PM
 * @version: 1.0
 */
export interface Scenario extends BaseEntity {
  name: string
  projectId: number
  x: number
  y: number
  width: number
  height: number
  node: string
  type: boolean
  isEnable: boolean
}
