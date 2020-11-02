<template>
  <el-tabs type="border-card">
    <el-tab-pane label="基本信息">
      <el-form label-position="left" label-width="80px" :model="GeneralFrom">
        <el-form-item label="表英文名">
          <el-input
            v-model="node.tableName"
            @blur="testField(node.tableName, '表英文名')"
          />
        </el-form-item>
        <el-form-item label="表中文名">
          <el-input v-model="node.tableNameCN" />
        </el-form-item>
        <!-- <el-form-item label="Commord">
          <el-input v-model="GeneralFrom.commord"></el-input>
        </el-form-item>-->
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="列">
      <el-button type="info" @click="createFields()">新增字段</el-button>
      <el-table
        :data="tableData"
        class="tb-edit"
        style="width: 100%"
        highlight-current-row
        @row-click="handleCurrentChange"
      >
        <el-table-column label="字段名" width="180">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.name"
              size="small"
              placeholder="请输入字段名"
              @change="handleEdit(scope.$index, scope.row)"
              @blur="testField(scope.row.name, '字段名')"
            />
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="字段中文名" width="180">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.info"
              size="small"
              placeholder="请输入字段中文名"
              @change="handleEdit(scope.$index, scope.row)"
            />
            <span>{{ scope.row.info }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="type" label="数据类型" width="180">
          <template slot-scope="scope">
            <el-select v-model="scope.row.type" placeholder="请选择数据类型">
              <el-option
                v-for="item in dataTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column prop="type" label="长度">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.length"
              size="small"
              placeholder="请输入长度"
              @change="handleEdit(scope.$index, scope.row)"
            />
            <span>{{ scope.row.length }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="type" label="precison">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.precison"
              size="small"
              placeholder="请输入"
              @change="handleEdit(scope.$index, scope.row)"
            />
            <span>{{ scope.row.precison }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="isPrimarykey" label="是否主键">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.isPrimarykey"
              size="small"
              @change="handleEdit(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="F" label="F">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.F"
              size="small"
              @change="handleEdit(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="M" label="M">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.M"
              size="small"
              @change="handleEdit(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>

    <el-tab-pane label="sql预览">
      <div class="sql-content">
        <el-tooltip class="item" effect="dark" content="复制" placement="top">
          <el-button
            v-clipboard:copy="sqlVal"
            v-clipboard:success="onCopy"
            type="info"
            icon="el-icon-document-copy"
            circle
          />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="执行" placement="top">
          <el-button
            type="info"
            icon="el-icon-video-play"
            circle
            @click="innerVisible = true"
          />\
        </el-tooltip>
      </div>
      <el-input
        ref="sqlArea"
        v-model="sqlVal"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 8 }"
        placeholder="请输入内容"
        :disabled="true"
      />

      <el-dialog
        width="40%"
        title="执行sql"
        :visible.sync="innerVisible"
        append-to-body
      >
        <el-form :model="GeneralFrom">
          <el-form-item label="数据源">
            <el-select v-model="GeneralFrom.region" placeholder="请选择数据源">
              <el-option label="数据源一" value="shanghai" />
              <el-option label="数据源二" value="beijing" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="innerVisible = false"
          >确 定</el-button>
        </div>
      </el-dialog>
    </el-tab-pane>

    <el-tab-pane v-if="$store.state.dataModel.pNodeData.length" label="计算逻辑">
      <el-collapse>
        <el-collapse-item>
          <template slot="title">
            <span class="title">数据源</span>
          </template>
          <div
            v-for="(item, index) in dataSourceList"
            :key="index"
            class="data-source"
          >
            <el-popover placement="bottom" width="200" trigger="click">
              <ul>
                <li>
                  <el-link type="primary">修改数据源</el-link>
                </li>
                <li>
                  <el-link type="primary">在SQL Lab里查看</el-link>
                </li>
                <li>
                  <el-link type="primary">编辑数据源</el-link>
                </li>
              </ul>
              <el-button slot="reference">{{ item.tableName }}</el-button>
            </el-popover>
            <el-tooltip
              class="item"
              effect="dark"
              content="打开/折叠数据源配置"
              placement="top"
            >
              <el-button
                type="info"
                icon="el-icon-circle-plus-outline"
                circle
                size="mini"
                @click="showTableDetail(index)"
              />
            </el-tooltip>
            <div v-show="currentIndex === index" class="tableSource">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>{{ item.tableName }}</span>
                </div>
                <el-table :data="item.fields" style="width: 100%">
                  <el-table-column prop="name" label="列" width="180" />
                  <el-table-column prop="type" label="类型" width="180" />
                </el-table>
              </el-card>
            </div>
          </div>
          <h4>设置关联关系</h4>
          <Association />
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            <span class="title">时间</span>
          </template>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="时间字段">
              <el-select v-model="$store.state.dataModel.timeField" placeholder="请选择时间字段">
                <el-option
                  v-for="(item, index) in $store.getters.allNodeFields"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="时间粒度">
              <el-select v-model="$store.state.dataModel.timeGranularity" placeholder="请选择粒度">
                <el-option label="second" value="second" />
                <el-option label="minute" value="minute" />
                <el-option label="hour" value="hour" />
                <el-option label="day" value="day" />
                <el-option label="week" value="week" />
                <el-option label="month" value="month" />
                <el-option label="year" value="year" />
                <el-option
                  label="week_ending_saturday"
                  value="week_ending_saturday"
                />
                <el-option
                  label="week_start_sunday"
                  value="week_start_sunday"
                />
              </el-select>
            </el-form-item>
            <br>
            <el-form-item label="时间范围">
              <TimeRange />
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            <span class="title">查询</span>
          </template>
          <p>指标</p>
          <MySelect />
          <p>过滤</p>
          <MyFilter />
          <p>分组</p>
          <el-select v-model="$store.state.dataModel.group" multiple placeholder="请选择">
            <el-option
              v-for="(item, index) in $store.getters.allNodeFields"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
          <div class="array-bottom">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="排序">
                <el-select v-model="$store.state.dataModel.sortField" placeholder="排序">
                  <el-option
                    v-for="(item, index) in $store.getters.allNodeFields"
                    :key="index"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-checkbox v-model="$store.state.dataModel.desc">降序</el-checkbox>
              </el-form-item>

              <el-form-item label="行限制">
                <el-select v-model="$store.state.dataModel.limit" placeholder="9选项">
                  <el-option label="10" value="10" />
                  <el-option label="50" value="50" />
                  <el-option label="100" value="100" />
                  <el-option label="250" value="250" />
                  <el-option label="500" value="500" />
                  <el-option label="1000" value="1000" />
                  <el-option label="5000" value="5000" />
                  <el-option label="10000" value="10000" />
                  <el-option label="50000" value="50000" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-collapse-item>
        <div class="active_sql_btn">
          <el-button @click="activeSelect">查看sql</el-button>
          <el-button
            v-clipboard:copy="associaTionSql"
            v-clipboard:success="onCopy"
          >复制sql</el-button>
        </div>
        <el-input
          v-show="associaTionSql"
          v-model="associaTionSql"
          type="textarea"
          disabled
          autosize
          placeholder="请输入内容"
        />
      </el-collapse>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
// import fieldMapperVue from "../../datax/json-build/components/fieldMapper.vue";
import { testTableName } from '@/utils/regExp';
import TimeRange from './timeRange';
import MySelect from './mySelect/mySelect';
import MyFilter from './mySelect/myFilter';
import Association from './association';
export default {
  name: 'EditField',
  components: {
    TimeRange,
    MySelect,
    Association,
    MyFilter
  },
  props: ['node', 'tableData'],
  data() {
    return {
      GeneralFrom: {
        name: '',
        code: '',
        commord: ''
      },
      dataTypeOptions: [
        {
          value: 'TINYINT',
          label: 'TINYINT'
        },
        {
          value: 'SMALLINT',
          label: 'SMALLINT'
        },
        {
          value: 'MEDIUMINT',
          label: 'MEDIUMINT'
        },
        {
          value: 'INT',
          label: 'INT'
        },
        {
          value: 'BIGINT',
          label: 'BIGINT'
        },
        {
          value: 'FLOAT',
          label: 'FLOAT'
        },
        {
          value: 'DOUBLE',
          label: 'DOUBLE'
        },
        {
          value: 'DECIMAL',
          label: 'DECIMAL'
        },
        {
          value: 'DATE',
          label: 'DATE'
        },
        {
          value: 'TIME',
          label: 'TIME'
        },
        {
          value: 'YEAR',
          label: 'YEAR'
        },
        {
          value: 'DATETIME',
          label: 'DATETIME'
        },
        {
          value: 'TIMESTAMP',
          label: 'TIMESTAMP'
        },
        {
          value: 'CHAR',
          label: 'CHAR'
        },
        {
          value: 'VARCHAR',
          label: 'VARCHAR'
        },
        {
          value: 'TINYBLOB',
          label: 'TINYBLOB'
        },
        {
          value: 'TEXT',
          label: 'TEXT'
        },
        {
          value: 'MEDIUMBLOB',
          label: 'MEDIUMBLOB'
        },
        {
          value: 'MEDIUMTEXT',
          label: 'MEDIUMTEXT'
        },
        {
          value: 'LONGBLOB',
          label: 'LONGBLOB'
        },
        {
          value: 'LONGTEXT',
          label: 'LONGTEXT'
        }
      ],
      sqlVal: ``,
      innerVisible: false,
      user: '',
      currentIndex: -1,
      associaTionSql: ''
    };
  },
  computed: {
    tableName() {
      return this.node.tableName;
    },

    tableNameCN() {
      return this.node.tableNameCN;
    },

    dataSourceList() {
      return this.$store.state.dataModel.pNodeData;
    }
  },
  watch: {
    tableData: {
      handler(val) {
        const disableOK = val.every((obj) => {
          const result = obj.info && obj.type && this.testField(obj.name);
          return result;
        });
        this.$emit('canUpdateFields', !disableOK); // 确定按钮
        this.sqlPreview();
      },
      // 开启深度监听
      deep: true
    },

    // tableData(val) {},

    tableName(val) {
      this.sqlPreview();
    },

    tableNameCN(val) {
      this.sqlPreview();
    }
  },
  created() {
    this.sqlPreview();
  },
  methods: {
    handleCurrentChange(row, event, column) {
      // console.log("改变", row, event, column);
    },
    handleEdit(index, row) {
      // console.log("修改", index, row);
    },
    handleDelete(index, row) {
      this.$emit('deleteFidlds', index);
    },
    createFields() {
      this.$emit('createFields');
    },

    testField(str, type) {
      const res = testTableName(str);
      console.log(res);
      if (!res) {
        this.$message.error(`${type}只能由字母、数字、_组成`);
      }
      return res;
    },

    // sql预览
    sqlPreview() {
      let fieldStr = ``;
      let primarykeyStr = '';
      for (let index = 0; index < this.tableData.length; index++) {
        const field = this.tableData[index];
        if (!field.name || !field.type || !field.info) {
          continue;
        }

        fieldStr += `\t ${field.name || ''} ${field.type || ''}${
          field.length ? '(' + field.length + ')' : ''
        } COMMENT '${field.info || ''}'${
          index === this.tableData.length - 1 ? '' : ',\n'
        } `;

        if (field.isPrimarykey) {
          primarykeyStr += field.name + ' ';
        }
      }

      this.sqlVal = `
    CREATE TABLE ${this.node.tableName} (
    ${fieldStr} ${
  primarykeyStr ? '\n\t PRIMARY KEY(' + primarykeyStr + ')' : ''
}
    ) COMMENT '${this.node.tableNameCN}';
    
    `;
    },

    // 复制sql
    onCopy() {
      this.$message.success('已复制到剪切板');
    },

    // 打开折叠数据源配置
    showTableDetail(index) {
      if (this.currentIndex === index) {
        this.currentIndex = -1;
        return;
      }
      this.currentIndex = index;
    },

    //
    activeSelect() {
      this.associaTionSql = this.$store.getters.associaTionSql;
    }
  }
};
</script>
<style  scoped>
.tb-edit .el-input {
  display: none;
}

.tb-edit .current-row .el-input {
  display: block;
}

.tb-edit .current-row .el-input + span {
  display: none;
}
.sql-content {
  margin-bottom: 10px;
}

.data-source {
  margin-bottom: 20px;
}
.tableSource {
  margin-top: 20px;
}

.array-bottom {
  margin-top: 20px;
}
.title {
  font-size: 16px;
  font-weight: bolder;
}
.active_sql_btn {
  margin: 20px 0;
}
</style>
