<template>
  <div class="general">
    <div class="top">
      <el-button type="primary" @click="showRelate">关联个性化规则</el-button>
      <el-button type="primary" @click="showAdd">新增</el-button>
      <el-input v-model="search" style="marginLeft: 20%;width: 40%;marginRight: 20px" placeholder="请输入关键字" />
      <el-button type="primary" @click="getAllList">查询</el-button>
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
          <a style="color: skyblue;" @click="goIndividuation(row)">{{ showType(row.row) }}</a>
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
          <el-input v-model="addForm.code" @input="checkRepeat" />
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
          <el-input v-model="editForm.code" @input="checkRepeat" />
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
          <el-select v-model="form.class" style="width:100%" placeholder="请选择" @change="searchSubclass">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="规则名称">
          <el-select v-model="form.subclass" style="width:100%" placeholder="请选择">
            <el-option
              v-for="item in Subclass"
              :key="item.id"
              :label="item.name"
              :value="item.id"
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
      :page-sizes="[50, 100, 150, 200]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getList, addList, delList, editList, cascade, check } from '@/api/data-general'
export default {
  data() {
    return {
      tableData: [],
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
      Subclass: [],
      Classify: [
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
      form: {
        class: '',
        subclass: '',
        classify: ''
      },
      search: '',
      labelCD: '吱吱吱吱吱吱吱吱吱吱吱吱吱吱吱吱吱吱吱吱',
      pageSize: 50, //  分页条数
      pageNum: 1, //  当前页
      total: 0 //  总条数
    }
  },
  // 计算属性
  computed: {
    showType() {
      return function(row) {
        if (row.personaliseType === 1) {
          return '格式入参集'
        } else if (row.personaliseType === 2) {
          return '长度入参集'
        } else if (row.personaliseType === 3) {
          return '特殊字符入参集'
        } else if (row.personaliseType === 4) {
          return '编码入参集'
        } else if (row.personaliseType === 5) {
          return '数据范围入参集'
        }
      }
    }
  },
  watch: {
    'form.subclass': {
      handler(newName, oldName) {
        console.log(newName)
        console.log(this.form.subclass)
        const newObj = this.tableData.find((obj) => obj.id === newName)
        console.log(newObj)
        if (newObj.personaliseType) {
          this.form.classify = newObj.personaliseType
        }
      },
      deep: true,
      immediate: true
    },
    'form.classify': {
      handler(newName, oldName) {
        console.log(newName)
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
      getList(this.pageNum, this.pageSize, this.search).then(res => {
        if (res.code === 200) {
          console.log(res)
          this.tableData = res.content.data
          this.total = res.content.count
          console.log(this.tableData)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 检测编码是否重复
    checkRepeat(e) {
      check(e).then((res) => {
        console.log(res)
        // if (res.code === 200) {
        //   this.$message.success('编码可以使用')
        // }
      }).catch((err) => {
        console.log(err)
      })
    },
    showAdd() {
      this.addForm = {}
      this.AddVisible = true
    },
    // 根据大类查询规则名称
    searchSubclass() {
      cascade(this.form.class).then((res) => {
        console.log(res)
        if (res.code === 200) {
          this.Subclass = res.content.data
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    showEdit(row) {
      console.log(row)
      if (localStorage.getItem('editData')) {
        localStorage.removeItem('editData')
        localStorage.setItem('editData', JSON.stringify(row.row))
      } else {
        localStorage.setItem('editData', JSON.stringify(row.row))
      }
      this.editForm.name = row.row.name
      this.editForm.type = row.row.type
      this.editForm.desc = row.row.description
      this.editForm.code = row.row.code
      this.EditVisible = true
    },
    // 编辑
    edit() {
      console.log(this.editIndex)
      console.log('123')
      if (this.editForm.type === '准确性') {
        this.editForm.type = 1
      } else if (this.editForm.type === '规范性') {
        this.editForm.type = 2
      } else if (this.editForm.type === '唯一性') {
        this.editForm.type = 3
      } else if (this.editForm.type === '一致性') {
        this.editForm.type = 4
      } else if (this.editForm.type === '关联性') {
        this.editForm.type = 5
      } else if (this.editForm.type === '完整性') {
        this.editForm.type = 0
      }
      const editParams = {
        id: JSON.parse(localStorage.getItem('editData')).id,
        name: this.editForm.name,
        code: this.editForm.code,
        description: this.editForm.desc,
        type: this.editForm.type
      }
      editList(editParams).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.EditVisible = false
          this.getAllList()
        }
      }).catch(err => {
        console.log(err)
      })
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
    // 添加列表
    add() {
      if (this.addForm.type === '准确性') {
        this.addForm.type = 1
      } else if (this.addForm.type === '规范性') {
        this.addForm.type = 2
      } else if (this.addForm.type === '唯一性') {
        this.addForm.type = 3
      } else if (this.addForm.type === '一致性') {
        this.addForm.type = 4
      } else if (this.addForm.type === '关联性') {
        this.addForm.type = 5
      } else if (this.addForm.type === '完整性') {
        this.addForm.type = 0
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
    // 关联个性化规则
    relate() {
      editList({
        id: this.form.subclass,
        personaliseType: this.form.classify
      }).then((res) => {
        if (res.code === 200) {
          this.RelateVisible = false
          this.getAllList()
          this.form = {}
        }
      }).catch((err) => {
        console.log(err)
      })
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

<style lang="scss" scoped>
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
