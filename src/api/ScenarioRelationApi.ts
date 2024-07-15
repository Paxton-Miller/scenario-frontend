/**
 * @name: ScenarioRelationApi
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 7/12/2024 10:11 PM
 * @version: 1.0
 */

import instance from '@/api/filter'

const scenarioRelationApi = ''

export const getAllScenarioRelation = () => {
  return instance.get(`${scenarioRelationApi}/scenarioRelation/getAll`)
}

export const getAllScenarioRelationByProjectId = (id: number) => {
  return instance.get(`${scenarioRelationApi}/scenarioRelation/getAllByProjectId?id=${id}`)
}

export const addScenarioRelation = (params: any) => {
  return instance.post(`${scenarioRelationApi}/scenarioRelation/add`, params)
}

export const batchAddScenarioRelation = (params: any) => {
  return instance.post(`${scenarioRelationApi}/scenarioRelation/batchAdd`, params)
}

export const editScenarioRelation = (params: any) => {
  return instance.post(`${scenarioRelationApi}/scenarioRelation/edit`, params)
}

export const batchEditScenarioRelation = (params: any) => {
  return instance.post(`${scenarioRelationApi}/scenarioRelation/batchEdit`, params)
}

export const delScenarioRelation = (id: number) => {
  return instance.delete(`${scenarioRelationApi}/scenarioRelation/del?id=${id}`)
}

export const batchDelScenarioRelation = (idList: number[]) => {
  return instance.delete(`${scenarioRelationApi}/scenarioRelation/batchDel`, { data: idList })
}
