<template>
  <div class="individuation">
    <el-radio-group v-model="radio1">
      <el-radio-button type="primary" label="代码入参集" />
      <el-radio-button type="primary" label="其他入参集" />
    </el-radio-group>
    <div class="top">
      <el-button type="primary" size="small"@click="showAdd">新增</el-button>
      <span class="tit_help">类型</span>
      <el-select v-model="selectValue" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input v-model="search" style="width:30%;margin: 0px 20px" prefix-icon="el-icon-search" palceholder="请输入入参名称或入参编码进行搜索" />
      <el-button class="search" type="primary" size="small">查询</el-button>
      <el-button class="reset" size="small" plain>重置</el-button>
    </div>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        align="center"
        label="序号"
      />
      <el-table-column
        prop="name"
        align="center"
        label="入参名称"
        width="180"
      />
      <el-table-column
        prop="code"
        align="center"
        label="入参编码"
        width="180"
      />
      <el-table-column
        prop="type"
        align="center"
        label="入参类型"
      />
      <el-table-column
        align="center"
        wdith="100"
        label="入参表达式"
      >
        <template v-slot:default="row">
          <a @click="view(row)">查看</a>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作栏"
      >
        <template v-slot:default="row">
          <a style="marginRight: 100px;" @click="showEdit(row)">编辑</a>
          <a @click="open(row)">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 新增对话框 -->
    <el-dialog
      title="新增入参"
      :visible.sync="AddVisible"
      width="40%"
    >
      <el-form ref="addForm" :model="addForm" :rules="rules" label-position="left" label-width="100px" class="demo-ruleForm">
        <el-form-item label="入参名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入入参名称" />
        </el-form-item>
        <el-form-item label="入参类型" prop="type">
          <el-select v-model="addForm.type" style="width:100%" placeholder="请选择">
            <el-option
              v-for="item in formOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入参编码" prop="code">
          <el-input v-model="addForm.code1" placeholder="GS" style="width:30%;marginRight: 2px" />
          <el-input v-model="addForm.code2" placeholder="示例:XBWA" style="width:30%;marginRight: 2px" />
          <el-input v-model="addForm.code3" placeholder="示例:01" style="width:30%;" /><i class="el-icon-info" />
        </el-form-item>
        <el-form-item label="入参表达式" prop="expression">
          <el-input v-model="addForm.expression" placeholder="请输入入参表达式" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑入参"
      :visible.sync="EditVisible"
      width="40%"
    >
      <el-form ref="editForm" :model="editForm" :rules="rules" label-position="left" label-width="100px" class="demo-ruleForm">
        <el-form-item label="入参名称" prop="name">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="入参类型" prop="type">
          <el-select v-model="editForm.type" style="width:100%" placeholder="请选择">
            <el-option
              v-for="item in formOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入参编码" prop="code">
          <el-input v-model="editForm.code1" disabled style="width:30%;marginRight: 2px" />
          <el-input v-model="editForm.code2" style="width:30%;marginRight: 2px" />
          <el-input v-model="editForm.code3" style="width:30%;" /><i class="el-icon-info" />
        </el-form-item>
        <el-form-item label="入参表达式" prop="expression">
          <el-input v-model="editForm.expression" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看入参表达式 -->
    <el-dialog
      title="查看入参表达式"
      :visible.sync="ViewVisible"
      width="40%"
    >
      <el-input v-model="viewExpression" :autosize="{ minRows: 4, maxRows: 6}" disabled type="textarea" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio1: '其他入参集',
      search: '',
      selectValue: '',
      tableData: [
        {
          name: 'query_01',
          code: 'CD_CD_01',
          type: '格式入参集',
          expression: '[0-9]{4}[0-9]{2}[0-9]{2}|长期|0-5年'
        },
        {
          name: 'query_02',
          code: 'CD_CD_02',
          type: '长度入参集',
          expression: '[0-9]{4}[0-9]{2}[0-9]{2}|长期|永久'
        },
        {
          name: 'query_03',
          code: 'CD_CD_03',
          type: '编码入参集',
          expression: '[0-9]{4}[0-9]{2}[0-9]{2}|长期|无处罚期限'
        }
      ],
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '格式入参集',
          value: '格式入参集'
        },
        {
          label: '长度入参集',
          value: '长度入参集'
        },
        {
          label: '特殊字符入参集',
          value: '特殊字符入参集'
        },
        {
          label: '编码入参集',
          value: '编码入参集'
        },
        {
          label: '数据范围入参集',
          value: '数据范围入参集'
        }
      ],
      formOptions: [
        {
          label: '格式入参集',
          value: '格式入参集'
        },
        {
          label: '长度入参集',
          value: '长度入参集'
        },
        {
          label: '特殊字符入参集',
          value: '特殊字符入参集'
        },
        {
          label: '编码入参集',
          value: '编码入参集'
        },
        {
          label: '数据范围入参集',
          value: '数据范围入参集'
        }
      ],
      addForm: {
        name: '',
        code1: '',
        code2: '',
        code3: '',
        type: '',
        expression: ''
      },
      editForm: {
        name: '',
        code1: '',
        code2: '',
        code3: '',
        type: '',
        expression: ''
      },
      AddVisible: false,
      EditVisible: false,
      ViewVisible: false,
      rules: {
        name: [
          { required: true, message: '请输入入参名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择入参类型', trigger: 'blur' }
        ],
        code1: [
          { required: true, message: '请输入入参编码', trigger: 'blur' }
        ],
        expression: [
          { required: true, message: '请输入入参表达式', trigger: 'blur' }
        ]
      },
      viewExpression: '',
      currentPage4: 4
    }
  },
  methods: {
    showAdd() {
      this.AddVisible = true
    },
    add() {
      this.tableData.push({
        name: this.addForm.name,
        code: this.addForm.code1 + '_' + this.addForm.code2 + '_' + this.addForm.code3,
        type: this.addForm.type,
        expression: this.addForm.expression
      })
      this.AddVisible = false
    },
    cancel() {
      this.AddVisible = false
      this.addForm = {}
    },
    showEdit(row) {
      this.editForm.name = row.row.name
      this.editForm.code1 = row.row.code.split('_')[0]
      this.editForm.code2 = row.row.code.split('_')[1]
      this.editForm.code3 = row.row.code.split('_')[2]
      this.editForm.type = row.row.type
      this.editForm.expression = row.row.expression
      this.EditVisible = true
    },
    view(row) {
      this.viewExpression = row.row.expression
      this.ViewVisible = true
      console.log(row.row)
    },
    edit() {
      console.log(this.tableData)
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].name === this.editForm.name) {
          this.tableData[i].name = this.editForm.name
          this.tableData[i].code = this.editForm.code1 + '_' + this.editForm.code2 + '_' + this.editForm.code3,
          this.tableData[i].type = this.editForm.type
          this.tableData[i].expression = this.editForm.expression
        }
      }
      console.log(this.editForm)
      console.log(this.tableData)
      this.EditVisible = false
    },
    del(row) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].name === row.row.name) {
          this.tableData.splice(i, 1)
        }
      }
      console.log(this.tableData)
    },
    open(row) {
      this.$confirm('确认删除该条数据吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          methods: this.del(row),
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
}
</script>

<style lang="scss">
  .individuation {
    padding: 30px;
    .top {
      height: 30px;
      line-height: 30px;
      margin: 20px 0px;
      .tit_help {
        margin-left: 20%;
        margin-right: 20px;
      }
      @media screen and (max-width:600px) {
        .search {
          display: none;
        }
        .reset {
          display: none;
        }
      }
    }
    .el-table {
      .el-table-column {
        a {
          color: slateblue;
        }
      }
    }
    .el-pagination {
      margin-top: 20px;
    }
    .el-dialog {
      #h_200 {
        .el-textarea__inner{
          height: 200px;
          overflow-y: auto;
          /* overflow-y: auto;兼容ie  */
        }
      }
    }
  }
</style>
