<!--
 * @Date: 2020-09-28 17:52:31
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-10-19 18:09:22
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\components\subPageResult.vue
 * @Description: 右半部分显示 - 表
-->

<template>
  <div>
    <el-row class="top-buttons">
      <el-col>
        <el-tooltip content="刷新搜索结果" placement="top">
          <el-button type="primary" size="mini" plain icon="el-icon-refresh" @click="refreshList" />
        </el-tooltip>
        <el-button type="primary" size="mini" plain icon="el-icon-arrow-right" @click="test">筛选</el-button>
        <el-button type="primary" size="mini" plain @click="backToSearch">清除</el-button>
        <el-tooltip content="保存为自定义筛选器" placement="top">
          <el-button type="primary" size="mini" plain icon="el-icon-folder-add" @click="saveAsCustomFilter">保存过滤器</el-button>
        </el-tooltip>
        <!-- <el-button type="primary" size="mini" plain icon="el-icon-plus" @click="addNewEntity">新建实体</el-button> -->
        <el-select
          v-model="tableColumnsSelected"
          size="small"
          multiple
          collapse-tags
          placeholder="其他列项"
          @change="test2"
        >
          <el-option
            v-for="item in tableColumns"
            :key="item.value"
            :label="translateIt(item.label)"
            :value="item.value"
          />
        </el-select>
      </el-col>
    </el-row>
    <el-row class="typeAndClassifications">
      <el-col v-if="searchRequestItem.length > 0" :span="24">
        <span class="searchResult">
          <span v-for="(item, index) in searchRequestItem" :key="item+index" class="filterQuery">
            <span>(</span>
            <span class="group">
              <span class="capsuleView">
                <span class="key">{{ item.key }}</span>
                <span> : </span>
                <span class="value">{{ item.value }}</span>
                <i class="el-icon-error" @click="deleteFilterItem(item)" />
              </span>
            </span>
            <span>)</span>
            <span v-if="index !== (searchRequestItem.length - 1)">AND</span>
          </span>
        </span>
        <!-- <div v-for="(item, index) in searchRequestItem" :key="item+index">
          <span>{{ index === 0 ? '(&nbsp;' : '' }}</span>
          <span>{{ item.key }}: {{ item.value }}<i class="el-icon-error" @click="deleteThisRequest(item)" /></span>
          {{ index !== (searchRequestItem.length - 1) ? '&nbsp;And&nbsp;' : '' }}
          <span>{{ index === (searchRequestItem.length - 1) ? ')&nbsp;' : '' }}</span>
        </div> -->
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table class="tableStyle" :data="tableData">
          <el-table-column key="名称" label="名称" prop="attributes.name" min-width="100" :show-overflow-tooltip="true">
            <template v-slot:default="{row}">
              <a class="tableItemLink" @click="goToDetails(row)"><i class="el-icon-document" />&nbsp;{{ row.attributes.name }}</a>
            </template>
          </el-table-column>
          <el-table-column key="所有者" label="所有者" prop="attributes.owner" />
          <el-table-column key="描述" label="描述" min-width="110" prop="attributes.description" />
          <el-table-column key="类型" label="类型" prop="typeName">
            <template v-slot:default="{row}">
              <a class="tableItemLink" @click="gotoNextResult('entity',row.typeName)">{{ row.typeName }}</a>
            </template>
          </el-table-column>
          <el-table-column key="分类" label="分类" width="150">
            <template v-slot:default="{ row }">
              <el-button-group v-if="row.classifications.length > 1" style="width: 150px">
                <el-tooltip :content="row.classifications[0].typeName">
                  <el-button plain size="mini" style="width:100px;overflow:hidden;text-overflow:ellipsis;" @click="gotoNextResult('classification',row.classifications[0].typeName)">{{ row.classifications[0].typeName }}</el-button>
                </el-tooltip>
                <el-button plain size="mini" style="width:12px;" icon="el-icon-close" />
              </el-button-group>
              <el-dropdown v-if="row.classifications.length > 1" trigger="click" placement="bottom-start" :hide-on-click="false" @click.stop.native>
                <el-button type="success" plain size="mini">
                  <i class="el-icon-more" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div v-for="(classes, index) in row.classifications" :key="classes">
                      <el-button-group v-if="index !== 0" style="width: 150px">
                        <el-tooltip :content="classes.typeName">
                          <el-button plain size="mini" style="width:100px;overflow:hidden;text-overflow:ellipsis;" @click="gotoNextResult('classification',classes.typeName)">{{ classes.typeName }}</el-button>
                        </el-tooltip>
                        <el-button plain size="mini" style="width:12px;" icon="el-icon-close" />
                      </el-button-group>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button type="success" plain size="mini" icon="el-icon-plus" @click="addClassification(row)" />
            </template>
          </el-table-column>
          <!-- <el-table-column key="术语" label="术语" width="150">
            <template v-slot:default="{ row }">
              <div v-for="classes in row.meanings" :key="classes">
                <el-button-group style="width: 150px">
                  <el-tooltip :content="classes.displayText">
                    <el-button plain size="mini" style="width:100px;overflow:hidden;text-overflow:ellipsis;" @click="test(classes)">{{ classes.displayText }}</el-button>
                  </el-tooltip>
                  <el-button plain size="mini" style="width:12px;" icon="el-icon-close" />
                </el-button-group>
              </div>
              <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="test(row)" />
            </template>
          </el-table-column> -->
          <el-table-column key="操作" label="操作" min-width="115">
            <template v-slot:default="{ row }">
              <el-button type="primary" plain size="mini" @click="metaCompare(row.guid)">元数据比对</el-button>
            </template>
          </el-table-column>
          <el-table-column v-for="item in tableColumnsSelected" :key="item.value" :label="item.label" :prop="item.value" />
        </el-table>
        <!-- <el-pagination
          background
          :current-page="current"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500]"
          :page-size="25"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        /> -->
      </el-col>
    </el-row>
    <el-dialog title="元数据比对" :visible.sync="metaCompareVisible" :before-close="initCompare" :show-close="false">
      <el-form ref="compareParams" :model="compareParams" label-position="left">
        <el-form-item>
          <el-radio v-model="compareType" label="time">时间版本比对</el-radio>
          <el-radio v-model="compareType" label="dimen">空间版本比对</el-radio>
        </el-form-item>
        <el-form-item v-if="compareType === 'time'" label="基线时间: " prop="baselineTime" :rules="{required: true, message: '请选择比较基线时间点', trigger: 'blur'}">
          <el-select v-model="compareParams.baselineTime" placeholder="请选择比较基线时间点" clearable>
            <el-option v-for="(item,index) in versionListLite(compareParams.toTime)" :key="index" :label="formatDate(item.timestamp)" :value="item.timestamp" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="compareType === 'time'" label="待比较时间点: " prop="toTime" :rules="{required: true, message: '请选择待比较时间点', trigger: 'blur'}">
          <el-select v-model="compareParams.toTime" placeholder="请选择待比较时间点" clearable>
            <el-option v-for="(item,index) in versionListLite(compareParams.baselineTime)" :key="index" :label="formatDate(item.timestamp)" :value="item.timestamp" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCompareTask">取消</el-button>
        <el-button type="primary" @click="submitCompareTask('compareParams')">提交</el-button>
      </div>
    </el-dialog>
    <AddClassification :add-classification-show="addClassificationShow" :classification-info="classificationInfo" :classification-list="classificationList" @addclassificationclose="addClassificationShow=false" />
  </div>
</template>

<script>
// import AddNewEntity from './addNewEntity'
import AddClassification from './addClassification'
import * as apiatlas from '@/api/datax-metadata-atlas'
import { translater } from '../utils/dictionary'

export default {
  name: 'SubPageResult',
  components: {
    AddClassification
  },
  // searchRequest 对象，存entity type和classifications
  props: {
    // eslint-disable-next-line vue/require-default-prop
    searchRequest: Object,
    // eslint-disable-next-line vue/require-default-prop
    classificationList: Array // 分类有值列表
  },
  data() {
    return {
      tableColumnsSelected: [],
      tableColumns: [
        { label: 'Contact_info', value: 'contact_info' },
        { label: 'DisplayName', value: 'displayName' },
        { label: 'InputToProcesses', value: 'inputToProcesses' },
        { label: 'Instance', value: 'instance' },
        { label: 'Meanings', value: 'meanings' },
        { label: 'Model', value: 'model' },
        { label: 'OutputFromProcesses', value: 'outputFromProcesses' },
        { label: 'Pipeline', value: 'pipeline' },
        { label: 'ProdOrOther', value: 'prodOrOther' },
        { label: 'QualifiedName', value: 'qualifiedName' },
        { label: 'ReplicatedFrom', value: 'replicatedFrom' },
        { label: 'ReplicatedTo', value: 'replicatedTo' },
        { label: 'Schema', value: 'schema' },
        { label: 'Tables', value: 'tables' },
        { label: 'UserDescription', value: 'userDescription' },
        { label: 'Created Timestamp', value: '__timestamp' },
        { label: 'Last Modified Timestamp', value: '__modificationTimestamp' },
        { label: 'Last Modified User', value: '__modifiedBy' },
        { label: 'Created By User', value: '__createdBy' },
        { label: 'Status', value: '__state' },
        { label: 'Guid', value: '__guid' },
        { label: 'Type Name', value: '__typeName' },
        { label: 'IsIncomplete', value: '__isIncomplete' },
        { label: 'Label(s)', value: '__labels' },
        { label: 'User-defined Properties', value: '__customAttributes' }
      ],
      tableColumnsPlus: [], // 除固定显示的列，额外显示的列项
      tableData: [], // 表数据
      tableTotal: 0, // 总数
      metaCompareVisible: false, // 版本比较dialog可见
      // 比较参数
      compareParams: {
        baselineTime: '',
        toTime: ''
      },
      versionList: [], // 所有版本列表
      compareType: 'time', // 选择比较方式 time dimen
      addClassificationShow: false, // 打开添加分类面板
      classificationInfo: {} // 为该条添加分类（guid，typeName）
    }
  },
  computed: {
    searchRequestItem() {
      const temp = []
      if (this.searchRequest['params'].typeName !== null) {
        temp.push({
          key: '类型',
          name: 'typeName',
          value: this.searchRequest['params'].typeName
        })
      }
      if (this.searchRequest['params'].classification !== null) {
        temp.push({
          key: '分类',
          name: 'classification',
          value: this.searchRequest['params'].classification
        })
      }
      if (this.searchRequest['params'].termName !== null) {
        temp.push({
          key: '术语',
          name: 'termName',
          value: this.searchRequest['params'].termName
        })
      }
      if (this.searchRequest['params'].query !== null) {
        temp.push({
          key: '查询',
          name: 'query',
          value: this.searchRequest['params'].query
        })
      }
      console.log(temp)
      return temp
    },
    formatDate() {
      return timestamp => {
        const date = new Date(timestamp)
        const y = date.getFullYear()
        let MM = date.getMonth() + 1
        MM = MM < 10 ? ('0' + MM) : MM
        let d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        let h = date.getHours()
        h = h < 10 ? ('0' + h) : h
        let m = date.getMinutes()
        m = m < 10 ? ('0' + m) : m
        let s = date.getSeconds()
        s = s < 10 ? ('0' + s) : s
        return y + '/' + MM + '/' + d + ' ' + h + ':' + m + ':' + s
      }
    },
    versionListLite() {
      return rmItem => {
        return this.versionList.filter(item => item.timestamp !== rmItem)
      }
    }
  },
  watch: {
    // 深度监控父组件传值searchRequest是否改变
    searchRequest: {
      handler: function(val) {
        this.refreshList()
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.refreshList()
    })
  },
  methods: {
    test2() {
      console.log(this.tableColumnsSelected)
    },
    test(info) {
      console.log(info)
    },
    async metaCompare(guid) {
      // console.log(guid)
      const res = await apiatlas.getVersionInfo(guid)
      // console.log(res)
      if (res.code === 200) {
        this.metaCompareVisible = true
        this.versionList = res.content
        console.log(this.versionList)
      } else {
        this.$message({
          message: '获取版本数据出错',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
    },
    submitCompareTask(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 调用比较接口，成功后提示成功信息；失败后需要提示失败及相关错误信息
          this.getCompareResult()
          this.resetCompare()
          this.metaCompareVisible = false
        } else {
          return false
        }
      })
    },
    cancelCompareTask() {
      this.resetCompare()
      this.metaCompareVisible = false
      this.$notify({
        title: '取消比对任务',
        message: '元数据比对任务已经取消',
        type: 'info',
        duration: 3000
      })
    },
    /**
         * @description: 初始化页面并返回到Search界面
         */
    backToSearch() {
      // console.log('通知父组件切页面')
      this.initSearchRequest()
      this.$emit('changepage', 'atlasSearch')
    },
    /**
         * @description: 通知父组件跳转到details界面
         */
    goToDetails(row) {
      this.$emit('changedetail', JSON.stringify(row))
    },
    /**
         * @description: 重新获取表信息
         */
    async refreshList() {
      // console.log('父组件传值改变重新获取数据')
      if (this.searchRequest.params.typeName === null && this.searchRequest.params.termName === null && this.searchRequest.params.classification === null && this.searchRequest.params.query === null) {
        if (this.searchRequest.businessMetadata === null) {
          // 全空报错
          // this.$message({
          //   message: '未选择实体、分类、业务元数据、词汇表、自定义过滤器',
          //   showClose: true,
          //   type: 'error',
          //   duration: 4000
          // })
          this.backToSearch()
        } else {
          // 执行渲染businessmetadata
          console.log('渲染businessmetadata')
        }
      } else {
        const res = await apiatlas.getTableByItems(this.searchRequest.params)
        console.log(res)
        if (res.status === 200 && res.statusText === 'OK') {
          this.tableData = res.data.entities
          this.tableTotal = res.data.approximateCount
        } else {
          this.$message({
            message: '获取对应记录出错',
            showClose: true,
            type: 'error',
            duration: 4000
          })
        }
      }
    },
    /**
         * @description: 通知父组件初始化查找条件
         */
    initSearchRequest() {
      this.$emit('changepage', 'initSearchByListItem')
    },
    /**
         * @description: 保存为自定义过滤器
         */
    saveAsCustomFilter() {
      console.log('保存为自定义过滤器')
    },
    /**
         * @description: 新建实体
         */
    addNewEntity() {
      console.log('弹出新建实体组件')
    },
    /**
         * @description: 删除筛选条件
         */
    deleteFilterItem(item) {
      // console.log('删除查询搜索条件')
      this.$emit('deletefilteritem', JSON.stringify(item))
    },
    gotoNextResult(type, param) {
      this.$emit('changeresult', type.concat('?').concat(param))
    },
    /**
     * @description: 打开添加分类面板
     */
    addClassification(row) {
      this.classificationInfo = row
      this.addClassificationShow = true
    },
    /**
     * @description: 翻译
     * @param {String} 待翻译文本
     * @return {String} 翻译文本
     */
    translateIt(str) {
      return translater(str)
    },
    async getCompareResult() {
      const res = await apiatlas.getCompareResult(this.versionList[0].entityId, this.compareParams)
      console.log(res);
      // if (res.code === 200) {
      this.$notify({
        title: '成功',
        message: "元数据比对任务提交成功, 请到'元数据比对'模块查看比对进度及结果详情！",
        type: 'success',
        duration: 3000
      })
      // }
    },
    initCompare(done) {
      this.compareParams.baselineTime = ''
      this.compareParams.toTime = ''
      done()
    },
    resetCompare() {
      this.$refs['compareParams'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.top-buttons {
    .el-button {
        font-size: 14px;
    }
    .el-col {
        margin-bottom: 10px;
        .el-select {
          margin: 0 0 0 10px;
          ::v-deep .el-input__inner {
            background: #ECF5FF;
            border-color: #b1d7fd;
            height: 30px;
            &::placeholder {
              color: #409eff;
            }
          }
        }
    }
}

.typeAndClassifications {
  margin-bottom: 10px;
    .el-col {
        span {
            position: relative;
            // color: #409eff;
            color: #686868;
            font-weight: bold;
            i {
                cursor: pointer;
                color: #686868;
            }
            i:hover {
                color: #acacac;
            }
        }
        .searchResult {
          .filterQuery {
            .group {
              display: inline-block;
              height: 1.9em;
              line-height: 1.9em;
              border: 1px solid #409eff;
              border-radius: 1.9em;
              .capsuleView {
                padding: 5px;
                .key {
                  color: #38BB9B;
                  font-size: 0.8rem;
                }
                .value {
                  color: #409eff;
                  font-size: 0.9rem;
                }
              }
            }
          }
        }
    }
}

.tableStyle {
    width: 100%;
}

.tableItemLink {
    color: #006ad4;

    i {
        font-weight: bold;
    }
}

.tableItemLink:hover {
    text-decoration: underline;
}
</style>
