/**
 * @name: RoomApi
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 7/20/2024 4:33 PM
 * @version: 1.0
 */
import instance from '@/api/filter'

const roomApi = ''

export const getRoomByScenarioId = (scenarioId: number) => {
  return instance.get(`${roomApi}/room/getByScenarioId?id=${scenarioId}`)
}

export const getRoomByUUId = (uuid: string) => {
  return instance.get(`${roomApi}/room/getByUUID?uuid=${uuid}`)
}

export const addRoomCollaborator = (param: any) => {
  return instance.post(`${roomApi}/room/addCollaborator`, param)
}

export const delRoomCollaborator = (param: any) => {
  return instance.post(`${roomApi}/room/delCollaborator`, param)
}

export const getScenarioInvolvedIn = (page: number, pageSize: number) => {
  if (page === undefined || pageSize === undefined)
    return instance.get(`${roomApi}/room/getScenarioInvolvedIn`)
  else
    return instance.get(`${roomApi}/room/getScenarioInvolvedIn?page=${page}&pageSize=${pageSize}`)
}
