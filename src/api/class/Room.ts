import type { BaseEntity, PageResponse } from '@/api/class/Common'
import { Project } from '@/api/class/Project'

/**
 * @name: Room
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 7/20/2024 4:44 PM
 * @version: 1.0
 */
export interface Room extends BaseEntity {
  collaborator: string
  permissionLevel: string
  uuid: string
  scenarioId: number
}

export interface GetAllRoomResponse extends PageResponse {
  list: Room[]
}
