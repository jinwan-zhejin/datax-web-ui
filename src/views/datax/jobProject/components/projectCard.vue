<!--
 * @Date: 2020-12-28 15:04:59
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-12-29 10:55:12
 * @FilePath: \datax-web-ui\src\views\datax\jobProject\components\projectCard.vue
 * @Description: 项目卡片
-->
<template>
  <el-card shadow="never" class="box-card" :body-style="{ padding: '0px' }">
    <div slot="header" class="clearfix">
      <span class="title">项目: </span>
      <span>{{ content.name }}</span>
    </div>
    <el-form class="forms">
      <el-form-item label="项目描述" :label-width="labelWidth" :label-position="'left'">
        <span class="texts">{{ content.description }}</span>
      </el-form-item>
      <el-form-item label="所属用户" :label-width="labelWidth" :label-position="'left'">
        <span class="texts">{{ getNameById(content.userId) }}</span>
      </el-form-item>
    </el-form>
    <slot name="options" />
    <div class="bottom clearfix project-time">
      <time class="time">{{ content.createTime }}创建</time>
    </div>
  </el-card>
</template>

<script>
import { getAllUser, getAllUserProject } from '@/api/datax-user'

export default {
  name: 'ProjectCard',
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      labelWidth: '90px',
      users: []
    }
  },
  computed: {
    getNameById() {
      return id => {
        const temp = this.users.filter(item => item.id === id)
        return temp[0]?.username
      }
    }
  },
  created() {
    getAllUser().then(response => {
      this.users = response
    })
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  z-index: 2020;
  border-radius: 0 !important;
  >>> .el-card__header {
    border: 0 !important;
  }
  .project-time {
    font-size: 13px;
    text-align: right;
    color: #00000040;
    margin: 7px;
  }
}
.box-card:hover {
  position: relative;
  z-index: 2021;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1)
}
.forms {
  .el-form-item {
    margin-bottom: 0px !important;
  }
  >>> .el-form-item__label {
    font-weight: normal;
    color: #999999;
    line-height: 30px !important;
  }
  >>> .el-form-item__content {
    line-height: 30px !important;
  }
  .texts {
    color: #333333;
  }
}
</style>
