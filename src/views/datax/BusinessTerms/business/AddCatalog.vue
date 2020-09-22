<template>
  <el-dialog
    width="500px"
    :title="isEditCatalog.isEdit ? '编辑分层' : '新建分层'"
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
      <el-form-item label="目录描述" prop="explanation">
        <el-input
          v-model="addCataLogForm.explanation"
          type="textarea"
          :rows="3"
        >
        </el-input>
      </el-form-item>
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
import * as businessTermsApi from "@/api/datax-business-terms";
export default {
  name: "",
  components: {},
  props: ["addCatalogVisible", "isEditCatalog"], // 接收父组件发来的dialog可视、编辑dialog参数
  data() {
    return {
      isOuter: false,
      addCataLogForm: {
        pid: "",
        id: "",
        name: "",
        explanation: "",
        iscodeset: "1"
      },
      rules: {
        name: [{ required: true, message: "请填写目录名称", trigger: "blur" }],
        explanation: [
          { required: true, message: "请填写目录描述", trigger: "blur" },
          { min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    /**
     * @description: 提交表单
     */
    submitCatalog(formName) {
      this.$refs[formName].validate(valid => {
        // 验证表单
        if (valid) {
          // this.$urlApi.dataStandard.updateAndAddCodeSet(this.addCataLogForm).then((res)=>{
          //     this.$message({
          //         message:'操作成功',
          //         type:'success'
          //     });
          //     this.$emit('addCatalogBack');
          //     this.cleanAddCataLogForm();
          //     this.$refs['addCataLogForm'].resetFields()
          // })
          businessTermsApi
            .updateAndAddCodeSet(this.addCataLogForm)
            .then(res => {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.$emit("addCatalogBack");
              this.cleanAddCataLogForm();
              this.$refs["addCataLogForm"].resetFields();
            });
        } else {
          return false;
        }
      });
    },
    /**
     * @description: 初始化表单
     */
    cleanAddCataLogForm() {
      this.addCataLogForm.pid = "";
      this.addCataLogForm.id = "";
      this.addCataLogForm.name = "";
      this.addCataLogForm.explanation = "";
      this.addCataLogForm.iscodeset = "1";
    },
    /**
     * @description: 关闭弹框 清空表单 清空表单数据
     */
    closeDialog() {
      this.$refs["addCataLogForm"].resetFields();
      this.cleanAddCataLogForm();
      this.$emit("addCatalogBack"); // 通知父组件关闭dialog
    }
  },
  mounted: function() {},
  watch: {
    isEditCatalog: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        // hander(修改后的值, 没被修改时候的值)
        if (val.id === undefined) {
          this.addCataLogForm.pid = -1;
          this.addCataLogForm.id = "";
          this.addCataLogForm.isCodeset = "1";
        } else {
          if (val.isEdit) {
            this.addCataLogForm.pid = val.pid;
            this.addCataLogForm.id = val.id;
            this.addCataLogForm.name = val.name;
            this.addCataLogForm.explanation = val.explanation;
          } else {
            this.addCataLogForm.pid = val.id;
            this.addCataLogForm.id = "";
            this.addCataLogForm.name = "";
            this.addCataLogForm.explanation = "";
          }
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="scss"></style>
