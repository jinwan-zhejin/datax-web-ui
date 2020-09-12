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
        prop="ruleName"
        align="center"
        label="规则名称"
      />
      <el-table-column
        prop="ruleCode"
        align="center"
        label="规则编码"
        width="120"
      />
      <el-table-column
        prop="ruleDesc"
        align="center"
        label="规则描述"
      />
      <el-table-column
        align="center"
        prop="inRule"
        wdith="120"
        label="个性化规则"
      />
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
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          ruleName: '检验字段记录的统一性',
          ruleCode: 'A001',
          ruleDesc: '检验字段记录的统一性，若为空则不规范',
          class: '一致性',
          inRule: ''
        },
        {
          ruleName: '检验主要字段是否为空',
          class: '完整性',
          ruleCode: 'A002',
          ruleDesc: '检验每张表的必要属性是否为空，若为空则不规范',
          inRule: ''
        },
        {
          ruleName: '检验字段首部是否含有空格',
          ruleCode: 'A003',
          class: '准确性',
          ruleDesc: '检验字段首部是否含有空格，若为空则不规范',
          inRule: ''
        },
        {
          ruleName: '检验个人用户关联字段',
          ruleCode: 'A004',
          class: '完整性',
          ruleDesc: '检验个人用户关联字段，若为空则不规范',
          inRule: ''
        },
        {
          ruleName: '检验数据含有TAB/ENTER键',
          ruleCode: 'A005',
          class: '准确性',
          ruleDesc: '检验数据含有TAB/ENTER键，若为空则不规范',
          inRule: ''
        }
      ],
      currentPage4: 4,
      AddVisible: false,
      RelateVisible: false,
      options: [
        {
          label: '完整性',
          value: '完整性'
        },
        {
          label: '准确性',
          value: '准确性'
        },
        {
          label: '规范性',
          value: '规范性'
        },
        {
          label: '唯一性',
          value: '唯一性'
        },
        {
          label: '一致性',
          value: '一致性'
        },
        {
          label: '关联性',
          value: '关联性'
        }
      ],
      addForm: {
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
      search: ''
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
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    showAdd() {
      this.AddVisible = true
    },
    showRelate() {
      this.RelateVisible = true
    },
    cancel() {
      this.AddVisible = false
      this.RelateVisible = false
      this.form = {}
      this.addForm = {}
    },
    add() {
      this.tableData.push({
        ruleName: this.addForm.name,
        ruleCode: this.addForm.code,
        ruleDesc: this.addForm.desc,
        class: this.addForm.type,
        inRule: ''
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
