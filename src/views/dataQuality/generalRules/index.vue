<template>
  <div class="general">
    <div class="top">
      <span class="titSpan">通用规则</span>
      <!-- <el-button type="goon" size="small" >关联个性化规则</el-button> -->
      <el-button type="goon" size="small" @click="showAdd"><i class="el-icon-plus" style="marginRight:8px;" />新建通用规则</el-button>
      <el-input v-model="search" clearable placeholder="数据源名称" style="width: 268px;" class="filter-item">
        <el-button slot="append" size="small" style="margin: 0px;padding: 8px 0px;backgroundColor: #3D5FFF" class="filter-item" type="goon" @click="getAllList">搜索</el-button>
      </el-input>
    </div>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{ background: '#FAFAFC' }"
    >
      <el-table-column
        type="index"
        align="center"
        label="序号"
        width="80"
      />
      <el-table-column
        prop="name"
        align="left"
        label="规则名称"
        width="220"
      />
      <el-table-column
        prop="code"
        align="left"
        label="规则编码"
        width="120"
      />
      <el-table-column
        prop="description"
        align="left"
        label="规则描述"
        width="350"
      />
      <el-table-column
        align="left"
        label="是否关联个性化规则"
        width="180"
      >
        <template v-slot:default="row">
          <a style="color: #333333;">{{ (row.row.relation === 0) }}</a>
        </template>a
      </el-table-column>
      <el-table-column
        align="left"
        prop="personaliseType"
        wdith="120"
        label="个性化规则"
      >
        <template v-slot:default="row">
          <a style="color: #333333;" @click="goIndividuation(row)">{{ showType(row.row) }}</a>
        </template>a
      </el-table-column>
      <el-table-column
        align="left"
        wdith="120"
        label="操作"
      >
        <template v-slot:default="row">
          <a style="color: #3D5FFF;" @click="showEdit(row)">编辑</a>
          <span
            style="width: 1px;
              height: 12px;
              background: #e6e6e8;
              display: inline-block;
              margin: 0px 8px;
            "
          />
          <a style="color: #FE4646;" @click="open(row)">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增对话框 -->
    <el-dialog
      title="新增通用规则"
      :visible.sync="AddVisible"
      width="40%"
    >
      <el-form ref="addForm" :model="addForm" label-position="right" label-width="150px" class="demo-ruleForm">
        <el-form-item label="规则名称:" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入入参名称" />
        </el-form-item>
        <el-form-item label="规则大类:" prop="type">
          <el-select v-model="addForm.type" style="width:100%" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="规则编码:" prop="code">
          <el-input v-model="addForm.code" @input="checkRepeat" />
        </el-form-item>
        <el-form-item label="规则描述:" prop="desc">
          <el-input v-model="addForm.desc" placeholder="请输入规则描述" type="textarea" />
        </el-form-item>
        <el-form-item label="是否关联个性化规则:">
          <el-radio-group v-model="addForm.relation">
            <el-radio label="0">关联</el-radio>
            <el-radio label="1">不关联</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="isRelate" label="正则表达式:">
          <el-input v-model="addForm.regular" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="goon" @click="add">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑通用规则"
      :visible.sync="EditVisible"
      width="40%"
    >
      <el-form ref="addForm" :model="editForm" label-position="right" label-width="100px" class="demo-ruleForm">
        <el-form-item label="规则名称:" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入入参名称" />
        </el-form-item>
        <el-form-item label="规则大类:" prop="type">
          <el-select v-model="editForm.type" style="width:100%" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="规则编码:" prop="code">
          <el-input v-model="editForm.code" @input="checkRepeat" />
        </el-form-item>
        <el-form-item label="规则描述:" prop="desc">
          <el-input v-model="editForm.desc" placeholder="请输入规则描述" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="goon" @click="edit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 关联个性化规则对话框 -->
    <el-dialog
      title="关联个性化规则"
      :visible.sync="RelateVisible"
      width="40%"
    >
      <el-form ref="form" :model="form" label-position="right" label-width="120px" class="demo-ruleForm">
        <el-form-item label="规则大类:">
          <el-select v-model="form.class" style="width:100%" placeholder="请选择" @change="searchSubclass">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="规则名称:">
          <el-select v-model="form.subclass" style="width:100%" placeholder="请选择">
            <el-option
              v-for="item in Subclass"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="个性化规则分类:">
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
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="goon" @click="relate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination
      background
      :current-page="pageNum"
      :page-sizes="[50, 100, 150, 200]"
      :page-size="pageSize"
      layout="total, prev, pager, next, sizes"
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
      isRelate: false,
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
        console.log(newObj.personaliseType)
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
    'addForm.relation': {
      handler(newName, oldName) {
        console.log(newName)
        if (newName === '1') {
          this.isRelate = true
        } else {
          this.isRelate = false
        }
        console.log(this.isRelate)
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
        type: this.addForm.type,
        relation: this.addForm.relation,
        regular: this.addForm.regular
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

<style lang="scss">
.general {
  margin: 24px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  .top {
    height: 84px;
    line-height: 84px;
    overflow: hidden;
    text-align: right;
    position: relative;
    .titSpan {
      position: absolute;
      left: 24px;
      top: 50%;
      font-size: 24px;
      font-family: PingFangHK-Medium, PingFangHK;
      font-weight: 500;
      color: #333333;
      transform: translateY(-50%);
    }
    .el-input {
      margin-right: 24px;
      .el-input-group__append {
        background-color: #3D5FFF;
        color: #fff;
      }
    }
    .el-button {
      margin-right: 24px;;
    }
    .lt {
      float: left;
    }
    .right {
      float: right;
    }
  }
  .el-pagination {
    float: right;
    padding: 20px;
  }
  .el-dialog {
      border-radius: 8px;
      .el-dialog__title {
        font-size: 24px;
        font-family: PingFangHK-Medium, PingFangHK;
        font-weight: 500;
        color: #333333;
      }
      .el-dialog__body {
        padding: 20px;
        padding-bottom: 5px;
        .el-form {
          padding-right: 30px;
        }
      }
      .el-dialog__footer{
        border-top: 1px solid #F3F3F3;
        padding: 20px;
      }
    }
}
</style>
