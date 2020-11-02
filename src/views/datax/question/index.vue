<template>
  <section class="quality-rule main-outer">
    <el-row class="common-condition ar mb15" />
    <el-row class="main-inner">
      <div class="search_list">
        <el-row>
          <span class="search_title">处理状态:</span>
          <el-radio-group v-model="applicationStatus" size="small" @change="changeStatus">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="0">待处理</el-radio-button>
            <el-radio-button label="1">已处理</el-radio-button>
          </el-radio-group>
        </el-row>
        <el-row :gutter="20" class="mt15">
          <el-col :span="10">
            <span>所属数据源:</span>
            <el-select v-model="sourceId" placeholder="请选择" size="small" @change="changeSelect">
              <el-option v-for="item in options" :key="item.value" :label="item.datasourceName" :value="item.id" />
            </el-select>
          </el-col>
          <!-- <el-col :span="6">
                        <span>问题责任人</span>
                        <el-input v-model="input" placeholder="请输入内容" size='small' class="mt10"></el-input>
                    </el-col>-->
          <!--<el-col :span="4">-->
          <!--<el-button type="info" size='small' @click="searchData" style="margin-top:25px">查询</el-button>-->
          <!--</el-col>-->
        </el-row>
        <el-row :gutter="20" class="mt15">
          <el-col :span="24">
            <el-button size="mini" class="grey-btn" :disabled="this.deleteSelection.length<=0" @click="batchOperate">处理</el-button>
            <div style="float: right">
              <el-input v-model="searchName" placeholder="请输入表名进行查询" style="width: 330px" size="mini" @keyup.enter.native="changeStatus">
                <i slot="prefix" class="el-input__icon el-icon-search" />
              </el-input>
              <el-button type="danger" size="mini" @click="changeStatus">查询</el-button>
            </div>

          </el-col>
        </el-row>
      </div>
      <div class="qdtable">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%;"
          @selection-change="changeFun"
        >
          <el-table-column
            type="selection"
            width="55"
            :selectable="checkDisabled"
          />
          <el-table-column
            prop="tableName"
            label="表名"
          />
          <el-table-column
            prop="dataSourceName"
            label="所属数据源"
          />
          <el-table-column
            prop="errorDataNum"
            label="问题数据"
          />
          <el-table-column
            prop="owner"
            label="问题责任人"
          />
          <el-table-column
            prop="createTime"
            label="创建时间"
            :formatter="this.$utils.dateFormat"
          />
          <el-table-column
            label="状态"
          >
            <template slot-scope="scope">
              <div>
                <el-tag v-if="scope.row.status==0" class="new-tag">待处理</el-tag>
                <el-tag v-else class="success-tag">已处理</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="questionDetail(scope.row.id)">问题详情</el-button>
              <el-button v-if="scope.row.status==0" type="text" size="mini" @click="dealOperate(scope.row)">处理</el-button>
              <el-button v-if="scope.row.status==1" type="text" size="mini" @click="operateLog(scope.row)">操作记录</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="ar mt15"
          :current-page="currentPage"
          :page-sizes="[10,20,30]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-row>
    <deal-operate :deal-operate-visible="dealOperateVisible" :isdeal-operate="isdealOperate" @dealOperateBack="dealOperateBack" />
    <operate-log :operate-log-visible="operateLogVisible" :is-operate-log="isOperateLog" @operateLogBack="operateLogBack" />
    <question-detail :question-detail-visible="questionDetailVisible" :is-question-detail="isQuestionDetail" @questionDetailBack="questionDetailBack" />
  </section>
</template>
<script>
import DealOperate from './questionData/DealOpterate.vue'
import OperateLog from './questionData/OperateLog.vue'
import QuestionDetail from './questionData/QuestionDetail.vue'
export default {
  name: '',
  components: { DealOperate, OperateLog, QuestionDetail },
  data() {
    return {
      applicationStatus: '',
      sourceId: '',
      options: [
        { id: '', datasourceName: '全部' }
      ],
      input: '',
      formInline: {
        user: '',
        region: ''
      },
      tableData: [],
      dealOperateVisible: false,
      isdealOperate: {
        currTime: new Date().getTime(),
        ids: '',
        dealComment: ''
      },
      operateLogVisible: false,
      isOperateLog: {
        currTime: new Date().getTime(),
        id: ''
      },
      questionDetailVisible: false,
      isQuestionDetail: {
        currTime: new Date().getTime(),
        id: ''
      },
      total: 0,
      currentPage: 1,
      pageLength: 10,
      deleteSelection: [],
      searchName: ''
    };
  },
  mounted: function() {
    this.getAllDataBase();
    this.getList()
  },
  methods: {
    getList() {
      const param = {
        start: (this.currentPage - 1) * 10,
        length: this.pageLength,
        sourceId: this.sourceId,
        status: this.applicationStatus,
        ownerId: '',
        tableName: this.searchName
      };
      this.$urlApi.dataQuality.queryProblemData(param).then((res) => {
        this.tableData = res.data;
        this.total = res.recordsFiltered
      })
    },
    searchData() {
      this.getList()
    },
    changeSelect() {
      this.getList()
    },
    handleSizeChange(cb) {
      this.pageLength = cb;
      this.getList()
    },
    handleCurrentChange(cb) {
      this.currentPage = cb;
      this.getList()
    },
    changeFun(val) { // 选择复选框
      this.deleteSelection = val;
    },
    changeStatus() {
      this.getList()
    },
    getAllDataBase() {
      this.$urlApi.dataQuality.getAllDBList().then((res) => {
        this.options = this.options.concat(res.data);
      })
    },
    dealOperate(item) { // 处理
      const currTime = new Date().getTime();
      this.isdealOperate.currTime = currTime;
      this.isdealOperate.dealComment = item.dealComment;
      this.isdealOperate.dealPeople = item.dealPeople;
      this.isdealOperate.ids = item.id;
      this.dealOperateVisible = true;
    },
    batchOperate(item) {
      const currTime = new Date().getTime();
      this.isdealOperate.currTime = currTime;
      this.isdealOperate.dealComment = item.dealComment;
      this.isdealOperate.dealPeople = item.dealPeople;
      this.isdealOperate.ids = this.deleteSelection.map(item => item.id).join();
      this.dealOperateVisible = true;
    },
    checkDisabled(row) { // 设置禁用
      if (row.status === 1) {
        return false;
      } else {
        return true;
      }
    },
    dealOperateBack(cb) {
      this.dealOperateVisible = false;
      this.getList();
    },
    operateLog(cb) { // 操作记录
      const currTime = new Date().getTime();
      this.operateLogVisible = true;
      this.isOperateLog.currTime = currTime;
      this.isOperateLog.dealPeople = cb.dealPeople;
      this.isOperateLog.dealComment = cb.dealComment;
      this.isOperateLog.dealTime = cb.dealTime;
    },
    operateLogBack(cb) {
      this.operateLogVisible = false;
    },
    questionDetail(id) { // 问题详情
      const currTime = new Date().getTime();
      this.questionDetailVisible = true;
      this.isQuestionDetail.currTime = currTime;
      this.isQuestionDetail.id = id;
    },
    questionDetailBack(cb) {
      this.questionDetailVisible = false;
    }
  }
};
</script>

<style lang="scss">
    .quality-rule{
        .search_list {
            margin-top: 10px;
            .search_title {
                display: inline-block;
                width: 70px;
                text-align: right;
                margin-right: 10px;
            }
            .el-radio-button__inner {
                border: 0;
            }
            .el-radio-button__orig-radio:checked + .el-radio-button__inner {
                color: #F67F89;
                border: 0;
                background: transparent;
                -webkit-box-shadow: none;
                -moz-box-shadow: none;
                -o-box-shadow: none;
                box-shadow: none;
            }
        }
    }

</style>
