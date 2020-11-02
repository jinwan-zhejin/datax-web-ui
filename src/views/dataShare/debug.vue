<template>
  <div class="call">
    <p>调用共享接口</p>
    <div class="box">
      <el-form ref="form" :model="form" label-width="80px">
        <el-input v-model="form.address" placeholder="请输入接口地址" class="input-with-select">
          <el-select slot="prepend" v-model="form.select" style="width: 100px" placeholder="请选择">
            <el-option label="post" value="post" />
            <el-option label="get" value="get" />
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="call" />
        </el-input>
      </el-form>
      <el-radio-group v-show="isBtn" v-model="radio1" style="marginTop: 20px">
        <el-radio-button label="formData" />
        <el-radio-button label="params" />
      </el-radio-group>
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label">Params</span>
          <p v-show="isSuccess" class="title">
            <!-- <el-radio-group v-model="radio">
              <el-radio label="none">none</el-radio>
              <el-radio label="form-data">form-data</el-radio>
              <el-radio label="x-www-form-urlencoded">x-www-form-urlencoded</el-radio>
              <el-radio label="raw">raw</el-radio>
              <el-radio label="binary">binary</el-radio>
            </el-radio-group> -->
            <el-button type="primary" @click="addKeyValue">add</el-button>
          </p>
          <el-table
            v-show="isSuccess"
            :data="callValue"
            border
            style="width: 100%"
          >
            <el-table-column
              width="50"
            />
            <el-table-column
              prop="date"
              label="key"
            >
              <template scope="scope">
                <el-input v-model="scope.row.key" size="mini" />
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="value"
            >
              <template scope="scope">
                <el-input v-model="scope.row.value" size="mini" />
              </template>
            </el-table-column>
            <el-table-column
              label="action"
            >
              <template v-slot:default="{ row }">
                <el-button @click="deleteKeyValue(row)"><i class="el-icon-delete" /></el-button>
              </template>
            </el-table-column>
          </el-table>
          <p v-show="showSuccess"><i class="el-icon-check" />调用成功<el-button v-show="showSuccess" type="primary" @click="cancel">关闭</el-button></p>
          <el-input v-show="showSuccess" v-model="dataObj" style="marginTop: 20px;" disabled type="textarea" autosize />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      callValue: [],
      radio: '',
      obj: {},
      isSuccess: true,
      showSuccess: false,
      dataObj: '',
      radio1: 'formData',
      isBtn: false
    }
  },
  watch: {
    'form.select': {
      handler(newValue, oldValue) {
        console.log(newValue)
        if (newValue === 'post') {
          this.isBtn = true
        } else {
          this.isBtn = false
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.addKeyValue()
  },
  methods: {
    cancel() {
      this.showSuccess = false
      this.isSuccess = true
    },
    addKeyValue() {
      this.callValue.push(
        {
          id: Date.parse(new Date()),
          key: '',
          value: ''
        }
      )
      console.log(this.callValue)
    },
    deleteKeyValue(row) {
      console.log(row)
      const index = this.callValue.indexOf(row)
      this.callValue.splice(index, 1)
    },
    call() {
      for (let i = 0; i < this.callValue.length; i++) {
        this.obj[this.callValue[i].key] = this.callValue[i].value
      }
      console.log(this.obj)
      if (this.form.select === 'post') {
        if (this.radio1 === 'formData') {
          this.$axios({
            method: this.form.select,
            url: this.form.address,
            data: this.obj
          }).then(
            (res) => {
              console.log(res)
              this.dataObj = JSON.stringify(res.data)
              console.log(this.dataObj)
              this.isSuccess = false
              this.showSuccess = true
              this.$message.success('调用成功')
            }
          ).catch(
            (error) => {
              console.log(error, this.callValue)
              this.$message.error('调用失败')
            }
          )
        } else if (this.radio1 === 'params') {
          this.$axios({
            method: this.form.select,
            url: this.form.address,
            params: this.obj
          }).then(
            (res) => {
              console.log(res)
              this.dataObj = JSON.stringify(res.data)
              console.log(this.dataObj)
              this.isSuccess = false
              this.showSuccess = true
              this.$message.success('调用成功')
            }
          ).catch(
            (error) => {
              console.log(error, this.callValue)
              this.$message.error('调用失败')
            }
          )
        }
      } else if (this.form.select === 'get') {
        this.$axios({
          method: this.form.select,
          url: this.form.address,
          params: this.obj
        }).then(
          (res) => {
            console.log(res)
            this.dataObj = JSON.stringify(res.data)
            console.log(this.dataObj)
            this.isSuccess = false
            this.showSuccess = true
            this.$message.success('调用成功')
          }
        ).catch(
          (error) => {
            console.log(error, this.callValue)
            this.$message.error('调用失败')
          }
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.call {
  p {
    text-align: center;
  }
  .box {
    // width: 80%;
    // height: 100%;
    padding: 20px;
    margin: 20px auto;
    border: 1px dotted #cccccc;
    .el-tabs {
      margin-top: 20px;
      .title {
        margin-bottom: 10px;
        text-align: right;
        .el-button {
          margin-left: 10px;
        }
      }
      .el-tab-pane {
        p {
          font-size: 24px;
          text-align: center;
          overflow: hidden;
          i {
            color: greenyellow;
            font-size: 24px;
          }
          .el-button {
            float: right;
          }
        }
      }
    }
  }
}
</style>
