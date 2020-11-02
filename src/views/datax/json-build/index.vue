<template>
  <div class="app-container">
    <div class="build-container">
      <div style="width:100%;border-bottom:1px solid rgba(240, 240, 242, 1);margin-bottom:20px;padding:20px 0;">
        <div style="width:80%;margin:0 auto;">
          <el-steps :active="active">
            <el-step title="新建任务" description="">1</el-step>
            <el-step title="构建reader" description="">2</el-step>
            <el-step title="构建writer" description="">3</el-step>
            <el-step title="字段映射" description="">4</el-step>
            <el-step title="构建" description="">5</el-step>
          </el-steps>
        </div>
      </div>

      <div v-show="active===1" class="step0">
        <Create ref="create" :fjson="configJson" v-on="$listeners" />
      </div>
      <div v-show="active===2" class="step1">
        <Reader ref="reader" />
      </div>
      <div v-show="active===3" class="step2">
        <Writer ref="writer" />
      </div>
      <div v-show="active===4" class="step3">
        <Mapper ref="mapper" />
      </div>
      <div v-show="active===5" class="step4">
        <div style="margin-top:20px;">
          <p>1.新建任务</p>
          <div class="step5content">
            <div>
              <span class="step5content_key">执行器：</span>
              <span class="step5content_value">{{ $refs.create && $refs.create.temp.jobGroup || '-' }}</span>
            </div>
            <div>
              <span class="step5content_key">所属项目：</span>
              <span class="step5content_value">{{ $refs.create && $refs.create.temp.projectId || '-' }}</span>
            </div>
            <div>
              <span class="step5content_key">路由策略：</span>
              <span class="step5content_value">{{ $refs.create && $refs.create.temp.executorRouteStrategy || '-' }}</span>
            </div>
            <div>
              <span class="step5content_key">子项目：</span>
              <span class="step5content_value">{{ $refs.create && $refs.create.temp.childJobIdArr || '-' }}</span>
            </div>
            <div>
              <span class="step5content_key">阻塞处理：</span>
              <span class="step5content_value">{{ $refs.create && $refs.create.temp.executorBlockStrategy || '-' }}</span>
            </div>
            <div>
              <span class="step5content_key">任务名称：</span>
              <span class="step5content_value">{{ $refs.create && $refs.create.temp.jobDesc || '-' }}</span>
            </div>
            <div>
              <span class="step5content_key">任务类型：</span>
              <span class="step5content_value">{{ $refs.create && $refs.create.temp.glueType || '-' }}</span>
            </div>
            <div>
              <span class="step5content_key">Cron：</span>
              <span class="step5content_value">{{ $refs.create && $refs.create.temp.jobCron || '-' }}</span>
            </div>
            <div>
              <span class="step5content_key">报警邮件：</span>
              <span class="step5content_value">{{ $refs.create && $refs.create.temp.alarmEmail || '-' }}</span>
            </div>
            <div>
              <span class="step5content_key">失败重试次数：</span>
              <span class="step5content_value">{{ $refs.create && $refs.create.temp.executorFailRetryCount || '-' }}</span>
            </div>
            <div>
              <span class="step5content_key">超时时间：</span>
              <span class="step5content_value">{{ $refs.create && $refs.create.temp.executorTimeout || '-' }}</span>
            </div>
          </div>
        </div>

        <div>
          <p>2.构建reader</p>
          <div class="step5content">
            <div>
              <span class="step5content_key">数据库源：</span>
              <span class="step5content_value">{{ datasourceName1 || '-' }}</span>
            </div>
            <div>
              <span class="step5content_key">切分字段：</span>
              <span class="step5content_value">{{ $refs.reader && $refs.reader.$refs.rdbmsreader.readerForm.splitPk || '-' }}</span>
            </div>
            <div>
              <span class="step5content_key">数据库表名：</span>
              <span class="step5content_value">{{ $refs.reader && $refs.reader.$refs.rdbmsreader.readerForm.tableName || '-' }}</span>
            </div>
            <div>
              <span class="step5content_key">SQL语句：</span>
              <span class="step5content_value">{{ $refs.reader && $refs.reader.$refs.rdbmsreader.readerForm.querySql || '-' }}</span>
            </div>
            <div>
              <span class="step5content_key">表所有字段：</span>
              <span class="step5content_value">{{ $refs.reader && $refs.reader.$refs.rdbmsreader.readerForm.columns || '-' }}</span>
            </div>
            <div>
              <span class="step5content_key">Where条件：</span>
              <span class="step5content_value">{{ $refs.reader && $refs.reader.$refs.rdbmsreader.readerForm.where || '-' }}</span>
            </div>
          </div>
        </div>

        <div>
          <p>3.构建writer</p>
          <div class="step5content">
            <div>
              <span class="step5content_key">数据库源：</span>
              <span class="step5content_value">{{ datasourceName2 || '-' }}</span>
            </div>
            <div>
              <span class="step5content_key">数据库表名：</span>
              <span class="step5content_value">{{ $refs.writer && $refs.writer.$refs.rdbmswriter.writerForm.ifCreateTable || '-' }}</span>
            </div>
            <div>
              <span class="step5content_key">字段：</span>
              <span class="step5content_value">{{ $refs.writer && $refs.writer.$refs.rdbmswriter.writerForm.columns || '-' }}</span>
            </div>
            <div>
              <span class="step5content_key">postSql：</span>
              <span class="step5content_value">{{ $refs.writer && $refs.writer.$refs.rdbmswriter.writerForm.postSql || '-' }}</span>
            </div>
            <div>
              <span class="step5content_key">前置Sql语句：</span>
              <span class="step5content_value">{{ $refs.writer && $refs.writer.$refs.rdbmswriter.writerForm.preSql || '-' }}</span>
            </div>
          </div>
        </div>

        <div style="margin-top:20px;">
          <p style="margin: 20px 0;">4.字段映射</p>
          <div style="border: 1px solid #F3F3F3;">
            <el-table
              :data="tableData"
              stripe
              :header-cell-style="{ background: '#FAFAFC',color:'rgba(51, 51, 51, 1)','font-family': 'PingFangHK-Medium, PingFangHK' }"
              style="width: 100%"
            >
              <el-table-column
                prop="sourceField"
                label="数据源库"
                width="180"
              />
              <el-table-column
                prop="clearRule"
                label="清洗规则"
                width="180"
              />
              <el-table-column
                prop="targetField"
                label="目标字段"
              />
            </el-table>
          </div>
        </div>

      </div>
      <div style="width:200px;float:right;">
        <el-button :disabled="active===1" style="margin-top: 12px;" @click="last">上一步</el-button>
        <el-button type="primary" style="margin-top: 12px;margin-bottom: 12px;background:rgba(61, 95, 255, 1);" @click="next">{{ active === 5 ?'提交':'下一步' }}</el-button>
      </div>

    </div>
  </div>
</template>

<script>
import * as dataxJsonApi from '@/api/datax-json'
import * as jobTemplate from '@/api/datax-job-template'
import * as job from '@/api/datax-job-info'
import Pagination from '@/components/Pagination'
import JsonEditor from '@/components/JsonEditor'
import Reader from './reader'
import Writer from './writer'
import clip from '@/utils/clipboard'
import Mapper from './mapper'
import Create from './create'

export default {
  name: 'JsonBuild',
  components: { Reader, Writer, Pagination, JsonEditor, Mapper, Create },
  data() {
    return {
      configJson: '',
      active: 1,
      jobTemplate: '',
      jobTemplateSelectDrawer: false,
      list: null,
      currentRow: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        size: 10000,
        jobGroup: 0,
        triggerStatus: -1,
        jobDesc: '',
        executorHandler: '',
        userId: 0
      },
      blockStrategies: [
        { value: 'SERIAL_EXECUTION', label: '单机串行' },
        { value: 'DISCARD_LATER', label: '丢弃后续调度' },
        { value: 'COVER_EARLY', label: '覆盖之前调度' }
      ],
      routeStrategies: [
        { value: 'FIRST', label: '第一个' },
        { value: 'LAST', label: '最后一个' },
        { value: 'ROUND', label: '轮询' },
        { value: 'RANDOM', label: '随机' },
        { value: 'CONSISTENT_HASH', label: '一致性HASH' },
        { value: 'LEAST_FREQUENTLY_USED', label: '最不经常使用' },
        { value: 'LEAST_RECENTLY_USED', label: '最近最久未使用' },
        { value: 'FAILOVER', label: '故障转移' },
        { value: 'BUSYOVER', label: '忙碌转移' }
        // { value: 'SHARDING_BROADCAST', label: '分片广播' }
      ],
      triggerNextTimes: '',
      registerNode: [],
      jobJson: '',
      temp: {
        id: undefined,
        jobGroup: '',
        jobCron: '',
        jobDesc: '',
        executorRouteStrategy: '',
        executorBlockStrategy: '',
        childJobId: '',
        executorFailRetryCount: '',
        alarmEmail: '',
        executorTimeout: '',
        userId: 0,
        jobConfigId: '',
        executorHandler: 'executorJobHandler',
        glueType: 'BEAN',
        jobJson: '',
        executorParam: '',
        replaceParam: '',
        jvmParam: '',
        incStartTime: ''
      },
      datasourceName1: '',
      datasourceName2: ''
    }
  },
  computed: {
    tableData() {
      return this.$store.state.taskAdmin.tableData
    },

    datasourceID1() {
      return this.$store.state.taskAdmin.readerDataSourceID
    },

    datasourceID2() {
      return this.$store.state.taskAdmin.writerDataSourceID
    }
  },

  watch: {
    datasourceID1(newval) {
      this.$store.state.taskAdmin.dataSourceList.forEach(element => {
        if (newval == element.id) {
          this.datasourceName1 = element.datasourceName
        }
      });
    },

    datasourceID2(newval) {
      this.$store.state.taskAdmin.dataSourceList.forEach(element => {
        if (newval == element.id) {
          this.datasourceName2 = element.datasourceName
        }
      });
    }
  },
  methods: {
    next() {
      const fromColumnList = this.$refs.reader.getData().columns
      const toColumnsList = this.$refs.writer.getData().columns
      // const fromTableName = this.$refs.reader.getData().tableName
      // 第一步 reader 判断是否已选字段
      if (this.active === 2) {
        // 实现第一步骤读取的表和字段直接带到第二步骤
        // this.$refs.writer.sendTableNameAndColumns(fromTableName, fromColumnList)
        // 取子组件的数据
        // console.info(this.$refs.reader.getData())
        this.active++
      } else {
        // 将第一步和第二步得到的字段名字发送到第三步
        if (this.active === 3) {
          this.$refs.mapper.sendColumns(fromColumnList, toColumnsList)
          this.$refs.mapper.sendRuleSettings()
        }
        if (this.active === 4) {
          const readerColumns = this.$refs.mapper.getLColumns()
          const writerColumns = this.$refs.mapper.getRColumns()
          var tmps = JSON.parse(JSON.stringify(readerColumns)).sort()
          for (var i = 0; i < tmps.length - 1; i++) {
            if (tmps[i] === tmps[i + 1]) {
              this.$message('源端有相同字段【' + tmps[i] + '】，请注意修改')
              throw new Error('源端有相同字段【' + tmps[i] + '】，请注意修改')
            }
          }
          var tmps1 = JSON.parse(JSON.stringify(writerColumns)).sort()
          for (i = 0; i < tmps1.length - 1; i++) {
            if (tmps1[i] === tmps1[i + 1]) {
              this.$message(
                '目标端含有相同字段【' + tmps1[i] + '】，请注意修改'
              )
              throw new Error(
                '目标端含有相同字段【' + tmps1[i] + '】，请注意修改'
              )
            }
          }
          this.buildJson();
        }
        if (this.active === 5) {
          this.$refs.create.createTask()
        } else {
          this.active++
        }
      }
    },
    last() {
      if (this.active > 1) {
        this.active--
      }
    },
    // 构建json
    buildJson() {
      const readerData = this.$refs.reader.getData()
      const writeData = this.$refs.writer.getData()
      const readerColumns = this.$refs.mapper.getLColumns()
      const writerColumns = this.$refs.mapper.getRColumns()
      const transformer = this.$refs.mapper.getRules()
      const hiveReader = {
        readerPath: readerData.path,
        readerDefaultFS: readerData.defaultFS,
        readerFileType: readerData.fileType,
        readerFieldDelimiter: readerData.fieldDelimiter,
        readerSkipHeader: readerData.skipHeader
      }
      const hiveWriter = {
        writerDefaultFS: writeData.defaultFS,
        writerFileType: writeData.fileType,
        writerPath: writeData.path,
        writerFileName: writeData.fileName,
        writeMode: writeData.writeMode,
        writeFieldDelimiter: writeData.fieldDelimiter
      }
      const hbaseReader = {
        readerMode: readerData.mode,
        readerMaxVersion: readerData.maxVersion,
        readerRange: readerData.range
      }
      const hbaseWriter = {
        writerMode: writeData.mode,
        writerRowkeyColumn: writeData.rowkeyColumn,
        writerVersionColumn: writeData.versionColumn,
        writeNullMode: writeData.nullMode
      }
      const mongoDBReader = {}
      const mongoDBWriter = {
        upsertInfo: writeData.upsertInfo
      }
      const rdbmsReader = {
        readerSplitPk: readerData.splitPk,
        whereParams: readerData.where,
        querySql: readerData.querySql
      }
      const rdbmsWriter = {
        preSql: writeData.preSql,
        postSql: writeData.postSql
      }
      const obj = {
        readerDatasourceId: readerData.datasourceId,
        readerTables: [readerData.tableName],
        readerColumns: readerColumns,
        writerDatasourceId: writeData.datasourceId,
        writerTables: [writeData.tableName],
        writerColumns: writerColumns,
        transformer: transformer,
        hiveReader: hiveReader,
        hiveWriter: hiveWriter,
        rdbmsReader: rdbmsReader,
        rdbmsWriter: rdbmsWriter,
        hbaseReader: hbaseReader,
        hbaseWriter: hbaseWriter,
        mongoDBReader: mongoDBReader,
        mongoDBWriter: mongoDBWriter
      }
      // 调api
      dataxJsonApi.buildJobJson(obj).then(response => {
        this.configJson = JSON.parse(response)
      })
    },
    handleCopy(text, event) {
      clip(this.configJson, event)
      this.$message({
        message: 'copy success',
        type: 'success'
      })
    },
    handleJobTemplateSelectDrawer() {
      this.jobTemplateSelectDrawer = !this.jobTemplateSelectDrawer
      if (this.jobTemplateSelectDrawer) {
        this.fetchData()
      }
    },
    getReaderData() {
      return this.$refs.reader.getData()
    },
    fetchData() {
      this.listLoading = true
      jobTemplate.getList(this.listQuery).then(response => {
        const { content } = response
        this.total = content.recordsTotal
        this.list = content.data
        this.listLoading = false
      })
    },
    handleCurrentChange(val) {
      this.temp = Object.assign({}, val)
      this.temp.id = undefined
      this.temp.jobDesc = this.getReaderData().tableName
      this.$refs.jobTemplateSelectDrawer.closeDrawer()
      this.jobTemplate = val.id + '(' + val.jobDesc + ')'
    }
  }
}
</script>

<style scoped>
.step5content {
  background: #F8F8FA;
  overflow: hidden;
  margin: 22px 0;
  padding: 16px;
}
.step5content_key {
  color: rgba(153, 153, 153, 1);
}
.step5content > div {
  width: 50%;
  float: left;
  padding: 8px;
}
.step5content_value {
  line-height: 20px;
  font-size: 14px;
  font-family: PingFangHK-Regular, PingFangHK;
  font-weight: 400;
  color: #333333;
}
.app-container {
  padding: 0;
}
</style>
