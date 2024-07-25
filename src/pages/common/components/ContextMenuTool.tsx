import { ElButton, ElDropdown } from 'element-plus'
import { ToolsView } from '@antv/x6'
import { createApp } from 'vue'
import { useContextMenuStore } from '@/store/contextMenu'

const store = useContextMenuStore()

// ContextMenu挂载的Vue实例
let app: any = null
let timer: any = null // timer

class ContextMenuTool extends ToolsView.ToolItem {
  toggleContextMenu(visible: any, pos: any) {
    if (app) {
      // 清空上次内容
      app.unmount()
      document.getElementById('graph-dropdown')!.innerHTML = ''
      app = null
    }
    document.removeEventListener('mousedown', this.onMouseDown)

    if (visible && pos) {
      app = createApp(
        <ElDropdown
          trigger={['contextmenu']}
        >
          {{
            default: () => {
              // menu是在createEdge传入的args
              if (Array.isArray((this.options as any).menu)) {
                return <div style="padding: 5px;">
                  {
                    (this.options as any).menu.map((item: any) => {
                      return <ElButton style="margin-left: 0;display:block;border: 0;" icon={item.icon}
                        onClick={item.onClick}>{item.label}</ElButton>
                    })
                  }
                </div>
              }
            },
          }}
        </ElDropdown>)

      // 减去本身元素的宽高
      document.getElementById('graph-dropdown')!.style.left = `${pos.x - 40}px`
      document.getElementById('graph-dropdown')!.style.top = `${pos.y - 40}px`
      app.mount('#graph-dropdown')
      document.addEventListener('mousedown', this.onMouseDown)
    }
  }

  onMouseDown = () => {
    timer = window.setTimeout(() => {
      this.toggleContextMenu(false, false)
    }, 200)
  }

  onContextMenu({ e, x, y, cell, view }: any) {
    // eslint-disable-next-line no-restricted-syntax
    // debugger
    if (timer) {
      clearTimeout(timer)
      timer = 0
    }

    // store.e = e
    // store.x = x
    // store.y = y
    // store.cell = cell
    // store.view = view
    Object.assign(store, { e, x, y, cell, view })
    this.toggleContextMenu(true, { x: e.pageX + 40, y: e.pageY })
  }

  delegateEvents() {
    this.cellView.on('cell:contextmenu', this.onContextMenu, this)

    return super.delegateEvents()
  }

  onRemove() {
    this.cellView.off('cell:contextmenu', this.onContextMenu, this)
  }
}

ContextMenuTool.config({
  tagName: 'div',
  isSVGElement: false,
})

export {
  ContextMenuTool,
}
