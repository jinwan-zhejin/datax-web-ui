<!--
 * @Date: 2020-10-23 10:25:52
 * @Author: Anybody
 * @LastEditors: ,: Anybody
 * @LastEditTime: ,: 2020-11-02 16:24:33
 * @FilePath: ,: \datax-web-ui\src\views\cloudbeaveratlas\components\addCustomFilter.vue
 * @Description: 添加自定义过滤器
-->
<template>
  <div>
    <el-dialog width="40%" :visible="addCustomFilterShow" title="保存自定义过滤器" @close="closeAddCustomFilter">
      <el-form ref="dataForm" :model="dataForm">
        <el-form-item label="过滤器名称" prop="name" :rules="[{ required: true, message: '输入过滤器名' }]">
          <el-select v-model="dataForm.name" filterable placeholder="输入或选择过滤器名" clearable>
            <el-input v-model="dataForm.name" placeholder="输入过滤器名" clearable />
            <el-option
              v-for="(item, index) in filterList"
              :key="index"
              :label="'更新： '+item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" plain type="primary" @click="closeAddCustomFilter">取 消</el-button>
        <el-button size="small" type="primary" @click="submit('dataForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCustomFilters, addCustomFilters, setCustomFilters } from '@/api/datax-metadata-atlas'
export default {
  name: 'AddCustomFilter',
  props: {
    addCustomFilterShow: Boolean
  },
  data() {
    return {
      dataForm: {
        name: '', // 名称
        form: '' // 提交的数据
      },
      filterList: []
    }
  },
  watch: {
    addCustomFilterShow(val) {
      if (val) {
        this.dataForm.name = ''
        this.getCFList()
      }
    }
  },
  created() {
    this.dataForm.name = ''
    this.getCFList()
  },
  methods: {
    async getCFList() {
      const res = await getCustomFilters()
      if (res.status === 200 && res.statusText === 'OK') {
        this.filterList = res.data
        // console.log(this.filterList);
      } else {
        this.$message({
          message: '查询自定义过滤器失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
    },
    async setCF(data) {
      const res = await setCustomFilters(data)
      if (res.status === 200 && res.statusText === 'OK') {
        this.$message({
          message: '修改自定义过滤器成功',
          showClose: true,
          type: 'success',
          duration: 4000
        })
        this.getCFList()
        this.closeAddCustomFilter()
        this.refresh()
      } else {
        this.$message({
          message: '修改自定义过滤器失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
    },
    async addCF(data) {
      const res = await addCustomFilters(data)
      if (res.status === 200 && res.statusText === 'OK') {
        this.$message({
          message: '添加自定义过滤器成功',
          showClose: true,
          type: 'success',
          duration: 4000
        })
        this.getCFList()
        this.closeAddCustomFilter()
        this.refresh()
      } else {
        this.$message({
          message: '添加自定义过滤器失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
    },
    refresh() {
      const temp = this.$route.query
      this.$router.replace({
        name: 'atlasResult',
        query: {}
      })
      this.$router.replace({
        name: 'atlasResult',
        query: temp
      })
    },
    /**
     * @description: 关闭
     */
    closeAddCustomFilter() {
      this.$refs.dataForm.resetFields()
      this.$emit('closeaddcustomfilter')
    },
    /**
     * @description: 提交
     */
    submit(dataForm) {
      this.$refs[dataForm].validate((valid) => {
        if (valid) {
          // console.log(this.$route.query);
          var found = false
          for (var i = 0; i < this.filterList.length; i++) {
            if (this.filterList[i].name === this.dataForm.name) {
              console.log('更新' + this.dataForm.name);
              this.filterList[i].searchParameters.typeName = this.$route.query.hasOwnProperty('type')
                ? this.$route.query.type : null
              this.filterList[i].searchParameters.classification = this.$route.query.hasOwnProperty('tag')
                ? this.$route.query.tag : null
              if (this.$route.query.hasOwnProperty('attributes')) {
                var tempAttributes = []
                var tempAttr = decodeURIComponent(this.$route.query.attributes).split(',')
                for (var k = 0; k < tempAttr.length; k++) {
                  tempAttributes.push(tempAttr[k])
                }
                this.filterList[i].searchParameters.attributes = tempAttributes
              } else {
                this.filterList[i].searchParameters.attributes = []
              }
              this.setCF(this.filterList[i])
              found = true
              break
            }
          }
          if (!found) {
            console.log('添加' + this.dataForm.name);
            var tempForm = {}
            tempForm.name = this.dataForm.name
            tempForm.searchType = 'BASIC'
            tempForm.searchParameters = {}
            tempForm.searchParameters.excludeDeletedEntities = true
            tempForm.searchParameters.includeSubClassifications = true
            tempForm.searchParameters.includeSubTypes = true
            if (this.$route.query.hasOwnProperty('type')) {
              tempForm.searchParameters.typeName = this.$route.query.type
            }
            if (this.$route.query.hasOwnProperty('tag')) {
              tempForm.searchParameters.classification = this.$route.query.tag
            }
            if (this.$route.query.hasOwnProperty('attributes')) {
              var tempAttributes2 = []
              var tempAttr2 = decodeURIComponent(this.$route.query.attributes).split(',')
              for (var k2 = 0; k2 < tempAttr2.length; k2++) {
                tempAttributes2.push(tempAttr2[k2])
              }
              tempForm.searchParameters.attributes = tempAttributes2
            } else {
              tempForm.searchParameters.attributes = []
            }
            // console.log(tempForm);
            this.addCF(tempForm)
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-select {
  width: 100%;
}
</style>
