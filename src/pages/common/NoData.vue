<!--
  @name: [...accessDenied]
  @description: TODO
  @author: Lingkai Shi
  @date: 7/20/2024 10:36 PM
  @version: 1.0
-->

<script setup lang="ts">
const props = defineProps({
  content: {
    type: String,
    default: 'Oops, no data to show',
  },
})
</script>

<template>
  <div class="invite-container">
    <div class="title-container">
      <h3 class="title">
        {{ content }}
      </h3>
    </div>
    <img
      src="../../assets/images/collaboration.jpg"
      class="invite-img"
    ><br>
  </div>
</template>

<style lang="scss" scoped>
$bg: #fff;
$dark_gray: #889aa4;
$dark: #000;
$cursor: #fff;

.invite-container {
  min-height: 70vh;
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
