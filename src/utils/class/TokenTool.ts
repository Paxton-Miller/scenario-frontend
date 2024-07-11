/**
 * @name: TokenTool
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 5/8/2024 4:04 PM
 * @version: 1.0
 */

// 工具类
class TokenTool {
  // 记录索引用，当通过递归搜索节点时，存在则这个值大于0
  public Index: number = 0

  FormatToken(res: string) {
    return decodeURIComponent(escape(window.atob(res.replace('-', '+').replace('_', '/').split('.')[1])))
  }

  FormatDate(val: number) {
    // PS：注意这个地方，要乘以1000
    const dt = new Date(val * 1000)
    const y = dt.getFullYear()
    const m = (`${dt.getMonth() + 1}`).padStart(2, '0')
    const d = (`${dt.getDate()}`).padStart(2, '0')
    const hh = (`${dt.getHours()}`).padStart(2, '0')
    const mm = (`${dt.getMinutes()}`).padStart(2, '0')
    const ss = (`${dt.getSeconds()}`).padStart(2, '0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }

  GetDate() {
    const dt = new Date()
    const y = dt.getFullYear()
    const m = (`${dt.getMonth() + 1}`).padStart(2, '0')
    const d = (`${dt.getDate()}`).padStart(2, '0')
    const hh = (`${dt.getHours()}`).padStart(2, '0')
    const mm = (`${dt.getMinutes()}`).padStart(2, '0')
    const ss = (`${dt.getSeconds()}`).padStart(2, '0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }

  ClearLocalStorage() {
    localStorage.setItem('id', '')
    localStorage.setItem('token', '')
    localStorage.setItem('type', '')
    localStorage.setItem('email', '')
    localStorage.setItem('path', '/')
    localStorage.setItem('expDate', '')
  }

  IsEmpty(value: any) {
    return value === '' || value === null || value === undefined
  }

  FindTree(tree: [], name: string) {
    if (tree !== undefined && tree.length > 0) {
      tree.forEach((item: any) => {
        if (item.path === name) {
          this.Index++
        }
        else
          this.FindTree(item.children, name)
      })
    }
  }
}

export default TokenTool
