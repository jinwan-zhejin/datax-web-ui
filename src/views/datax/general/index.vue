<template>
  <div class="general">
    <div class="top">
      <el-button type="primary" @click="showRelate">关联个性化规则</el-button>
      <el-button type="primary" @click="showAdd">新增</el-button>
      <el-input v-model="search" style="marginLeft: 20%;width: 40%;marginRight: 20px" placeholder="请输入关键字" />
      <el-button type="primary">查询</el-button>
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
        width="50"
      />
      <el-table-column
        prop="name"
        align="center"
        label="规则名称"
      />
      <el-table-column
        prop="code"
        align="center"
        label="规则编码"
        width="120"
      />
      <el-table-column
        prop="description"
        align="center"
        label="规则描述"
      />
      <el-table-column
        align="center"
        prop="personaliseType"
        wdith="120"
        label="个性化规则"
      >
        <template v-slot:default="row">
          <a style="color: skyblue;" @click="goIndividuation(row)">{{ row.row.inRule }}</a>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        wdith="120"
        label="操作"
      >
        <template v-slot:default="row">
          <el-button type="primary" @click="showEdit(row)">编辑</el-button>
          <el-button type="primary" @click="open(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增对话框 -->
    <el-dialog
      title="新增通用规则"
      :visible.sync="AddVisible"
      width="40%"
    >
      <el-form ref="addForm" :model="addForm" label-position="left" label-width="100px" class="demo-ruleForm">
        <el-form-item label="规则名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入入参名称" />
        </el-form-item>
        <el-form-item label="规则大类" prop="type">
          <el-select v-model="addForm.type" style="width:100%" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="规则编码" prop="code">
          <el-input v-model="addForm.code" />
        </el-form-item>
        <el-form-item label="规则描述" prop="desc">
          <el-input v-model="addForm.desc" placeholder="请输入规则描述" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑通用规则"
      :visible.sync="EditVisible"
      width="40%"
    >
      <el-form ref="addForm" :model="editForm" label-position="left" label-width="100px" class="demo-ruleForm">
        <el-form-item label="规则名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入入参名称" />
        </el-form-item>
        <el-form-item label="规则大类" prop="type">
          <el-select v-model="editForm.type" style="width:100%" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="规则编码" prop="code">
          <el-input v-model="editForm.code" />
        </el-form-item>
        <el-form-item label="规则描述" prop="desc">
          <el-input v-model="editForm.desc" placeholder="请输入规则描述" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 关联个性化规则对话框 -->
    <el-dialog
      title="关联个性化规则"
      :visible.sync="RelateVisible"
      width="40%"
    >
      <el-form ref="form" :model="form" label-position="left" label-width="120px" class="demo-ruleForm">
        <el-form-item label="规则大类">
          <el-select v-model="form.class" style="width:100%" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="规则小类">
          <el-select v-model="form.subclass" style="width:100%" placeholder="请选择">
            <el-option
              v-for="item in Subclass"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="个性化规则分类">
          <el-select v-model="form.classify" style="width:100%" placeholder="请选择">
            <el-option
              v-for="item in Classify"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="relate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination
      background
      :current-page="pageNum"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { login } from '@/api/user'
import { getList, addList, delList } from '@/api/data-general'
export default {
  data() {
    return {
      tableData: [],
      currentPage4: 4,
      AddVisible: false,
      RelateVisible: false,
      EditVisible: false,
      obj: {},
      options: [
        {
          label: '完整性',
          value: '0'
        },
        {
          label: '准确性',
          value: '1'
        },
        {
          label: '规范性',
          value: '2'
        },
        {
          label: '唯一性',
          value: '3'
        },
        {
          label: '一致性',
          value: '4'
        },
        {
          label: '关联性',
          value: '5'
        }
      ],
      addForm: {
        name: '',
        code: '',
        type: '',
        desc: ''
      },
      editForm: {
        name: '',
        code: '',
        type: '',
        desc: ''
      },
      Subclass: [
        {
          label: '检验主要字段是否为空',
          value: '检验主要字段是否为空'
        },
        {
          label: '检验个人用户关联字段',
          value: '检验个人用户关联字段'
        },
        {
          label: '检验企业用户关联字段',
          value: '检验企业用户关联字段'
        }
      ],
      Classify: [
        {
          label: '编码入参集',
          value: '编码入参集'
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
          label: '数据范围入参集',
          value: '数据范围入参集'
        }
      ],
      form: {
        class: '',
        subclass: '',
        classify: ''
      },
      search: '',
      labelCD: '吱吱吱吱吱吱吱吱吱吱吱吱吱吱吱吱吱吱吱吱',
      editIndex: '',
      pageSize: 50, //  分页条数
      pageNum: 1, //  当前页
      total: 0 //  总条数
    }
  },
  watch: {
    'form.class': {
      handler(newName, oldName) {
        console.log(newName, oldName)
        if (newName === '准确性') {
          this.Subclass = []
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].class === newName) {
              this.Subclass.push({
                label: this.tableData[i].ruleName,
                value: this.tableData[i].ruleName
              })
            }
          }
        } else if (newName === '规范性') {
          this.Subclass = []
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].class === newName) {
              this.Subclass.push({
                label: this.tableData[i].ruleName,
                value: this.tableData[i].ruleName
              })
            }
          }
        } else if (newName === '唯一性') {
          this.Subclass = []
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].class === newName) {
              this.Subclass.push({
                label: this.tableData[i].ruleName,
                value: this.tableData[i].ruleName
              })
            }
          }
        } else if (newName === '一致性') {
          this.Subclass = []
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].class === newName) {
              this.Subclass.push({
                label: this.tableData[i].ruleName,
                value: this.tableData[i].ruleName
              })
            }
          }
        } else if (newName === '关联性') {
          this.Subclass = []
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].class === newName) {
              this.Subclass.push({
                label: this.tableData[i].ruleName,
                value: this.tableData[i].ruleName
              })
            }
          }
        } else {
          this.Subclass = []
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].class === newName) {
              this.Subclass.push({
                label: this.tableData[i].ruleName,
                value: this.tableData[i].ruleName
              })
            }
          }
        }
      },
      deep: true,
      immediate: true
    },
    'editForm.type': {
      handler(newName, oldName) {
        console.log(newName, oldName)
        if (newName === 1) {
          this.editForm.type = '准确性'
        } else if (newName === 2) {
          this.editForm.type = '规范性'
        } else if (newName === 3) {
          this.editForm.type = '唯一性'
        } else if (newName === 4) {
          this.editForm.type = '一致性'
        } else if (newName === 5) {
          this.editForm.type = '关联性'
        } else if (newName === 0) {
          this.editForm.type = '完整性'
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getAllList()
  },
  methods: {
    // 获取全部列表
    getAllList() {
      getList().then(res => {
        if (res.code === 200) {
          console.log(res)
          this.tableData = res.content.data
          console.log(this.tableData)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    showAdd() {
      this.AddVisible = true
    },
    showEdit(row) {
      console.log(row)
      this.editForm.name = row.row.name
      this.editForm.type = row.row.type
      this.editForm.desc = row.row.description
      this.editForm.code = row.row.code
      this.EditVisible = true
    },
    edit() {
      console.log(this.editIndex)
      console.log('123')
      this.tableData[this.editIndex].ruleName = this.editForm.name
      this.tableData[this.editIndex].class = this.editForm.type
      this.tableData[this.editIndex].ruleDesc = this.editForm.desc
      this.tableData[this.editIndex].ruleCode = this.editForm.code
      this.EditVisible = false
      this.editIndex = ''
    },
    showRelate() {
      this.RelateVisible = true
    },
    cancel() {
      this.AddVisible = false
      this.RelateVisible = false
      this.EditVisible = false
      this.form = {}
      this.addForm = {}
    },
    add() {
      if (this.addForm.type === '准确性') {
        this.editForm.type = 1
      } else if (this.addForm.type === '规范性') {
        this.editForm.type = 2
      } else if (this.addForm.type === '唯一性') {
        this.editForm.type = 3
      } else if (this.addForm.type === '一致性') {
        this.editForm.type = 4
      } else if (this.addForm.type === '关联性') {
        this.editForm.type = 5
      } else if (this.addForm.type === '完整性') {
        this.editForm.type = 0
      }
      this.obj = {
        name: this.addForm.name,
        code: this.addForm.code,
        description: this.addForm.desc,
        type: this.addForm.type
      }
      console.log(JSON.stringify(this.obj))
      addList(JSON.stringify(this.obj)).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.EditVisible = false
          this.getAllList()
        }
      }).catch(err => {
        console.log(err)
      })
      this.AddVisible = false
    },
    relate() {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].ruleName === this.form.subclass) {
          this.tableData[i].inRule = this.form.classify
        }
      }
      this.RelateVisible = false
      this.form = {}
    },
    goIndividuation(row) {
      this.$router.push('/datax/quality/individuation')
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
    // 删除
    del(row) {
      console.log(row.row)
      delList(row.row.id).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.getAllList()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    styleMethod({ column, rowIndex, columnIndex }) {
      console.log(123)
      console.log(column)
      console.log(rowIndex)
      console.log(columnIndex)
    },
    // 分页方法
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
      this.getAllList()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getAllList()
    }
  }
}
</script>

<style lang="scss">
.general {
  padding: 30px;
  .top {
    height: 30px;
    line-height: 30px;
    margin-bottom: 20px;
  }
  .el-pagination {
    margin-top: 20px;
  }
}
</style>
