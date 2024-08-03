/**
 * @name: RoomCollaboratorApi
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 7/29/2024 4:09 PM
 * @version: 1.0
 */
import instance from '@/api/filter'

const roomCollaboratorApi = ''

export const getCollaboratorByRoomId = (roomId: number) => {
  return instance.get(`${roomCollaboratorApi}/roomCollaborator/getByRoomId?roomId=${roomId}`)
}

export const addRoomCollaborator = (param: any) => {
  return instance.post(`${roomCollaboratorApi}/roomCollaborator/add`, param)
}

export const editRoomCollaborator = (param: any) => {
  return instance.post(`${roomCollaboratorApi}/roomCollaborator/edit`, param)
}

export const delRoomCollaborator = (param: any) => {
  return instance.delete(`${roomCollaboratorApi}/roomCollaborator/del`, { data: param })
}

export const getScenarioInvolvedIn = (page: number, pageSize: number) => {
  if (page === undefined || pageSize === undefined)
    return instance.get(`${roomCollaboratorApi}/roomCollaborator/getScenarioInvolvedIn`)
  else
    return instance.get(`${roomCollaboratorApi}/roomCollaborator/getScenarioInvolvedIn?page=${page}&pageSize=${pageSize}`)
}
