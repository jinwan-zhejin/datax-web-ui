<template>
  <div class="app-container">
    <div class="head-container">
      <el-card class="box-card">
        <div class="text item">
          <div class="left">接口注册</div>
          <el-col class="left-description">
            接口注册流程。
          </el-col>
        </div>
      </el-card>
    </div>

    <div class="main">
      <!-- 步骤条 -->
      <el-steps :active="active" align-center>
        <el-step title="填写信息接口" />
        <el-step title="填写出入参数" />
        <el-step title="注册信息确认" />
        <el-step title="注册结果" />
      </el-steps>
      <!-- tab标签页 -->
      <el-divider />
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane name="0">
          <!-- 填写接口信息 -->
          <el-form ref="form" class="interForm" :rules="rules" :model="form" label-width="120px" label-position="right">
            <el-form-item label="联系人:" placeholder="最多20个字" prop="contacts">
              <el-input v-model="form.contacts" />
            </el-form-item>
            <el-form-item label="联系电话:" placeholder="请输入联系电话" prop="telephone">
              <el-input v-model="form.telephone" />
            </el-form-item>
            <el-form-item label="注册人:" placeholder="请输入注册人" prop="registerCompany">
              <!-- <el-input v-model="form.registerCompany" disabled /> -->
              <span style="color: #666666;">{{ form.registerCompany }}</span>
            </el-form-item>
            <el-form-item label="接口名称:" placeholder="(中文)最多20个字" prop="interName">
              <el-input v-model="form.interName" />
            </el-form-item>
            <el-form-item label="接口描述:" placeholder="请输入接口描述" prop="interRemark">
              <el-input v-model="form.interRemark" />
            </el-form-item>
            <el-form-item label="返回数据格式:">
              <!-- <el-radio-group v-model="form.responseMode" size="medium" @change="changeMode">
                <el-radio-button size="small" label="JSON" />
              <el-radio-button label="XML"></el-radio-button>
              </el-radio-group> -->
              <span style="color: #666666;">{{ form.responseMode }}</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane name="1">
          <el-form class="paramForm" :model="paramForm" label-width="120px" label-position="right">
            <el-row>
              <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="8">
                <el-form-item label="数据源:">
                  <el-select v-model="paramForm.serverName" :disabled="isBan" style="width: 234px" @change="fetchTables">
                    <el-option
                      v-for="item in dsList"
                      :key="item.id"
                      :label="item.datasourceName"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="8">
                <el-form-item label="数据表:">
                  <el-select v-model="paramForm.infoName" :disabled="isBan" style="width: 234px" @change="fetchColumns">
                    <el-option
                      v-for="(item, index) in tableList"
                      :key="index"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="7" /> -->
            </el-row>
          </el-form>
          <p>接口输入参数 (*<span>字段名称和字段编码不能重复</span>*)<i id="i1" class="el-icon-plus" @click="addData1" /></p>
          <el-table
            :data="tableData1"
            border
            style="width: 80%;margin: 0px auto;"
            :header-cell-style="{background:'#fafafc',color:'#333333',fontSize:'14px',fontWeight:'500'}"
          >
            <el-table-column
              prop="fieldName"
              label="字段名称"
            >
              <template slot-scope="scope">
                <el-select v-if="scope.row.status" v-model="scope.row.fieldName" @change="chooseName(scope.row.fieldName)">
                  <el-option
                    v-for="item in options3"
                    :key="item.COLUMN_NAME"
                    :label="item.COLUMN_NAME"
                    :value="item.COLUMN_NAME"
                  />
                </el-select>
                <span v-else>{{ scope.row.fieldName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="fieldCode"
              label="字段编码"
            />
            <el-table-column
              prop="fieldRemark"
              label="字段描述"
            />
            <el-table-column
              prop="tag"
              label="操作"
              width="120"
            >
              <template slot-scope="scope">
                <el-tag style="cursor: pointer;" @click="deleteData1(scope.row)"><i class="el-icon-delete" /></el-tag>
              </template>
            </el-table-column>
          </el-table>
          <p>接口输出参数 (*<span>字段名称和字段编码不能重复</span>*)<i id="i2" class="el-icon-plus" @click="addData2" /></p>
          <el-table
            :data="tableData2"
            border
            style="width: 80%;margin: 0px auto;"
            :header-cell-style="{background:'#fafafc',color:'#333333',fontSize:'14px',fontWeight:'500'}"
          >
            <el-table-column
              prop="fieldName"
              label="字段名称"
            >
              <template slot-scope="scope">
                <el-select v-if="scope.row.status" v-model="scope.row.fieldName" @change="chooseName1(scope.row.fieldName)">
                  <el-option
                    v-for="item in options3"
                    :key="item.COLUMN_NAME"
                    :label="item.COLUMN_NAME"
                    :value="item.COLUMN_NAME"
                  />
                </el-select>
                <span v-else>{{ scope.row.fieldName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="fieldCode"
              label="字段编码"
            />
            <el-table-column
              prop="fieldRemark"
              label="字段描述"
            />
            <el-table-column
              prop="tag"
              label="操作"
              width="120"
            >
              <template slot-scope="scope">
                <el-tag style="cursor: pointer;" @click="deleteData2(scope.row)"><i class="el-icon-delete" /></el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="2">
          <div class="interConfirm">
            <el-row>
              <el-col class="title">
                <label>接口注册表单</label>
              </el-col>
              <el-col class="tableForm">
                <el-col class="subtitle">
                  <label>1.信息接口</label>
                  <el-tooltip content="修改" placement="top">
                    <el-button
                      style="padding:0; position: relative; float: right; font-size: 16px; font-weight: bold;"
                      type="text"
                      icon="el-icon-edit-outline"
                      @click="() => { active = 1; activeName = '0'; }"
                    />
                  </el-tooltip>
                </el-col>
                <el-col class="table-infos">
                  <el-col>
                    <el-col class="form-key" :span="9">联系人:</el-col>
                    <el-col class="form-value" :span="15">{{ form.contacts }}</el-col>
                  </el-col>
                  <el-col>
                    <el-col class="form-key" :span="9">联系电话:</el-col>
                    <el-col class="form-value" :span="15">{{ form.telephone }}</el-col>
                  </el-col>
                  <el-col>
                    <el-col class="form-key" :span="9">注册人:</el-col>
                    <el-col class="form-value" :span="15">{{ form.registerCompany }}</el-col>
                  </el-col>
                  <el-col>
                    <el-col class="form-key" :span="9">接口名称:</el-col>
                    <el-col class="form-value" :span="15">{{ form.interName }}</el-col>
                  </el-col>
                  <el-col>
                    <el-col class="form-key" :span="9">接口描述:</el-col>
                    <el-col class="form-value" :span="15">{{ form.interRemark }}</el-col>
                  </el-col>
                  <el-col>
                    <el-col class="form-key" :span="9">返回数据格式:</el-col>
                    <el-col class="form-value" :span="15">{{ form.responseMode }}</el-col>
                  </el-col>
                </el-col>
                <el-col class="subtitle">
                  <label>2.出入参数</label>
                  <el-tooltip content="修改" placement="top">
                    <el-button
                      style="padding:0; position: relative; float: right; font-size: 16px; font-weight: bold;"
                      type="text"
                      icon="el-icon-edit-outline"
                      @click="() => { active = 2; activeName = '1'; }"
                    />
                  </el-tooltip>
                </el-col>
                <el-col class="table-infos">
                  <el-col>
                    <el-col class="form-key" :span="9">数据源:</el-col>
                    <el-col class="form-value" :span="15">{{ paramForm.serverName === '' ? '无' : paramForm.serverName }}</el-col>
                  </el-col>
                  <el-col>
                    <el-col class="form-key" :span="9">数据表:</el-col>
                    <el-col class="form-value" :span="15">{{ paramForm.infoName === '' ? '无' : paramForm.infoName }}</el-col>
                  </el-col>
                </el-col>
                <el-col class="subtitle">
                  <label>2.1接口输入参数</label>
                  <el-tooltip content="修改" placement="top">
                    <el-button
                      style="padding:0; position: relative; float: right; font-size: 16px; font-weight: bold;"
                      type="text"
                      icon="el-icon-edit-outline"
                      @click="() => { active = 2; activeName = '1'; }"
                    />
                  </el-tooltip>
                </el-col>
                <el-col class="table-infos">
                  <el-col>
                    <el-table
                      :data="tableData1"
                      border
                      :header-cell-style="{background:'#fafafc',color:'#333333',fontSize:'14px',fontWeight:'500'}"
                    >
                      <el-table-column
                        prop="fieldName"
                        label="字段名称"
                      >
                        <template slot-scope="scope">
                          <el-select v-if="scope.row.status" v-model="scope.row.fieldName" @change="chooseName(scope.row.fieldName)">
                            <el-option
                              v-for="item in options3"
                              :key="item.COLUMN_NAME"
                              :label="item.COLUMN_NAME"
                              :value="item.COLUMN_NAME"
                            />
                          </el-select>
                          <span v-else>{{ scope.row.fieldName }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="fieldCode"
                        label="字段编码"
                      />
                      <el-table-column
                        prop="fieldRemark"
                        label="字段描述"
                      />
                    </el-table>
                  </el-col>
                </el-col>
                <el-col class="subtitle">
                  <label>2.2接口输出参数</label>
                  <el-tooltip content="修改" placement="top">
                    <el-button
                      style="padding:0; position: relative; float: right; font-size: 16px; font-weight: bold;"
                      type="text"
                      icon="el-icon-edit-outline"
                      @click="() => { active = 2; activeName = '1'; }"
                    />
                  </el-tooltip>
                </el-col>
                <el-col class="table-infos">
                  <el-col>
                    <el-table
                      :data="tableData2"
                      border
                      :header-cell-style="{background:'#fafafc',color:'#333333',fontSize:'14px',fontWeight:'500'}"
                    >
                      <el-table-column
                        prop="fieldName"
                        label="字段名称"
                      >
                        <template slot-scope="scope">
                          <el-select v-if="scope.row.status" v-model="scope.row.fieldName" @change="chooseName1(scope.row.fieldName)">
                            <el-option
                              v-for="item in options3"
                              :key="item.COLUMN_NAME"
                              :label="item.COLUMN_NAME"
                              :value="item.COLUMN_NAME"
                            />
                          </el-select>
                          <span v-else>{{ scope.row.fieldName }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="fieldCode"
                        label="字段编码"
                      />
                      <el-table-column
                        prop="fieldRemark"
                        label="字段描述"
                      />
                    </el-table>
                  </el-col>
                </el-col>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane name="3">
          <div class="bor">
            <i v-show="infoMsg === '注册成功'" class="el-icon-check" style="margin-right: 20px;color: skyblue" />
            <i v-show="infoMsg !== '注册成功'" class="el-icon-close" style="margin-right: 20px;color: skyblue" />
            {{ infoMsg }}
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-divider />
      <div class="btn">
        <el-button v-show="active !== 1 && active !== 4" size="small" class="next" type="goon" @click="prev">上一步</el-button>
        <el-button v-show="active < 3" size="small" class="next" type="goon" @click="next">下一步</el-button>
        <el-button v-show="active === 3" size="small" class="next" type="goon" @click="sure">确 定</el-button>
        <el-button v-show="active === 4" size="small" class="next" type="goon" @click="back">确 定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as datasourceApi from '@/api/datax-jdbcDatasource'
import * as dsQueryApi from '@/api/metadata-query'
import * as interFaceApi from '@/api/data-share'
export default {
  data() {
    return {
      active: 1,
      activeName: '0',
      toWay: false,
      inWay: false,
      form: {
        implMethod: 'HTTP',
        businessType: '数据共享',
        responseMode: 'JSON',
        realName: '',
        deployMethod: [
          '外部共享'
        ],
        isLimit: '无条件共享'
      },
      rules: {
        contacts: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        registerCompany: [
          { required: true, message: '请输入注册人', trigger: 'blur' }
        ],
        interName: [
          { required: true, message: '请输入接口名称', trigger: 'blur' }
        ],
        interRemark: [
          { required: true, message: '请输入接口描述', trigger: 'blur' }
        ]
      },
      infoMsg: '',
      options1: [],
      tableList: [],
      dsList: [],
      options3: [],
      isBan: false,
      detailForm: {},
      tableData1: [],
      tableData2: [],
      fileList: [],
      type: 'goon',
      paramForm: {
        serverName: '',
        infoName: ''
      },
      infoId: '',
      tableEnglish: '',
      deployMethod: [],
      isSelect: false,
      itemSelect: '数据共享',
      listQuery: {
        current: 1,
        size: 10000
      }
    }
  },
  watch: {
    deployMethod: function(val) {
      console.log(val)
      if (val.length === 1) {
        if (val[0] === '外部共享') {
          this.toWay = true
          this.inWay = false
        } else if (val[0] === '内部共享') {
          this.inWay = true
          this.toWay = false
        }
      } else if (val.length === 2) {
        this.inWay = true
        this.toWay = true
      } else {
        this.inWay = false
        this.toWay = false
      }
    }
  },
  created() {
    // this.form.registerCompany = localStorage.getItem('UserName')
    this.form.registerCompany = 'admin'
    this.fetchDataSource()
  },
  mounted() {
    const em = document.getElementsByClassName('el-tabs__header')[0]
    em.style.display = 'none'
  },
  updated() {
    this.deployMethod = this.form.deployMethod
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
      this.active = +tab.index
      console.log(tab)
      console.log(event)
    },
    // 获取当前点击的Dom元素
    getDom(e) {
      console.log(e)
      const dom = e.target.innerText
      this.itemSelect = dom
      console.log(dom)
    },
    isShowLi() {
      console.log(6666)
    },
    changeShare(val) {
      console.log(val)
      if (val === this.itemSelect) {
        this.isSelect = true
      } else {
        this.isSelect = false
      }
    },
    changeMode(val) {
      this.isSelect = false
    },
    changeMethod(val) {
      this.isSelect = false
    },
    changeLimit(val) {
      this.isSelect = false
    },
    // 下一步
    next() {
      console.log(this.active)
      console.log(this.activeName)
      if (this.active === 1) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            // if (this.active++ > 3) this.active = 0
            // 1. 控制步骤条
            this.active++
            // 2. 控制标签页
            this.activeName = this.active - 1 + ''
          } else {
            this.$message.error('验证未通过')
          }
        })
      } else {
        // if (this.active++ > 3) this.active = 0
        // 1. 控制步骤条
        this.active++
        // 2. 控制标签页
        this.activeName = this.active - 1 + ''
      }
    },
    // 上一步
    prev() {
      // 1. 控制步骤条
      this.active--
      // 2. 控制标签页
      this.activeName = this.active - 1 + ''
      console.log(this.form)
      console.log(typeof (this.form.deployMethod))
      if (typeof (this.form.deployMethod) === 'string') {
        const str1 = this.form.deployMethod.split('|')[0]
        const str2 = this.form.deployMethod.split('|')[1]
        this.form.deployMethod = []
        this.form.deployMethod.push(str1)
        this.form.deployMethod.push(str2)
        console.log(this.form.deployMethod)
      }
      console.log(this.active)
      console.log(this.activeName)
    },
    // 只要文件上传成功, 都会调用这个函数
    handleSuccess(response, file, fileList) {
      console.log(response)
    },
    handleRemove(file, fileList) {
      this.fileList = []
    },
    handlePreview(file, fileList) {
      console.log(file)
    },
    uploadFile(file) {
      file.name = file.file.name
      this.fileList.push(file)
    },
    // 文件上传组件自带相关方法
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除${file.name}？`)
    },
    // 选择
    async chooseServer(name) {
      const res = await this.$axios.post(`/dataCatalog/getCatalogByServerName?serverName=${name}&token=${localStorage.getItem('token')}`)
      console.log(res)
      if (res.status === 200) {
        this.tableList = res.data.message
      }
    },
    // 选择信息资源名称
    async chooseInfo(name) {
      interFaceApi.getInfoList(name).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.options3 = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取所在服务器名称
    async getServer() {
      const res = await this.$axios.post('/databaseInfo/getDataBaseInfoServerName')
      console.log(res)
      if (res.status === 200) {
        this.options1 = res.data
      }
    },
    chooseName(name) {
      for (let i = 0; i < this.options3.length; i++) {
        if (this.options3[i].COLUMN_NAME === name) {
          this.tableData1[this.tableData1.length - 1].fieldCode = this.options3[i].COLUMN_NAME
          this.tableData1[this.tableData1.length - 1].fieldRemark = this.options3[i].COLUMN_COMMENT
          break
        }
      }
    },
    chooseName1(name) {
      console.log(this.options3)
      for (let i = 0; i < this.options3.length; i++) {
        if (this.options3[i].COLUMN_NAME === name) {
          this.tableData2[this.tableData2.length - 1].fieldCode = this.options3[i].COLUMN_NAME
          this.tableData2[this.tableData2.length - 1].fieldRemark = this.options3[i].COLUMN_COMMENT
          break
        }
      }
    },
    // 添加1
    addData1() {
      this.tableData1.map(item => {
        if (item.status) {
          item.status = 0
        }
        return item
      })
      this.tableData1.push(
        {
          id: Date.parse(new Date()),
          fieldCode: '',
          fieldName: '',
          fieldRemark: '',
          status: 1
        }
      )
      this.isBan = true
    },
    // 添加2
    addData2() {
      this.tableData2.map(item => {
        if (item.status) {
          item.status = 0
        }
        return item
      })
      this.tableData2.push(
        {
          id: Date.parse(new Date()),
          fieldCode: '',
          fieldName: '',
          fieldRemark: '',
          status: 1
        }
      )
      this.isBan = true
    },
    // 确认添加
    confirmAdd(row) {
      row.edit = false
    },
    // 修改
    editData(row) {
      row.edit = true
    },
    // 删除1
    deleteData1(row) {
      const index = this.tableData1.indexOf(row)
      this.tableData1.splice(index, 1)
      console.log(index)
      if (this.tableData1.length === 0 && this.tableData2.length === 0) {
        this.isBan = false
      }
    },
    // 删除2
    deleteData2(row) {
      const index = this.tableData2.indexOf(row)
      this.tableData2.splice(index, 1)
      console.log(index)
      if (this.tableData1.length === 0 && this.tableData2.length === 0) {
        this.isBan = false
      }
    },
    // 获取infoId和tableName
    getParams() {
      console.log(this.tableList)
      for (let i = 0; i < this.tableList.length; i++) {
        if (this.tableList[i].infoName === this.paramForm.infoName) {
          this.tableEnglish = this.tableList[i]
        }
      }
      // for (let j = 0; j < this.dsList.length; j++) {
      //   if (this.dsList[j].id === this.paramForm.serverName) {
      //     this.paramForm.serverName = this.dsList[j].datasourceName
      //   }
      // }
    },
    // 确定注册
    async ok() {
      this.getParams()
      console.log('12333333333333', this.paramForm.serverName)
      console.log(this.form)
      interFaceApi.regInterFace({
        contacts: this.form.contacts,
        telephone: this.form.telephone,
        interName: this.form.interName,
        interRemark: this.form.interRemark,
        registerCompany: this.form.registerCompany,
        responseMode: this.form.responseMode,
        inputParams: this.tableData1,
        outputParams: this.tableData2,
        tableEnglish: this.paramForm.infoName,
        id: this.paramForm.serverName
      }).then(res => {
        console.log('----------------')
        console.log(res)
        if (res.code === 200) {
          this.next()
          this.infoMsg = res.content.message
        } else {
          this.$message.error(res.message)
          this.next()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    sure() {
      if (this.tableData1.length > 0 && this.tableData2.length > 0) {
        this.ok()
      } else {
        this.$message.error('请填写完整的信息')
      }
    },
    // 返回注册列表
    back() {
      this.$router.push('/data/registerAudit')
    },
    fetchDataSource() {
      console.log('datasource')
      datasourceApi.list(this.listQuery).then(response => {
        const { records } = response
        this.dsList = records
        console.log(records, '@@@@@@@@@@')
      })
    },
    fetchTables(e) {
      console.log(e, '111111111')
      const param = {}
      param.datasourceId = e
      dsQueryApi.getTables(param).then(res => {
        this.tableList = res
      })
    },
    fetchColumns(e) {
      console.log(this.paramForm.serverName)
      const obj = {
        datasourceId: this.paramForm.serverName,
        tableName: e
      }
      dsQueryApi.getTableColumns(obj).then(response => {
        console.log(response)
        this.options3 = response.datas
      })
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
  }

  .el-steps {
    padding-top: 20px;
    width: 60%;
    margin: 0 auto;
  }
  .el-tabs {
    .el-tab-pane {
      height: calc(100vh - 499px);
      overflow-y: auto;
      .el-form .el-form-item__label {
        color: #666666;
        font-size: 14px;
        font-weight: 500;
        font-family: PingFangHK-Medium, PingFangHK;
      }
      .el-tabs__nav-wrap::after {
        background-color: #fff;
      }
      p {
        width: 80%;
        margin: 20px auto;
        color: #666666;
        font-size: 14px;
        font-weight: 500;
        font-family: PingFangHK-Medium, PingFangHK;
        span {
          color: #fe4646;
          font-size: 12px;
        }
        #i1 {
          background-color: rgb(93, 93, 250);
          color: #fff;
          padding: 3px;
          border-radius: 50%;
          margin-left: 20px;
          cursor: pointer;
        }
        #i2 {
          background-color: rgb(93, 93, 250);
          color: #fff;
          padding: 3px;
          border-radius: 50%;
          margin-left: 20px;
          cursor: pointer;
        }
      }
      .bor {
        width: 60%;
        margin: 20px auto;
        height: 150px;
        line-height: 150px;
        border: 1px dotted #cccccc;
        font-size: 24px;
        text-align: center;
      }
    }
  }
  .interForm {
    width: 60%;
    margin: 30px auto;
    position: relative;
    .el-form-item {
      .next {
        margin: 0 30%;
        transform: translateX(-50%);
      }
      // .el-input {
      //   width: 410px;
      // }
      .el-button {
        width: 200px;
      }
      .colorBlue {
        background-color: rgb(129, 164, 230);
      }
    }
    .select {
      position: absolute;
      // top: 73%;
      top: 447px;
      left: 14.8%;
      overflow-y: scroll;
      height: 120px;
      ul {
        width: 98px;
        background-color: #fff;
        border-radius: 1px;
        border-top: 1px solid #ffffff;
        li {
          width: 98px;
          height: 36px;
          line-height: 36px;
          list-style: none;
          background-color: #ccc;
          font-size: 14px;
          color: #fff;
          text-align: center;
          border-right: none;
          cursor: pointer;
        }
        li:hover {
          background-color: #409EFF;
        }
      }
    }
  }
  .el-row {
    width: 80%;
    margin: 10px auto;
  }
  .el-table {
    .el-tag {
      margin: 0px 5px;
    }
  }
  .btn {
    height: 96px;
    line-height: 96px;
    text-align: center;
    .el-button {
      margin: 10px 60px;
    }
  }
  .interConfirm {
    width: 80%;
    margin: 30px auto;
    position: relative;
    label {
      font-weight: normal;
    }
    .title {
      font-size: 20px;
      font-family: PingFangHK-Medium, PingFangHK;
      margin: 10px 0;
    }
    .tableForm {
      .table-infos {
        background-color: #f8f8fa;
        // border: 1px solid #e9e9e9dd;
        padding: 15px;
      }
      .subtitle {
        font-size: 16px;
        font-family: PingFangHK-Medium, PingFangHK;
        margin: 15px 0;
      }
      .sub-subtitle {
        font-size: 14px;
        font-family: PingFangHK-Medium, PingFangHK;
        margin: 10px 0;
      }
      .form-key {
        text-align: right;
        padding: 5px 10px;
        color: #999999;
        font-size: 14px;
        font-family: PingFangHK-Medium, PingFangHK;
      }
      .form-value {
        padding: 5px 20px;
        // border-bottom: 1px solid #e9e9e9dd;
        text-align: left;
        color: #666666;
        font-size: 14px;
        font-family: PingFangHK-Medium, PingFangHK;
      }
    }
  }
}

</style>
