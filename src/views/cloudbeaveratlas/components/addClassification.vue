<!--
 * @Date: 2020-10-16 10:22:36
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-10-21 18:32:39
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\components\addClassification.vue
 * @Description: 添加分类
-->

<template>
  <div>
    <el-dialog width="70%" :visible.sync="addClassificationShow" :show-close="true" :before-close="cancelAdd">
      <div slot="title" class="dialog-title">
        添加分类
      </div>
      <el-form ref="dataForm" :model="dataForm">
        <el-form-item prop="classificationSelected" :rules="[{ required: true, message: '请选择分类'}]" label="分类">
          <el-select v-model="dataForm.classificationSelected" filterable placeholder="-- 从下拉列表中选择一个分类 --" clearable>
            <el-option
              v-for="item in classificationListFiltered"
              :key="item.description"
              :label="item.description"
              :value="item.description"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div>
              <el-checkbox v-model="propagate">传播</el-checkbox>
            </div>
            <div>
              <el-checkbox v-model="removePropagation">当实体删除时移除传播</el-checkbox>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-checkbox v-model="isValidityPeriod">添加申请有效期</el-checkbox>
          </el-col>
        </el-form-item>
        <el-form-item v-if="isValidityPeriod">
          <el-col>
            <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="addToTimeList">增加有效期</el-button>
          </el-col>
        </el-form-item>
        <el-form-item
          v-for="(item, index) in dataForm.timeList"
          :key="index"
          :prop="'timeList.' + index + '.time'"
          :rules="{ required: true, message: '添加有效期不能为空', trigger: 'blur' }"
        >
          <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
            <span>有效期</span>
          </el-col>
          <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
            <el-date-picker
              v-model="item.time"
              class="date-picker"
              format="yyyy/MM/dd HH:mm:ss"
              value-format="yyyy/MM/dd HH:mm:ss"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            />
          </el-col>
          <el-col :xs="24" :sm="24" :md="2" :lg="2" :xl="2">
            <el-button type="danger" size="mini" icon="el-icon-close" @click="removeFromTimeList(item.id)" />
          </el-col>
        </el-form-item>
        <el-form-item
          v-if="dataForm.classificationSelected.indexOf('CLASSIFIED') > -1"
          prop="tag"
          :rules="[{ required: true, message: '请输入tag'}]"
          label="标签"
        >
          <el-input v-model="dataForm.tag" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" plain type="primary" @click="cancelAdd">取 消</el-button>
        <el-button size="small" plain type="primary" @click="submitAdd('dataForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addClassification } from '@/api//datax-metadata-atlas'
export default {
  name: 'AddClassification',
  props: {
    addClassificationShow: Boolean, // dialog开闭
    // eslint-disable-next-line vue/require-default-prop
    classificationInfo: Object, // 为哪个添加分类
    // eslint-disable-next-line vue/require-default-prop
    classificationList: Array // 分类列表
  },
  data() {
    return {
      validityPeriod: false, // 是否添加申请有效期
      propagate: true, // 传播
      removePropagation: false, // 当实体删除时移除传播
      // 表单验证
      dataForm: {
        classificationSelected: '', // 下拉列表选中值
        tag: '',
        timeList: []
      }
    }
  },
  computed: {
    classificationListFiltered() {
      var temp = []
      for (var i in this.classificationList) {
        if (this.classificationList[i].description[0] !== '_') {
          if (this.classificationInfo.classificationNames.indexOf(this.classificationList[i].description) > -1) {
            continue
          }
          temp.push(this.classificationList[i])
        }
      }
      return temp
    },
    isValidityPeriod: {
      get() {
        return this.validityPeriod
      },
      set(val) {
        this.validityPeriod = val
      }
    },
    timeListPlus() {
      var temp = this.dataForm.timeList
      for (var i in this.dataForm.timeList) {
        temp[i].startTime = this.dataForm.timeList[i].time[0]
        temp[i].endTime = this.dataForm.timeList[i].time[1]
      }
      return temp
    }
  },
  watch: {
    classificationInfo: {
      handler(val) {
        this.classificationInfo = val
        console.log(this.classificationInfo);
      },
      deep: true
    },
    'dataForm.timeList': {
      handler(val) {
        if (val.length <= 0) {
          this.validityPeriod = false
        }
      }
    },
    validityPeriod: {
      handler(val, oldVal) {
        if (oldVal === false) {
          this.addToTimeList()
        } else {
          this.dataForm.timeList = []
        }
      }
    }
  },
  created() {
    // 打开重置
    this.dataForm.classificationSelected = ''
    this.validityPeriod = false
    this.dataForm.timeList = []
    this.propagate = true
    this.removePropagation = false
    this.dataForm.tag = ''
  },
  methods: {
    /**
     * @description: 通知父组件关闭dialog
     */
    cancelAdd() {
      this.dataForm.classificationSelected = ''
      this.validityPeriod = false
      this.dataForm.timeList = []
      this.propagate = true
      this.removePropagation = false
      this.dataForm.tag = ''
      this.$emit('addclassificationclose')
    },
    /**
     * @description: 提交/验证添加分类表单
     */
    submitAdd(dataForm) {
      this.$refs[dataForm].validate((valid) => {
        if (valid) {
          this.add()
          // console.log('asdasdasd')
        } else {
          return false
        }
      })
    },
    /**
     * @description: 添加到时间列表
     */
    addToTimeList() {
      this.dataForm.timeList.push({
        id: new Date().getTime(), time: null, startTime: '', endTime: '', timeZone: ''
      })
    },
    /**
     * @description: 从时间列表移除
     */
    removeFromTimeList(delId) {
      this.dataForm.timeList = this.dataForm.timeList.filter(item => item.id.toString() !== delId.toString())
    },
    /**
     * @description: 添加分类
     */
    async add() {
      var temp = {}
      if (this.dataForm.classificationSelected.indexOf('CLASSIFIED') > -1) {
        temp.tag = this.dataForm.tag
      } else {
        temp = {}
      }
      const res = await addClassification({
        classification: {
          typeName: this.dataForm.classificationSelected,
          attributes: temp,
          propagate: this.propagate,
          removePropagationsOnEntityDelete: this.removePropagation,
          validityPeriods: this.timeListPlus
        },
        entityGuids: [this.classificationInfo.guid] }
      )
      if (res.status === 204) {
        // console.log(res)
        this.$message({
          message: '分类添加成功',
          showClose: true,
          type: 'success',
          duration: 4000
        })
        this.cancelAdd()
      } else {
        this.$message({
          message: '分类添加失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog {
  .el-row {
    margin-bottom: 10px;
    .el-col {
      padding: 10px;
      .box {
        border: 1px solid rgba(196, 196, 196, 0.7);
        border-radius: 7px;
        div {
          padding: 10px;
        }
      }
    }
  }

}
::v-deep .el-select {
  width: 100%;
}
.date-picker {
  ::v-deep .el-input__inner {
    width: 100%;
  }
}
</style>
