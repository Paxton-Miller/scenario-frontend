<!--
  @name: invite
  @description: TODO
  @author: Lingkai Shi
  @date: 7/20/2024 2:53 PM
  @version: 1.0
-->

<script setup lang="ts">
import { addRoomCollaborator, getRoomByUUId } from '@/api/RoomApi'
import type { Room } from '@/api/class/Room'

const route = useRoute()
const router = useRouter()
const room = ref<Room>()
const isAlreadyACollaborator = ref<boolean>(false)

const checkIdentity = async () => {
  // First, check if I’m already a collaborator of the scenario.
  const result = await getRoomByUUId(route.query.roomUUId as string) as unknown as Room
  if (result)
    room.value = result
  const regex = new RegExp(`(^|,)${localStorage.getItem('id') as number}(,|$)`)
  if (regex.test(room.value?.collaborator as string))
    isAlreadyACollaborator.value = true
}

const handleJoin = async () => {
  const param = {
    uuid: route.query.roomUUId,
    collaboratorList: [],
  }

  param.collaboratorList.push(localStorage.getItem('id'))

  const result = await addRoomCollaborator(param) as unknown as Room
  if (result) {
    ElMessage.success('Let\'s collaborate!')
    await router.push({
      name: 'Scenario',
      query: { id: result.scenarioId },
    })
  }
}

const handleEnter = async () => {
  await router.push({
    name: 'Scenario',
    query: { id: room.value?.scenarioId },
  })
}

const handleClick = () => {
  if (isAlreadyACollaborator.value)
    handleEnter()
  else
    handleJoin()
}

onMounted(async () => {
  await checkIdentity()
})
</script>

<template>
  <div class="invite-container">
    <div class="title-container">
      <h3 class="title">
        {{ isAlreadyACollaborator === true ? 'Oops, it seems like you\'re already in.' : 'Let\'s get it done!' }}
      </h3>
    </div>
    <img
      class="invite-img"
      src="../../assets/images/collaboration.jpg"
    >
    <br>
    <ElButton
      size="large"
      plain
      class="join-button"
      @click="handleClick"
    >
      <span style="font-size: larger;font-family: Consolas">
        {{ isAlreadyACollaborator === true ? 'Enter the Collaboration' : 'Join the Collaboration' }}
      </span>
    </ElButton>
  </div>
</template>

<style lang="scss" scoped>
$bg: #fff;
$dark_gray: #889aa4;
$dark: #000;
$cursor: #fff;

.invite-container {
  min-height: 100vh;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  text-align: center;

  .invite-img {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 40px 25px 0;
    margin: auto auto;
    overflow: hidden;
  }

  .join-button {
    width: 20%;
    box-sizing: border-box;
  }

  .tips {
    font-size: 16px;
    line-height: 28px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 46px;
      color: $dark;
      margin: 60px auto auto auto;
      text-align: center;
      font-weight: bold;
      font-family: "Comic Sans MS";
    }

    ::v-deep .lang-select {
      position: absolute;
      top: 4px;
      right: 0;
      background-color: white;
      font-size: 22px;
      padding: 4px;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .show-pwd {
    // position: absolute;
    // right: 10px;
    // top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    userApi-select: none;
  }
}
</style>
