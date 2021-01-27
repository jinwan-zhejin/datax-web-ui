<template>
  <div class="app-container">
    <div class="head-container">
      <el-card class="box-card">
        <div class="text item">
          <div class="left">DDL构建</div>
          <el-col class="left-description">
            DDL构建。
          </el-col>
        </div>
      </el-card>
    </div>
    <div class="main">
      <el-form class="action-bar" style="border-bottom: 1px solid #DCDFE6;" label-position="right" label-width="auto" :inline="true">
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="newTransform"
          >新的构建</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="18" :offset="3">
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-width="200px"
            style="margin: 15px 0; height: calc(100vh - 367px); overflow-y: auto;"
          >
            <el-form-item label="所属项目名称:" prop="projectId">
              <el-select
                v-model="form.projectId"
                placeholder="请选择待项目名称"
                @change="onProjectChange"
              >
                <el-option
                  v-for="item in projectlist"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="待转换数据源:" prop="datasourceId">
              <el-select
                v-model="form.datasourceId"
                placeholder="请选择待转换数据源"
                @change="onDSChange"
              >
                <el-option
                  v-for="(item, index) in datasourcelist"
                  :key="index"
                  :value="item.id"
                  :label="item.datasourceName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="待转换数据库/Schema:" prop="schema">
              <el-select
                v-model="form.schema"
                placeholder="请选择待转换数据库/Schema"
                @change="onSchemaChange"
              >
                <el-option
                  v-for="(item, index) in schemalist"
                  :key="index"
                  :value="item"
                  :label="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="目标SQL类型:">
              <el-radio-group v-model="form.targetSQL">
                <el-radio :label="1">Hive</el-radio>
                <el-radio :label="2">Impala</el-radio>
                <el-radio :label="3">Kudu</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.targetSQL === 1" label="版本:">
              <el-select v-model="form.targetVersion" placeholder="请选择版本" style="width: 35%;">
                <el-option
                  v-for="(item, index) in hiveVersion"
                  :key="index"
                  :value="item.hive"
                >{{ item.cdh }} ({{ item.hive }})</el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.targetSQL === 1" label="是否临时表:">
              <el-radio-group v-model="form.temporary">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.targetSQL === 1" label="是否外部表:">
              <el-radio-group v-model="form.external">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item v-if="form.targetSQL === 1" label="是否添加删除语句:">
              <el-radio-group v-model="form.dropAdded">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.targetSQL === 1" label="数据库名称:">
              <el-radio-group v-model="form.dbNameType">
                <el-radio label="source">与数据源相同</el-radio>
                <el-radio label="udf">自定义</el-radio>
              </el-radio-group>
              <el-input v-if="form.dbNameType =='udf'" v-model="form.dbNamePattern" style="width: 35%; margin-left: 20px;" />
              <el-tooltip class="item" effect="dark" content="自定义数据库名格式,字符串中的%s会被源库名替换" placement="top">
                <i class="el-icon-info" style="margin-left: 10px;" />
              </el-tooltip>
            </el-form-item>
            <el-form-item v-if="form.targetSQL === 1" label="表名:">
              <el-radio-group v-model="form.tableNameType">
                <el-radio label="source">与数据源相同</el-radio>
                <el-radio label="udf">自定义</el-radio>
              </el-radio-group>
              <el-input v-if="form.tableNameType =='udf'" v-model="form.tableNamePattern_o" style="width: 35%; margin-left: 20px;">
                <template slot="prepend">%s</template>
              </el-input>
              <el-tooltip class="item" effect="dark" content="自定义表名格式,字符串中的%s会被源表名替换" placement="top">
                <i class="el-icon-info" style="margin-left: 10px;" />
              </el-tooltip>
            </el-form-item>
            <el-form-item v-if="form.targetSQL === 1" label="分区字段:">
              <el-radio-group v-model="form.partitionKey">
                <el-radio label="random">随机选取</el-radio>
                <el-radio label="randomDate">随机选取DATE类型字段</el-radio>
                <el-radio label="none">无</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.targetSQL === 1" label="分桶字段:">
              <el-radio-group v-model="form.bucketKey">
                <el-radio label="primarykey">主键</el-radio>
                <el-radio label="random">随机选取</el-radio>
                <el-radio label="none">无</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.targetSQL === 1 && form.bucketKey != 'none'" label="分桶数:">
              <el-input-number
                v-model="form.bucketNum"
                :min="2"
                :max="30"
                style="width: 35%;"
                size="small"
              />
            </el-form-item>
            <el-form-item v-if="form.targetSQL === 1 && form.bucketKey != 'none'" label="分桶排序字段:">
              <el-radio-group v-model="form.bucketSortKey">
                <el-radio label="date">时间字段</el-radio>
                <el-radio label="random">随机选取</el-radio>
                <el-radio label="none">无</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.targetSQL === 1 && form.bucketKey != 'none' && form.bucketSortKey != 'none'">
              <el-radio-group v-model="form.bucketSortOrder">
                <el-radio label="desc">降序</el-radio>
                <el-radio label="asc">升序</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.targetSQL === 1" label="格式控制:">
              <el-radio-group v-model="form.rowformat">
                <el-radio label="DELIMITED">DELIMITED</el-radio>
                <el-radio label="SERDE">SERDE</el-radio>
                <el-radio label="none">无</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.targetSQL === 1 && form.rowformat == 'DELIMITED'" label="">
              <el-form label-width="110px" label-position="left">
                <el-form-item>
                  <span slot="label">
                    <el-checkbox v-model="lineTermChecked">行分隔符</el-checkbox>
                  </span>
                  <el-input
                    v-if="lineTermChecked"
                    v-model="form.rowformatLineTerm"
                    style="line-height: 54px;"
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="110px" label-position="left">
                <el-form-item>
                  <span slot="label">
                    <el-checkbox v-model="fieldTermChecked">列分隔符</el-checkbox>
                  </span>
                  <el-input
                    v-if="fieldTermChecked"
                    v-model="form.fieldTerm"
                    style="line-height: 54px;"
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="155px" label-position="left">
                <el-form-item>
                  <span slot="label">
                    <el-checkbox v-model="collectionTermChecked">Collection分隔符</el-checkbox>
                  </span>
                  <el-input
                    v-if="collectionTermChecked"
                    v-model="form.rowformatCollectTerm"
                    style="line-height: 54px;"
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="160px" label-position="left">
                <el-form-item>
                  <span slot="label">
                    <el-checkbox v-model="mapKeyTermChecked">MapKey分隔符号</el-checkbox>
                  </span>
                  <el-input
                    v-if="mapKeyTermChecked"
                    v-model="form.rowformatMapKeyTerm"
                    style="line-height: 54px;"
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="140px" label-position="left">
                <el-form-item>
                  <span slot="label">
                    <el-checkbox v-model="nullDefinedAsChecked">空值替换字符</el-checkbox>
                  </span>
                  <el-input
                    v-if="nullDefinedAsChecked"
                    v-model="form.rowformatNullDefinndAs"
                    style="line-height: 54px;"
                  />
                </el-form-item>
              </el-form>
            </el-form-item>
            <el-form-item v-if="form.targetSQL === 1 && form.rowformat == 'SERDE'" label="SERDE名称:">
              <el-input v-model="form.rowformatSerdeName" placeholder="SERDE名称" />
            </el-form-item>
            <el-form-item v-if="form.targetSQL === 1" label="存储文件类型:">
              <el-select
                v-model="form.storedAs"
                placeholder="存储文件类型"
              >
                <el-option
                  v-for="item in storedAslist"
                  :key="item"
                  :value="item"
                  :label="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.targetSQL === 1" label="存储位置:">
              <el-input v-model="form.location" placeholder="存储位置" />
            </el-form-item>
            <el-col :span="18" :offset="3">
              <el-progress
                v-if="showProgressbar"
                ref="transformProgress"
                :color="progressColor"
                :format="progressFormat"
                style="margin: 20px 0;"
                :percentage="transformPercentage"
              />
            </el-col>
          </el-form>
        </el-col>
      </el-row>
      <el-col style="padding-top: 15px; border-top: 1px solid #dcdfe6;">
        <el-col :span="12" :offset="6">
          <el-col :span="12" style="text-align: center;">
            <el-button
              v-loading="isLoading"
              :disabled="showProgressbar"
              type="primary"
              size="small"
              @click="onTransform('form')"
            >开始转换</el-button>
          </el-col>
          <el-col :span="12" style="text-align: center;">
            <el-button
              v-loading="isLoading"
              :disabled="!showProgressbar"
              type="primary"
              size="small"
              @click="showTransformedSQL"
            >查看转换结果</el-button>
          </el-col>
        </el-col>
      </el-col>
    </div>
    <!-- <el-dialog title="转换进度" :visible.sync="showProgressbar" width="50%">
        <el-progress
          style="width: 80%; margin-left: 10%"
          :percentage="transformPercentage"
        />
      </el-dialog> -->
    <el-dialog title="查看转换结果" :visible.sync="dialogVisible" width="60%">
      <div class="dialogBody">
        <el-row class="result-op" style="margin: 5px 0; position: absolute; right: 40px; z-index: 2020;">
          <el-col class="result-options">
            <el-tooltip placement="top" content="复制脚本">
              <el-button
                v-clipboard:error="onError"
                v-clipboard:copy="sqlScript"
                v-clipboard:success="onCopy"
                style="padding: 5px; font-size: 16px;"
                type="text"
                icon="el-icon-document-copy"
              />
            </el-tooltip>
            <el-tooltip placement="top" content="导出脚本">
              <el-button
                style="padding: 5px; font-size: 16px;"
                type="text"
                icon="el-icon-download"
                @click="onExportScript"
              />
            </el-tooltip>
          </el-col>
        </el-row>
        <el-input
          v-model="sqlScript"
          class="codesql"
          type="textarea"
          :autosize="{ minRows: 7, maxRows: 15}"
          placeholder="转换结果"
          readonly
        />
      </div>
    </el-dialog>
  </div>
  </div>
</template>

<script>
import * as jobProjectApi from '@/api/datax-job-project';
import * as datasourceApi from '@/api/datax-jdbcDatasource';
import {
  getTableSchema,
  getTableListWithComment,
  getTableList,
  getTableColumns,
  db2hive
} from '@/api/metadata-query';

export default {
  name: 'DDLTransform',
  components: {},
  data() {
    return {
      fieldTermChecked: false,
      collectionTermChecked: false,
      mapKeyTermChecked: false,
      lineTermChecked: false,
      nullDefinedAsChecked: false,
      form: {
        projectId: '',
        datasourceId: '', // 数据源id
        schema: '', // 数据源schema
        targetVersion: 'hive-1.1.0', // 取值：hive-1.1.0，hive-0.13.1，hive-0.12.0
        temporary: false, // 是否临时表
        external: true, // 是否外部表
        dropAdded: true, // 是否添加删除语句
        dbNameType: 'source', // source -与源库相同, udf - 根据dbNamePattern，用源库替换patter里的%s得到库名
        dbNamePattern: '%s', // 当dbNameType为udf时，根据dbNamePattern，用源库替换patter里的%s得库名
        tableNameType: 'source', // source -与源库相同, udf - 根据tableNamePattern，用源库替换patter里的%s得到表名
        tableNamePattern: '%s', // 当tableNamePattern为udf时，根据tableNamePattern，用源库替换patter里的%s得到表名
        tableNamePattern_o: '',
        partitionKey: 'random', // 分区字段，random: 随机选择, randomDate: 随机选择时间字段，none: 无分区
        bucketKey: 'random', // 分桶字段，primaryKey: 主键，random：随机选取，none：无分桶
        bucketNum: 3, // 分桶数量，整数
        bucketSortKey: 'date', // 分桶排序字段，date：选择某一个时间字段，random：随机选取字段，none：无排序字段
        bucketSortOrder: 'desc', // 分桶排序顺序，desc：降序，asc：升序
        rowformat: 'DELIMITED', // row format，DELIMITED：DELIMITED，SERDE：SERDE，none：无
        fieldTerm: ',', // 当rowformat为DELIMITED时，字段分隔符
        rowformatCollectTerm: ',', // 当rowformat为DELIMITED时，collection分隔符
        rowformatMapKeyTerm: ':', // 当rowformat为DELIMITED时，MapKey分隔符
        rowformatLineTerm: '\\n', // 当rowformat为DELIMITED时，行分隔符
        rowformatNullDefinndAs: ' ', // 当rowformat为DELIMITED时，Null值替换值
        rowformatSerdeName: '', // 当rowformat为SERDE时，serde类名
        storedAs: 'PARQUET', // 文件存储格式，取之范围：: SEQUENCEFILE，TEXTFILE，RCFILE，ORC，PARQUET，AVRO，JSONFILE
        location: '/tmp', // 对应location，存储位置
        targetSQL: 1 // 目标SQL类型
      },
      formCopy: undefined,
      rules: {
        projectId: [
          { required: true, message: '请选择所属项目名称', trigger: 'change' }
        ],
        datasourceId: [
          { required: true, message: '请选择待转换数据源', trigger: 'change' }
        ],
        schema: [
          { required: true, message: '请选择待转换数据库/Schema', trigger: 'change' }
        ]
      },
      storedAslist: [
        'SEQUENCEFILE',
        'TEXTFILE',
        'RCFILE',
        'ORC',
        'PARQUET',
        'AVRO',
        'JSONFILE',
        '无'
      ],
      hiveVersion: [
        {
          cdh: '> CDH 5.3.x',
          hive: 'hive-1.1.0'
        },
        {
          cdh: 'CDH 5.2.x | CDH 5.3.x',
          hive: 'hive-0.13.1'
        },
        {
          cdh: 'CDH 5.0.x | CDH 5.1.x',
          hive: 'hive-0.12.0'
        }
      ],
      transformPercentage: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        searchVal: '',
        userId: ''
      },
      projectlist: [],
      datasourcelist: [],
      datasourceListQuery: {
        current: 1,
        size: 10000,
        projectId: '',
        datasourceName: ''
      },
      schemalist: [],
      tablelist: [],
      showProgressbar: false,
      /** 进度log */
      sqlScript: '',
      mysql2hiveDataTypeMap: {
        int: 'INT',
        double: 'DOUBLE',
        varchar: 'String',
        datetime: 'DATE',
        timestamp: 'DATETIME'
      },
      dialogVisible: false,
      isLoading: false
    };
  },
  watch: {
    'form.tableNamePattern_o'(val) {
      this.form.tableNamePattern = '%s' + val
    },
    'form.tableNameType'(val) {
      if (val === 'source') {
        this.form.tableNamePattern_o = ''
      }
    },
    'form.dbNameType'(val) {
      if (val === 'source') {
        this.form.dbNamePattern = '%s'
      }
    }
  },
  created() {
    this.formCopy = JSON.parse(JSON.stringify(this.form))
    this.getProjectList();
  },
  methods: {
    /**
     * @description: 开始转换
     */
    async onTransform(formName) {
      // const len = this.tablelist.length;
      // if (len < 1) {
      //   this.$notify({
      //     title: '警告',
      //     message: '未指定需要转换的表，请选择完善构建信息',
      //     type: 'warning',
      //     duration: 2000
      //   });
      //   return;
      // }
      // var targetSQL = this.form.targetSQL;
      // if (targetSQL == 1) {
      //   this.showProgressbar = true;

      //   for (let k = 0; k < len; k++) {
      //     await getTableColumns({
      //       datasourceId: this.form.datasourceId,
      //       schema: this.form.schema,
      //       tableName: this.tablelist[k].name
      //     }).then((res) => {
      //       console.log(res.datas);
      //       const arr = [];
      //       var script =
      //         'CREATE TABLE IF NOT EXISTS ' + this.tablelist[k].name + ' (\n';
      //       for (let j = 0; j < res.datas.length; j++) {
      //         var ele = res.datas[j];
      //         script +=
      //           '  ' +
      //           ele.COLUMN_NAME +
      //           ' ' +
      //           this.mysql2hiveDataTypeMap[ele.DATA_TYPE] +
      //           " comment '" +
      //           ele.COLUMN_COMMENT +
      //           "',\n";
      //       }
      //       this.sqlScript +=
      //         script +
      //         ")\nrow format delimited fields terminated by ',' \nlines terminated by '\\n';\n\n";
      //     });
      //     // this.sqlScript = this.sqlScript + this.tablelist[j].name + '\n'
      //     this.transformPercentage = Math.round(((k + 1) / len) * 100);
      //   }
      //   console.log(this.sqlScript);
      // } else if (targetSQL == 2) {
      // } else if (targetSQL == 3) {
      // } else {
      //   this.$notify({
      //     title: '警告',
      //     message: '未知目标SQL类型：' + targetSQL,
      //     type: 'warning',
      //     duration: 2000
      //   });
      //   return;
      // }

      // // this.$refs.transformProgress.setstate = 'success'

      // this.$notify({
      //   title: '转换完成',
      //   message: 'DDL转换完成，点击查看转换结果查看SQL',
      //   type: 'success',
      //   duration: 2000
      // });
      // this.showProgressbar = false
      // this.transformPercentage = 0
      console.log('this.form', this.form)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sqlScript = ''
          this.showProgressbar = true
          this.transformPercentage = 0
          this.isLoading = true
          if (this.form.targetSQL === 1) { // to hive
            db2hive(this.form).then(response => {
              response.forEach(ele => {
                this.sqlScript += (ele + '\n')
              })
              this.transformPercentage = 100
              this.isLoading = false
            })
          }
        } else {
          return false;
        }
      })
    },
    /**
     * @description: 获取项目列表
     */
    getProjectList() {
      this.listQuery.userId = parseInt(localStorage.getItem('userId'))
      jobProjectApi.list(this.listQuery).then((response) => {
        const { records } = response;
        this.projectlist = records;
      });
    },
    onProjectChange(value) {
      console.log(value);
      this.datasourceListQuery.projectId = value;
      datasourceApi.getJobList(this.datasourceListQuery).then((response) => {
        this.datasourcelist = response.records;
        this.form.datasourceId = ''
        this.form.schema = ''
        console.log(this.datasourcelist);
      });
    },
    onDSChange(value) {
      console.log(value);
      getTableSchema({
        datasourceId: value
      }).then((res) => {
        console.log(res);
        this.schemalist = res;
        this.form.schema = ''
      });
    },
    onSchemaChange(value) {
      getTableListWithComment({
        id: this.form.datasourceId,
        schema: value
      }).then((res) => {
        console.log('res', res);
        // this.tableList = res;
        this.tablelist = res;
      });
    },
    /**
     * @description: 转换结果
     */
    showTransformedSQL() {
      this.dialogVisible = true;
      // this.transformPercentage = 0;
    },
    /**
     * @description: 进度条颜色
     */
    progressColor(percentage) {
      if (percentage < 30) {
        return '#3d5eff';
      } else if (percentage < 70) {
        return '#409eff';
      } else {
        return '#67c23a';
      }
    },
    /**
     * @description: 进度条文字
     */
    progressFormat(percentage) {
      return percentage === 100 ? `完成` : `${percentage}%`
    },
    /**
     * @description: 新的构建
     */
    newTransform() {
      this.form = JSON.parse(JSON.stringify(this.formCopy))
      this.showProgressbar = false
      this.isLoading = false
    },
    /**
     * @description: 复制结果脚本到剪贴板
     */
    // 复制成功
    onCopy(e) {
      this.$message({
        message: '复制成功！',
        type: 'success'
      })
    },
    // 复制失败
    onError(e) {
      this.$message({
        message: '复制失败！',
        type: 'error'
      })
    },
    /**
     * @description: 脚本导出
     */
    onExportScript() {
      const fileBlob = new Blob([this.sqlScript])
      const downloadElement = document.createElement('a')
      const href = window.URL.createObjectURL(fileBlob)
      downloadElement.href = href
      downloadElement.download = '导出脚本' + '.txt'
      document.body.appendChild(downloadElement)
      downloadElement.click()
      document.body.removeChild(downloadElement)
      window.URL.revokeObjectURL(href)
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0;
  .head-container {
    overflow: hidden;
    background-color: #ffffff;
    padding: 0px;
    .box-card {
      box-shadow: inset 0px 5px 10px -8px rgba(0, 0, 0, 0.1);
      border: 0 !important;
      border-radius: 0;
      .left {
        float: left;
        width: 120px;
        font-size: 24px;
        font-family: PingFangHK-Medium, PingFangHK;
        font-weight: 500;
        color: #333333;
        margin-left: 24px;
      }
      .left-description {
        float: left;
        font-size: 14px;
        font-family: PingFangHK-Medium, PingFangHK;
        color: #000000a6;
        margin: 15px 24px;
      }
    }
  }

  .main {
    padding: 24px;
    background-color: #fff;
    overflow: hidden;
    margin: 20px 20px 0 20px;
  }

  .topSelect {
    overflow: hidden;
    height: 40px;
    line-height: 40px;

    .el-input {
      .el-input__inner {
        height: 32px;
      }

      .el-button {
        .el-button--default {
          color: #ffffff;
        }
      }
    }
  }

  .el-tabs {
    margin-top: 20px;

    .el-tab-pane {
      ul {
        overflow: hidden;

        li {
          list-style: none;
          float: left;
          width: 12.5%;

          a {
            text-align: center;

            img {
              display: block;
              margin: 0 auto;
              margin-top: 10px;
              width: 64px;
            }

            p {
              height: 40px;
              font-size: 14px;
              font-family: PingFangHK-Regular, PingFangHK;
              font-weight: 400;
              color: #333333;
              line-height: 20px;
              margin-top: 10px;
            }
          }

          p {
            font-size: 16px;
            margin-top: 20px;
          }
        }

        li:hover {
          background-color: #e9e9f5 !important;
        }

        li:active {
          background-color: #c4cfff;
        }

        li:visited {
          background-color: #c4cfff;
        }
      }
    }
  }

  .set {
    p {
      font-size: 18px;
      margin: 20px 0px 16px 0;
      font-family: PingFangHK-Medium, PingFangHK;
    }

    .bgcForm {
      background-color: #f5f6fa;
      padding: 24px 16px;
      overflow: hidden;
    }
  }

  .el-dialog {
    border-radius: 8px;

    .el-dialog__header {
      font-size: 24px;

      .p_tit {
        font-size: 16px;
        color: #cccccc;
        margin-top: 20px;
      }
    }

    .el-dialog__body {
      padding: 10px 20px;

      .el-form {
        overflow: hidden;
        border-radius: 6px;
        padding-right: 25px;
      }
    }

    .el-dialog__footer {
      border-top: 1px solid #f3f3f3;
      padding: 20px;
    }
  }

  .codesql {
    font-size: 11pt;
    // font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono,
    // DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
    >>> .el-textarea__inner {
      font-family: PingFangHK-Medium, PingFangHK;
    }
  }

  >>> .el-dialog__body {
    padding-top: 10px;
  }

  .result-options {
    .el-tooltip {
      background: #e6e6e6;
    }
    .el-tooltip:hover {
      background: #DAF3FD;
    }
  }
  .result-op {
    display: none;
  }

  .dialogBody:hover {
    .result-op {
      display: inline;
      transition: width 0.15s linear;
    }
  }
}
</style>
