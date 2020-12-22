<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card style="height: 64px">
        <div class="left">DDL构建</div>
      </el-card>
      <el-card style=" margin-top: 10px">
        <el-form
          ref="form"
          :model="form"
          label-width="200px"
          style="margin-top: 15px;"
        >
          <el-form-item label="所属项目名称:">
            <el-select
              v-model="form.projectId"
              style="width: 85%"
              placeholder="请选择待项目名称"
              @change="onProjectChange"
            >
              <el-form-item label="所属项目名称">
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
              <el-form-item label="待转换数据源">
                <el-select
                  v-model="form.datasource"
                  placeholder="请选择待转换数据源"
                  @change="onDSChange"
                >
                  <el-option
                    v-for="item in datasourcelist"
                    :key="item.id"
                    :value="item.id"
                    :label="item.datasourceName"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="待转换数据库/Schema">
                <el-select
                  v-model="form.schema"
                  placeholder="请选择待转换数据库/Schema"
                  @change="onSchemaChange"
                >
                  <el-option
                    v-for="item in schemalist"
                    :key="item"
                    :value="item"
                    :label="item"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="目标SQL类型">
                <el-radio-group v-model="form.targetSQL">
                  <el-radio label="Hive" />
                  <el-radio label="Impala" />
                  <el-radio label="Kudu" />
                </el-radio-group>
              </el-form-item>

              <el-form-item>
                <el-button
                  style="margin-left: 30%"
                  type="primary"
                  size="small"
                  @click="onTransform"
                >开始转换</el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="showTransformedSQL"
                >查看转换结果</el-button>
              </el-form-item>
              <el-progress
                v-if="showProgressbar"
                ref="transformProgress"
                style="width: 80%; margin-left: 10%"
                :percentage="transformPercentage"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="待转换数据源:">
            <el-select
              v-model="form.datasource"
              style="width: 85%"
              placeholder="请选择待转换数据源"
              @change="onDSChange"
            >
              <el-option
                v-for="item in datasourcelist"
                :key="item.id"
                :value="item.id"
                :label="item.datasourceName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="待转换数据库/Schema:">
            <el-select
              v-model="form.schema"
              style="width: 85%"
              placeholder="请选择待转换数据库/Schema"
              @change="onSchemaChange"
            >
              <el-option
                v-for="item in schemalist"
                :key="item"
                :value="item"
                :label="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="目标SQL类型:">
            <el-radio-group v-model="form.targetSQL">
              <el-radio label="Hive" />
              <el-radio label="Impala" />
              <el-radio label="Kudu" />
            </el-radio-group>
          </el-form-item>
          </el-form-item>
          <el-form-item v-if="form.targetSQL === 'Hive'" label="版本:">
            <el-select v-model="form.targetVersion" placeholder="请选择版本" style="width: 35%;">
              <el-option v-for="item in hiveVersion" :value="item.hive">{{ item.cdh }} ({{ item.hive }})</el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.targetSQL === 'Hive'" label="是否临时表:">
            <el-radio-group v-model="form.isTemporary">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.targetSQL === 'Hive'" label="是否外表:">
            <el-radio-group v-model="form.isExternal">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="form.targetSQL === 'Hive'" label="是否添加删除语句:">
            <el-radio-group v-model="form.isDropAdded">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.targetSQL === 'Hive'" label="数据库名称:">
            <el-radio-group v-model="form.dbNameType">
              <el-radio label="source">与数据源相同</el-radio>
              <el-radio label="udf">自定义</el-radio>
            </el-radio-group>
            <el-input v-if="form.dbNameType =='udf'" v-model="form.dbNamePattern" style="width: 35%; margin-left: 20px;" />
            <el-tooltip class="item" effect="dark" content="自定义数据库名格式,字符串中的%s会被源库名替换" placement="top">
              <i class="el-icon-info" style="margin-left: 10px;" />
            </el-tooltip>
          </el-form-item>
          <el-form-item v-if="form.targetSQL === 'Hive'" label="表名:">
            <el-radio-group v-model="form.tableNameType">
              <el-radio label="source">与数据源相同</el-radio>
              <el-radio label="udf">自定义</el-radio>
            </el-radio-group>
            <el-input v-if="form.tableNameType =='udf'" v-model="form.tableNamePattern" style="width: 35%; margin-left: 20px;" />
            <el-tooltip class="item" effect="dark" content="自定义表名格式,字符串中的%s会被源表名替换" placement="top">
              <i class="el-icon-info" style="margin-left: 10px;" />
            </el-tooltip>
          </el-form-item>
          <el-form-item v-if="form.targetSQL === 'Hive'" label="分区字段:">
            <el-radio-group v-model="form.partitionKey">
              <el-radio label="random">随机选取</el-radio>
              <el-radio label="randomDate">随机选取DATE类型字段</el-radio>
              <el-radio label="none">无</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.targetSQL === 'Hive'" label="分桶字段:">
            <el-radio-group v-model="form.bucketKey">
              <el-radio label="primarykey">主键</el-radio>
              <el-radio label="random">随机选取</el-radio>
              <el-radio label="none">无</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.targetSQL === 'Hive' && form.bucketKey != 'none'" label="分桶数:">
            <el-input-number
              v-model="form.bucketNum"
              :min="2"
              :max="30"
              style="width: 35%;"
            />
          </el-form-item>
          <el-form-item v-if="form.targetSQL === 'Hive' && form.bucketKey != 'none'" label="分桶排序字段:">
            <el-radio-group v-model="form.bucketSortKey">
              <el-radio label="date">时间字段</el-radio>
              <el-radio label="random">随机选取</el-radio>
              <el-radio label="none">无</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.targetSQL === 'Hive' && form.bucketKey != 'none' && form.bucketSortKey != 'none'">
            <el-radio-group v-model="form.bucketSortOrder">
              <el-radio label="desc">降序</el-radio>
              <el-radio label="asc">升序</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.targetSQL === 'Hive'" label="Row Format:">
            <el-radio-group v-model="form.rowformat">
              <el-radio label="DELIMITED">DELIMITED</el-radio>
              <el-radio label="SERDE">SERDE</el-radio>
              <el-radio label="none">无</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.targetSQL === 'Hive' && form.rowformat == 'DELIMITED'" label="">
            <el-row>
              <el-col :span="4">
                <el-checkbox v-model="fieldTermChecked">列分隔符</el-checkbox>
              </el-col>
              <el-col :span="8">
                <el-input
                  v-if="fieldTermChecked"
                  v-model="form.fieldTerm"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <el-checkbox v-model="collectionTermChecked">Collection分隔符</el-checkbox>
              </el-col>
              <el-col :span="8">
                <el-input
                  v-if="collectionTermChecked"
                  v-model="form.rowformatCollectTerm"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <el-checkbox v-model="mapKeyTermChecked">MapKey分隔符号</el-checkbox>
              </el-col>
              <el-col :span="8">
                <el-input
                  v-if="mapKeyTermChecked"
                  v-model="form.rowformatMapKeyTerm"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <el-checkbox v-model="lineTermChecked">行分隔符</el-checkbox>
              </el-col>
              <el-col :span="8">
                <el-input
                  v-if="lineTermChecked"
                  v-model="form.rowformatLineTerm"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <el-checkbox v-model="nullDefinedAsChecked">空值替换字符</el-checkbox>
              </el-col>
              <el-col :span="8">
                <el-input
                  v-if="nullDefinedAsChecked"
                  v-model="form.rowformatNullDefinndAs"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item v-if="form.targetSQL === 'Hive' && form.rowformat == 'SERDE'" label="SERDE名称">
            <el-row>
              <el-col :span="8">
                <el-input
                  v-model="form.rowformatSerdeName"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item v-if="form.targetSQL === 'Hive'" label="存储文件类型:">
            <el-select
              v-model="form.storedAs"
              style="width: 35%"
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
          <el-form-item v-if="form.targetSQL === 'Hive'" label="LOCATION:">
            <el-input v-model="form.location" style="width: 35%;" />
          </el-form-item>
          <el-form-item>
            <el-button
              style="margin-left: 30%"
              type="primary"
              size="small"
              @click="onTransform"
            >开始转换</el-button>
            <el-button
              type="primary"
              size="small"
              @click="showTransformedSQL"
            >查看转换结果</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-dialog title="转换进度" :visible.sync="showProgressbar" width="50%">
        <el-progress
          style="width: 80%; margin-left: 10%"
          :percentage="transformPercentage"
        />
      </el-dialog>

      <el-dialog title="查看转换结果" :visible.sync="dialogVisible" width="60%">
        <textarea
          v-model="sqlScript"
          class="codesql"
          style="width: 100%; height: 550px"
        />
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
        datasource: '',
        schema: '',
        targetSQL: 'Hive',
        targetVersion: 'hive-1.1.0', // 取值：hive-1.1.0，hive-0.13.1，hive-0.12.0
        isTemporary: false, // true, false
        isExternal: true, // true, false
        isDropAdded: true, // true, false
        dbNameType: 'source', // source -与源库相同, udf - 根据dbNamePattern，用源库替换patter里的%s得到库名
        dbNamePattern: '%s', // 当dbNameType为udf时，根据dbNamePattern，用源库替换patter里的%s得库名
        tableNameType: 'source', // source -与源库相同, udf - 根据tableNamePattern，用源库替换patter里的%s得到表名
        tableNamePattern: '%s', // 当tableNamePattern为udf时，根据tableNamePattern，用源库替换patter里的%s得到表名
        partitionKey: 'random', // 分区字段，random: 随机选择, randomDate: 随机选择时间字段，none: 无分区
        bucketKey: 'random', // 分桶字段，primaryKey: 主键，random：随机选取，none：无分桶
        bucketNum: 3, // 分桶数量，整数
        bucketSortKey: 'date', // 分桶排序字段，date：选择某一个时间字段，random：随机选取字段，none：无排序字段
        bucketSortOrder: 'desc', // 分桶排序顺序，desc：降序，asc：升序
        rowformat: 'DELIMITED', // row format，DELIMITED：DELIMITED，SERDE：SERDE，none：无
        fieldTerm: ',', // 当rowformat为DELIMITED时，字段分隔符
        rowformatCollectTerm: ',', // 当rowformat为DELIMITED时，collection分隔符
        rowformatMapKeyTerm: ':', // 当rowformat为DELIMITED时，MapKey分隔符
        rowformatLineTerm: '\n', // 当rowformat为DELIMITED时，行分隔符
        rowformatNullDefinndAs: ' ', // 当rowformat为DELIMITED时，Null值替换值
        rowformatSerdeName: '', // 当rowformat为SERDE时，serde类名
        storedAs: 'PARQUET', // 文件存储格式，取之范围：: SEQUENCEFILE，TEXTFILE，RCFILE，ORC，PARQUET，AVRO，JSONFILE
        location: '/tmp' // 对应location，存储位置
      },
      rules: {
        isTemporary: [
          { required: true, message: '请选择是否是临时表', trigger: 'change' }
        ]
        // name: [
        //   { required: true, message: '请输入活动名称', trigger: 'blur' },
        //   { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        // ],
        // region: [
        //   { required: true, message: '请选择活动区域', trigger: 'change' }
        // ],
        // date1: [
        //   { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        // ],
        // date2: [
        //   { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        // ],
        // type: [
        //   { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        // ],
        // resource: [
        //   { required: true, message: '请选择活动资源', trigger: 'change' }
        // ],
        // desc: [
        //   { required: true, message: '请填写活动形式', trigger: 'blur' }
        // ]
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
        searchVal: ''
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
      sqlScript: '',
      mysql2hiveDataTypeMap: {
        int: 'INT',
        double: 'DOUBLE',
        varchar: 'String',
        datetime: 'DATE',
        timestamp: 'DATETIME'
      },
      dialogVisible: false
    };
  },
  created() {
    this.getProjectList();
  },
  methods: {
    async onTransform() {
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
      // if (targetSQL == 'Hive') {
      //   this.showProgressbar = true;

      //   for (let k = 0; k < len; k++) {
      //     await getTableColumns({
      //       datasourceId: this.form.datasource,
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
      // } else if (targetSQL == 'Impala') {
      // } else if (targetSQL == 'Kudu') {
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
      db2hive(this.form).then(res => {
        console.log('ddl ressssssssss', res)
      })
    },
    getProjectList() {
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
      });
    },
    onSchemaChange(value) {
      getTableListWithComment({
        id: this.form.datasource,
        schema: value
      }).then((res) => {
        console.log('res', res);
        // this.tableList = res;
        this.tablelist = res;
      });
    },
    showTransformedSQL() {
      this.dialogVisible = true;
      this.transformPercentage = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  .filter-container {
    overflow: hidden;
    // line-height: 56px;
    background-color: #ffffff;
    padding: 0px;

    // border-radius: 5px 5px 0px 0px;
    // box-shadow:0 2px 12px 0 rgba(0,0,0,.3);
    .el-card {
      .left {
        float: left;
        font-size: 24px;
        font-family: PingFangHK-Medium, PingFangHK;
        font-weight: 500;
        color: #333333;
        margin-left: 24px;
      }

      .right {
        float: right;
        margin-right: 20px;

        .el-input {
          overflow: hidden;

          .el-input__inner {
            float: left;
            width: 200px;
            height: 32px;
            line-height: 32px;
            padding-right: 15px;
          }

          .el-input-group__append {
            float: left;
            width: 60px;
            padding: 0px 15px;
            text-align: center;
            color: #fff;
            background-color: #3d5fff;
          }
        }
      }
      .el-form {
        >>> .el-select {
          width: 100% !important;
        }
      }
    }
  }

  .main {
    background-color: #fff;
    overflow: hidden;
    margin-top: 10px;
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
    /* font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono,
    DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif; */
  }
}
</style>
