<template>
  <div class="individuation">
    <el-radio-group v-model="radio1">
      <!-- <el-radio-button type="primary" label="代码入参集" /> -->
      <el-radio-button type="primary" label="其他入参集" />
    </el-radio-group>
    <div class="top">
      <el-button type="primary" size="small" @click="showAdd">新增</el-button>
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
      <el-button class="search" type="primary" size="small" @click="Search">查询</el-button>
      <el-button class="reset" size="small" plain @click="reSet">重置</el-button>
    </div>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
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
        prop="joinType"
        align="center"
        label="入参类型"
      >
        <template v-slot:default="row">
          {{ showType(row.row) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        wdith="100"
        label="入参表达式"
      >
        <template v-slot:default="row">
          <el-tag size="medium" style="cursor: pointer;" effect="dark" @click="view(row)">查看</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作栏"
      >
        <template v-slot:default="row">
          <el-tag style="marginRight: 100px;cursor: pointer;" size="medium" effect="dark" @click="showEdit(row)">编辑</el-tag>
          <el-tag style="cursor: pointer;" size="medium" effect="dark" @click="open(row)">删除</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      :current-page="pageNum"
      :page-sizes="[50, 100, 150, 200]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
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
          <el-input v-model="addForm.code1" disabled style="width:30%;marginRight: 2px" />
          <el-input v-model="addForm.code2" placeholder="示例:XBWA" style="width:30%;marginRight: 2px" />
          <el-input v-model="addForm.code3" placeholder="示例:01" style="width:30%;" @input="checkRepeat" />
          <el-tooltip class="item" effect="dark" content="前半部分为4个字母内指标名称缩写(大写字母),后半部分为2个阿拉伯数字区分" placement="top">
            <i class="el-icon-info" />
          </el-tooltip>
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
          <el-input v-model="editForm.code3" style="width:30%;" @input="checkRepeat_edit" /><i class="el-icon-info" />
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
import { getList, addPerson, editPerson, delPerson, check } from '@/api/data-personalise'
export default {
  data() {
    return {
      radio1: '其他入参集',
      search: '',
      selectValue: '',
      tableData: [],
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '编码入参集',
          value: 4
        },
        {
          label: '格式入参集',
          value: 1
        },
        {
          label: '长度入参集',
          value: 2
        },
        {
          label: '特殊字符入参集',
          value: 3
        },
        {
          label: '数据范围入参集',
          value: 5
        }
      ],
      formOptions: [
        {
          label: '编码入参集',
          value: 4
        },
        {
          label: '格式入参集',
          value: 1
        },
        {
          label: '长度入参集',
          value: 2
        },
        {
          label: '特殊字符入参集',
          value: 3
        },
        {
          label: '数据范围入参集',
          value: 5
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
      pageSize: 50, //  分页条数
      pageNum: 1, //  当前页
      total: 0, //  总条数
      editId: ''
    }
  },
  // 计算属性
  computed: {
    showType() {
      return function(row) {
        if (row.joinType === 1) {
          return '格式入参集'
        } else if (row.joinType === 2) {
          return '长度入参集'
        } else if (row.joinType === 3) {
          return '特殊字符入参集'
        } else if (row.joinType === 4) {
          return '编码入参集'
        } else if (row.joinType === 5) {
          return '数据范围入参集'
        }
      }
    }
  },
  watch: {
    'addForm.type': {
      handler(newName, oldName) {
        console.log(newName, oldName)
        if (newName === 1) {
          this.addForm.code1 = 'GS'
        } else if (newName === 2) {
          this.addForm.code1 = 'CD'
        } else if (newName === 3) {
          this.addForm.code1 = 'ZF'
        } else if (newName === 5) {
          this.addForm.code1 = 'DR'
        } else if (newName === 4) {
          this.addForm.code1 = 'BM'
        } else {
          this.addForm.code1 = ''
        }
      },
      deep: true,
      immediate: true
    },
    'editForm.type': {
      handler(newName, oldName) {
        console.log(newName, oldName)
        if (newName === 1) {
          this.editForm.code1 = 'GS'
        } else if (newName === 2) {
          this.editForm.code1 = 'CD'
        } else if (newName === 3) {
          this.editForm.code1 = 'ZF'
        } else if (newName === 5) {
          this.editForm.code1 = 'DR'
        } else if (newName === 4) {
          this.editForm.code1 = 'BM'
        } else {
          this.editForm.code1 = ''
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.Search()
  },
  methods: {
    showAdd() {
      this.AddVisible = true
    },
    // 多条件查询
    Search() {
      getList(this.pageNum, this.pageSize, this.search, this.selectValue)
        .then((res) => {
          console.log(res)
          if (res.code === 200) {
            this.tableData = res.content.data
            this.total = res.content.count
          }
        }).catch((err) => {
          console.log(err)
        })
    },
    // 新增检测编码是否重复
    checkRepeat() {
      const code = this.addForm.code1 + '_' + this.addForm.code2 + '_' + this.addForm.code3
      console.log(code)
      check(code).then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    },
    // 编辑检测编码是否重复
    checkRepeat_edit() {
      const code = this.editForm.code1 + '_' + this.editForm.code2 + '_' + this.editForm.code3
      console.log(code)
      check(code).then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    },
    // 个性化规则添加
    add() {
      const obj = {
        name: this.addForm.name,
        code: this.addForm.code1 + '_' + this.addForm.code2 + '_' + this.addForm.code3,
        joinType: this.addForm.type,
        type: 2,
        regular: this.addForm.expression
      }
      addPerson(obj).then((res) => {
        console.log(res)
        if (res.code === 200) {
          this.Search()
          this.AddVisible = false
          this.addForm = {}
        }
      }).catch((err) => {
        console.log(err)
      })
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
      this.editForm.expression = row.row.regular
      this.editId = row.row.id
      this.EditVisible = true
    },
    view(row) {
      this.viewExpression = row.row.regular
      this.ViewVisible = true
      console.log(row.row)
    },
    // 编辑
    edit() {
      editPerson({
        id: this.editId,
        name: this.editForm.name,
        code: this.editForm.code1 + '_' + this.editForm.code2 + '_' + this.editForm.code3,
        regular: this.editForm.expression
      }).then((res) => {
        console.log(res)
        if (res.code === 200) {
          this.Search()
          this.EditVisible = false
          this.$message.success('编辑成功')
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 删除
    del(row) {
      delPerson(row.row.id).then((res) => {
        if (res.code === 200) {
          this.Search()
        }
      }).catch((err) => {
        console.log(err)
      })
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
    // 分页方法
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
      this.Search()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.Search()
    },
    // 重置
    reSet() {
      this.search = ''
      this.selectValue = ''
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
        .el-tag {
          cursor: pointer;
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
