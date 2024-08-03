import type { BaseEntity, PageResponse } from '@/api/class/Common'
import { Room } from '@/api/class/Room'

/**
 * @name: RoomCollaborator
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 7/29/2024 5:36 PM
 * @version: 1.0
 */
export interface RoomCollaborator extends BaseEntity {
  permissionLevel: string
  roomId: number
  userId: number
}
