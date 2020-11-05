<template>
  <div class="call">
    <p class="P1">调用共享接口</p>
    <el-form ref="form" class="formTop" :model="form" label-width="80px">
      <el-input v-model="form.address" placeholder="请输入接口地址" class="input-with-select">
        <el-select slot="prepend" v-model="form.select" style="width: 100px" placeholder="请选择">
          <el-option label="post" value="post" />
          <el-option label="get" value="get" />
        </el-select>
        <el-button slot="append" icon="el-icon-check" @click="call" />
      </el-input>
    </el-form>
    <div class="box">
      <el-radio-group v-show="isBtn" v-model="radio1" style="marginBottom: 20px;">
        <el-radio-button size="small" type="goon" label="formData" />
        <el-radio-button size="small" type="goon" label="params" />
      </el-radio-group>
      <!-- <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label">参数</span>
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
              label="操作"
              width="120"
              align="center"
            >
              <template v-slot:default="{ row }">
                <a class="a1" @click="addKeyValue">添加</a>
                <span
                  style="
                    width: 1px;
                    height: 12px;
                    background: #e6e6e8;
                    display: inline-block;
                  "
                />
                <a class="a2" @click="deleteKeyValue(row)">删除</a>
              </template>
            </el-table-column>
          </el-table>
          <p v-show="showSuccess"><i class="el-icon-check" />调用成功<el-button v-show="showSuccess" type="primary" @click="cancel">关闭</el-button></p>
          <el-input v-show="showSuccess" v-model="dataObj" style="marginTop: 20px;" disabled type="textarea" autosize />
        </el-tab-pane>
      </el-tabs> -->
      <el-table
        v-show="isSuccess"
        :data="callValue"
        border
        :header-cell-style="{ background: '#FAFAFC' }"
        style="width: 100%"
      >
        <el-table-column
          prop="date"
          label="key(参数名)"
        >
          <template scope="scope">
            <el-input v-model="scope.row.key" size="mini" />
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="value(参数值)"
        >
          <template scope="scope">
            <el-input v-model="scope.row.value" size="mini" />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
          align="center"
        >
          <template v-slot:default="{ row }">
            <!-- <el-button @click="deleteKeyValue(row)" /> -->
            <a class="a1" @click="addKeyValue">添加</a>
            <span
              style="
                width: 1px;
                height: 12px;
                background: #e6e6e8;
                display: inline-block;
              "
            />
            <a class="a2" @click="deleteKeyValue(row)">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <p v-show="showSuccess"><i class="el-icon-check" />调用成功<el-button v-show="showSuccess" type="primary" @click="cancel">关闭</el-button></p>
      <el-input v-show="showSuccess" v-model="dataObj" style="marginTop: 20px;" disabled type="textarea" autosize />
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
      if (this.callValue.length > 1) {
        const index = this.callValue.indexOf(row)
        this.callValue.splice(index, 1)
      } else {
        this.$message.info('请输入内容')
      }
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

<style lang="scss">
.call {
  margin: 20px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  position: relative;
  .P1 {
    position: relative;
    top: 4px;
    left: 4px;
    font-size: 24px;
    font-family: PingFangHK-Medium, PingFangHK;
    font-weight: 500;
    color: #333333;
    height: 36px;
    line-height: 36px;
  }
  .formTop {
    position: absolute;
    width: 50%;
    right: 24px;
    top: 24px;
  }
  .box {
    margin-top: 24px;
    .el-table {
      a {
        color: cornflowerblue;
      }
      .a1:hover {
        color: rgb(54, 105, 182)
      }
      .a2:hover {
        color: rgb(218, 85, 85);
      }
    }
  }
}
</style>
