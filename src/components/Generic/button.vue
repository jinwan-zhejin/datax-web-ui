<template>
  <div class="btn">
    <div v-if="type === '普通'" class="b1">{{ name }}</div>
    <div v-if="type === '删除'" class="d1">{{ name }}</div>
  </div>
</template>

<script>
export default {
  name: 'ComButton',
  props: {
    type: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
.btn {
  .b1 {
    width: 84px;
    height: 36px;
    cursor: pointer;
    color: #ffffff;
    background-color: #3D5FFF;
    border-radius: 4px;
  }
  .b1:hover {
    background-color: #506FFF;
  }
  .b1:active {
    background-color: #3655E5;
  }
  .d1 {
    width: 84px;
    height: 36px;
    cursor: pointer;
    color: #ffffff;
    background-color: #FE4646;
    border-radius: 4px;
  }
  .d1:hover {
    background-color: #FE5858;
  }
  .d1:active {
    background-color: #E43E3E;
  }
}
</style>
