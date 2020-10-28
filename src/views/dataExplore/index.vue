<template>
  <div class="explore-container">
    <div class="app-container">
      <div class="filter-container">
        <!-- 条件查询和操作 -->
        <div class="box-card">
          <div class="text item">
            <div class="left">数据探查</div>
            <div class="right">
              <el-input
                v-model="search"
                clearable
                placeholder="数据探查名称"
                style="width: 268px"
                class="filter-item"
                @keyup.enter.native="handleFilter"
              >
                <el-button slot="append" size="small" style="margin: 0px;padding: 8.5px 0px;" class="filter-item" type="goon" @click="getAllData">搜索</el-button>
              </el-input>
              <el-button class="filter-item" style="margin-left: 30px;" type="goon" size="small" icon="el-icon-plus" @click="AddList">
                添加
              </el-button>
              <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
                reviewer
              </el-checkbox> -->
            </div>
          </div>
        </div>
      </div>
      <div class="line" />
      <!-- 列表 -->
      <ul>
        <li v-for="item in ObjList" :key="item.id">
          <a>
            <!-- <div class="img">
              <img src="../../assets/dataSourceIcon/bigquery_icon_big@2x.png" alt="">
            </div> -->
            <div class="main">
              <div class="txtInfo">
                <div class="p1">{{ item.taskName }}</div>
                <p>
                  <span><i class="el-icon-user-solid" />{{ userName }}</span>
                </p>
                <p>
                  <span><i class="el-icon-present" />{{ item.tableName }}</span>
                  <span><i class="el-icon-coin" />{{ item.size }}</span>
                  <span><i class="el-icon-reading" />{{ item.rows }}</span>
                  <span><i class="el-icon-s-grid" />{{ item.cols }}</span>
                </p>
              </div>
            </div>
            <el-button class="startE" plain size="small" @click="gotoDetail(item)">开始探查</el-button>
            <i class="deleteIcon el-icon-close" @click="open(item.id)" />
          </a>
        </li>
      </ul>
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <!-- 添加列表对话框 -->
      <el-dialog
        title="添加列表"
        :visible.sync="dialogAddVisible"
        width="50%"
      >
        <div class="dia_rg">
          <i class="el-icon-close" @click="closeDialog" />
          <div class="top">
            <!-- <el-input v-model="dia_search" /> -->
            <span style="fontSize: 24px;">添加数据</span>
          </div>
          <!-- link链接 -->
          <div v-if="isLink" class="Link">
            <el-form ref="form" label-position="right" :model="form" label-width="100px">
              <el-form-item label="任务名:">
                <el-input v-model="form.taskName" />
              </el-form-item>
              <el-form-item label="数据源:">
                <el-select v-model="form.sourceName" placeholder="请选择数据源" @change="schemaChange">
                  <el-option
                    v-for="item in sourceList"
                    :key="item.id"
                    :label="item.datasourceName"
                    :value="item.datasourceName"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="数据库表名:">
                <el-select v-model="form.tableName" placeholder="请选择数据库表名">
                  <el-option
                    v-for="item in tableList"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="简介:">
                <el-input v-model="form.content" />
              </el-form-item>
              <el-form-item label="创建人名字:">
                <el-input v-model="form.name" disabled />
              </el-form-item>
              <el-form-item label="描述:">
                <el-input v-model="form.desc" type="textarea" autosize />
              </el-form-item>
            </el-form>
          </div>
          <!-- githubURL -->
          <div v-if="isGitHub" class="Link">
            <h2>Import GitHub repository</h2>
            <p>Create a dataset from a GitHub repository archive. Use the repo URL or any deep link.</p>
            <span>GitHub URL</span><el-input v-model="newURL" placeholder="Enter a URL to add a new file" />
          </div>
          <!-- List -->
          <div v-if="isList" class="list">
            <div class="form">
              <el-input v-model="listSearch" placeholder="Search notebooks" />
              <el-select v-model="selectValue" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <ul>
              <li>
                <a>
                  <svg-icon icon-class="clipboard" />
                  <h3>EfficientNetB3 data Pipeline and Model</h3>
                  <p>123123</p>
                </a>
              </li>
            </ul>
          </div>
          <!-- Set设置 -->
          <div v-if="isSet" class="set">
            <el-form ref="form" label-position="left" :model="form" label-width="120px">
              <el-form-item label="Privacy">
                <el-select v-model="form.option" placeholder="Public">
                  <el-option label="Public" value="Public" />
                  <el-option label="Private" value="Private" />
                </el-select>
                <div class="p">
                  <span>Private Quota</span>
                </div>
              </el-form-item>
              <el-form-item label="License">
                <el-select v-model="form.option1" placeholder="Unknown">
                  <el-option label="Public" value="Public" />
                  <el-option label="Private" value="Private" />
                </el-select>
              </el-form-item>
              <el-form-item label="Owner">
                <el-select v-model="form.option2" placeholder="wh_dev7295">
                  <el-option label="Public" value="Public" />
                  <el-option label="Private" value="Private" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="footer">
            <el-button style="border:none" @click="dialogAddVisible = false">取消</el-button>
            <el-button @click="create"><i class="el-icon-success" />创建</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getList } from '@/api/datax-user'
import { list as jdbcDsList } from '@/api/datax-jdbcDatasource'
import { addList, getAllList, deleteData } from '@/api/data-explore'
// import { list } from '@/api/datax-jdbcDatasource'
import * as dsQueryApi from '@/api/metadata-query'

export default {
  name: 'Explore',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      sourceId: '', // 选中数据源ID
      userName: '',
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      search: '',
      dialogAddVisible: false,
      ObjList: [
        {
          id: 124234,
          taskName: '60k Stack Overflow Questions with Quality Rating',
          desc: '清华大学（Tsinghua University）简称“清华”，是中华人民共和国教育部直属、中央直管副部级建制的全国重点大学，位列“211工程”、“985工程”、“世界一流大学和一流学科”A类，入选“2011计划”、“珠峰计划”、“111计划”、“强基计划”，为九校联盟、松联盟、中国大学校长联谊会、亚洲大学联盟、环太平洋大学联盟、清华—剑桥—MIT低碳大学联盟成员。是中国著名高等学府、中国高层次人才培养和科学技术研究的重要基地，被誉为“红色工程师的摇篮”。',
          sourceName: 'demo_01',
          tableName: 'QH_1911',
          content: 'Questions from 2016-2020 classified in three categories based on their quality',
          number: 2345,
          name: 'admin'
        },
        {
          id: 235345,
          taskName: 'LEGO Minifigures Classification',
          content: '"Do or do not. There is no try" - Yoda',
          sourceName: 'demo_01',
          tableName: 'BJ_1898',
          desc: '北京大学（Peking University），简称“北大”，由中华人民共和国教育部直属，中央直管副部级建制。位列“双一流”、“211工程”、“985工程”，入选“基础学科拔尖学生培养试验计划”、“高等学校创新能力提升计划”、“高等学校学科创新引智计划”，为九校联盟、松联盟、中国大学校长联谊会、京港大学联盟、亚洲大学联盟、东亚研究型大学协会、国际研究型大学联盟、环太平洋大学联盟、21世纪学术联盟、东亚四大学论坛、国际公立大学论坛、中俄综合性大学联盟成员。',
          number: 2354,
          name: 'admin'
        }
      ],
      dia_search: '',
      newURL: '',
      listSearch: '',
      selectValue: '',
      fileList: [],
      options: [
        {
          value: '北京大学',
          label: '北大'
        },
        {
          value: '清华大学',
          label: '清华'
        }
      ],
      form: {},
      sourceList: [],
      tableList: [],
      isUpload: false,
      isLink: true,
      isGitHub: false,
      isList: false,
      isSet: false,
      pageNum: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.fetchData()
    this.getAllData()
    this.userName = localStorage.getItem('roles').split('_')[1].split('"')[0]
    if (localStorage.getItem('newData')) {
      if (JSON.parse(localStorage.getItem('newData')) !== this.ObjList) {
        this.ObjList = JSON.parse(localStorage.getItem('newData'))
      }
    }
    console.log(document.getElementsByClassName('el-pagination__total'))
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        console.log(response)
        this.list = response.content.data
        this.listLoading = false
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取全部数据
    getAllData() {
      const obj = {
        keyword: this.search,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      getAllList(obj).then((res) => {
        console.log(res)
        if (res.code === 200) {
          this.ObjList = res.content.reverse()
          this.total = res.content.length
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    gotoDetail(item) {
      console.log(this.$router)
      console.log(item)
      this.$router.push({
        path: '/dataExplore/details',
        query: item
      })
    },
    AddList() {
      this.getJdbcDs()
      this.form.name = localStorage.getItem('roles').split('_')[1].split('"')[0]
      this.dialogAddVisible = true
    },
    closeDialog() {
      this.dialogAddVisible = false
    },
    like(item) {
      const newValue = item.number
      if (newValue === item.number) {
        item.number = item.number + 1
      } else {
        item.number = item.number - 1
      }
      console.log('124234')
    },
    showUpload() {
      this.isUpload = true
      this.isLink = false
      this.isGitHub = false
    },
    showLink() {
      this.isUpload = false
      this.isLink = true
      this.isGitHub = false
    },
    showGitHub() {
      this.isUpload = false
      this.isLink = false
      this.isGitHub = true
    },
    showList() {
      this.isUpload = false
      this.isLink = false
      this.isGitHub = false
      this.isList = true
    },
    showSet() {
      this.isUpload = false
      this.isLink = false
      this.isGitHub = false
      this.isList = false
      this.isSet = true
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
      this.getAllData()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getAllData()
    },
    // 创建
    create() {
      // const params = new FormData()
      // params.append('taskName', this.form.taskName)
      // params.append('tableName', this.form.tableName)
      // params.append('description', this.form.desc || '')
      // params.append('jdbcDatasourceId', this.sourceId)
      // params.append('intro', this.form.content)
      const params = {
        taskName: this.form.taskName,
        tableName: this.form.tableName,
        description: this.form.desc || '',
        jdbcDatasourceId: this.sourceId,
        intro: this.form.content
      }
      console.log(params)
      addList(params).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.dialogAddVisible = false
          this.form = {}
          this.getAllData()
          this.$message.success('添加成功')
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('添加失败')
      })
    },
    // 获取数据源
    async getJdbcDs() {
      jdbcDsList({
        current: 1,
        size: 1000
      }).then(response => {
        const { records } = response
        console.log(records)
        this.sourceList = records
      })
      // list().then(res => {
      //   console.log(res)
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    // schema 切换
    schemaChange(e) {
      this.form.sourceName = e
      console.log(e)
      // 获取可用表
      this.getTables('rdbmsReader')
    },
    // 获取表名
    getTables(type) {
      if (type === 'rdbmsReader') {
        let obj = {}
        if (this.dataSource === 'postgresql' || this.dataSource === 'greenplum' || this.dataSource === 'oracle' || this.dataSource === 'sqlserver') {
          obj = {
            tableSchema: this.form.sourceName
          }
          console.log(this.sourceList)
          for (let i = 0; i < this.sourceList.length; i++) {
            if (this.form.sourceName === this.sourceList[i].datasourceName) {
              // obj.append('datasourceId', this.sourceList[i].datasourceId)
              console.log()
              obj.datasourceId = this.sourceList[i].id
            }
          }
        } else {
          obj = {}
          console.log(this.sourceList)
          for (let i = 0; i < this.sourceList.length; i++) {
            if (this.form.sourceName === this.sourceList[i].datasourceName) {
              // obj.append('datasourceId', this.sourceList[i].datasourceId)
              obj.datasourceId = this.sourceList[i].id
            }
          }
          console.log(obj)
          this.sourceId = obj.datasourceId
        }
        // 组装
        dsQueryApi.getTables(obj).then(response => {
          if (response) {
            this.tableList = response
            console.log(response)
          }
        })
      }
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
      console.log(file)
      file.name = file.file.name
      this.fileList.push(file)
    },
    del(id) {
      deleteData(id).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.getAllData()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    open(id) {
      this.$confirm('您确定要删除该条探查任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.del(id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss">
.explore {
  &-container {
    margin: 30px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    .filter-container {
      background-color: #ffffff;
      overflow: hidden;
      border-radius: 4px;
      padding: 0px;
      margin: 10px 0px;
      .box-card {
        .left {
          float: left;
          width: 120px;
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
    .line {
      height: 1px;
      background: #F3F3F3;
    }
    ul {
      border-radius: 2px;
      padding-left: 0px;
      border-bottom: none;
      li {
        width: 100%;
        height: 144px;
        list-style: none;
        border-bottom: 1px solid #F3F3F3;
        a {
          width: 100%;
          height: 144px;
          display: block;
          overflow: hidden;
          position: relative;
          cursor: default;
          .main {
            width: 60%;
            float: left;
            padding-top: 26px;
            .txtInfo {
              margin-left: 20px;
              .p1 {
                height: 25px;
                font-size: 18px;
                font-family: PingFangHK-Medium, PingFangHK;
                font-weight: 500;
                color: #333333;
                line-height: 25px;
              }
              p {
                margin-top: 10px;
                color: #666666;
                span {
                  font-size: 14px;
                  font-family: PingFangHK-Regular, PingFangHK;
                  font-weight: 400;
                  cursor: pointer;
                  margin-right: 30px;
                  i {
                    margin-right: 8px;
                  }
                }
                span:hover {
                  color: steelblue;
                }
              }
            }
          }
          .startE {
            position: absolute;
            right: 24px;
            bottom: 25px;
          }
          .deleteIcon {
            position: absolute;
            right: 24px;
            top: 26px;
            cursor: pointer;
          }
          .deleteIcon:hover {
            color: tomato;
          }
        }
      }
    }
    .el-pagination {
      float: right;
      height: 30px;
      line-height: 30px;
      margin: 25px;
    }
    .el-dialog {
      border-radius: 8px;
      .el-dialog__header {
        display: none;
      }
      .el-dialog__footer {
        border-top: 1px solid #cccccc;
        padding-bottom: 10px;
      }
      .el-dialog__body {
        padding: 0px;
        height: 100%;
        overflow: hidden;
        .dia_lt {
          width: 10%;
          height: 100%;
          float: left;
          position: relative;
          border-right: 1px solid #ccc;
          i {
            font-size: 30px;
            margin: 10px 0px;
            margin-left: 50%;
            transform: translateX(-50%);
            cursor: pointer;
          }
          i:hover {
            color: steelblue;
          }
          i:visited {
            color: blue;
          }
          .svg-icon {
            font-size: 30px;
            margin: 10px 0px;
            margin-left: 50%;
            transform: translateX(-50%);
            cursor: pointer;
          }
          .svg-icon:hover {
            color: steelblue;
          }
        }
        .dia_rg {
          float: right;
          width: 100%;
          height: 100%;
          position: relative;
          padding-bottom: 60px;
          .top {
            padding: 23px;
            .el-input {
              width: 90%;
            }
          }
          .el-icon-close {
            border: 1px solid #ccc;
            z-index: 999;
            padding: 5px;
            border-radius: 3px;
            background-color: gray;
            color: aliceblue;
            font-weight: 700;
            cursor: pointer;
            position: absolute;
            top: 10px;
            right: 10px;
          }
          .action {
            width: 100%;
            height: 100%;
            padding-bottom: 60px;
            overflow: hidden;
            .el-upload {
              padding-bottom: 60px;
              margin-left: 50%;
              transform: translateX(-50%);
            }
            .help {
              font-size: 20px;
              text-align: center;
              color: rgb(199, 199, 199);
            }
            p {
              text-align: center;
              font-size: 20px;
            }
            .box {
              width: 80px;
              height: 80px;
              line-height: 80px;
              margin: 0px auto;
              border-radius: 50%;
              border: 1px solid #cccccc;
              text-align: center;
              box-shadow: 0px 0px 20px rgb(49, 139, 243);
              .svg-icon {
                font-size: 30px;
              }
            }
          }
          .Link {
            width: 80%;
            height: 100%;
            padding: 0px 20px;
            margin: 0px auto;
            .el-form {
              margin-top: 20px;
              margin-right: 50px;
              .el-select {
                width: 100%;
              }
              .p {
                width: 100%;
                height: 30px;
                line-height: 30px;
                border: 1px solid #ccc;
                border-radius: 2px;
                margin-top: 10px;
                span {
                  width: 20%;
                }
              }
              .el-form-item {
                .el-form-item__content {
                  .upload-demo {
                    ul {
                      border: none;
                    }
                  }
                }
              }
            }
          }
          .list {
            width: 100%;
            height: 100%;
            padding: 0px 20px;
            padding-bottom: 60px;
            overflow: hidden;
            .form {
              overflow: hidden;
              .el-input {
                width: 60%;
                margin: 10px;
                float: left;
              }
              .el-select {
                width: 30%;
                float: left;
              }
            }
            ul {
              height: 200px;
              border: none;
              li {
                height: 50px;
                line-height: 50px;
                border-bottom: none;
                a {
                  overflow: hidden;
                  .svg-icon {
                    font-size: 20px;
                    display: block;
                    float: left;
                    margin: 15px;
                  }
                  h3 {
                    height: 15px;
                    padding: 0px;
                    margin: 0px;
                  }
                  p {
                    font-size: 14px;
                    padding: 0px;
                    margin: 0px;
                  }
                }
              }
              li:hover {
                background-color: rgb(235, 235, 235);
                border-radius: 10px;
              }
            }
          }
          .set {
            width: 100%;
            height: 100%;
            padding: 0px 20px;
            padding-bottom: 60px;
            overflow: hidden;
            .el-form {
              margin-top: 20px;
              .el-select {
                width: 100%;
              }
              .p {
                width: 100%;
                height: 30px;
                line-height: 30px;
                border: 1px solid #ccc;
                border-radius: 2px;
                margin-top: 10px;
                span {
                  width: 20%;
                }
              }
            }
          }
          .footer {
            width: 100%;
            position: absolute;
            bottom: 0;
            height: 60px;
            padding: 10px;
            border-top: 1px solid #F3F3F3;
            text-align: right;
            z-index: 999;
            background-color: #fff;
            border-radius: 0px 0px 8px 8px;
          }
        }
      }
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

