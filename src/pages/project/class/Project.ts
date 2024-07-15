/**
 * @name: Project
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 7/10/2024 5:10 PM
 * @version: 1.0
 */
export interface AddForm {
  name: string
  description?: string
}

export interface AddRequest extends AddForm {

}

export interface AddConnectorForm {
  source_id: number | string
  target_id: number | string
  label: string
}
