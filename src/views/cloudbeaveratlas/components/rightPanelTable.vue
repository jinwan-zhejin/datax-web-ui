<!--
 * @Date: 2020-09-28 17:52:31
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-10-12 19:11:05
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\components\rightPanelTable.vue
 * @Description: 右半部分显示 - 表
-->

<template>
  <div>
    <el-row class="top-buttons">
      <el-col :span="12" style="min-width: 234px;">
        <el-tooltip content="刷新搜索结果" placement="top">
          <el-button type="primary" size="" plain icon="el-icon-refresh" @click="refreshList" />
        </el-tooltip>
        <el-button type="primary" size="" plain icon="el-icon-arrow-right" @click="test">筛选</el-button>
        <el-button type="primary" size="" plain @click="backToSearch">Clear</el-button>
      </el-col>
      <el-col :span="12" style="min-width: 334px;">
        <el-tooltip content="保存为自定义筛选器" placement="top">
          <el-button type="primary" size="" plain icon="el-icon-folder-add" @click="saveAsCustomFilter">Save Filter</el-button>
        </el-tooltip>
        <!-- <el-button type="primary" size="mini" plain icon="el-icon-plus" @click="createNewEntity">新建实体</el-button> -->
        <!-- <el-dropdown size="" trigger="click" :hide-on-click="false">
          <el-button type="primary" size="" plain>
            列项<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in tableColumns" :key="item">{{ item }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
        <el-select
          v-model="tableColumnsSelected"
          multiple
          collapse-tags
          style="margin-left: 20px;"
          placeholder="列项"
          @change="test2"
        >
          <el-option
            v-for="item in tableColumns"
            :key="item.value"
            :label="item.label"
            :value="item"
          />
        </el-select>
      </el-col>
    </el-row>
    <el-row class="typeAndClassifications">
      <el-col v-if="searchRequestItem.length > 0">
        <div v-for="(item, index) in searchRequestItem" :key="item+index">
          <span>{{ index === 0 ? '(&nbsp;' : '' }}</span>
          <span>{{ item.key }}: {{ item.value }}<i class="el-icon-error" @click="deleteThisRequest(item)" /></span>
          {{ index !== (searchRequestItem.length - 1) ? '&nbsp;And&nbsp;' : '' }}
          <span>{{ index === (searchRequestItem.length - 1) ? ')&nbsp;' : '' }}</span>
        </div>
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
          <el-table-column key="所有者" label="所有者" min-width="80" prop="attributes.owner" />
          <el-table-column key="描述" label="描述" min-width="110" prop="attributes.description" />
          <el-table-column key="类型" label="类型" min-width="115" prop="typeName">
            <template v-slot:default="{row}">
              <a class="tableItemLink" @click="refreshList">{{ row.typeName }}</a>
            </template>
          </el-table-column>
          <el-table-column key="分类" label="分类" prop="classificationNames">
            <template v-slot:default="{ row }">
              <div v-for="classes in row.classifications" :key="classes">
                <el-tooltip :content="classes.typeName">
                  <el-button type="primary" plain size="mini">{{ classes.typeName }}</el-button>
                </el-tooltip>
              </div>
              <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="test(row)" />
            </template>
          </el-table-column>
          <el-table-column key="术语" label="术语" prop="">
            <template v-slot:default="{ row }">
              <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="test(row)" />
            </template>
          </el-table-column>
          <el-table-column key="操作" label="操作" min-width="80">
            <template v-slot:default="{ row }">
              <el-button type="primary" plain size="mini" @click="metaCompare(row)">元数据比对</el-button>
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
    <el-dialog title="元数据比对" :visible.sync="metaCompareVisible">
      <el-form :model="compareParams" label-position="left">
        <el-form-item>
          <el-radio v-model="compareType" label="time">时间版本比对</el-radio>
          <el-radio v-model="compareType" label="dimen">空间版本比对</el-radio>
        </el-form-item>
        <el-form-item v-if="compareType == 'time'" label="基线时间: ">
          <el-select v-model="compareParams.baselineTime" placeholder="请选择比较基线时间点" />
        </el-form-item>
        <el-form-item v-if="compareType == 'time'" label="待比较时间点: ">
          <el-select v-model="compareParams.toTime" placeholder="请选择待比较时间点" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCompareTask">取消</el-button>
        <el-button type="primary" @click="submitCompareTask">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import CreateNewEntityDialog from './createNewEntityDialog'
import {
  getTableByItems
} from '@/api/datax-metadata-atlas'

export default {
  name: 'RightPanelTable',
  // searchRequest 对象，存entity type和classifications
  props: {
    searchRequest: Object
  },
  data() {
    return {
      tableColumnsSelected: [],
      tableColumns: [
        { label: '联系资料', value: 'contact_info' },
        { label: '显示名称', value: 'displayName' },
        { label: '输入到进程', value: 'inputToProcesses' },
        { label: '实例', value: 'instance' },
        { label: '意义', value: 'meanings' },
        { label: '模型', value: 'model' },
        { label: '进程输出', value: 'outputFromProcesses' },
        { label: '管道', value: 'pipeline' },
        { label: '产品或其他', value: 'prodOrOther' },
        { label: '合格名称', value: 'qualifiedName' },
        { label: '复制自', value: 'replicatedFrom' },
        { label: '复制到', value: 'replicatedTo' },
        { label: '架构图', value: 'schema' },
        { label: '表', value: 'tables' },
        { label: '用户说明', value: 'userDescription' },
        { label: '创建时间', value: '__timestamp' },
        { label: '最后修改时间', value: '__modificationTimestamp' },
        { label: '最后修改者', value: '__modifiedBy' },
        { label: '创建者', value: '__createdBy' },
        { label: '状态', value: '__state' },
        { label: '引导', value: '__guid' },
        { label: '类型', value: '__typeName' },
        { label: '不完整', value: '__isIncomplete' },
        { label: '标签', value: '__labels' },
        { label: '用户定义属性', value: '__customAttributes' }
      ],
      tableColumnsPlus: [], // 除固定显示的列，额外显示的列项
      tableData: [], // 表数据
      tableTotal: 0, // 总数
      metaCompareVisible: false,
      compareParams: {
        baselineTime: '2020-09-10 12:31:31',
        toTime: '2020-09-19 14:31:09'
      },
      compareType: 'time'
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
      console.log(temp)
      return temp
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
    metaCompare(row) {
      console.log(row)
      this.metaCompareVisible = true
    },
    submitCompareTask() {
      this.metaCompareVisible = false
      // 调用比较接口，成功后提示成功信息；失败后需要提示失败及相关错误信息
      this.$notify({
        title: '成功',
        message: "元数据比对任务提交成功, 请到'元数据比对'模块查看比对进度及结果详情！",
        type: 'success',
        duration: 3000
      })
    },
    cancelCompareTask() {
      this.metaCompareVisible = false
      this.$notify({
        title: '取消比对任务',
        message: '元数据比对任务已经取消',
        type: 'info',
        duration: 3000
      })
    },
    test(info) {
      console.log(info)
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
      this.$emit('changepage', 'atlasDetails'.concat('?').concat(JSON.stringify(row)))
    },
    /**
         * @description: 重新获取表信息
         */
    async refreshList() {
      // console.log('父组件传值改变重新获取数据')
      if (this.searchRequest.params.typeName === null && this.searchRequest.params.termName === null && this.searchRequest.params.classification === null) {
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
        const res = await getTableByItems(this.searchRequest.params)
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
    createNewEntity() {
      console.log('弹出新建实体组件')
    },
    /**
         * @description: 删除查询搜索条件
         */
    deleteThisRequest(item) {
      console.log('删除查询搜索条件')
      for (var i in this.searchRequestItem) {
        if (item.key === this.searchRequestItem[i].key) {
          this.searchRequestItem.splice(i, 1)
        }
      }
      console.log(this.searchRequestItem)
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
    }
}

.typeAndClassifications {
    .el-col {
        span {
            position: relative;
            color: #409eff;

            i {
                cursor: pointer;
                color: rgb(56, 56, 56);
            }

            i:hover {
                color: rgb(126, 126, 126);
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
