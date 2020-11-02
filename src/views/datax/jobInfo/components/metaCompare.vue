<template>
  <div style="margin-top: 20px; margin-left: 20px;">
    <el-button>执行</el-button>
    <el-button>查询日志</el-button>
    <el-button>编辑</el-button>
    <el-button>删除</el-button>
    <el-divider />
    <el-form ref="dataForm" :model="temp" label-position="left" label-width="130px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="任务名称" prop="jobDesc">
            <el-input v-model="temp.jobDesc" size="medium" placeholder="请输入任务描述" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="基准数据源连接" prop="baseDataSourceId">
            <el-select v-model="temp.baseDataSourceId" placeholder="请选择基准数据源连接">
              <el-option v-for="item in blockStrategies" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="基准Schema">
            <el-input v-model="temp.baseSchema" placeholder="请输入基准Schema" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="待比较数据源连接" prop="dataSourceId">
            <el-select v-model="temp.dataSourceId" placeholder="请选择待比较数据源连接">
              <el-option v-for="item in blockStrategies" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="待比较Schema">
            <el-input v-model="temp.schema" placeholder="请输入待比较Schema" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-button @click="dialogFormVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="createCompareJob">
        确定
      </el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'MetaCompare',
  data() {
    return {
      temp: {},
      blockStrategies: []
    }
  },
  methods: {
    createCompareJob() {

    }
  }
}
</script>

<style>
</style>
