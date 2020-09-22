<template>
  <el-dialog
    width="500px"
    title="新建分层"
    :visible.sync="addCatalogVisible"
    :before-close="closeDialog"
    append-to-body
  >
    <el-form
      :model="addCataLogForm"
      :rules="rules"
      ref="addCataLogForm"
      size="small"
      label-width="80px"
      label-position="right"
    >
      <el-form-item label="目录名称" prop="name">
        <el-input
          v-model="addCataLogForm.name"
          maxlength="20"
          placeholder="最大长度为20个字符"
        ></el-input>
      </el-form-item>
      <!--<el-form-item label="目录编号" prop="code">
                <el-input v-model="addCataLogForm.code"></el-input>
            </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="info" size="small" @click="closeDialog">取 消</el-button>
      <el-button
        type="danger"
        size="small"
        @click="submitCatalog('addCataLogForm')"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import * as documentManageApi from "@/api/datax-document-manage"
export default {
  name: "",
  components: {},
  props: ["addCatalogVisible", "isEditCatalog"],
  data() {
    return {
      isOuter: false,
      addCataLogForm: {
        parentId: "",
        id: "",
        name: ""
      },
      rules: {
        name: [{ required: true, message: "请填写目录名称", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 提交新建分层
    submitCatalog(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //   this.$urlApi.dataStandard
          //     .addDocumentContent(this.addCataLogForm)
          //     .then(res => {
          //       this.$message({
          //         message: "操作成功",
          //         type: "success"
          //       });
          //       this.$emit("addCatalogBack");
          //       this.$refs["addCataLogForm"].resetFields();
          //     });
          documentManageApi.addDocumentContent(this.addCataLogForm).then(res => {
            this.$message({
              message: "操作成功",
              type: "success"
            })
            this.$emit("addCatalogBack") // 通知父组件关闭dialog
            this.$refs["addCataLogForm"].resetFields()
          })
        } else {
          return false;
        }
      });
    },
    // 关闭dialog
    closeDialog() {
      this.$refs["addCataLogForm"].resetFields();
      this.$emit("addCatalogBack");
    }
  },
  mounted: function() {},
  watch: {
    isEditCatalog: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        if (val.id === undefined) {
          this.addCataLogForm.parentId = -1;
          this.addCataLogForm.id = "";
        } else {
          if (val.isEdit) {
            this.addCataLogForm.parentId = val.pid;
            this.addCataLogForm.id = val.id;
            this.addCataLogForm.name = val.name;
          } else {
            this.addCataLogForm.parentId = val.id;
          }
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="scss"></style>
