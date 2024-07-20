import type { PageResponse } from '@/api/class/Common'
import { Room } from '@/api/class/Room'

/**
 * @name: Login
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 4/27/2024 10:13 AM
 * @version: 1.0
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * @name: User
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 5/20/2024 10:53 AM
 * @version: 1.0
 */
export interface LoginResponse {
  token: string
}

/**
 * @name: Register
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 5/8/2024 2:44 PM
 * @version: 1.0
 */

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

/**
 * @name: SessionWebUser
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 5/8/2024 2:55 PM
 * @version: 1.0
 */

export interface SessionWebUser {
  id: number
  email: string
  type: number
  token: string
  exp: number
}

export interface GetAllUserResponse extends PageResponse {
  list: []
}
