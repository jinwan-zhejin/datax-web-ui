<template>
  <el-dialog
    width="500px"
    title="新建代码集"
    :visible.sync="addCodeSetVisible"
    :before-close="closeDialog"
    append-to-body
  >
    <el-form
      :model="addCodeSet"
      :rules="rules"
      ref="addCodeSet"
      size="small"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="代码集名称" prop="name">
        <el-input
          v-model="addCodeSet.name"
          maxlength="20"
          placeholder="最大长度为20个字符"
        ></el-input>
      </el-form-item>
      <el-form-item label="代码集编号" prop="code">
        <el-input
          v-model="addCodeSet.code"
          maxlength="20"
          placeholder="最大长度为20个字符"
        ></el-input>
      </el-form-item>
      <!--<el-form-item label="表示">
                <el-input v-model="addCodeSet.express"></el-input>
            </el-form-item>
            <el-form-item label="说明">
                <el-input v-model="addCodeSet.explanation"></el-input>
            </el-form-item>-->
      <el-form-item label="编码规则" prop="coderule">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="addCodeSet.coderule"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="info" size="small" @click="closeDialog">取 消</el-button>
      <el-button type="danger" size="small" @click="submitCodeSet('addCodeSet')"
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
  props: ["addCodeSetVisible", "isEditCodeSet"],
  data() {
    return {
      addCodeSet: {
        pid: "",
        id: "",
        name: "",
        code: "",
        iscodeset: "0",
        explanation: "",
        express: "",
        coderule: ""
      },
      rules: {
        name: [
          { required: true, message: "请填写代码集名称", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请填写代码集编号", trigger: "blur" }
        ],
        coderule: [
          { min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitCodeSet(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.$urlApi.dataStandard.updateAndAddCodeSet(this.addCodeSet).then((res)=>{
          //     this.$message({
          //         message:'操作成功',
          //         type:'success'
          //     });
          //     this.$emit('addCodeSetBack');
          //     this.$refs['addCodeSet'].resetFields();
          //     this.cleanData()
          // })
          businessTermsApi.updateAndAddCodeSet(this.addCodeSet).then(res => {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.$emit("addCodeSetBack");
            this.$refs["addCodeSet"].resetFields();
            this.cleanData();
          });
        } else {
          return false;
        }
      });
    },
    cleanData() {
      this.addCodeSet.explanation = "";
      this.addCodeSet.express = "";
      this.addCodeSet.coderule = "";
    },
    closeDialog() {
      this.$refs["addCodeSet"].resetFields();
      this.cleanData();
      this.$emit("addCodeSetBack");
    }
  },
  mounted: function() {},
  watch: {
    isEditCodeSet: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        this.addCodeSet.pid = val.id;
      },
      deep: true
    }
  }
};
</script>

<style lang="scss"></style>
