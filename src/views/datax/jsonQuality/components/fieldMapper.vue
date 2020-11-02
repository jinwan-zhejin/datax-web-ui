<template>
  <div class="app-container">
    <div style="border: 1px solid #F3F3F3;">
      <el-table
        :data="tableData"
        stripe
        :header-cell-style="{ background: '#FAFAFC',color:'rgba(51, 51, 51, 1)','font-family': 'PingFangHK-Medium, PingFangHK' }"
        style="width: 100%"
      >
        <el-table-column
          label="源字段"
          
        >
          <template slot-scope="scope">
            <el-select
              v-model="readerForm.lcolumns[scope.row.index]"
              placeholder="请选择"
              filterable
              value-key="index"
              @change="lHandleSelect(scope.row.index,$event)"
            >
              <el-option v-for="tmp in fromColumnsList" :key="tmp" :label="tmp" :value="tmp" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="目标字段"
          
        >
          <template slot-scope="scope">
            <el-select
              v-model="readerForm.rcolumns[scope.row.index]"
              placeholder="请选择"
              filterable
              value-key="index"
              @change="rHandleSelect(scope.row.index,$event)"
            >
              <el-option v-for="tmp in toColumnsList" :key="tmp" :label="tmp" :value="tmp" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="infor"
              icon="el-icon-delete"
              circle
              size="small"
              value-key="index"
              @click="bHandleClick(scope.row.index,$event)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FieldMapper',
  data() {
    return {
      mapperJson: {},
      fromColumnsList: [],
      fromColumnsListChecked: [],
      toColumnsList: [],
      toColumnsListChecked: [],
      ruleSettings: [],
      readerForm: {
        lcolumns: [],
        rcolumns: [],
        rules: [],
        lcheckAll: false,
        rcheckAll: false,
        isIndeterminate: true
      }
    }
  },
  computed: {
    tableData() {
      return this.$store.state.taskAdmin.tableData
    }
  },
  watch: {
    fromColumnsListChecked(newval) {
      const arr = []
      newval.forEach((element, index) => {
        const obj = {
          sourceField: this.readerForm.lcolumns[index],
          clearRule: this.readerForm.rules[index],
          targetField: this.readerForm.rcolumns[index],
          index: index
        }
        arr.push(obj)
      })
      this.$store.commit('SET_TABLEDATA', arr)
      console.log(this.tableData);
    }

  },
  mounted() {
  },
  methods: {
    lHandleCheckAllChange(val) {
      this.readerForm.lcolumns = val ? this.fromColumnsList : []
      this.readerForm.isIndeterminate = false
    },
    rHandleCheckAllChange(val) {
      this.readerForm.rcolumns = val ? this.toColumnsList : []
      this.readerForm.isIndeterminate = false
    },
    lHandleCheckedChange(value) {
      const checkedCount = value.length
      this.readerForm.checkAll = checkedCount === this.fromColumnsList.length
      this.readerForm.isIndeterminate = checkedCount > 0 && checkedCount < this.fromColumnsList.length
    },
    rHandleCheckedChange(value) {
      const checkedCount = value.length
      this.readerForm.checkAll = checkedCount === this.toColumnsList.length
      this.readerForm.isIndeterminate = checkedCount > 0 && checkedCount < this.toColumnsList.length
    },
    lHandleSelect(index, v) {},
    cHandleSelect(index, v) {},
    rHandleSelect(index, v) {},
    bHandleClick(index, v) {
      this.fromColumnsListChecked.splice(index, 1)
      this.toColumnsListChecked.splice(index, 1)

      this.readerForm.lcolumns.splice(index, 1)
      this.readerForm.rcolumns.splice(index, 1)
    },
    getLColumns() {
      return this.readerForm.lcolumns
    },
    getRColumns() {
      return this.readerForm.rcolumns
    },
    getRules() {
      return this.readerForm.rules
    }
  }
}
</script>
