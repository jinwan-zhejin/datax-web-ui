<!--
 * @Date: 2020-09-28 17:52:31
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-11-12 15:44:43
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\components\subPageResult.vue
 * @Description: 右半部分显示 - 表
-->

<template>
  <div :key="timer">
    <el-row class="top-buttons">
      <el-col>
        <!-- {{ classificationList }} -->
        <!-- {{ entities }} -->
        <el-tooltip content="刷新搜索结果" placement="top">
          <el-button type="primary" size="mini" plain icon="el-icon-refresh" @click="refreshList">刷新</el-button>
        </el-tooltip>
        <el-button type="primary" size="mini" plain @click="openFilter = !openFilter">
          <svg-icon :icon-class="openFilter?'filter-solid':'filter-regular'" /> 过滤器
        </el-button>
        <el-collapse-transition>
          <el-card v-if="openFilter" style="position: absolute; z-index: 2099; width: 60%; max-width: 650px; margin-top: 10px;" header="过滤器">
            <el-form label-position="top">
              <el-form-item label="包含/排除">
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-checkbox v-model="showHistoricalEntities">显示历史实体</el-checkbox>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-checkbox v-model="excludeSubClassifications">排除子分类</el-checkbox>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-checkbox v-model="excludeSubTypes">排除子类型</el-checkbox>
                </el-col>
              </el-form-item>
            </el-form>
            <el-divider />
            <span style="margin: 15px;position: relative;float: right;">
              <el-button type="primary" plain size="small" @click="openFilter = false">取消</el-button>
              <el-button type="primary" size="small" @click="addOtherFilter">确认</el-button>
            </span>
          </el-card>
        </el-collapse-transition>
        <!-- <el-popover
          placement="bottom"
          trigger="click"
          title="过滤器"
          @hide="openFilter = false"
        >
          <el-button
            slot="reference"
            type="primary"
            size="mini"
            plain
            @click="openFilter = !openFilter"
          ><svg-icon :icon-class="openFilter?'filter-solid':'filter-regular'" /> 过滤器</el-button>
          <el-form label-position="top">
            <el-form-item label="包含/排除">
              <el-col :span="12">
                <el-checkbox v-model="showHistoricalEntities">显示历史实体</el-checkbox>
              </el-col>
              <el-col :span="12">
                <el-checkbox v-model="excludeSubClassifications">排除子分类</el-checkbox>
              </el-col>
              <el-col :span="12">
                <el-checkbox v-model="excludeSubTypes">排除子类型</el-checkbox>
              </el-col>
            </el-form-item>
          </el-form>
          <span
            style="margin: 15px;position: relative;float: right;"
          >
            <el-button
              type="primary"
              plain
              size="small"
              @click="openFilter = false"
            >取消</el-button>
            <el-button
              type="primary"
              size="small"
              @click="addOtherFilter"
            >确认</el-button>
          </span>
        </el-popover> -->
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click="msgShow=true">清除</el-button>
        <el-tooltip content="保存为自定义筛选器" placement="top">
          <el-button type="primary" size="mini" plain @click="saveAsCustomFilter">
            <svg-icon icon-class="save-light" /> 保存过滤器
          </el-button>
        </el-tooltip>
        <!-- <el-button type="primary" size="mini" plain icon="el-icon-plus" @click="addNewEntity">新建实体</el-button> -->
        <el-select v-model="tableColumnsSelected" size="small" multiple collapse-tags placeholder="其他列项" style="position: relative; float: right;">
          <el-option v-for="(item, index) in tableColumns" :key="index" :label="translateIt(item.label)" :value="item.value" />
        </el-select>
      </el-col>
    </el-row>
    <el-row class="typeAndClassifications">
      <el-col v-if="searchParams.length > 0" :span="24">
        <span class="searchResult">
          <span v-for="(item, index) in searchParams" :key="index" class="filterQuery">
            <span>(</span>
            <span class="group">
              <span class="capsuleView">
                <span class="key">{{ item.key }}</span>
                <span> : </span>
                <span class="value">{{ item.value }}</span>
                <i class="el-icon-error" @click="deleteFilterItem(index, item.name)" />
              </span>
            </span>
            <span>)</span>
            <span v-if="index !== searchParams.length - 1">AND</span>
          </span>
        </span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          v-loading="tableLoading"
          height="59vh"
          class="tableStyle"
          :data="tableData"
          :header-cell-style="{background:'#F8F8FA',color:'#333333',fontWeight:'500'}"
        >
          <el-table-column key="名称" label="名称" prop="attributes.name" min-width="100" :show-overflow-tooltip="true" sortable>
            <template v-slot:default="{ row }">
              <a
                :class="[
                  row.status === 'DELETED'
                    ? 'tableItemLinkRed'
                    : 'tableItemLink'
                ]"
                @click="goToDetails(row)"
              ><i class="el-icon-document" />&nbsp;{{
                row.attributes.name
              }}</a>
              <el-tooltip content="已删除" placement="bottom">
                <el-tag v-if="row.status === 'DELETED'" type="danger" size="mini">
                  <i class="el-icon-delete" />
                </el-tag>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column key="所有者" label="所有者" prop="attributes.owner" sortable />
          <el-table-column key="描述" label="描述" min-width="110" prop="attributes.description" sortable />
          <el-table-column key="类型" min-width="“160”" label="类型" :show-overflow-tooltip="true" sortable>
            <template v-slot:default="{ row }">
              <a class="tableItemLink" @click="researchEntity(row.typeName)">{{
                row.typeName
              }}</a>
            </template>
          </el-table-column>
          <el-table-column key="分类" label="分类" width="150">
            <template v-slot:default="{ row }">
              <el-button-group v-if="row.classifications.length > 0" style="width: 150px;">
                <el-tooltip :content="row.classifications[0].typeName">
                  <el-button
                    plain
                    size="mini"
                    style="width:100px;overflow:hidden;text-overflow:ellipsis;"
                    @click="
                      researchClassification(row.classifications[0].typeName)
                    "
                  >{{ row.classifications[0].typeName }}</el-button>
                </el-tooltip>
                <el-button
                  plain
                  size="mini"
                  style="width:12px;"
                  icon="el-icon-close"
                  @click="
                    deleteClassification(
                      row.guid,
                      row.classifications[0].typeName,
                      row.attributes.name
                    )
                  "
                />
              </el-button-group>
              <el-dropdown v-if="row.classifications.length > 1" trigger="click" placement="bottom-start" :hide-on-click="false" @click.stop.native>
                <el-tooltip content="其余分类" placement="bottom">
                  <el-button type="text" style="color: #38bb9b">
                    <i class="el-icon-more" />
                  </el-button>
                </el-tooltip>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div v-for="(classes, index) in row.classifications" :key="index">
                      <el-button-group v-if="index !== 0" style="width: 150px">
                        <el-tooltip :content="classes.typeName">
                          <el-button plain size="mini" style="width:100px;overflow:hidden;text-overflow:ellipsis;" @click="researchClassification(classes.typeName)">{{ classes.typeName }}</el-button>
                        </el-tooltip>
                        <el-button
                          plain
                          size="mini"
                          style="width:12px;"
                          icon="el-icon-close"
                          @click="
                            deleteClassification(
                              classes.entityGuid,
                              classes.typeName,
                              row.attributes.name
                            )
                          "
                        />
                      </el-button-group>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-tooltip v-if="row.status !== 'DELETED'" content="添加分类" placement="bottom">
                <el-button type="text" size="medium" icon="el-icon-plus" @click="addClassification(row)" />
              </el-tooltip>
            </template>
          </el-table-column>
          <!-- <el-table-column key="术语" label="术语" width="150">
            <template v-slot:default="{ row }">
              <div v-for="(classes,index) in row.meanings" :key="index">
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
          <el-table-column key="操作" label="操作" width="115">
            <template v-slot:default="{ row }">
              <el-button type="primary" plain size="mini" @click="metaCompare(row.guid)">元数据比对</el-button>
            </template>
          </el-table-column>
          <el-table-column v-for="(item, index) in tableColumnsSelected" :key="index" :label="translateIt(item)" min-width="115">
            <template v-slot:default="{ row }">
              {{ item !== "instance" ? row.attributes[item] : "" }}
              <a v-if="item === 'instance'" class="tableItemLink" @click="goToDetails(instanceInfo(row))">{{
                instanceInfo(row).hasOwnProperty("attributes")
                  ? instanceInfo(row).attributes.name
                  : ""
              }}</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="position: relative; float: right;" background :current-page="currentPage" :layout="pagerLayout" :page-sizes="[25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500]" :page-size="pageSize" :pager-count="5" :total="tableTotal" @size-change="handlePageSizeChange" @current-change="handlePageCurrentChange" />
      </el-col>
    </el-row>
    <el-dialog width="40%" title="元数据比对" :visible.sync="metaCompareVisible" :before-close="initCompare" :show-close="true">
      <el-form>
        <el-form-item>
          <el-radio v-model="compareType" label="time">时间版本比对</el-radio>
        </el-form-item>
      </el-form>
      <el-form ref="compareParams" :model="compareParams" label-position="right" label-width="150px">
        <el-form-item
          v-if="compareType === 'time'"
          label="基线时间 "
          prop="baselineTime"
          :rules="{
            required: true,
            message: '请选择比较基线时间点',
            trigger: 'blur'
          }"
        >
          <el-select v-model="compareParams.baselineTime" style="width: 85%;" placeholder="请选择比较基线时间点" clearable>
            <el-option v-for="(item, index) in versionListLite(compareParams.toTime)" :key="index" :label="formatDate(item.timestamp)" :value="item.timestamp" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="compareType === 'time'"
          label="待比较时间点 "
          prop="toTime"
          :rules="{
            required: true,
            message: '请选择待比较时间点',
            trigger: 'blur'
          }"
        >
          <el-select v-model="compareParams.toTime" style="width: 85%;" placeholder="请选择待比较时间点" clearable>
            <el-option
              v-for="(item, index) in versionListLite(
                compareParams.baselineTime
              )"
              :key="index"
              :label="formatDate(item.timestamp)"
              :value="item.timestamp"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-divider />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain size="small" @click="cancelCompareTask">取消</el-button>
        <el-button type="primary" size="small" @click="submitCompareTask('compareParams')">提交</el-button>
      </div>
    </el-dialog>
    <AddClassification :add-classification-show="addClassificationShow" :classification-info="classificationInfo" :classification-list="classificationList" @addclassificationclose="addClassificationClose" />
    <el-dialog width="40%" title="删除分类" :visible.sync="deleteClassificationFlag">
      <el-form>
        <el-form-item>
          移除：{{ deleteClass }} 从 {{ deleteTypeName }} ?
        </el-form-item>
      </el-form>
      <el-divider />
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" plain @click="deleteClassificationFlag = false">取消</el-button>
        <el-button v-loading="isLoading" size="small" type="primary" @click="handledeleteClassification">提交</el-button>
      </div>
    </el-dialog>
    <AddCustomFilter :add-custom-filter-show="addCustomFilterShow" @closeaddcustomfilter="addCustomFilterShow = false" />
    <MsgBox width="30%" :is-show="msgShow" title="提示" type="question" @submit="backToSearch" @close="msgShow = false">
      <div slot="content">
        搜索参数将被重置，将返回到默认搜索页面。是否继续 ?
      </div>
    </MsgBox>
  </div>
</template>

<script>
// import AddNewEntity from './addNewEntity'
import AddClassification from './addClassification';
import * as apiatlas from '@/api/datax-metadata-atlas';
import { translater } from '@/utils/dictionary';
import AddCustomFilter from './addCustomFilter';
import MsgBox from './msgBox'

export default {
  name: 'SubPageResult',
  components: {
    AddClassification,
    AddCustomFilter,
    MsgBox
  },
  props: {
    classificationList: {
      type: Array,
      default: () => []
    },
    entities: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      msgShow: false,
      tableColumnsSelected: [],
      tableColumns: [{
        label: 'Contact_info',
        value: 'contact_info'
      },
      {
        label: 'DisplayName',
        value: 'displayName'
      },
      {
        label: 'InputToProcesses',
        value: 'inputToProcesses'
      },
      {
        label: 'Instance',
        value: 'instance'
      },
      {
        label: 'Meanings',
        value: 'meanings'
      },
      {
        label: 'Model',
        value: 'model'
      },
      {
        label: 'OutputFromProcesses',
        value: 'outputFromProcesses'
      },
      {
        label: 'Pipeline',
        value: 'pipeline'
      },
      {
        label: 'ProdOrOther',
        value: 'prodOrOther'
      },
      {
        label: 'QualifiedName',
        value: 'qualifiedName'
      },
      {
        label: 'ReplicatedFrom',
        value: 'replicatedFrom'
      },
      {
        label: 'ReplicatedTo',
        value: 'replicatedTo'
      },
      {
        label: 'Schema',
        value: 'schema'
      },
      {
        label: 'Tables',
        value: 'tables'
      },
      {
        label: 'UserDescription',
        value: 'userDescription'
      },
      {
        label: 'Created Timestamp',
        value: '__timestamp'
      },
      {
        label: 'Last Modified Timestamp',
        value: '__modificationTimestamp'
      },
      {
        label: 'Last Modified User',
        value: '__modifiedBy'
      },
      {
        label: 'Created By User',
        value: '__createdBy'
      },
      {
        label: 'Status',
        value: '__state'
      },
      {
        label: 'Guid',
        value: '__guid'
      },
      {
        label: 'Type Name',
        value: '__typeName'
      },
      {
        label: 'IsIncomplete',
        value: '__isIncomplete'
      },
      {
        label: 'Label(s)',
        value: '__labels'
      },
      {
        label: 'User-defined Properties',
        value: '__customAttributes'
      }
      ],
      tableColumnsPlus: [], // 除固定显示的列，额外显示的列项
      tableData: [], // 表数据
      allData: {}, // 所有数据
      metaCompareVisible: false, // 版本比较dialog可见
      // 比较参数
      compareParams: {
        baselineTime: '',
        toTime: ''
      },
      versionList: [], // 所有版本列表
      compareType: 'time', // 选择比较方式 time dimen
      addClassificationShow: false, // 打开添加分类面板
      classificationInfo: {}, // 为该条添加分类（guid，typeName）
      deleteClassificationFlag: false,
      deleteGuid: '',
      deleteClass: '',
      deleteTypeName: '',
      resultQuery: '', // 存储从路由读到的参数
      timer: '',
      addCustomFilterShow: false,
      currentPage: 1,
      pageSize: 25,
      tableTotal: 0, // 总数
      openFilter: false,
      filterActiveName: ['includeexclude'],
      showHistoricalEntities: false,
      excludeSubClassifications: false,
      excludeSubTypes: false,
      pagerLayout: 'total, prev, pager, next, sizes',
      tableLoading: false,
      isLoading: false
    };
  },
  computed: {
    // 显示查询参数
    searchParams() {
      var temp = [];
      for (var i in this.resultQuery) {
        if (i === 'attributes' || i === 'searchType') {
          continue;
        }
        temp.push({
          key: this.translateIt(i),
          name: i,
          value: this.resultQuery[i]
        });
      }
      return temp;
    },
    searchParamsAttributes() {
      const arr = [];
      if (this.resultQuery.hasOwnProperty('attributes')) {
        const temp = decodeURIComponent(this.resultQuery.attributes).split(',');
        for (let i = 0; i < temp.length; i++) {
          arr.push(temp[i]);
        }
        return arr;
      }
      return arr;
    },
    formatDate() {
      return timestamp => {
        const date = new Date(timestamp);
        const y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? '0' + MM : MM;
        let d = date.getDate();
        d = d < 10 ? '0' + d : d;
        let h = date.getHours();
        h = h < 10 ? '0' + h : h;
        let m = date.getMinutes();
        m = m < 10 ? '0' + m : m;
        let s = date.getSeconds();
        s = s < 10 ? '0' + s : s;
        return y + '/' + MM + '/' + d + ' ' + h + ':' + m + ':' + s;
      };
    },
    versionListLite() {
      return rmItem => {
        return this.versionList.filter(item => item.timestamp !== rmItem);
      };
    },
    instanceInfo() {
      return row => {
        if (row.attributes.hasOwnProperty('instance')) {
          if (row.attributes.instance.hasOwnProperty('guid')) {
            if (this.allData.hasOwnProperty('referredEntities')) {
              if (
                this.allData.referredEntities.hasOwnProperty(
                  row.attributes.instance.guid
                )
              ) {
                return this.allData.referredEntities[
                  row.attributes.instance.guid
                ];
              }
            }
          }
        }
        return {};
      };
    }
  },
  watch: {
    '$route.query': {
      handler(val, oldVal) {
        this.currentPage = 1;
        this.pageSize = 25;
        this.tableTotal = 0; // 总数
        this.resultQuery = val;
        this.showHistoricalEntities = this.resultQuery.hasOwnProperty('includeDE')
        this.excludeSubClassifications = this.resultQuery.hasOwnProperty('excludeSC')
        this.excludeSubTypes = this.resultQuery.hasOwnProperty('excludeST')
        if (val.searchType === 'dsl') {
          // this.pagerLayout = 'prev, next, sizes'
          this.refreshList_dsl()
        } else if (val.searchType === 'basic') {
          // this.pagerLayout = 'total, prev, pager, next, sizes'
          this.refreshList();
        }
        // console.log('query changed');
      },
      deep: true
    },
    resultQuery: {
      handler(val, oldVal) {
        // console.log('resultQuery changed');
        if (
          !val.hasOwnProperty('type') &&
                    !val.hasOwnProperty('term') &&
                    !val.hasOwnProperty('tag') &&
                    !val.hasOwnProperty('query')
        ) {
          this.backToSearch();
        }
      },
      deep: true
    },
    addCustomFilterShow(val) {
      if (!val) {
        this.$emit('refreshcustomlist');
      }
    },
    tableColumnsSelected(val) {
      this.refreshList();
    }
  },
  created() {
    this.resultQuery = this.$route.query;
    this.showHistoricalEntities = this.resultQuery.hasOwnProperty('includeDE')
    this.excludeSubClassifications = this.resultQuery.hasOwnProperty('excludeSC')
    this.excludeSubTypes = this.resultQuery.hasOwnProperty('excludeST')
    // this.refreshList();
    if (this.resultQuery.searchType === 'dsl') {
      // this.pagerLayout = 'prev, next, sizes'
      this.refreshList_dsl()
    } else if (this.resultQuery.searchType === 'basic') {
      // this.pagerLayout = 'total, prev, pager, next, sizes'
      this.refreshList();
    }
  },
  mounted() {
    // this.$nextTick(function() {
    //   this.refreshList()
    // })
  },
  methods: {
    test2() {
      this.$router.replace({
        name: 'atlasSearch',
        query: {}
      });
    },
    test(info) {
      console.log(info);
    },
    test3() {
      console.log(this.tableColumnsSelected);
    },
    async metaCompare(guid) {
      this.metaCompareVisible = true;
      // console.log(guid)
      const res = await apiatlas.getVersionInfo(guid);
      // console.log(res)
      if (res.code === 200) {
        // this.metaCompareVisible = true
        this.versionList = res.content;
        console.log(this.versionList);
      } else {
        this.$message({
          message: '获取版本数据出错',
          showClose: true,
          type: 'error',
          duration: 4000
        });
      }
    },
    submitCompareTask(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 调用比较接口，成功后提示成功信息；失败后需要提示失败及相关错误信息
          this.getCompareResult();
          this.resetCompare();
          this.metaCompareVisible = false;
        } else {
          return false;
        }
      });
    },
    cancelCompareTask() {
      this.resetCompare();
      this.metaCompareVisible = false;
      this.$notify({
        title: '取消比对任务',
        message: '元数据比对任务已经取消',
        type: 'info',
        duration: 3000
      });
    },
    /**
         * @description: 初始化页面并返回到Search界面
         */
    backToSearch() {
      this.$router.replace({
        name: 'atlasSearch'
      });
    },
    /**
         * @description: 通知父组件跳转到details界面
         */
    goToDetails(row) {
      this.$router.replace({
        name: 'atlasDetails',
        params: {
          guid: row.guid
        },
        query: this.$route.query
      });
    },
    /**
         * @description: 重新获取表信息
         */
    async refreshList() {
      // console.log('父组件传值改变重新获取数据')
      // console.log(this.resultQuery);
      if (
        !this.resultQuery.hasOwnProperty('type') &&
                !this.resultQuery.hasOwnProperty('term') &&
                !this.resultQuery.hasOwnProperty('tag') &&
                !this.resultQuery.hasOwnProperty('query')
      ) {
        this.backToSearch();
      } else {
        this.tableLoading = true
        const res = await apiatlas.getTableByItems({
          attributes: this.searchParamsAttributes.concat(
            this.tableColumnsSelected
          ),
          classification: this.resultQuery.hasOwnProperty('tag')
            ? this.resultQuery.tag : null,
          excludeDeletedEntities: !this.showHistoricalEntities,
          includeClassificationAttributes: true,
          includeSubClassifications: !this.excludeSubClassifications,
          includeSubTypes: !this.excludeSubTypes,
          query: this.resultQuery.hasOwnProperty('query')
            ? this.resultQuery.query : null,
          limit: this.pageSize,
          offset: this.pageSize * (this.currentPage - 1),
          typeName: this.resultQuery.hasOwnProperty('type')
            ? this.resultQuery.type : null
        });
        // console.log(res)
        if (res.status === 200 && res.statusText === 'OK') {
          this.allData = res.data;
          console.log(this.allData);
          this.tableData = res.data.entities;
          this.tableTotal = res.data.approximateCount;
          this.openFilter = false;
          this.tableLoading = false
        } else {
          this.$message({
            message: '获取对应记录出错',
            showClose: true,
            type: 'error',
            duration: 4000
          });
          this.tableLoading = false
        }
      }
    },
    /**
         * @description: 重新获取表信息2
         */
    async refreshList_dsl() {
      // console.log('父组件传值改变重新获取数据')
      // console.log(this.resultQuery);
      if (
        !this.resultQuery.hasOwnProperty('type') &&
                !this.resultQuery.hasOwnProperty('term') &&
                !this.resultQuery.hasOwnProperty('tag') &&
                !this.resultQuery.hasOwnProperty('query')
      ) {
        this.backToSearch();
      } else {
        // console.log(this.resultQuery);
        var temp = {
          limit: this.pageSize,
          offset: this.pageSize * (this.currentPage - 1),
          _: new Date().getTime()
        }
        if (this.resultQuery.hasOwnProperty('type')) {
          temp.typeName = this.resultQuery.type
        }
        if (this.resultQuery.hasOwnProperty('query')) {
          temp.query = this.resultQuery.query
        }
        // console.log(temp);
        this.tableLoading = true
        const res = await apiatlas.getDSLResult(temp)
        // console.log(res)
        if (res.status === 200 && res.statusText === 'OK') {
          this.allData = res.data;
          // console.log(this.allData);
          this.tableData = res.data.entities;
          for (var i = 0; i < this.entities.length; i++) {
            if (this.entities[i].name === this.resultQuery.type) {
              this.tableTotal = this.entities[i].hasOwnProperty('countActive') ? this.entities[i].countActive : 1000
              break
            }
            if (i === this.entities.length - 1) {
              this.tableTotal = res.data.approximateCount;
            }
          }
          this.openFilter = false;
          this.tableLoading = false
        } else {
          this.$message({
            message: res.status === 400 ? res.data.errorMessage : '获取对应记录出错',
            showClose: true,
            type: 'error',
            duration: 6000
          });
          this.tableLoading = false
        }
      }
    },
    /**
         * @description: 保存为自定义过滤器
         */
    saveAsCustomFilter() {
      this.addCustomFilterShow = true;
    },
    /**
         * @description: 新建实体
         */
    addNewEntity() {
      console.log('弹出新建实体组件');
    },
    /**
         * @description: 删除筛选条件
         */
    deleteFilterItem(index, name) {
      this.$delete(this.resultQuery, name);
      var temp = JSON.parse(JSON.stringify(this.resultQuery));
      if (name === 'includeDE') {
        this.showHistoricalEntities = false;
      } else if (name === 'excludeST') {
        this.excludeSubTypes = false;
      } else if (name === 'excludeSC') {
        this.excludeSubClassifications = false;
      }
      this.$router.replace({
        name: 'atlasResult',
        query: {}
      });
      this.$router.replace({
        name: 'atlasResult',
        query: temp
      });
      // console.log(index, name);
    },
    researchClassification(param) {
      this.$router.replace({
        name: 'atlasResult',
        query: {
          searchType: 'basic',
          tag: param
        }
      });
    },
    researchEntity(param) {
      this.$router.replace({
        name: 'atlasResult',
        query: {
          searchType: 'basic',
          type: param
        }
      });
    },
    /**
         * @description: 打开添加分类面板
         */
    addClassification(row) {
      this.classificationInfo = row;
      this.addClassificationShow = true;
    },
    /**
         * @description: 翻译
         * @param {String} 待翻译文本
         * @return {String} 翻译文本
         */
    translateIt(str) {
      return translater(str);
    },
    async getCompareResult() {
      const res = await apiatlas.getCompareResult(
        this.versionList[0].entityId,
        this.compareParams
      );
      console.log(res);
      // if (res.code === 200) {
      this.$notify({
        title: '成功',
        message: "元数据比对任务提交成功, 请到'元数据比对'模块查看比对进度及结果详情！",
        type: 'success',
        duration: 3000
      });
      // }
    },
    initCompare(done) {
      this.compareParams.baselineTime = '';
      this.compareParams.toTime = '';
      done();
    },
    resetCompare() {
      this.$refs['compareParams'].resetFields();
    },
    addClassificationClose() {
      this.addClassificationShow = false;
      this.refreshList();
    },
    deleteClassification(guid, classification, typeName) {
      // console.log(guid, classification, typeName)
      this.deleteGuid = guid;
      this.deleteClass = classification;
      this.deleteTypeName = typeName;
      this.deleteClassificationFlag = true;
    },
    async handledeleteClassification() {
      this.isLoading = true
      const res = await apiatlas.deleteClassification(
        this.deleteGuid,
        this.deleteClass
      );
      // console.log(res)
      if (res.status === 204) {
        this.deleteClassificationFlag = false;
        this.$message({
          message: '删除分类成功',
          showClose: true,
          type: 'success',
          duration: 4000
        });
        this.isLoading = false
        this.refreshList();
      } else {
        this.$message({
          message: '删除分类失败',
          showClose: true,
          type: 'error',
          duration: 4000
        });
        this.isLoading = false
      }
    },
    /**
         * @description: 分页
         */
    handlePageSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      if (this.resultQuery.searchType === 'dsl') {
        this.refreshList_dsl()
      } else if (this.resultQuery.searchType === 'basic') {
        this.refreshList();
      }
    },
    handlePageCurrentChange(val) {
      this.currentPage = val;
      if (this.resultQuery.searchType === 'dsl') {
        this.refreshList_dsl()
      } else if (this.resultQuery.searchType === 'basic') {
        this.refreshList();
      }
    },
    /**
         * @description: 添加其他过滤器
         */
    addOtherFilter() {
      // console.log(!this.showHistoricalEntities, !this.excludeSubClassifications, !this.excludeSubTypes);
      var temp = {};
      var temp2 = this.$route.query;
      if (this.showHistoricalEntities) {
        temp.includeDE = true;
      } else {
        if (temp2.hasOwnProperty('includeDE')) {
          delete temp2.includeDE;
        }
      }
      if (this.excludeSubClassifications) {
        temp.excludeSC = true;
      } else {
        if (temp2.hasOwnProperty('excludeSC')) {
          delete temp2.excludeSC;
        }
      }
      if (this.excludeSubTypes) {
        temp.excludeST = true;
      } else {
        if (temp2.hasOwnProperty('excludeST')) {
          delete temp2.excludeST;
        }
      }
      Object.assign(temp, temp2);
      temp.searchType = 'basic'
      this.$router.replace({
        name: 'atlasResult',
        query: {}
      });
      this.$router.replace({
        name: 'atlasResult',
        query: temp
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.top-buttons {
    .el-button {
        font-size: 14px;
    }

    .el-col {
        margin-bottom: 10px;

        .el-select {
            ::v-deep .el-input__inner {
                height: 30px;
            }
        }
    }
}

.typeAndClassifications {
    margin-bottom: 10px;

    .el-col {
        span {
            position: relative;
            // color: #3D5FFF;
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
                    border: 1px solid #3d5fff;
                    border-radius: 1.9em;

                    .capsuleView {
                        padding: 5px;

                        .key {
                            color: #38bb9b;
                            font-size: 0.8rem;
                        }

                        .value {
                            color: #3d5fff;
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
    border: 2px solid #F8f8FA;
    border-radius: 4px;
    margin-bottom: 20px;
    // ::v-deep .el-table__body-wrapper {
    //   height: 50%;
    //   overflow-y: auto;
    // }
}

::v-deep .el-table th {
    background-color: #F8f8FA;
}

.tableItemLink {
    color: #006ad4;

    i {
        font-weight: bold;
    }
}

.tableItemLinkRed {
    color: #853d13;

    i {
        font-weight: bold;
    }
}

.tableItemLinkRed:hover {
    text-decoration: underline;
}

.tableItemLink:hover {
    text-decoration: underline;
}

.el-collapse {
    width: calc(60vw);
    max-width: 620px;
    min-width: 300px;
    border: 0;

    ::v-deep .el-collapse-item__header {
        color: #333333;
        font-size: 16px;
        font-weight: bold;
        border: 0;
    }

    ::v-deep .el-collapse-item__wrap {
        border: 0;
    }
}
</style>
