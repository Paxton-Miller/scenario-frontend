<!--
  @name: Chat
  @description: TODO
  @author: Lingkai Shi
  @date: 7/16/2024 9:43 PM
  @version: 1.0
-->

<script setup lang="ts">
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { getUserById } from '@/api/UserApi'
import CollaboratorTable from '@/pages/invite-collaboration/components/CollaboratorTable.vue'
import { useDimensionStore } from '@/store/dimension'
import { useEChartsStore } from '@/store/echarts'
import { isEmpty } from '@/utils/StringTool'

const props = defineProps({
  scenarioId: {
    default: 1,
    type: Number,
  },
  room: {
    default: {},
  },
})

const store = useDimensionStore()
const echartsStore = useEChartsStore()

// Chat WebSocket link
const ws = ref(new WebSocket(`ws://localhost:8898/chatWs/${store.roomUUID}?token=${localStorage.getItem('token').substring(7)}`))
const imgRef = ref()
const popoverRef = ref()

const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}

const inputText = ref('')
const chatText = ref('')
const content = ref('')
const remoteUser = ref()

const createContent = (nowUser: boolean, remote: boolean, text: string) => {
  let html

  // 当前用户消息
  // https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png
  if (nowUser) { // nowUser 表示是否显示当前用户发送的聊天消息，绿色气泡
    html = '<div class="el-row" style="padding: 5px 0">\n'
      + '  <div class="el-col el-col-22" style="text-align: right; padding-right: 5px">\n'
      + `    <div class="tip left">${text}</div>\n`
      + '  </div>\n'
      + '  <div class="el-col el-col-2">\n'
      + '  <span class="el-avatar el-avatar--circle" style="height: 20px; width: 20px; line-height: 20px;">\n'
      + `    <img src="${localStorage.getItem('avatar')}" ref="${imgRef.value}" v-click-outside="${onClickOutside}" style="object-fit: cover;">\n`
      + '  </span>\n'
      + '  </div>\n'
      + '</div>'
  }
  else if (remote) { // remoteUser表示远程用户聊天消息，蓝色的气泡
    html = '<div class="el-row" style="padding: 5px 0">\n'
      + '  <div class="el-col el-col-2" style="text-align: right">\n'
      + '  <span class="el-avatar el-avatar--circle" style="height: 20px; width: 20px; line-height: 20px;">\n'
      + `    <img src="${remoteUser.value.avatar}" style="object-fit: cover;">\n`
      + '  </span>\n'
      + '  </div>\n'
      + '  <div class="el-col el-col-22" style="text-align: left; padding-left: 10px">\n'
      + `    <div class="tip right">${text}</div>\n`
      + '  </div>\n'
      + '</div>'
  }
  console.log(html)
  content.value += html
}

// current tab name
const activeName = ref('first')

// onChatMsg is useless right now
const onChatMsg = async (message: any) => {
  chatText.value += message.data

  const userId = localStorage.getItem('id')
  const data = JSON.parse(message.data)
  if (data.userId == userId) {
    createContent(true, false, data.content)
  }
  else {
    remoteUser.value = await getUserById(data.userId) as unknown as any
    createContent(false, true, data.content)
  }
}

defineExpose({
  onChatMsg,
})

const initWebSocket = () => {
  ws.value.onopen = () => {
    // define the event when receiving a new message
    ws.value.onmessage = async message => {
      console.log('chat websocket connected')
      chatText.value += message.data

      const userId = localStorage.getItem('id')
      const data = JSON.parse(message.data)

      console.log(data)

      // Normal msgs, the beginning and the end of the chat would all show on the chat panel
      if (data.content.includes('just joined the chat') || data.content.includes('just quit the chat') || data.isMsg) {
        // show the message on right side if the current user is the sender
        if (data.userId == userId) {
          createContent(true, false, data.content)
        }
        else {
          remoteUser.value = await getUserById(data.userId) as unknown as any
          createContent(false, true, data.content)
        }
      }

      // if the message is wordcloud, render it
      else {
        echartsStore.updateChart(JSON.parse(data.content))
      }
    }
    ws.value.onerror = e => {
      console.log(e)
    }
    ws.value.onclose = e => {
      console.log(`${e.code} ${e.reason} ${e.wasClean}`)
    }
  }
}

// make the chat component always on the bottom when receiving a new message
const scrollToBottom = () => {
  const container = document.getElementById('chatPanel')!

  container.scrollTop = container.scrollHeight
}

// Hearbeat: send a message that will not be sent to other users to the server on a certain interval
const sendMessagePing = () => {
  if (ws.value && ws.value.readyState === WebSocket.OPEN)
    ws.value.send('ping')
  else
    console.log('WebSocket has lost connection~')
}

const sendMsg = () => {
  if (isEmpty(inputText.value))
    return ElMessage.warning('Unable to send null message')
  ws.value.send(inputText.value)
  inputText.value = ''
}

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

onMounted(async () => {
  initWebSocket()
  setInterval(() => {
    // 心跳机制，60秒一次
    sendMessagePing()
  }, 1000 * 60)
})
onBeforeUnmount(() => {
  ws.value.close()
})
watch(() => content.value, val => {
  nextTick(() => {
    scrollToBottom()
  })
})
</script>

<template>
  <ElTabs
    v-model="activeName"
    class="demo-tabs"
    @tab-click="handleClick"
  >
    <ElTabPane
      label="Chat"
      name="first"
    >
      <div
        style=" margin: 0 auto; background-color: white;
                    border-radius: 5px; box-shadow: 0 0 10px #ccc"
      >
        <div
          id="chatPanel"
          style="height:220px; overflow-y:auto; overflow-x: hidden"
          v-html="content"
        />
        <ElInput
          id="message"
          v-model="inputText"
          size="small"
        >
          <template #append>
            <ElIcon
              style="cursor: pointer"
              @click="sendMsg"
            >
              <component is="promotion" />
            </ElIcon>
          </template>
        </ElInput>
      </div>
    </ElTabPane>
    <ElTabPane
      label="Collaborator"
      name="second"
    >
      <CollaboratorTable
        :room="props.room as any"
        :show-header="false"
        layout="prev, next, jumper"
      />
    </ElTabPane>
  </ElTabs>
</template>

<style>
.tip {
  color: white;
  text-align: left;
  border-radius: 10px;
  font-family: sans-serif;
  font-size: smaller;
  padding: 5px;
  max-width: 200px;
  width: auto;
  display: inline-block !important;
  display: inline;
}

.right {
  background-color: deepskyblue;
}

.left {
  background-color: forestgreen;
}
</style>
