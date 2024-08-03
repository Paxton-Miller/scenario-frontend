/**
 * @name: GeoJsonApi
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 8/3/2024 11:26 AM
 * @version: 1.0
 */
import instance from '@/api/filter'

const geoJsonApi = ''

export const addGeoJson = (param: any) => {
  return instance.post(`${geoJsonApi}/geojson/add`, param)
}

export const addGeoJsonByFile = (param: FormData) => {
  instance.defaults.headers['Content-type'] = 'multipart/form-data'

  const fun = instance.post(`${geoJsonApi}/geojson/addByFile`, param)

  instance.defaults.headers['Content-type'] = 'application/json'

  return fun
}

export const getGeoJsonById = (id: string) => {
  return instance.get(`${geoJsonApi}/geojson/${id}`)
}
