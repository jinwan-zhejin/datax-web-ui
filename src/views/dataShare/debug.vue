<template>
  <div class="app-container">
    <div class="head-container">
      <el-card class="box-card">
        <div class="text item">
          <div class="left">接口调用</div>
          <el-col class="left-description">
            测试调用接口。
          </el-col>
        </div>
      </el-card>
    </div>
    <div class="main">
      <el-form class="search-bar" label-position="right" label-width="auto" :inline="true">
        <el-form-item label="接口：">
          <el-input v-model="form.address" placeholder="接口地址" style="width: 100%; margin-top: 6px;" class="input-with-select">
            <el-select slot="prepend" v-model="form.select" placeholder="请求方式" style="width: 110px;">
              <el-option label="post" value="post" />
              <el-option label="get" value="get" />
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-search"
            @click="call"
          >搜 索</el-button>
          <el-button
            size="small"
            icon="el-icon-refresh"
            @click="reSet"
          >重 置</el-button>
        </el-form-item>
      </el-form>
      <el-radio-group v-show="isBtn" v-model="radio1" style="margin-bottom: 10px;" size="small">
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
        :header-cell-style="{ background: '#FAFAFC', color: '#666666' }"
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
            <el-button type="text" @click="addKeyValue">添加</el-button>
            <el-divider direction="vertical" />
            <el-button type="text" style="color: #fe4646;" @click="deleteKeyValue(row)">删除</el-button>
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
    },
    /**
     * @description: 重置
     */
    reSet() {
      this.form.select = ''
      this.form.address = ''
      this.call()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0;
  .head-container {
    overflow: hidden;
    background-color: #ffffff;
    padding: 0px;
    .el-card {
      box-shadow: inset 0px 5px 10px -8px rgba(0, 0, 0, 0.1);
      border: 0 !important;
      border-radius: 0;
      .left {
        float: left;
        font-size: 24px;
        font-family: PingFangHK-Medium, PingFangHK;
        font-weight: 500;
        color: #333333;
        margin-left: 24px;
      }
      .left-description {
        float: left;
        font-size: 14px;
        font-family: PingFangHK-Medium, PingFangHK;
        color: #000000a6;
        margin: 15px 24px;
      }
    }
  }
  .main {
    padding: 24px;
    background-color: #fff;
    overflow: hidden;
    margin: 20px 20px 0 20px;
    .search-bar {
      background: #ffffff;

      >>> .el-form-item__label {
        font-weight: normal;
        font-size: 15px;
        line-height: 42px;
      }
      >>> .el-form-item__content {
        line-height: 42px;
      }
    }
    .el-table {
      th {
        background: #FAFAFC;
      }
    }
  }
}
</style>
