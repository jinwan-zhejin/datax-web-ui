<template>
  <el-dialog
    width="500px"
    title="新建分层"
    :visible.sync="AddEditCodeListVisible"
    :before-close="closeDialog"
    append-to-body
  >
    <el-form
      :model="addEditCodeForm"
      :rules="rules"
      ref="addEditCodeForm"
      size="small"
      label-width="10z0px"
      label-position="right"
    >
      <el-form-item label="代码" prop="name">
        <el-input v-model="addEditCodeForm.name"></el-input>
      </el-form-item>
      <el-form-item label="代码名称" prop="code">
        <el-input v-model="addEditCodeForm.code"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="info" size="small" @click="closeDialog">取 消</el-button>
      <el-button
        type="danger"
        size="small"
        @click="submitCodeList('addEditCodeForm')"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import * as documentManageApi from "@/api/datax-document-manage";
export default {
  name: "",
  components: {},
  props: ["AddEditCodeListVisible", "isEditCodeList", "currNodeId"],
  data() {
    return {
      isOuter: false,
      addEditCodeForm: {
        pid: "-1",
        id: "",
        name: "",
        code: "",
        codesetId: ""
      },
      rules: {
        name: [{ required: true, message: "请填写代码", trigger: "blur" }],
        code: [{ required: true, message: "请填写代码名称", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 提交新建分层
    submitCodeList(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addEditCodeForm.codesetId = this.currNodeId;
          if (this.addEditCodeForm.id === undefined) {
            // this.$urlApi.dataStandard
            //   .codeSetAddCode(this.addEditCodeForm)
            //   .then(res => {
            //     this.$message({
            //       message: "操作成功",
            //       type: "success"
            //     });
            //     this.$emit("editCodeListBack");
            //     this.$refs["addEditCodeForm"].resetFields();
            //   });
            documentManageApi.codeSetAddCode(this.addEditCodeForm).then(res => {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.$emit("editCodeListBack");
              this.$refs["addEditCodeForm"].resetFields();
            });
          } else {
            // this.$urlApi.dataStandard
            //   .CodeSetUpDate(this.addEditCodeForm)
            //   .then(res => {
            //     this.$message({
            //       message: "操作成功",
            //       type: "success"
            //     });
            //     this.$emit("editCodeListBack");
            //     this.$refs["addEditCodeForm"].resetFields();
            //   });
            documentManageApi.CodeSetUpDate(this.addEditCodeForm).then(res => {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.$emit("editCodeListBack")
              this.$refs["addEditCodeForm"].resetFields()
            });
          }
        } else {
          return false;
        }
      });
    },
    // 关闭dialog前
    closeDialog() {
      this.$refs["addEditCodeForm"].resetFields();
      this.$emit("editCodeListBack"); // 通知父组件关闭dialog
    }
  },
  mounted: function() {},
  watch: {
    isEditCodeList: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        if (val.id === undefined) {
          this.addEditCodeForm.id = undefined;
        } else {
          this.addEditCodeForm.id = val.id;
          this.addEditCodeForm.name = val.name;
          this.addEditCodeForm.code = val.code;
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="scss"></style>
