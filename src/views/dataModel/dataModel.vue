<template>
  <div class="content">
    <div class="left">
      <LeftBar @createtab="createModel = true" />
    </div>
    <div class="right">
      <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
        <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="index"
          :label="item.title"
          :name="index + ''"
        >
          <el-button type="info">保存</el-button>
          <Modeling />
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog width='50%' title="新建模型" :visible.sync="createModel">
      <el-form :model="form">
        <el-form-item label="模型名称" label-width="120px">
          <el-input width='120px' placeholder="请输入模型名称" v-model="form.modelName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="DBMS" label-width="120px">
          <el-select v-model="form.DBMS" placeholder="请选择DBMS">
            <el-option label="MySql" value="MySql"></el-option>
            <el-option label="Oracle" value="Oracle"></el-option>
            <el-option label="Postgresql" value="Postgresql"></el-option>
            <el-option label="Greenplum" value="Greenplum"></el-option>
            <el-option label="sqlServer" value="sqlServer"></el-option>
            <el-option label="hive" value="hive"></el-option>
            <el-option label="hbase" value="hbase"></el-option>
            <el-option label="mongodb" value="mongodb"></el-option>
            <el-option label="clickhouse" value="clickhouse"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createModel = false">取 消</el-button>
        <el-button type="primary" @click="createTab()" :disabled='!(form.modelName && form.DBMS)'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import LeftBar from "./components/leftBar";
import Modeling from "./components/modeling";
export default {
  data() {
    return {
      createModel: false,
      form: {
        modelName: "",
        DBMS: "",
      },
      editableTabsValue: "0",
      editableTabs: [
        {
          title: "table name",
        },
      ],
    };
  },
  components: {
    LeftBar,
    Modeling,
  },
  methods: {
    createTab() {
      //新建模型
      this.editableTabs.push({
        title: this.form.modelName,
      });
      this.editableTabsValue = this.editableTabs.length - 1 + "";
      this.createModel = false;
      this.form = {
        modelName: "",
        DBMS: "",
      };
    },

    removeTab(target) {
      this.editableTabs.splice(+target, 1);
      this.editableTabsValue =
        +target === this.editableTabs.length ? target - 1 + "" : target;
    },
  },
};
</script>

<style scoped>
.content {
  display: flex;
  background-color: rgb(247, 249, 251);
}
.left {
  width: 300px;
  padding: 10px;
}
.right {
  width: calc(100% - 300px);
  min-height: 660px;
  border-left: 1px solid grey;
}
</style>