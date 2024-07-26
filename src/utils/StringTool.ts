/**
 * @name: StringTool
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 7/26/2024 7:55 PM
 * @version: 1.0
 */
// check if the string is blank
export const isEmpty = (msg: string) => {
  return msg === null || msg.match(/^ *$/) !== null
}
