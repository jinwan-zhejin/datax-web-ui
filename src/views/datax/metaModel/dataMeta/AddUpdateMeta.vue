<template>
  <el-dialog
    title=""
    :visible.sync="AddUpdateVisible"
    :before-close="closeDialog"
    class="add-update-meta"
    width="760px"
    @closed="closeDialog"
    @open="openDialog"
  >
    <span v-if="isEditMeta.id === ''" slot="title">新增数据元</span>
    <span v-if="!(isEditMeta.id === '')&& !isEditMeta.isHistory" slot="title">编辑数据元</span>
    <span v-if="isEditMeta.isHistory" slot="title">数据元详情</span>
    <el-form ref="baseForm" :model="baseForm" :rules="rules" size="small" label-width="100px" label-position="right">
      <el-row>
        <el-col :span="12">
          <el-form-item label="数据元名称" prop="dataElementName">
            <el-input v-model="baseForm.dataElementName" :disabled="isEditMeta.isHistory" maxlength="20" placeholder="最大长度为20个字符" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="英文名称" prop="dataElementCode">
            <el-input
              v-model="baseForm.dataElementCode"
              :disabled="isEditMeta.isHistory || !(isEditMeta.id === '')"
              maxlength="20"
              placeholder="输入字母数字和下划线"
              onkeyup="this.value=this.value.replace(/[^\w_]/g,'');"
              @blur="checkCode()"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!--   <el-form-item label="数据源标记">
                <el-input v-model="baseForm.ip"></el-input>
            </el-form-item>-->
      <el-form-item label="数据元类型" prop="dataElementType">
        <el-col :span="11">
          <el-select v-model="baseForm.dataElementType" style="width: 100%" size="small" placeholder="请选择数据元类型" :disabled="!(isEditMeta.id === '') || isEditMeta.isHistory">
            <el-option v-for="item in dataType" :key="item.value" :value="item.value" :label="item.value" :disabled="isEditMeta.isHistory" />
          </el-select>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-input v-for="item in dataType" v-if="item.value===baseForm.dataElementType" :key="item.value" v-model="baseForm.dataElementAttr" :placeholder="item.des" :disabled="item.type===1 || isEditMeta.isHistory || !(isEditMeta.id === '') " />
        </el-col>
      </el-form-item>
      <el-form-item label="值域">
        <el-cascader
          v-model="baseForm.sourceLayerId"
          :disabled="isEditMeta.isHistory"
          change-on-select
          clearable
          :options="layerOptions"
          :props="layerOptionsProps"
          @change="handleLayerChange"
        />
      </el-form-item>
      <!-- <el-form-item label="数据范围"  prop="dataRange">-->
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="数据范围"
            prop="dataRangeFront"
          >
            <el-input v-model.number="baseForm.dataRangeFront" placeholder="请输入较小数字" :disabled="isEditMeta.isHistory" />
          </el-form-item>
        </el-col>
        <el-col class="line ac" :span="2">~</el-col>
        <el-col :span="10">
          <el-form-item
            label-width="0px"
            prop="dataRangeEnd"
          >
            <el-input v-model.number="baseForm.dataRangeEnd" placeholder="请输入较大数字" :disabled="isEditMeta.isHistory" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- </el-form-item>-->
      <el-form-item label="正则表达式">
        <el-select v-model="baseForm.regularExpression" clearable size="small" placeholder="请选择数据源类型" :disabled="isEditMeta.isHistory">
          <el-option value="^([1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3})|([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X))$" label="身份证号码验证" />
          <el-option value="^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$" label="手机号码验证" />
          <el-option value="((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))" label="IP地址验证" />
          <el-option value="^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$" label="邮箱地址验证" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input
          v-model="baseForm.remark"
          :disabled="isEditMeta.isHistory"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
        />
      </el-form-item>
    </el-form>
    <span v-if="!openStatus" slot="footer" class="dialog-footer">
      <el-button type="info" size="small" @click="resetForm('baseForm')">重 置</el-button>
      <el-button type="danger" size="small" :loading="buttonLoading" @click="submitForm('baseForm')">保 存</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: '',
  components: {},
  props: ['addUpdateVisible', 'isEditMeta'],
  data() {
    var validateDataRangeFront = (rule, value, callback) => {
      debugger
      if (value !== '' && this.baseForm.dataRangeEnd !== '') {
        if (value > this.baseForm.dataRangeEnd || !Number.isFinite(value)) {
          callback(new Error('请输入合法范围值'));
        } else {
          callback();
        }
      } else if (value !== '' && this.baseForm.dataRangeEnd == '') {
        this.$refs.baseForm.validateField('dataRangeEnd');
      } else if (value == '' && this.baseForm.dataRangeEnd !== '') {
        callback(new Error('请输入合法范围值'));
      } else {
        callback();
      }
      // this.$refs.baseForm.validateField('dataRangeEnd');
    };
    var validateDataRangeEnd = (rule, value, callback) => {
      if (value !== '' && this.baseForm.dataRangeFront !== '') {
        if (value < this.baseForm.dataRangeFront || !Number.isFinite(value)) {
          callback(new Error('请输入合法范围值'));
        } else {
          this.$refs.baseForm.validateField('dataRangeFront');
          callback();
        }
      } else if (value !== '' && this.baseForm.dataRangeFront == '') {
        this.$refs.baseForm.validateField('dataRangeFront');
      } else if (value == '' && this.baseForm.dataRangeFront !== '') {
        callback(new Error('请输入合法范围值'));
      } else {
        callback();
      }
    };
    return {
      openStatus: false,
      buttonLoading: false,
      dataType: [
        { value: 'c', des: '输入小于4000的正整数', type: 0 },
        { value: 'c..', des: '输入小于4000的正整数', type: 0 },
        { value: 'a', des: '输入小于4000的正整数', type: 0 },
        { value: 'a..', des: '输入小于4000的正整数', type: 0 },
        { value: 'n', des: '输入小于4000的正整数', type: 0 },
        { value: 'n..', des: '输入小于4000的正整数', type: 0 },
        { value: 'an', des: '输入小于4000的正整数', type: 0 },
        { value: 'an..', des: '输入小于4000的正整数', type: 0 },
        { value: 'n..()', des: '输入两个正整数，并用英文逗号隔开', type: 0 },
        { value: 'd', des: 'YYYYMMDD', type: 'd' },
        { value: 't', des: 'hhmmss', type: 1 },
        { value: 'dt', des: 'YYYYMMDD hhmmss', type: 1 },
        { value: 'b', des: '图形，图片等二进制类型', type: 1 }
      ],
      baseForm: {
        id: 0,
        dataElementName: '',
        dataElementCode: '',
        dataElementType: '',
        dataElementAttr: '',
        dataRangeFront: '',
        dataRangeEnd: '',
        regularExpression: '',
        remark: '',
        codeset: '',
        codeList: '',
        sourceLayerId: []
      },
      rules: {
        dataElementName: [
          { required: true, message: '请填写数据元名称', trigger: 'blur' }
        ],
        dataElementCode: [
          { required: true, message: '请填写英文名称', trigger: 'blur' }
        ],
        dataElementType: [
          { required: true, message: '请选择数据类型', trigger: 'change' }
        ],
        remark: [
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
        ],
        dataRangeFront: [
          // { type: 'number', message: '必须为数字值',required:false},
          { validator: validateDataRangeFront, trigger: ['blur', 'change'], required: false }
        ],
        dataRangeEnd: [
          // { type: 'number', message: '必须为数字值',required:false},
          { validator: validateDataRangeEnd, trigger: ['blur', 'change'] }
        ]
      },
      layerOptionsProps: {
        value: 'id',
        label: 'name'
      },
      layerOptions: [

      ]
    }
  },
  watch: {
    isEditMeta: {// 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        this.getLayerMenu();
        if (val.id !== '') {
          this.getDataById();
          this.baseForm.id = val.id
        }
      },
      deep: true
    }
  },
  mounted: function() {
    this.getLayerMenu();
  },
  methods: {
    checkCode() {
      const code = this.baseForm.dataElementCode.replace(/[^\w_]/g, '');
      this.baseForm.dataElementCode = code;
    },
    getLayerMenu() {
      this.$urlApi.dataStandard.getCodeSet().then((res) => {
        this.layerOptions = res.data
      })
    },
    getDataById() {
      this.$urlApi.dataStandard.editDataElement({ 'id': this.isEditMeta.id }).then((res) => {
        this.baseForm.dataElementName = res.data.dataElementName;
        this.baseForm.dataElementCode = res.data.dataElementCode;
        this.baseForm.dataElementType = res.data.dataElementType;
        this.baseForm.dataElementAttr = res.data.dataElementAttr;
        if (res.data.dataRangeFront !== '') {
          this.baseForm.dataRangeFront = Number(res.data.dataRangeFront);
        } else {
          this.baseForm.dataRangeFront = res.data.dataRangeFront;
        }
        if (res.data.dataRangeEnd !== '') {
          this.baseForm.dataRangeEnd = Number(res.data.dataRangeEnd);
        } else {
          this.baseForm.dataRangeEnd = res.data.dataRangeEnd;
        }
        this.baseForm.regularExpression = res.data.regularExpression;
        this.baseForm.remark = res.data.remark;
        if (res.data.codeList) {
          this.baseForm.sourceLayerId = res.data.codeList.split(',').map(Number)
        }
      })
    },
    handleLayerChange(cb) { // 数据分层改变
      console.log(cb)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.baseForm.sourceLayerId.length === 0) {
            this.baseForm.codeset = '';
          } else {
            this.baseForm.codeset = this.baseForm.sourceLayerId[this.baseForm.sourceLayerId.length - 1];
          }
          this.baseForm.codeList = this.baseForm.sourceLayerId.join(',');
          // this.buttonLoading=true;
          this.$urlApi.dataStandard.addDataElement(this.baseForm).then((res) => {
            this.buttonLoading = false;
            this.$refs['baseForm'].resetFields();
            this.closeData();
            this.$emit('AddUpdateVisibleBack', 1);
            this.$message({
              type: 'success',
              message: '操作成功'
            });
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      if (!(this.isEditMeta.id === '') && !this.isEditMeta.isHistory) {
        this.baseForm = {
          id: this.baseForm.id,
          dataElementName: '',
          dataElementCode: this.baseForm.dataElementCode,
          dataElementType: this.baseForm.dataElementType,
          dataElementAttr: this.baseForm.dataElementAttr,
          dataRangeFront: '',
          dataRangeEnd: '',
          regularExpression: '',
          remark: '',
          codeset: '',
          codeList: '',
          sourceLayerId: []
        }
      } else {
        this.closeData()
        this.$refs[formName].resetFields();
      }
    },
    closeData() {
      this.baseForm = {
        id: 0,
        dataElementName: '',
        dataElementCode: '',
        dataElementType: '',
        dataElementAttr: '',
        dataRangeFront: '',
        dataRangeEnd: '',
        regularExpression: '',
        remark: '',
        codeset: '',
        codeList: '',
        sourceLayerId: []
      }
    },
    closeDialog() {
      this.$refs['baseForm'].resetFields();
      this.closeData();
      this.$emit('AddUpdateVisibleBack', 0);
    },
    openDialog() {
      this.openStatus = this.isEditMeta.isHistory;
      this.buttonLoading = false;
    }
  }
}
</script>

<style lang="scss">
    .add-update-meta{

    }
</style>
