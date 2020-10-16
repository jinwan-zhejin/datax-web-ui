<!--
 * @Date: 2020-09-27 16:38:14
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-10-16 14:36:29
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\components\addNewEntity.vue
 * @Description: 新建实体 模态框
-->

<template>
  <div>
    <el-dialog width="60%" :visible.sync="createDialogShow" :show-close="true" :before-close="createDialogOnClose">
      <div slot="title" class="dialog-title">
        新建实体
      </div>
      <el-row>
        <el-col :span="24">
          <el-select v-model="entityType" size="small" filterable placeholder="请选择实体">
            <el-option
              v-for="item in entityTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col v-if="entityType !== ''" :span="24" style="margin-top:15px;">
          <el-switch
            v-model="chooseRequire"
            style="position: relative;float:right;"
            active-text="所有选项"
            inactive-text="所需选项"
          />
        </el-col>
      </el-row>
      <el-row v-if="entityType !== ''" style="margin-top:15px;">
        属性
        <el-col :span="24">
          <div id="attributes" class="form-ring">
            <el-form>
              <el-form-item v-for="item in createEntityAttributes" :key="item.label" :label="item.label.concat(' (').concat(item.type).concat(')')">
                <el-input v-model="item.value" :placeholder="item.label" />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="entityType !== ''" style="margin-top:15px;">
        关系
        <el-col :span="24">
          <div id="relationships" class="form-ring">
            <el-form>
              <el-form-item v-for="item in createEntityRelationships" :key="item.label" :label="item.label.concat(' (').concat(item.type).concat(')')">
                <el-input v-model="item.value" :placeholder="item.label" />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createDialogOnClose">取消</el-button>
        <el-button type="primary" @click="createDialogOnSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AddNewEntity',
  prop: ['createDialogShow'], // createDialogShow - 父传子 显示Dialog与否
  data() {
    return {
      /* 输入 - 属性
       * value: 当前值
       * label: 显示名
       * type : 类型 不同类型用不同标签展示
       * string[el-input]
       * long[el-input]-numberOnly
       * int[el-input]-numberOnly
       * array<AtlasServer>[el-input]-输入后匹配输入建议
       * boolean[el-select]
       * date[el-date-picker]
       */
      createEntityAttributes: {
        clusterName: { value: '', label: '集群名称', type: 'string' },
        createTime: { value: '', label: '创建时间', type: 'date' },
        description: { value: '', label: '描述', type: 'string' },
        displayName: { value: '', label: '显示名称', type: 'string' },
        extendedAttributes: { value: '', label: '扩展属性', type: 'map<string,string>' },
        fileSize: { value: '', label: '文件大小', type: 'long' },
        group: { value: '', label: '组', type: 'string' },
        isFile: { value: '', label: '是否文件', type: 'boolean' },
        isSymlink: { value: '', label: '是否符号链接', type: 'boolean' },
        modifiedTime: { value: '', label: '修改时间', type: 'date' },
        name: { value: '', label: '名称', type: 'string' },
        nameServiceId: { value: '', label: '名称服务id', type: 'string' },
        numberOfReplicas: { value: '', label: '副本数', type: 'int' },
        owner: { value: '', label: '所有者', type: 'string' },
        path: { value: '', label: '路径', type: 'string' },
        posixPermission: { value: '', label: 'Posix权限', type: 'fs_permissions' },
        qualifiedName: { value: '', label: '合格名称', type: 'string' },
        replicatedFrom: { value: '', label: '复制来自', type: 'array<AtlasServer>' },
        replicatedTo: { value: '', label: '复制到', type: 'array<AtlasServer>' },
        userDescription: { value: '', label: '用户描述', type: 'string' }
      },
      /* 输入 - 关系
       * value: 当前值
       * label: 显示名
       * type : 类型 不同类型用不同标签展示
       * array<>[el-input]-输入后匹配输入建议
       * spark_ml_*[el-select]
       */
      createEntityRelationships: {
        inputToProcesses: { value: '', label: '输入到进程', type: 'array<Process>' },
        meanings: { value: '', label: '意义', type: 'array<AtlasGlossaryTerm>' },
        model: { value: '', label: '模型', type: 'spark_ml_model' },
        outputFromProcesses: { value: '', label: '进程输出', type: 'array<Process>' },
        pipeline: { value: '', label: '管道', type: 'spark_ml_pipeline' },
        schema: { value: '', label: '图式', type: 'array<avro_schema>' }
      },
      entityType: '', // 当前选择的实体类型
      // 实体类型列表
      entityTypeOptions: [
        { label: 'hdfs_path', value: 'hdfs_path' },
        { label: 'hdfs_path_2', value: 'hdfs_path_2' }
      ],
      chooseRequire: false // 选择所需/选择所有
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
