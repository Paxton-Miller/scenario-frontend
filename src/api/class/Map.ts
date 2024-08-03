import type { BaseEntity, PageResponse } from '@/api/class/Common'

/**
 * @name: Map
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 8/2/2024 10:39 AM
 * @version: 1.0
 */
export interface Map extends BaseEntity {
  name: string
  mapUrl: string
  logoUrl: string
  vectorUrl: string
  attributions: string
  accessLevel: string
}

export interface GetAllMapResponse extends PageResponse {
  list: Map[]
}
