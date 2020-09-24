<template>
  <el-tabs type="border-card">
    <el-tab-pane label="基本信息">
      <el-form label-position="left" label-width="80px" :model="GeneralFrom">
        <el-form-item label="表英文名">
          <el-input v-model="node.tableName" @blur="testField(node.tableName, '表英文名')"></el-input>
        </el-form-item>
        <el-form-item label="表中文名">
          <el-input v-model="node.tableNameCN"></el-input>
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
              size="small"
              v-model="scope.row.name"
              placeholder="请输入字段名"
              @change="handleEdit(scope.$index, scope.row)"
              @blur="testField(scope.row.name, '字段名')"
            ></el-input>
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>

        <el-table-column label="字段中文名" width="180">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.info"
              placeholder="请输入字段中文名"
              @change="handleEdit(scope.$index, scope.row)"
            ></el-input>
            <span>{{scope.row.info}}</span>
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
              ></el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column prop="type" label="长度">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.length"
              placeholder="请输入长度"
              @change="handleEdit(scope.$index, scope.row)"
            ></el-input>
            <span>{{scope.row.length}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="type" label="precison">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.precison"
              placeholder="请输入"
              @change="handleEdit(scope.$index, scope.row)"
            ></el-input>
            <span>{{scope.row.precison}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="isPrimarykey" label="是否主键">
          <template slot-scope="scope">
            <el-checkbox
              size="small"
              v-model="scope.row.isPrimarykey"
              @change="handleEdit(scope.$index, scope.row)"
            ></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column prop="F" label="F">
          <template slot-scope="scope">
            <el-checkbox
              size="small"
              v-model="scope.row.F"
              @change="handleEdit(scope.$index, scope.row)"
            ></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column prop="M" label="M">
          <template slot-scope="scope">
            <el-checkbox
              size="small"
              v-model="scope.row.M"
              @change="handleEdit(scope.$index, scope.row)"
            ></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
          ></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="执行" placement="top">
          <el-button @click="innerVisible = true" type="info" icon="el-icon-video-play" circle></el-button>\
        </el-tooltip>
      </div>
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 8}"
        placeholder="请输入内容"
        v-model="sqlVal"
        :disabled="true"
        ref="sqlArea"
      ></el-input>

      <el-dialog width="40%" title="执行sql" :visible.sync="innerVisible" append-to-body>
        <el-form :model="GeneralFrom">
          <el-form-item label="数据源" >
            <el-select v-model="GeneralFrom.region" placeholder="请选择数据源">
              <el-option label="数据源一" value="shanghai"></el-option>
              <el-option label="数据源二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="innerVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import fieldMapperVue from "../../datax/json-build/components/fieldMapper.vue";
import { testTableName } from "@/utils/regExp";
export default {
  name: "EditField",
  props: ["node", "tableData"],
  data() {
    return {
      GeneralFrom: {
        name: "",
        code: "",
        commord: "",
      },
      dataTypeOptions: [
        {
          value: "TINYINT",
          label: "TINYINT",
        },
        {
          value: "SMALLINT",
          label: "SMALLINT",
        },
        {
          value: "MEDIUMINT",
          label: "MEDIUMINT",
        },
        {
          value: "INT",
          label: "INT",
        },
        {
          value: "BIGINT",
          label: "BIGINT",
        },
        {
          value: "FLOAT",
          label: "FLOAT",
        },
        {
          value: "DOUBLE",
          label: "DOUBLE",
        },
        {
          value: "DECIMAL",
          label: "DECIMAL",
        },
        {
          value: "DATE",
          label: "DATE",
        },
        {
          value: "TIME",
          label: "TIME",
        },
        {
          value: "YEAR",
          label: "YEAR",
        },
        {
          value: "DATETIME",
          label: "DATETIME",
        },
        {
          value: "TIMESTAMP",
          label: "TIMESTAMP",
        },
        {
          value: "CHAR",
          label: "CHAR",
        },
        {
          value: "VARCHAR",
          label: "VARCHAR",
        },
        {
          value: "TINYBLOB",
          label: "TINYBLOB",
        },
        {
          value: "TEXT",
          label: "TEXT",
        },
        {
          value: "MEDIUMBLOB",
          label: "MEDIUMBLOB",
        },
        {
          value: "MEDIUMTEXT",
          label: "MEDIUMTEXT",
        },
        {
          value: "LONGBLOB",
          label: "LONGBLOB",
        },
        {
          value: "LONGTEXT",
          label: "LONGTEXT",
        },
      ],
      sqlVal: ``,
      innerVisible: false,
    };
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
      this.$emit("deleteFidlds", index);
    },
    createFields() {
      this.$emit("createFields");
    },

    testField(str, type) {
      const res = testTableName(str);
      console.log(res);
      if (!res) {
        this.$message.error(`${type}只能由字母、数字、_组成`);
      }
      return res;
    },

    //sql预览
    sqlPreview() {
      let fieldStr = ``;
      let primarykeyStr = "";
      for (let index = 0; index < this.tableData.length; index++) {
        const field = this.tableData[index];
        if (!field.name || !field.type || !field.info) {
          continue;
        }

        fieldStr += `\t ${field.name || ""} ${field.type || ""}${
          field.length ? "(" + field.length + ")" : ""
        } COMMENT '${field.info || ""}', \n`;

        if (field.isPrimarykey) {
          primarykeyStr += field.name + " ";
        }
      }

      this.sqlVal = `
    CREATE TABLE ${this.node.tableName} (
    ${fieldStr}\t ${primarykeyStr ? "PRIMARY KEY(" + primarykeyStr + ")" : ""}
    ) COMMENT '${this.node.tableNameCN}';
    
    `;
    },

    //复制sql
    onCopy() {
      this.$message.success("已复制到剪切板");
    },
  },
  computed: {
    tableName() {
      return this.node.tableName;
    },
    tableNameCN() {
      return this.node.tableNameCN;
    }
  },
  watch: {
    tableData: {
      handler(val) {
        const disableOK = val.every((obj) => {
          const result = obj.info && obj.type && this.testField(obj.name);
          return result;
        });
        this.$emit("canUpdateFields", !disableOK); //确定按钮
        this.sqlPreview();
      },
      // 开启深度监听
      deep: true,
    },

    // tableData(val) {},

    tableName(val) {
      this.sqlPreview();
    },

    tableNameCN(val){
      this.sqlPreview();
    }
  },
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
</style>
