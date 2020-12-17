<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card style="height: 64px">
        <div class="left">DDL构建</div>
      </el-card>
      <el-card style="height: 660px; margin-top: 10px">
        <el-form
          ref="form"
          :model="form"
          label-width="200px"
          style="margin-top: 15px"
        >
          <el-form-item label="所属项目名称">
            <el-select
              v-model="form.projectId"
              style="width: 85%"
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
          <el-form-item label="待转换数据库/Schema">
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
        </el-form>
      </el-card>

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
  getTableColumns
} from '@/api/metadata-query';

export default {
  name: 'DDLTransform',
  components: {},
  data() {
    return {
      form: {
        targetSQL: 'Hive'
      },
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
      const len = this.tablelist.length;
      if (len < 1) {
        this.$notify({
          title: '警告',
          message: '未指定需要转换的表，请选择完善构建信息',
          type: 'warning',
          duration: 2000
        });
        return;
      }
      var targetSQL = this.form.targetSQL;
      if (targetSQL == 'Hive') {
        this.showProgressbar = true;

        for (let k = 0; k < len; k++) {
          await getTableColumns({
            datasourceId: this.form.datasource,
            schema: this.form.schema,
            tableName: this.tablelist[k].name
          }).then((res) => {
            console.log(res.datas);
            const arr = [];
            var script =
              'CREATE TABLE IF NOT EXISTS ' + this.tablelist[k].name + ' (\n';
            for (let j = 0; j < res.datas.length; j++) {
              var ele = res.datas[j];
              script +=
                '  ' +
                ele.COLUMN_NAME +
                ' ' +
                this.mysql2hiveDataTypeMap[ele.DATA_TYPE] +
                " comment '" +
                ele.COLUMN_COMMENT +
                "',\n";
            }
            this.sqlScript +=
              script +
              ")\nrow format delimited fields terminated by ',' \nlines terminated by '\\n';\n\n";
          });
          // this.sqlScript = this.sqlScript + this.tablelist[j].name + '\n'
          this.transformPercentage = Math.round(((k + 1) / len) * 100);
        }
        console.log(this.sqlScript);
      } else if (targetSQL == 'Impala') {
      } else if (targetSQL == 'Kudu') {
      } else {
        this.$notify({
          title: '警告',
          message: '未知目标SQL类型：' + targetSQL,
          type: 'warning',
          duration: 2000
        });
        return;
      }

      // this.$refs.transformProgress.setstate = 'success'
      // this.showProgressbar = false

      this.$notify({
        title: '转换完成',
        message: 'DDL转换完成，点击查看转换结果查看SQL',
        type: 'success',
        duration: 2000
      });
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
