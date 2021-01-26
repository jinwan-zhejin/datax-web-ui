<template>
  <div class="app-container">
    <el-table
      :data="tableData"
      stripe
      :header-cell-style="{ background: '#FAFAFC',color:'rgba(51, 51, 51, 1)','font-family': 'PingFangHK-Medium, PingFangHK' }"
    >
      <el-table-column
        label="数据源库"
        min-width="180"
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
        label="清洗规则"
        min-width="180"
      >
        <template slot-scope="scope">
          <el-select
            v-model="readerForm.rules[scope.row.index]"
            placeholder="请选择"
            filterable
            clearable
            value-key="index"
            @change="cHandleSelect(scope.row.index,$event)"
          >
            <el-option v-for="tmp in ruleSettings" :key="tmp" :label="tmp" :value="tmp" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="目标字段"
        min-width="180"
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
</template>

<script>
import { computed } from '@vue/composition-api'
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
    ruleArr() {
      return this.readerForm.rules;
    },

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
    },

    ruleArr() {
      const arr = []
      this.fromColumnsListChecked.forEach((element, index) => {
        const obj = {
          sourceField: this.readerForm.lcolumns[index],
          clearRule: this.readerForm.rules[index],
          targetField: this.readerForm.rcolumns[index],
          index: index
        }
        arr.push(obj)
      })
      this.$store.commit('SET_TABLEDATA', arr)
    }

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

<style lang="scss" scoped>
.app-container {
  background: white;
}
</style>
