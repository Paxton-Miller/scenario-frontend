import type { BaseEntity } from '@/api/class/Common'

/**
 * @name: ScenarioRelation
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 7/12/2024 10:06 PM
 * @version: 1.0
 */
export interface ScenarioRelation extends BaseEntity {
  name: string
  projectId: number
  sourceId: number
  targetId: number
  type: boolean
}
