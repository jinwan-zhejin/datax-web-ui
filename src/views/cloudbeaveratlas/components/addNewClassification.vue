<!--
 * @Date: 2020-10-23 14:05:25
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-10-26 16:19:48
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\components\addNewClassification.vue
 * @Description: 添加新分类
-->
<template>
  <div>
    <el-dialog :visible.sync="addNewClassificationShow" :title="superTypes===''?'添加新分类':'添加子分类'" @close="closeAddNewClassification">
      <el-form ref="dataForm" :model="dataForm">
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '输入名称', trigger: 'blur' }]">
          <el-input v-model="dataForm.name" placeholder="名称（必须）" clearable />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="dataForm.description" placeholder="描述" clearable />
        </el-form-item>
        <el-form-item label="选择分类以继承属性（可选）" prop="inhertName">
          <el-col>
            <span>属性定义分类的其他属性</span>
          </el-col>
          <el-col class="line-col">
            <el-select v-model="dataForm.superTypes" placeholder="搜索属性" multiple clearable>
              <el-option v-for="(item, index) in myAllClassification" :key="index" :label="item.name" :value="item.name" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="属性（可选）">
          <el-button plain size="mini" type="primary" @click="addAttribute">添加新属性</el-button>
        </el-form-item>
        <el-form-item
          v-for="(item, index) in dataForm.attributeDefs"
          :key="index"
          :prop="'attributeDefs.' + index + '.name'"
          :rules="{ required: true, message: '新增属性名不能为空', trigger: 'blur' }"
        >
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-input v-model="item.name" placeholder="属性名" clearable />
          </el-col>
          <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
            <el-select v-model="item.typeName" placeholder="类型" clearable>
              <el-option label="string" value="string" />
              <el-option label="boolean" value="boolean" />
              <el-option label="byte" value="byte" />
              <el-option label="short" value="short" />
              <el-option label="int" value="int" />
              <el-option label="float" value="float" />
              <el-option label="double" value="double" />
              <el-option label="date" value="date" />
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="24" :md="2" :lg="2" :xl="2">
            <el-button size="mini" type="danger" icon="el-icon-close" @click="removeAttribute(index)" />
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="closeAddNewClassification">关 闭</el-button>
        <el-button v-loading="isLoading" size="small" type="primary" @click="submit('dataForm')">添 加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addNewClassification } from '@/api/datax-metadata-atlas'
export default {
  name: 'AddNewClassification',
  props: {
    allClassification: { type: Array, default: () => ([]) },
    addNewClassificationShow: Boolean,
    superTypes: { type: String, default: () => ('') }
  },
  data() {
    return {
      dataForm: {
        name: '', // 名称
        description: '', // 描述
        superTypes: [], // 继承类型
        attributeDefs: [ // 属性
          // cardinality: "SINGLE"
          // isIndexable: true
          // isOptional: true
          // isUnique: false
          // name: "wwww"
          // typeName: "string"
          // valuesMaxCount: 1
          // valuesMinCount: 0
        ]
      },
      isLoading: false // loading
    }
  },
  computed: {
    myAllClassification() {
      return this.allClassification.filter(item => item.name.charAt(0) !== '_')
    }
  },
  watch: {
    'superTypes'(val) {
      this.dataForm.superTypes = []
      if (val !== '') {
        this.dataForm.superTypes.push(val)
      }
    }
  },
  created() {
    this.dataForm.superTypes = []
    if (this.superTypes !== '') {
      this.dataForm.superTypes.push(this.superTypes)
    }
  },
  methods: {
    /**
     * @description: 关闭
     */
    closeAddNewClassification() {
      this.$refs.dataForm.resetFields()
      this.isLoading = false
      this.$emit('closeaddnewclassification')
    },
    /**
     * @description: 提交
     */
    submit(dataForm) {
      this.$refs[dataForm].validate((valid) => {
        if (valid) {
          // console.log(this.dataForm);
          this.addNewClassification()
        } else {
          return false
        }
      })
    },
    /**
     * @description: 添加新分类
     */
    async addNewClassification() {
      this.isLoading = true
      const res = await addNewClassification(this.dataForm)
      if (res.status === 200 && res.statusText === 'OK') {
        this.isLoading = false
        this.$message({
          message: '添加分类成功',
          showClose: true,
          type: 'success',
          duration: 4000
        })
        this.$emit('refreshclassification')
        this.closeAddNewClassification()
      } else {
        this.$message({
          message: '添加分类失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
        this.isLoading = false
      }
    },
    /**
     * @description: 添加属性
     */
    addAttribute() {
      this.dataForm.attributeDefs.push({
        cardinality: 'SINGLE',
        isIndexable: true,
        isOptional: true,
        isUnique: false,
        name: '',
        typeName: 'string',
        valuesMaxCount: 1,
        valuesMinCount: 0
      })
    },
    /**
     * @description: 移除属性
     */
    removeAttribute(index) {
      this.dataForm.attributeDefs.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.line-col {
  ::v-deep .el-select {
    width: 100%;
  }
}
</style>
