<!--
 * @Date: 2020-09-28 17:52:31
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-09-30 18:32:04
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\components\rightPanelTable.vue
 * @Description: 右半部分显示 - 表
-->

<template>
  <div>
    <el-row class="top-buttons">
      <el-col :span="12" style="min-width: 234px;">
        <el-tooltip content="刷新搜索结果" placement="top">
          <el-button type="primary" size="mini" plain icon="el-icon-refresh" @click="refreshList" />
        </el-tooltip>
        <el-button type="primary" size="mini" plain icon="el-icon-arrow-right" @click="test">筛选</el-button>
        <el-button type="primary" size="mini" plain @click="backToSearch">Clear</el-button>
      </el-col>
      <el-col :span="12" style="min-width: 334px;">
        <el-tooltip content="保存为自定义筛选器" placement="top">
          <el-button type="primary" size="mini" plain icon="el-icon-folder-add" @click="saveAsCustomFilter">Save Filter</el-button>
        </el-tooltip>
        <el-button type="primary" size="mini" plain icon="el-icon-plus" @click="createNewEntity">新建实体</el-button>
        <el-dropdown size="mini" trigger="click">
          <el-button type="primary" size="mini" plain>
            列项<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in tableColumns" :key="item">{{ item }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-row class="typeAndClassifications">
      <el-col v-if="!searchRequest">
        <span>( </span>
        <span>类型: {{ searchRequest }}NULL <i class="el-icon-error" @click="deleteThisRequest" /></span>
        <span> ) And ( </span>
        <span>分类: {{ searchRequest }}NULL <i class="el-icon-error" @click="deleteThisRequest" /></span>
        <span> )</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table class="tableStyle" :data="tableData">
          <el-table-column key="名称" label="名称" prop="attributes.name" min-width="180" :show-overflow-tooltip="true">
            <template v-slot:default="{row}">
              <a class="tableItemLink" @click="goToDetails(row)"><i class="el-icon-document" />&nbsp;{{ row.attributes.name }}</a>
            </template>
          </el-table-column>
          <el-table-column key="所有者" label="所有者" prop="attributes.owner" />
          <el-table-column key="描述" label="描述" min-width="120" prop="attributes.description" />
          <el-table-column key="类型" label="类型" min-width="89" prop="typeName">
            <template v-slot:default="{row}">
              <a class="tableItemLink" @click="refreshList">{{ row.typeName }}</a>
            </template>
          </el-table-column>
          <el-table-column key="分类" label="分类" prop="classificationNames">
            <template v-slot:default="{ row }">
              <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="test(row)" />
            </template>
          </el-table-column>
          <el-table-column key="术语" label="术语" prop="">
            <template v-slot:default="{ row }">
              <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="test(row)" />
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CreateNewEntityDialog from './createNewEntityDialog'
import { getTableByItems } from '@/api/datax-metadata-atlas'

export default {
  name: 'RightPanelTable',
  // searchRequest 对象，存entity type和classifications
  props: {
    searchRequest: Object
  },
  data() {
    return {
      tableColumns: [
        '联系方式', '显示名称',
        '输入到进程', '实例', '意义', '模型', '进程输出', '管道', '产品或其他', '合格名称',
        '复制自', '复制到', '架构图', '桌子', '用户说明', '创建时间', '修改时间', '最后修改者',
        '由用户创建', '状态', '引导', '类型名称', '不完整', '标签', '用户定义的属性'
      ],
      tableColumnsPlus: [], // 除固定显示的列，额外显示的列项
      tableData: [], // 表数据
      tableTotal: 0 // 总数
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
    test(info) {
      console.log(info)
    },
    /**
     * @description: 初始化页面并返回到Search界面
     */
    backToSearch() {
      // console.log('通知父组件切页面')
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
        // console.log(res)
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
    deleteThisRequest(request) {
      console.log('删除查询搜索条件')
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
         cursor:pointer;
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
  text-decoration:underline;
}
</style>
