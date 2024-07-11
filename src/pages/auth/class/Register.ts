/**
 * @name: Register
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 5/8/2024 2:44 PM
 * @version: 1.0
 */
import type { RegisterRequest } from '@/api/class/User'

export interface RegisterForm extends RegisterRequest {
  confirmPwd: string
}
