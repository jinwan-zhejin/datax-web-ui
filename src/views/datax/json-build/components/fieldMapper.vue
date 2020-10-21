<template>
  <div class="app-container">
    <!-- <el-form label-position="left" label-width="80px" :model="readerForm">
      <el-row style="background: #F8F8FA;padding:15px 0;" :gutter="5">
        <el-col :span="6" style="text-align:left;">
          <a class="table_title">源端字段</a>
        </el-col>
        <el-col :span="6" style="text-align:left;">
          <a class="table_title table_title_pl">清洗规则</a>
        </el-col>
        <el-col :span="6" style="text-align:left;">
          <a class="table_title table_title_pl">目标字段</a>
        </el-col>
        <el-col :span="6" style="text-align:center;">
          <a class="table_title table_title_pl">操作</a>
        </el-col>
      </el-row>
      <div style="margin: 15px 0;" />
      <el-row :gutter="5">
        <el-col :span="6" style="text-align:center;">
          <div
            v-for="(item,index) in fromColumnsListChecked"
            :key="index"
            class="itemContainer"
            style="margin:0 0 10px 0;"
          >
            <el-select
              v-model="readerForm.lcolumns[index]"
              placeholder="请选择"
              filterable
              value-key="index"
              @change="lHandleSelect(index,$event)"
            >
              <el-option v-for="tmp in fromColumnsList" :key="tmp" :label="tmp" :value="tmp" />
            </el-select>
          </div>
        </el-col>
        <el-col :span="6" style="text-align:center;">
          <div
            v-for="(item,index) in fromColumnsListChecked"
            :key="index"
            class="itemContainer"
            style="margin:0 0 10px 0;"
          >
            <el-select
              v-model="readerForm.rules[index]"
              placeholder="请选择"
              filterable
              clearable
              value-key="index"
              @change="cHandleSelect(index,$event)"
            >
              <el-option v-for="tmp in ruleSettings" :key="tmp" :label="tmp" :value="tmp" />
            </el-select>
          </div>
        </el-col>
        <el-col :span="6" style="text-align:center;">
          <div
            v-for="(item,index) in fromColumnsListChecked"
            :key="index"
            class="itemContainer"
            style="margin:0 0 10px 0;"
          >
            <el-select
              v-model="readerForm.rcolumns[index]"
              placeholder="请选择"
              filterable
              value-key="index"
              @change="rHandleSelect(index,$event)"
            >
              <el-option v-for="tmp in toColumnsList" :key="tmp" :label="tmp" :value="tmp" />
            </el-select>
          </div>
        </el-col>
        <el-col :span="6" style="text-align:center;">
          <div
            v-for="(item,index) in fromColumnsListChecked"
            :key="index"
            class="itemContainer"
            style="margin:0 0 10px 0;"
          >
            <el-button
              type="infor"
              icon="el-icon-delete"
              circle
              size="small"
              value-key="index"
              @click="bHandleClick(index,$event)"
            />
          </div>
        </el-col>
      </el-row>
    </el-form> -->

    <div style="border: 1px solid #F3F3F3;">
      <el-table
      :data="tableData"
      stripe
      :header-cell-style="{ background: '#FAFAFC',color:'rgba(51, 51, 51, 1)','font-family': 'PingFangHK-Medium, PingFangHK' }"
      style="width: 100%">
        <el-table-column
          label="数据源库"
          width="180">
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
          width="180">
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
          label="目标字段">
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
          label="操作">
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
      console.log(index);
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
  },
  computed: {
    ruleArr(){
      return this.readerForm.rules;
    },
    
    tableData(){
      return this.$store.state.taskAdmin.tableData 
    }
  },
  watch: {
    fromColumnsListChecked(newval){
      let arr = []
      newval.forEach((element,index) => {
        let obj = {
          sourceField: this.readerForm.lcolumns[index],
          clearRule: this.readerForm.rules[index],
          targetField: this.readerForm.rcolumns[index],
          index:index
        }
        arr.push(obj)
      })
      this.$store.commit('SET_TABLEDATA', arr)
      console.log(this.tableData);
    },
    
    ruleArr(){
      let arr = []
      this.fromColumnsListChecked.forEach((element,index) => {
        let obj = {
          sourceField: this.readerForm.lcolumns[index],
          clearRule: this.readerForm.rules[index],
          targetField: this.readerForm.rcolumns[index],
          index:index
        }
        arr.push(obj)
      })
      this.$store.commit('SET_TABLEDATA', arr)
    }

  }
}
</script>

<style scoped>
.table_title{
  padding-left: 20px;
  color: rgba(51, 51, 51, 1);
  font-size: 14px;
  font-family: PingFangHK-Medium, PingFangHK;
  
}
.table_title_pl {
  border-left: 1px solid #e5e5e5;
}
</style>
