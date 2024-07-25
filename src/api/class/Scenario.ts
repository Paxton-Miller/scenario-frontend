import type { BaseEntity, PageResponse } from '@/api/class/Common'
import { Project } from '@/api/class/Project'

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

export interface ScenarioWithProject extends BaseEntity {
  name: string
  projectName: string
  projectId: number
  roomUUID: string
}

export interface GetScenarioWithProjectResponse extends PageResponse {
  list: ScenarioWithProject[]
}
