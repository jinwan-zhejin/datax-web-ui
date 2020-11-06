<template>
  <div class="app-container">
    <div class="build-container">
      <div
        style="
          width: 100%;
          border-bottom: 1px solid rgba(240, 240, 242, 1);
          margin-bottom: 20px;
          padding: 20px 0;
        "
      >
        <div style="width: 80%; margin: 0 auto">
          <el-steps :active="active" align-center>
            <el-step title="新建任务" description="">1</el-step>
            <el-step title="添加质量规则" description="">2</el-step>
            <el-step title="结果数据存放位置" description="">3</el-step>
            <el-step title="字段映射" description="">4</el-step>
            <el-step title="构建" description="">5</el-step>
          </el-steps>
        </div>
      </div>

      <div class="main_content">
        <div v-show="active === 0" class="step0">
          <el-form
            ref="dataForm"
            :rules="rules"
            :model="temp"
            label-position="right"
            label-width="120px"
          >
            <el-form-item label="任务名称：" prop="jobDesc">
              <el-input
                v-model="temp.jobDesc"
                size="medium"
                placeholder="请输入任务描述"
              />
            </el-form-item>

            <el-form-item label="执行器：" prop="jobGroup">
              <el-select v-model="temp.jobGroup" placeholder="请选择执行器">
                <el-option
                  v-for="item in executorList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="路由策略：" prop="executorRouteStrategy">
              <el-select
                v-model="temp.executorRouteStrategy"
                placeholder="请选择路由策略"
              >
                <el-option
                  v-for="item in routeStrategies"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="阻塞处理：" prop="executorBlockStrategy">
              <el-select
                v-model="temp.executorBlockStrategy"
                placeholder="请选择阻塞处理策略"
              >
                <el-option
                  v-for="item in blockStrategies"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="子任务：">
              <el-select
                v-model="temp.childJobIdArr"
                multiple
                placeholder="子任务"
                value-key="id"
              >
                <el-option
                  v-for="item in jobIdList"
                  :key="item.id"
                  :label="item.jobDesc"
                  :value="item"
                />
              </el-select>
            </el-form-item>

            <el-dialog
              title="提示"
              :visible.sync="showCronBox"
              width="60%"
              append-to-body
              class="cron"
            >
              <cron v-model="temp.jobCron" />
              <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showCronBox = false"
                  >关闭</el-button
                >
                <el-button
                  size="small"
                  type="primary"
                  @click="showCronBox = false"
                  >确 定</el-button
                >
              </span>
            </el-dialog>
            <el-form-item label="Cron" prop="jobCron">
              <el-input
                v-model="temp.jobCron"
                auto-complete="off"
                placeholder="请输入Cron表达式"
              >
                <el-button
                  v-if="!showCronBox"
                  slot="append"
                  icon="el-icon-turn-off"
                  title="打开图形配置"
                  @click="showCronBox = true"
                />
                <el-button
                  v-else
                  slot="append"
                  icon="el-icon-open"
                  title="关闭图形配置"
                  @click="showCronBox = false"
                />
              </el-input>
            </el-form-item>

            <el-form-item label="报警邮件：">
              <el-input
                v-model="temp.alarmEmail"
                placeholder="请输入报警邮件，多个用逗号分隔"
              />
            </el-form-item>

            <el-form-item label="JVM启动参数：">
              <el-input
                v-model="temp.jvmParam"
                placeholder="-Xms1024m -Xmx1024m -XX:+HeapDumpOnOutOfMemoryError"
              />
            </el-form-item>

            <el-form-item label="失败重试次数：">
              <el-input-number
                v-model="temp.executorFailRetryCount"
                :min="0"
                :max="20"
                size="small"
              />
            </el-form-item>

            <el-form-item label="超时时间(分)：">
              <el-input-number
                v-model="temp.executorTimeout"
                :min="0"
                :max="120"
                size="small"
              />
            </el-form-item>
          </el-form>
        </div>

        <div v-show="active === 1" class="step1">
          <Reader ref="reader" />
        </div>
        <div v-show="active === 2" class="step2">
          <Writer ref="writer" />
        </div>
        <div v-show="active === 3" class="step3">
          <Mapper ref="mapper" />
        </div>
        <div v-show="active === 4" class="step4">
          <div style="margin-bottom: 20px" />
          <!-- <json-editor
            v-show="active === 4"
            ref="jsonEditor"
            v-model="configJson"
          /> -->
          <div style="margin-top: 20px">
            <p>1.新建任务</p>
            <div class="step5content">
              <div>
                <span class="step5content_key">执行器：</span>
                <span class="step5content_value">{{ temp.jobGroup || "-" }}</span>
              </div>
              <div>
                <span class="step5content_key">所属项目：</span>
                <span class="step5content_value">{{ temp.projectId || "-" }}</span>
              </div>
              <div>
                <span class="step5content_key">路由策略：</span>
                <span class="step5content_value">{{ temp.executorRouteStrategy || "-" }}</span>
              </div>
              <div>
                <span class="step5content_key">子项目：</span>
                <span class="step5content_value">{{ temp.childJobId || "-" }}</span>
              </div>
              <div>
                <span class="step5content_key">阻塞处理：</span>
                <span class="step5content_value">{{ temp.executorBlockStrategy || "-" }}</span>
              </div>
              <div>
                <span class="step5content_key">任务名称：</span>
                <span class="step5content_value">{{ temp.jobDesc || "-" }}</span>
              </div>
              <div>
                <span class="step5content_key">任务类型：</span>
                <span class="step5content_value">{{ $store.state.taskAdmin.tabType }}</span>
              </div>
              <div>
                <span class="step5content_key">Cron：</span>
                <span class="step5content_value">{{ temp.jobCron }}</span>
              </div>
              <div>
                <span class="step5content_key">报警邮件：</span>
                <span class="step5content_value">{{ temp.alarmEmail || "-" }}</span>
              </div>
              <div>
                <span class="step5content_key">失败重试次数：</span>
                <span class="step5content_value">{{ temp.executorFailRetryCount || "0" }}</span>
              </div>
              <div>
                <span class="step5content_key">超时时间：</span>
                <span class="step5content_value">{{ temp.executorTimeout || "0" }}</span>
              </div>
            </div>
          </div>

          <div>
            <p>2.构建reader</p>
            <div class="step5content">
              <div>
                <span class="step5content_key">数据库源：</span>
                <span class="step5content_value">{{ $refs.reader && $refs.reader.$refs.rdbmsreader.datasourceName || "-" }}</span>
              </div>
              <div>
                <span class="step5content_key">切分字段：</span>
                <span class="step5content_value">{{ $refs.reader && $refs.reader.$refs.rdbmsreader.readerForm.splitPk || "-" }}</span>
              </div>
              <div>
                <span class="step5content_key">数据库表名：</span>
                <span class="step5content_value">{{ $refs.reader && $refs.reader.$refs.rdbmsreader.readerForm.tableName || "-" }}</span>
              </div>
              <div>
                <span class="step5content_key">表所有字段：</span>
                <span class="step5content_value">{{ $refs.reader && $refs.reader.$refs.rdbmsreader.readerForm.columns || "-" }}</span>
              </div>
            </div>
          </div>

          <div>
            <p>3.构建writer</p>
            <div class="step5content">
              <div>
                <span class="step5content_key">数据库源：</span>
                <span class="step5content_value">{{ $refs.writer && $refs.writer.$refs.rdbmswriter.datasourceName || "-" }}</span>
              </div>
              <div>
                <span class="step5content_key">数据库表名：</span>
                <span class="step5content_value">{{ $refs.writer && $refs.writer.$refs.rdbmswriter.writerForm.tableName || "-" }}</span>
              </div>
              <div>
                <span class="step5content_key">字段：</span>
                <span class="step5content_value">{{ $refs.writer && $refs.writer.$refs.rdbmswriter.writerForm.columns || "-" }}</span>
              </div>
              <div>
                <span class="step5content_key">postSql：</span>
                <span class="step5content_value">{{ $refs.writer && $refs.writer.$refs.rdbmswriter.writerForm.postSql || "-" }}</span>
              </div>
              <div>
                <span class="step5content_key">前置Sql语句：</span>
                <span class="step5content_value">{{  $refs.writer && $refs.writer.$refs.rdbmswriter.writerForm.preSql || "-" }}</span>
              </div>
            </div>
          </div>

          <div style="margin-top: 20px">
            <p style="margin: 20px 0">4.字段映射</p>
            <div style="border: 1px solid #f3f3f3">
              <el-table
                :data="$store.state.taskAdmin.tableData"
                stripe
                :header-cell-style="{
                  background: '#FAFAFC',
                  color: 'rgba(51, 51, 51, 1)',
                  'font-family': 'PingFangHK-Medium, PingFangHK',
                }"
                style="width: 100%"
              >
                <el-table-column
                  prop="sourceField"
                  label="数据源库"
                  width="180"
                />
                <!-- <el-table-column
                  prop="clearRule"
                  label="清洗规则"
                  width="180"
                /> -->
                <el-table-column prop="targetField" label="目标字段" />
              </el-table>
            </div>
          </div>
        </div>
      </div>

      <div class="from_footer">
        <el-button
          :disabled="active === 0"
          style="margin-top: 12px"
          @click="last"
          size="small"
          >上一步</el-button
        >
        <el-button
          v-show="showNext"
          type="primary"
          style="margin-top: 12px; margin-bottom: 12px"
          @click="next"
          size="small"
          >下一步</el-button
        >
        <el-button
          v-show="showSubmit"
          :disabled="isBan"
          type="primary"
          style="margin-top: 12px; margin-bottom: 12px"
          @click="next"
          size="small"
          >提交任务</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import * as dataxJsonApi from "@/api/datax-json";
import * as jobTemplate from "@/api/datax-job-template";
import * as job from "@/api/datax-job-info";
import Pagination from "@/components/Pagination";
import JsonEditor from "@/components/JsonEditor";
import * as jobProjectApi from "@/api/datax-job-project";
import ShellEditor from "@/components/ShellEditor";
import PythonEditor from "@/components/PythonEditor";
import PowershellEditor from "@/components/PowershellEditor";
import Reader from "./reader";
import Writer from "./writer";
import clip from "@/utils/clipboard";
import Mapper from "./mapper";
import { isJSON } from "@/utils/validate";
import Cron from "@/components/Cron";

export default {
  name: "JsonBuild",
  components: {
    Reader,
    Writer,
    Pagination,
    JsonEditor,
    ShellEditor,
    PythonEditor,
    PowershellEditor,
    Mapper,
    Cron,
  },
  data() {
    const validateIncParam = (rule, value, callback) => {
      if (!value) {
        callback(new Error("Increment parameters is required"));
      }
      callback();
    };
    const validatePartitionParam = (rule, value, callback) => {
      if (!this.partitionField) {
        callback(new Error("Partition parameters is required"));
      }
      callback();
    };
    return {
      configJson: "",
      isBan: false,
      active: 0,
      jobTemplate: "",
      radio: "使用模板",
      dialogFormVisible: false,
      executorList: "",
      jobProjectList: "",
      jobIdList: "",
      showSubmit: false,
      showNext: true,
      jobTemplateSelectDrawer: false,
      list: null,
      currentRow: null,
      listLoading: true,
      showCronBox: false,
      total: 0,
      listQuery: {
        current: 1,
        size: 10,
        jobGroup: 0,
        triggerStatus: -1,
        jobDesc: "",
        executorHandler: "",
        userId: 0,
      },
      blockStrategies: [
        { value: "SERIAL_EXECUTION", label: "单机串行" },
        { value: "DISCARD_LATER", label: "丢弃后续调度" },
        { value: "COVER_EARLY", label: "覆盖之前调度" },
      ],
      routeStrategies: [
        { value: "FIRST", label: "第一个" },
        { value: "LAST", label: "最后一个" },
        { value: "ROUND", label: "轮询" },
        { value: "RANDOM", label: "随机" },
        { value: "CONSISTENT_HASH", label: "一致性HASH" },
        { value: "LEAST_FREQUENTLY_USED", label: "最不经常使用" },
        { value: "LEAST_RECENTLY_USED", label: "最近最久未使用" },
        { value: "FAILOVER", label: "故障转移" },
        { value: "BUSYOVER", label: "忙碌转移" },
        // { value: 'SHARDING_BROADCAST', label: '分片广播' }
      ],
      incrementTypes: [
        { value: 0, label: "无" },
        { value: 1, label: "主键自增" },
        { value: 2, label: "时间自增" },
        { value: 3, label: "HIVE分区" },
        { value: 4, label: "HIVE分区自增" },
        { value: 5, label: "MongoDB主键增量" },
      ],
      glueTypes: [
        { value: "BEAN", label: "DataX任务" },
        { value: "GLUE_SHELL", label: "Shell任务" },
        { value: "GLUE_PYTHON", label: "Python任务" },
        { value: "GLUE_POWERSHELL", label: "PowerShell任务" },
      ],
      triggerNextTimes: "",
      registerNode: [],
      jobJson: "",
      isUse: true,
      glueSource: "",
      rules: {
        jobGroup: [
          {
            required: true,
            message: "jobGroup is required",
            trigger: "change",
          },
        ],
        executorRouteStrategy: [
          {
            required: true,
            message: "executorRouteStrategy is required",
            trigger: "change",
          },
        ],
        executorBlockStrategy: [
          {
            required: true,
            message: "executorBlockStrategy is required",
            trigger: "change",
          },
        ],
        glueType: [
          { required: true, message: "jobType is required", trigger: "change" },
        ],
        projectId: [
          {
            required: true,
            message: "projectId is required",
            trigger: "change",
          },
        ],
        jobDesc: [
          { required: true, message: "jobDesc is required", trigger: "blur" },
        ],
        jobProject: [
          {
            required: true,
            message: "jobProject is required",
            trigger: "blur",
          },
        ],
        jobCron: [
          { required: true, message: "jobCron is required", trigger: "blur" },
        ],
        incStartId: [{ trigger: "blur", validator: validateIncParam }],
        replaceParam: [{ trigger: "blur", validator: validateIncParam }],
        primaryKey: [{ trigger: "blur", validator: validateIncParam }],
        incStartTime: [{ trigger: "change", validator: validateIncParam }],
        replaceParamType: [{ trigger: "change", validator: validateIncParam }],
        partitionField: [
          { trigger: "blur", validator: validatePartitionParam },
        ],
        datasourceId: [{ trigger: "change", validator: validateIncParam }],
        readerTable: [{ trigger: "blur", validator: validateIncParam }],
      },
      temp: {
        id: undefined,
        jobGroup: "",
        jobCron: "",
        jobDesc: "",
        executorRouteStrategy: "",
        executorBlockStrategy: "",
        childJobId: "",
        childJobIdArr: [],
        executorFailRetryCount: "",
        alarmEmail: "",
        executorTimeout: "",
        userId: 0,
        jobConfigId: "",
        executorHandler: "executorJobHandler",
        glueType: "BEAN",
        glueSource: "",
        jobJson: "",
        executorParam: "",
        replaceParam: "",
        replaceParamType: "Timestamp",
        jvmParam: "",
        incStartTime: "",
        partitionInfo: "",
        incrementType: 0,
        incStartId: "",
        primaryKey: "",
        projectId: this.$store.state.taskAdmin.projectId,
        datasourceId: "",
        readerTable: "",
      },
    };
  },
  watch: {
    radio: function (newValue) {
      console.log(newValue);
      if (newValue === "使用模板") {
        this.isUse = true;
        this.isBan = false;
        this.handleJobTemplateSelectDrawer();
        this.dialogFormVisible = false;
      } else {
        this.isUse = false;
        this.isBan = true;
        this.dialogFormVisible = true;
      }
    },
  },
  created() {
    // this.getJdbcDs()
    this.getExecutor();
    this.getJobProject();
    this.getJobIdList();
  },
  methods: {
    noUse() {
      this.dialogFormVisible = true;
      console.log(123);
    },
    handleClose() {
      this.dialogFormVisible = false;
    },
    // 补充请求
    getExecutor() {
      job.getExecutorList().then((response) => {
        const { content } = response;
        this.executorList = content;
      });
    },
    getJobProject() {
      jobProjectApi.getJobProjectList().then((response) => {
        this.jobProjectList = response;
      });
    },
    getJobIdList() {
      job.getJobIdList().then((response) => {
        const { content } = response;
        this.jobIdList = content;
      });
    },
    next() {
      const fromColumnList = this.$refs.reader.getData().columns;
      const toColumnsList = this.$refs.writer.getData().columns;
      // const fromTableName = this.$refs.reader.getData().tableName
      // 第一步 reader 判断是否已选字段
      if (this.active === 0) {
        this.$refs["dataForm"].validate((valid) => {
          if (valid) {
            this.active++;
          } else {
            return false;
          }
        });
      } else if (this.active === 1) {
        // 实现第一步骤读取的表和字段直接带到第二步骤
        // this.$refs.writer.sendTableNameAndColumns(fromTableName, fromColumnList)
        // 取子组件的数据
        this.$refs["reader"].$refs["rdbmsreader"].$refs["readerFrom"].validate(
          (valid) => {
            if (valid) {
              this.active++;
            } else {
              return false;
            }
          }
        );

        this.showNext = true;
        this.showSubmit = false;
      } else {
        // 将第一步和第二步得到的字段名字发送到第三步
        if (this.active === 2) {
          let datasource = this.$refs.writer.dataSource;
          let ref = {
            db2: "rdbmswriter",
            hive: "hivewriter",
          };

          this.$refs["writer"].$refs[ref[datasource] || "rdbmswriter"].$refs[
            "writerFrom"
          ].validate((valid) => {
            if (valid) {
              this.active++;
              this.showNext = true;
              this.showSubmit = false;
              this.$refs.mapper.sendColumns(fromColumnList, toColumnsList);
              this.$refs.mapper.sendRuleSettings();
            } else {
              return false;
            }
          });
        } else if(this.active === 3 || this.active === 4) {
          this.active++
        };

        if (this.active === 3) {
          this.showNext = true;
          this.showSubmit = false;
          this.jobTemplateSelectDrawer = true;
          const readerColumns = this.$refs.mapper.getLColumns();
          const writerColumns = this.$refs.mapper.getRColumns();
          var tmps = JSON.parse(JSON.stringify(readerColumns)).sort();
          for (var i = 0; i < tmps.length - 1; i++) {
            if (tmps[i] === tmps[i + 1]) {
              this.$message("源端有相同字段【" + tmps[i] + "】，请注意修改");
              throw new Error("源端有相同字段【" + tmps[i] + "】，请注意修改");
            }
          }
          var tmps1 = JSON.parse(JSON.stringify(writerColumns)).sort();
          for (i = 0; i < tmps1.length - 1; i++) {
            if (tmps1[i] === tmps1[i + 1]) {
              this.$message(
                "目标端含有相同字段【" + tmps1[i] + "】，请注意修改"
              );
              throw new Error(
                "目标端含有相同字段【" + tmps1[i] + "】，请注意修改"
              );
            }
          }
          this.buildJson();
        } else if (this.active === 4) {
          this.showNext = false;
          this.showSubmit = true;
        } else if (this.active === 5) {
          this.temp.jobJson = this.configJson;
          this.temp.jobType = this.$store.state.taskAdmin.tabType;

          let str = "";
          this.temp.childJobIdArr.forEach((child) => {
            str += `${child.id},`;
          });

          this.temp.childJobId = str;
          console.log("this.temp", this.temp);
          job.createJob(this.temp).then(() => {
            this.$notify({
              title: "Success",
              message: "Created Successfully",
              type: "success",
              duration: 2000,
            });

            this.$store.dispatch("getTaskList", true);
            this.$store.commit("SET_TAB_TYPE", "");
          });
        }
      }

      console.log(this.active);
    },
    last() {
      if (this.active >= 1) {
        this.showNext = true;
        this.showSubmit = false;
        this.active--;
      } else if (this.active === 3) {
        this.showNext = false;
        this.showSubmit = true;
      } else {
        this.showNext = true;
        this.showSubmit = false;
      }

      console.log(this.active);
    },
    // 构建json
    buildJson() {
      const readerData = this.$refs.reader.getData();
      const writeData = this.$refs.writer.getData();
      const readerColumns = this.$refs.mapper.getLColumns();
      const writerColumns = this.$refs.mapper.getRColumns();
      const transformer = this.$refs.mapper.getRules();
      const hiveReader = {
        readerPath: readerData.path,
        readerDefaultFS: readerData.defaultFS,
        readerFileType: readerData.fileType,
        readerFieldDelimiter: readerData.fieldDelimiter,
        readerSkipHeader: readerData.skipHeader,
      };
      const hiveWriter = {
        writerDefaultFS: writeData.defaultFS,
        writerFileType: writeData.fileType,
        writerPath: writeData.path,
        writerFileName: writeData.fileName,
        writeMode: writeData.writeMode,
        writeFieldDelimiter: writeData.fieldDelimiter,
      };
      const hbaseReader = {
        readerMode: readerData.mode,
        readerMaxVersion: readerData.maxVersion,
        readerRange: readerData.range,
      };
      const hbaseWriter = {
        writerMode: writeData.mode,
        writerRowkeyColumn: writeData.rowkeyColumn,
        writerVersionColumn: writeData.versionColumn,
        writeNullMode: writeData.nullMode,
      };
      const mongoDBReader = {};
      const mongoDBWriter = {
        upsertInfo: writeData.upsertInfo,
      };
      const rdbmsReader = {
        readerSplitPk: readerData.splitPk,
        whereParams: readerData.where,
        querySql: readerData.querySql,
      };
      const rdbmsWriter = {
        preSql: writeData.preSql,
        postSql: writeData.postSql,
      };
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
        rule: this.$refs.reader.getData().rule,
        mongoDBReader: mongoDBReader,
        mongoDBWriter: mongoDBWriter,
      };
      // 调api
      dataxJsonApi.buildJson(obj).then((response) => {
        this.configJson = response;
      });
    },
    handleCopy(text, event) {
      clip(this.configJson, event);
      this.$message({
        message: "copy success",
        type: "success",
      });
    },
    handleJobTemplateSelectDrawer() {
      this.jobTemplateSelectDrawer = !this.jobTemplateSelectDrawer;
      if (this.jobTemplateSelectDrawer) {
        this.fetchData();
      }
    },
    getReaderData() {
      return this.$refs.reader.getData();
    },
    fetchData() {
      this.listLoading = true;
      jobTemplate.getList(this.listQuery).then((response) => {
        const { content } = response;
        this.total = content.recordsTotal;
        this.list = content.data;
        this.listLoading = false;
      });
    },
    handleCurrentChange(val) {
      this.temp = Object.assign({}, val);
      this.temp.id = undefined;
      this.temp.jobDesc = this.getReaderData().tableName;
      this.$refs.jobTemplateSelectDrawer.closeDrawer();
      this.jobTemplate = val.id + "(" + val.jobDesc + ")";
    },
  },
};
</script>

<style scoped>
.from_footer {
  text-align: right;
  border-top: 1px solid #f3f3f3;
  margin-top: 0;
}

.main_content {
  width: 78%;
  margin: 0 auto;
  min-height: 500px;
}

.main_content >>> .el-select {
  width: 100%;
}

.cron >>> .el-dialog {
  border-radius: 8px;
}

.step5content {
  background: #f8f8fa;
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
</style>
