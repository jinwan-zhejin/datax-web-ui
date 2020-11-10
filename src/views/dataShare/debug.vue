<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card" style="height: 65px;">
        <div class="text item">
          <div class="left">调用共享接口</div>
          <div class="right">
            <el-input v-model="form.address" placeholder="请输入接口地址" class="filter-item" style="width: 376px;">
              <el-select slot="prepend" v-model="form.select" class="filter-item" style="margin: 0px; padding: 0px;" placeholder="请选择">
                <el-option label="post" value="post" />
                <el-option label="get" value="get" />
              </el-select>
              <el-button slot="append" class="filter-item" style="margin: 0px; padding: 8.5px 0px;" @click="call">搜索</el-button>
            </el-input>
          </div>
        </div>
      </el-card>
    </div>
    <div class="main">
      <el-radio-group v-show="isBtn" v-model="radio1" style="margin: 12px 0;" size="small">
        <el-radio-button type="goon" label="formData" />
        <el-radio-button type="goon" label="params" />
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
        :header-cell-style="{ background: '#FAFAFC' }"
        style="width: 100%;"
      >
        <!-- height="calc(100vh - 198px)" -->
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
.app-container {
  .filter-container {
    overflow: hidden;
    background-color: #ffffff;
    padding: 0px;
    .el-card {
      .left {
        float: left;
        font-size: 24px;
        font-family: PingFangHK-Medium, PingFangHK;
        font-weight: 500;
        color: #333333;
        margin-left: 24px;
      }
      .right {
        float: right;
        margin-right: 20px;
        .el-input {
          overflow: hidden;
          .el-input__inner {
            float: left;
            width: 200px;
            height: 32px;
            line-height: 32px;
            padding-right: 15px;
          }
          .el-input-group__prepend {
            float: left;
            width: 100px;
            height: 32px;
            .el-select {
              .el-input {
                .el-input__inner {
                  width: 75px;
                  padding: 0;
                }
              }
            }
          }
          .el-input-group__append {
            float: left;
            width: 60px;
            padding: 0px 15px;
            text-align: center;
            color: #fff;
            background-color: #3d5fff;
          }
        }
      }
    }
  }
  .formTop {
    position: absolute;
    float: right;
    right: 24px;
    top: 24px;
  }
  .main {
    background-color: transparent;
    // background-color: #fff;
    overflow: hidden;
    margin-top: 10px;
    .el-table {
      // border-top: 1px solid #e0e0e0;
      // border-left: 1px solid #e0e0e0;
      // border-right: 1px solid #e0e0e0;
      th {
        background: #FAFAFC;
      }
      a {
        color: cornflowerblue;
      }
      .a1:hover {
        color: rgb(54, 105, 182)
      }
      .a2 {
        color: #fe4646;
      }
      .a2:hover {
        color: rgb(218, 85, 85);
      }
    }
  }
}
</style>
