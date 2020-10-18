<!--
 * @Date: 2020-10-16 10:22:36
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-10-16 18:34:04
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\components\addClassification.vue
 * @Description: 添加分类
-->

<template>
  <div>
    <el-dialog width="70%" :visible.sync="addClassificationShow" :show-close="true" :before-close="dialogOnClose">
      <div slot="title" class="dialog-title">
        添加分类
      </div>
      <el-row>
        <el-col>
          <el-select v-model="classificationSelected" filterable placeholder="-- 从下拉列表中选择一个分类 --" clearable>
            <el-option
              v-for="item in classificationListFiltered"
              :key="item.description"
              :label="item.description"
              :value="item.description"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <div class="box">
            <div>
              <el-checkbox v-model="propagate">传播</el-checkbox>
            </div>
            <div>
              <el-checkbox v-model="removePropagation">当实体删除时移除传播</el-checkbox>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-checkbox v-model="isValidityPeriod">添加申请有效期</el-checkbox>
        </el-col>
      </el-row>
      <el-row v-if="isValidityPeriod">
        <el-col>
          <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="addToTimeList">增加有效期</el-button>
        </el-col>
        <el-col>
          <div class="box">
            <el-form>
              <el-form-item>
                <el-row v-for="item in timeList" :key="item">
                  <el-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
                    <span>开始时间</span>
                    <el-date-picker
                      v-model="item.startTime"
                      class="date-picker"
                      format="yyyy/MM/dd HH:mm:ss"
                      value-format="yyyy/MM/dd HH:mm:ss"
                      type="datetime"
                      placeholder="选择日期时间"
                    />
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
                    <span>结束时间</span>
                    <el-date-picker
                      v-model="item.endTime"
                      class="date-picker"
                      format="yyyy/MM/dd HH:mm:ss"
                      value-format="yyyy/MM/dd HH:mm:ss"
                      type="datetime"
                      placeholder="选择日期时间"
                    />
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="2" :lg="2" :xl="2">
                    <el-button style="margin-top: 15px;" type="danger" size="mini" icon="el-icon-close" @click="removeFromTimeList(item.id)" />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>

          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button plain type="primary" @click="dialogOnClose">取 消</el-button>
        <el-button plain type="primary" @click="dialogOnClose">确 定</el-button>
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
      classificationSelected: '', // 下拉列表选中值
      validityPeriod: false, // 是否添加申请有效期
      timeList: [],
      propagate: true, // 传播
      removePropagation: false // 当实体删除时移除传播
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
    timeList: {
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
          this.timeList = []
        }
      }
    }
  },
  created() {
    // 打开重置
    this.classificationSelected = ''
  },
  methods: {
    /**
     * @description: 通知父组件关闭dialog
     */
    dialogOnClose() {
      this.$emit('addclassificationclose')
    },
    /**
     * @description: 添加到时间列表
     */
    addToTimeList() {
      this.timeList.push({
        id: new Date().getTime(), startTime: '', endTime: '', timeZone: ''
      })
    },
    /**
     * @description: 从时间列表移除
     */
    removeFromTimeList(delId) {
      this.timeList = this.timeList.filter(item => item.id.toString() !== delId.toString())
    },
    /**
     * @description: 添加分类
     */
    async add() {
      const res = await addClassification({
        classification: {
          typeName: this.classificationSelected,
          attributes: {},
          propagate: this.propagate,
          removePropagationsOnEntityDelete: this.removePropagation,
          validityPeriods: this.timeList
        },
        entityGuids: [this.classificationInfo.guid] }
      )
      if (res.status === 200) {
        console.log(res)
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
      ::v-deep .el-select {
        width: 100%;
      }
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
.date-picker {
  ::v-deep .el-input__inner {
    width: 100%;
  }
}
</style>
