<template>
  <el-dialog
    title="问题数据处理"
    :visible.sync="dealOperateVisible"
    :before-close="closeDialog"
    class="deal-operate"
    :lock-scroll="false"
    width="500px"
    :close-on-click-modal="false"
    @open="openDialog"
  >
    <el-form ref="baseForm" :model="baseForm" :rules="rules" size="small" label-width="100px" label-position="right">
      <el-form-item label="处理人" prop="dealPeople">
        <el-input
          v-model="baseForm.dealPeople"
          type="text"
          placeholder="请输入内容"
          maxlength="20"
        />
      </el-form-item>
      <el-form-item label="处理方式" prop="dealComment">
        <el-input
          v-model="baseForm.dealComment"
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="info" size="small" @click="closeDialog">关 闭</el-button>
      <el-button type="danger" size="small" @click="submitForm('baseForm')">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: '',
  components: {},
  props: ['dealOperateVisible', 'isdealOperate'],
  data() {
    return {
      baseForm: {
        ids: '',
        dealPeople: '',
        dealComment: ''
      },
      rules: {
        dealPeople: [
          { required: true, message: '请填写处理人', trigger: 'blur' }
        ],
        dealComment: [
          { required: true, message: '请填写处理方式', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    isdealOperate: {// 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {

      },
      deep: true
    }
  },
  mounted: function() {

  },
  methods: {
    closeDialog() {
      this.$refs['baseForm'].resetFields()
      this.$emit('dealOperateBack');
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$urlApi.dataQuality.dealProblemData(this.baseForm).then((res) => {
            this.$emit('dealOperateBack');
            this.$refs['baseForm'].resetFields();
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          });
        } else {
          return false;
        }
      });
    },
    openDialog() {
      console.log(this.isdealOperate);

      if (this.isdealOperate.dealPeople) {
        this.baseForm.dealPeople = this.isdealOperate.dealPeople;
      } else {
        this.baseForm.dealPeople = this.$auth.get('userName');
      }
      this.baseForm.dealComment = this.isdealOperate.dealComment;
      this.baseForm.ids = this.isdealOperate.ids;
    }
  }
}
</script>

<style lang="scss">
    .deal-operate{

    }
</style>
