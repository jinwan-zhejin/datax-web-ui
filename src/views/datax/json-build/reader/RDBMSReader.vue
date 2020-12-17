<template>
  <div>
    <el-form
      label-position="right"
      label-width="120px"
      :model="readerForm"
      :rules="rules"
      :class="[
        $store.state.taskAdmin.readerAllowEdit ? '' : 'form-label-class'
      ]"
    >
      <el-form-item label="数据库源：" prop="datasourceId">
        <el-select
          v-show="$store.state.taskAdmin.readerAllowEdit"
          v-model="$store.state.taskAdmin.readerDataSourceID"
          filterable
          @change="rDsChange"
        >
          <el-option
            v-for="(item, index) in dataSourceCompute"
            :key="index"
            :label="item.datasourceName"
            :value="item.id"
          />
        </el-select>
        <span v-show="!$store.state.taskAdmin.readerAllowEdit">{{
          dashOrValue(
            finder(
              $store.state.taskAdmin.readerDataSourceID,
              dataSourceCompute,
              "id",
              "datasourceName"
            )
          )
        }}</span>
      </el-form-item>
      <el-form-item label="数据库表名：" prop="tableName">
        <el-select
          v-show="$store.state.taskAdmin.readerAllowEdit"
          v-model="$store.state.taskAdmin.readerTableName"
          allow-create
          default-first-option
          filterable
          @change="rTbChange"
        >
          <el-option
            v-for="(item, index) in rTbList"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
        <span v-show="!$store.state.taskAdmin.readerAllowEdit">{{
          dashOrValue($store.state.taskAdmin.readerTableName)
        }}</span>
      </el-form-item>
      <el-form-item label="SQL语句：">
        <el-input
          v-show="$store.state.taskAdmin.readerAllowEdit"
          v-model="readerForm.querySql"
          :autosize="{ minRows: 3, maxRows: 20 }"
          type="textarea"
          placeholder="sql查询，一般用于多表关联查询时才用"
          style="width: calc(100% - 85px)"
        />
        <el-button
          v-show="$store.state.taskAdmin.readerAllowEdit"
          size="small"
          style="background:rgba(61, 95, 255, 1)"
          type="primary"
          @click.prevent="getColumns('reader')"
        >解析字段</el-button>
        <span v-show="!$store.state.taskAdmin.readerAllowEdit">{{
          dashOrValue(readerForm.querySql)
        }}</span>
      </el-form-item>
      <el-form-item label="切分字段：">
        <el-input
          v-show="$store.state.taskAdmin.readerAllowEdit"
          v-model="readerForm.splitPk"
          placeholder="切分主键"
        />
        <span v-show="!$store.state.taskAdmin.readerAllowEdit">{{
          dashOrValue(readerForm.splitPk)
        }}</span>
      </el-form-item>
      <el-form-item label="表所有字段：">
        <el-checkbox
          v-model="readerForm.checkAll"
          :disabled="!$store.state.taskAdmin.readerAllowEdit"
          :indeterminate="readerForm.isIndeterminate"
          @change="rHandleCheckAllChange"
        >全选
        </el-checkbox>
        <div style="margin: 15px 0;" />
        <el-checkbox-group
          v-model="$store.state.taskAdmin.selectReaderColumn"
          :disabled="!$store.state.taskAdmin.readerAllowEdit"
          @change="rHandleCheckedChange"
        >
          <el-checkbox v-for="c in rColumnList" :key="c" :label="c">{{
            c
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="where条件：" prop="where">
        <el-input
          v-show="$store.state.taskAdmin.readerAllowEdit"
          v-model="readerForm.where"
          placeholder="where条件，不需要再加where"
          type="textarea"
        />
        <span v-show="!$store.state.taskAdmin.readerAllowEdit">{{
          dashOrValue(readerForm.where)
        }}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as dsQueryApi from '@/api/metadata-query';
import { list as jdbcDsList } from '@/api/datax-jdbcDatasource';
import Bus from '../busReader';
import { finder, dashOrValue } from '../private';

export default {
  name: 'RDBMSReader',
  data() {
    return {
      jdbcDsQuery: {
        current: 1,
        size: 200,
        ascs: 'datasource_name'
      },
      datasourceId: '',
      rDsList: [],
      rTbList: [],
      schemaList: [],
      rColumnList: [],
      rNameList: [],
      loading: false,
      active: 1,
      customFields: '',
      customType: '',
      customValue: '',
      dataSource: '',
      readerForm: {
        datasourceId: undefined,
        tableName: '',
        columns: [],
        where: '',
        querySql: '',
        checkAll: false,
        isIndeterminate: true,
        splitPk: '',
        tableSchema: ''
      },
      rules: {
        datasourceId: [
          { required: true, message: 'this is required', trigger: 'change' }
        ],
        tableName: [
          { required: true, message: 'this is required', trigger: 'change' }
        ],
        tableSchema: [
          { required: true, message: 'this is required', trigger: 'change' }
        ]
      }
    };
  },
  computed: {
    dataSourceCompute() {
      if (this.$store.state.taskAdmin.tabType === 'NORMAL') {
        return this.$store.state.taskAdmin.dataSourceList;
      } else if (this.$store.state.taskAdmin.tabType === 'IMPORT') {
        return this.$store.state.taskAdmin.dataSourceList.filter(item => {
          return item.datasource !== 'impala' && item.datasource !== 'hive';
        });
      } else {
        return this.$store.state.taskAdmin.dataSourceList.filter(item => {
          return item.datasource === 'impala' || item.datasource === 'hive';
        });
      }
    }
  },
  watch: {
    'readerForm.datasourceId': function(oldVal, newVal) {
      if (
        this.dataSource === 'postgresql' ||
        this.dataSource === 'greenplum' ||
        this.dataSource === 'oracle' ||
        this.dataSource === 'sqlserver'
      ) {
        this.getSchema();
      }
      this.getTables('rdbmsReader');
    }
  },
  mounted() {
    this.getTableColumns();
    this.getTables('rdbmsReader');
  },

  methods: {
    // 获取表名
    getTables(type) {
      if (type === 'rdbmsReader') {
        let obj = {};
        if (
          this.dataSource === 'postgresql' ||
          this.dataSource === 'greenplum' ||
          this.dataSource === 'oracle' ||
          this.dataSource === 'sqlserver'
        ) {
          obj = {
            datasourceId: this.readerForm.datasourceId,
            tableSchema: this.readerForm.tableSchema
          };
        } else {
          obj = {
            datasourceId: this.$store.state.taskAdmin.readerDataSourceID
          };
        }
        // 组装
        dsQueryApi.getTables(obj).then(response => {
          if (response) {
            this.rTbList = response;
          }
        });
      }
    },
    getSchema() {
      const obj = {
        datasourceId: this.readerForm.datasourceId
      };
      dsQueryApi.getTableSchema(obj).then(response => {
        this.schemaList = response;
      });
    },
    // schema 切换
    schemaChange(e) {
      this.readerForm.tableSchema = e;
      // 获取可用表
      this.getTables('rdbmsReader');
    },
    // reader 数据源切换
    rDsChange(e) {
      this.datasourceId = e;
      this.$store.commit('SET_READER_DATASOURCE_ID', e);
      // 清空
      this.readerForm.tableName = '';
      this.readerForm.datasourceId = e;
      this.rDsList = this.$store.state.taskAdmin.dataSourceList;
      this.rDsList.find(item => {
        if (item.id === e) {
          this.dataSource = item.datasource;
        }
      });
      Bus.dataSourceId = e;
      this.$emit('selectDataSource', this.dataSource);
    },
    getTableColumns() {
      const obj = {
        datasourceId: this.$store.state.taskAdmin.readerDataSourceID,
        tableName: this.$store.state.taskAdmin.readerTableName
      };

      dsQueryApi.getColumns(obj).then(response => {
        this.rColumnList = response;
        this.readerForm.columns = response;
        this.readerForm.checkAll = true;
        this.readerForm.isIndeterminate = false;

        this.$store.commit('SET_READER_COLUMNS', response);
      });
    },
    getColumnsByQuerySql() {
      const obj = {
        datasourceId: this.readerForm.datasourceId,
        querySql: this.readerForm.querySql
      };
      dsQueryApi.getColumnsByQuerySql(obj).then(response => {
        this.rColumnList = response;
        this.readerForm.columns = response;
        this.readerForm.checkAll = true;
        this.readerForm.isIndeterminate = false;
      });
    },
    // 获取表字段
    getColumns(type) {
      if (type === 'reader') {
        if (this.readerForm.querySql !== '') {
          this.getColumnsByQuerySql();
        } else {
          this.getTableColumns();
        }
      }
    },
    // 表切换
    rTbChange(t) {
      this.readerForm.tableName = t;
      this.rColumnList = [];
      this.readerForm.columns = [];
      this.getColumns('reader');
      this.$store.commit('SET_READER_TABLENAME', t);
    },

    rHandleCheckAllChange(val) {
      this.readerForm.columns = val ? this.rColumnList : [];
      this.readerForm.isIndeterminate = false;
      this.$store.commit('SET_SELECT_READERCOLUMN', this.readerForm.columns);
    },
    rHandleCheckedChange(value) {
      const checkedCount = value.length;
      this.readerForm.checkAll = checkedCount === this.rColumnList.length;
      this.readerForm.isIndeterminate =
        checkedCount > 0 && checkedCount < this.rColumnList.length;
      // this.$store.commit('SET_READER_COLUMNS',value)
      this.$store.commit('SET_SELECT_READERCOLUMN', value);
    },
    getData() {
      if (Bus.dataSourceId) {
        this.readerForm.datasourceId = Bus.dataSourceId;
      }
      return this.readerForm;
    },
    finder(item, sets, attr, distAttr) {
      return finder(item, sets, attr, distAttr);
    },
    dashOrValue(val) {
      return dashOrValue(val);
    }
  }
};
</script>

<style lang="scss" scoped>
.form-label-class {
  >>> .el-form-item__label {
    font-weight: 500;
    color: #999999;
    font-family: PingFangHK-Regular, PingFangHK;
  }
}
.ruleName >>> .el-tag {
  display: inline-block;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
