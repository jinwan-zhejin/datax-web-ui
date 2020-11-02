<template>
  <el-dialog
    width="500px"
    title=""
    :visible.sync="AddEditCodeListVisible"
    :before-close="closeDialog"
    append-to-body
    @closed="closeDialog"
    @open="openDialog"
  >
    <span v-if="isEditCodeList.id === null" slot="title">新增代码</span>
    <span
      v-if="!(isEditCodeList.id === null) && !isEditCodeList.isHistory"
      slot="title"
    >编辑代码</span>
    <span v-if="isEditCodeList.isHistory" slot="title">代码详情</span>
    <el-form
      ref="addEditCodeForm"
      :model="addEditCodeForm"
      :rules="rules"
      size="small"
      label-width="10z0px"
      label-position="right"
    >
      <el-form-item label="代码" prop="code">
        <el-input
          v-model="addEditCodeForm.code"
          :disabled="isEditCodeList.isHistory"
          maxlength="20"
          placeholder="最大长度为20个字符"
        />
      </el-form-item>
      <el-form-item label="代码名称" prop="name">
        <el-input
          v-model="addEditCodeForm.name"
          :disabled="isEditCodeList.isHistory"
          maxlength="20"
          placeholder="最大长度为20个字符"
        />
      </el-form-item>
    </el-form>
    <span v-if="!openStatus" slot="footer" class="dialog-footer">
      <el-button type="info" size="small" @click="closeDialog">取 消</el-button>
      <el-button
        type="danger"
        size="small"
        @click="submitCodeList('addEditCodeForm')"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as businessTermsApi from '@/api/datax-business-terms';
export default {
  name: '',
  components: {},
  props: ['addEditCodeListVisible', 'isEditCodeList', 'currNodeId'],
  data() {
    return {
      openStatus: false,
      isOuter: false,
      addEditCodeForm: {
        pid: '-1',
        id: '',
        name: '',
        code: '',
        codesetId: ''
      },
      rules: {
        name: [{ required: true, message: '请填写代码名称', trigger: 'blur' }],
        code: [{ required: true, message: '请填写代码', trigger: 'blur' }]
      }
    };
  },
  watch: {
    isEditCodeList: {
      // 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        if (val.id === undefined || val.id === null) {
          this.addEditCodeForm.id = undefined;
        } else {
          this.addEditCodeForm.id = val.id;
        }
      },
      deep: true
    }
  },
  mounted: function() {},
  methods: {
    submitCodeList(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addEditCodeForm.codesetId = this.currNodeId;
          if (!this.isEditCodeList.id) {
            // this.$urlApi.dataStandard.codeSetAddCode(this.addEditCodeForm).then((res)=>{
            //     this.$message({
            //         message:'操作成功',
            //         type:'success'
            //     });
            //     this.$emit('editCodeListBack');
            //     this.$refs['addEditCodeForm'].resetFields()
            // })
            businessTermsApi.codeSetAddCode(this.addEditCodeForm).then(res => {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.$emit('editCodeListBack');
              this.$refs['addEditCodeForm'].resetFields();
            });
          } else {
            // this.$urlApi.dataStandard.CodeSetUpDate(this.addEditCodeForm).then((res)=>{
            //     this.$message({
            //         message:'操作成功',
            //         type:'success'
            //     });
            //     this.$emit('editCodeListBack');
            //     this.$refs['addEditCodeForm'].resetFields()
            // })
            businessTermsApi.CodeSetUpDate(this.addEditCodeForm).then(res => {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.$emit('editCodeListBack');
              this.$refs['addEditCodeForm'].resetFields();
            });
          }
        } else {
          return false;
        }
      });
    },
    getCodeById() {
      // this.$urlApi.dataStandard.getCodeById({'id':this.addEditCodeForm.id}).then((res)=>{
      //     this.addEditCodeForm.name=res.data[0].name;
      //     this.addEditCodeForm.code=res.data[0].code;
      // })
      businessTermsApi
        .getCodeById({ id: this.addEditCodeForm.id })
        .then(res => {
          this.addEditCodeForm.name = res.data[0].name;
          this.addEditCodeForm.code = res.data[0].code;
        });
    },
    closeDialog() {
      this.$refs['addEditCodeForm'].resetFields();
      this.$emit('editCodeListBack');
    },
    openDialog() {
      this.openStatus = this.isEditCodeList.isHistory;
      if (this.addEditCodeForm.id) {
        this.getCodeById();
      }
    }
  }
};
</script>

<style lang="scss"></style>
