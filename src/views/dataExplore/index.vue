<template>
  <div class="explore-container">
    <div class="app-container">
      <!-- 条件查询和操作 -->
      <div class="filter-container">
        <el-input v-model="search" prefix-icon="el-icon-search" style="width:40%;border:none;" placeholder="请输入关键字" @input="Search" />
        <el-button class="filter-item" style="float:right;backgroundColor: #000;color:#fff;" round type="default" icon="el-icon-plus" @click="AddList">
          添加
        </el-button>
      </div>
      <!-- 列表 -->
      <ul>
        <li v-for="item in ObjList" :key="item.id">
          <a @click="gotoDetail(item)">
            <div class="img">
              <img src="../../assets/dataset-cover.png" alt="">
            </div>
            <div class="main">
              <div class="main_tit">
                <h5>{{ item.taskName }}</h5>
                <p>
                  <span><i class="el-icon-user-solid" />{{ item.name }}</span>
                  <!-- <span><i class="el-icon-link" />Link</span> -->
                </p>
                <p>
                  <span><i class="el-icon-present" />{{ item.tableName }}</span>
                  <!-- <span><i class="el-icon-coin" />item</span> -->
                  <span><i class="el-icon-suitcase" />{{ item.number }}</span>
                  <!-- <span><i class="el-icon-tickets" />task</span> -->
                </p>
              </div>
            </div>
            <!-- <div class="rg_btn">
              <el-button style="margin:0px;marginTop；14px;" plain @click.stop="like(item)"><i class="el-icon-arrow-up" /></el-button>
              <el-button style="marginLeft: 0px;" plain>{{ item.number }}</el-button>
            </div> -->
          </a>
        </li>
      </ul>
      <!-- 添加列表对话框 -->
      <el-dialog
        title="添加列表"
        :visible.sync="dialogAddVisible"
        width="50%"
      >
        <div class="dia_lt">
          <i class="el-icon-upload" @click="showUpload" />
          <i class="el-icon-link" @click="showLink" />
          <!-- <svg-icon icon-class="github" @click="showGitHub" />
          <i class="el-icon-s-help" @click="showList" />
          <svg-icon style="marginTop:150px;" icon-class="shezhi" @click="showSet" /> -->
        </div>
        <div class="dia_rg">
          <i class="el-icon-close" @click="closeDialog" />
          <div class="top">
            <!-- <el-input v-model="dia_search" /> -->
          </div>
          <!-- 文件上传 -->
          <div v-if="isUpload" class="action">
            <p class="help">Drop your files and folders here</p>
            <div class="box">
              <svg-icon icon-class="clipboard" />
            </div>
            <p class="or">or</p>
            <el-upload
              ref="uploaddemo"
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :limit="1"
              :on-success="handleSuccess"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :http-request="uploadFile"
              :file-list="fileList"
            >
              <el-button size="small" type="primary" round>点击上传</el-button>
            </el-upload>
          </div>
          <!-- link链接 -->
          <div v-if="isLink" class="Link">
            <!-- <h2>Remote Files</h2>
            <p>Create a dataset from remote URLs. URLs must point to a file.</p>
            <el-input v-model="newURL" placeholder="Enter a URL to add a new file" />
            <el-button round plain><i class="el-icon-plus" />Add remote file</el-button> -->
            <el-form ref="form" label-position="left" :model="form" label-width="120px">
              <el-form-item label="任务名">
                <el-input v-model="form.taskName" />
              </el-form-item>
              <el-form-item label="数据源">
                <el-select v-model="form.sourceName" placeholder="Public">
                  <el-option label="Public" value="Public" />
                  <el-option label="Private" value="Private" />
                </el-select>
              </el-form-item>
              <el-form-item label="数据库表名">
                <el-select v-model="form.tableName" placeholder="Unknown">
                  <el-option label="QH_1911" value="QH_1911" />
                  <el-option label="BJ_1898" value="BJ_1898" />
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="Owner">
                <el-select v-model="form.option2" placeholder="wh_dev7295">
                  <el-option label="Public" value="Public" />
                  <el-option label="Private" value="Private" />
                </el-select>
              </el-form-item> -->
              <el-form-item label="创建人名字">
                <el-input v-model="form.name" disabled />
              </el-form-item>
              <el-form-item label="描述">
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
          taskName: '清华大学',
          desc: '清华大学（Tsinghua University）简称“清华”，是中华人民共和国教育部直属、中央直管副部级建制的全国重点大学，位列“211工程”、“985工程”、“世界一流大学和一流学科”A类，入选“2011计划”、“珠峰计划”、“111计划”、“强基计划”，为九校联盟、松联盟、中国大学校长联谊会、亚洲大学联盟、环太平洋大学联盟、清华—剑桥—MIT低碳大学联盟成员。是中国著名高等学府、中国高层次人才培养和科学技术研究的重要基地，被誉为“红色工程师的摇篮”。',
          sourceName: 'demo_01',
          tableName: 'QH_1911',
          content: '老尖子生了',
          number: 2345,
          name: 'admin'
        },
        {
          id: 235345,
          taskName: '北京大学',
          content: '北京大学老二次元了',
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
      isUpload: true,
      isLink: false,
      isGitHub: false,
      isList: false,
      isSet: false
    }
  },
  created() {
    this.fetchData()
    if (localStorage.getItem('newData')) {
      if (JSON.parse(localStorage.getItem('newData')) !== this.ObjList) {
        this.ObjList = JSON.parse(localStorage.getItem('newData'))
      }
    }
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
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
      this.dialogAddVisible = true
    },
    Search() {
      console.log(this.search)
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
      this.form.name = localStorage.getItem('roles').split('_')[1].split('"')[0]
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
    // 创建
    create() {
      this.ObjList.push(
        {
          id: Date.parse(new Date()),
          taskName: this.form.taskName,
          name: this.form.name,
          content: '',
          desc: this.form.desc,
          sourceName: this.form.sourceName,
          tableName: this.form.tableName,
          number: Date.parse(new Date()) % 99999
        }
      )
      console.log(this.ObjList)
      console.log(JSON.stringify(this.ObjList))
      localStorage.setItem('newData', JSON.stringify(this.ObjList))
      this.dialogAddVisible = false
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
    }
  }
}
</script>

<style lang="scss">
.explore {
  &-container {
    margin: 30px;
    .filter-container {
      margin-bottom: 20px;
      border: 1px solid #ccc;
      overflow: hidden;
      border-radius: 4px;
      padding: 2px;
      .el-input {
        .el-input__inner {
          border: none;
        }
      }
      .el-button {
        margin: 0px 20px;
      }
    }
    .filter-container:hover {
      border: 1px solid skyblue;
    }
    ul {
      border: 1px solid #cccccc;
      border-radius: 2px;
      padding-left: 0px;
      border-bottom: none;
      li {
        width: 100%;
        height: 88px;
        list-style: none;
        border-bottom: 1px solid #ccc;
        a {
          width: 100%;
          height: 88px;
          display: block;
          overflow: hidden;
          .img {
            width: 60px;
            height: 60px;
            margin: 14px;
            float: left;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .main {
            width: 60%;
            float: left;
            .main_tit {
              h5 {
                margin: 10px 0px;
                text-indent: 10px;
              }
              p {
                font-size: 14px;
                margin: 5px 0px;
                i {
                  margin: 0px 10px;
                }
                span {
                  cursor: pointer;
                  margin: 20px 0px;
                }
                span:hover {
                  color: skyblue;
                }
              }
            }
          }
          .rg_btn {
            float: right;
            margin: 14px;
          }
        }
      }
    }
    .el-dialog {
      .el-dialog__header {
        display: none;
      }
      .el-dialog__footer {
        border-top: 1px solid #cccccc;
        padding-bottom: 10px;
      }
      .el-dialog__body {
        padding: 0px;
        height: 400px;
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
          width: 90%;
          height: 100%;
          position: relative;
          padding-bottom: 60px;
          .top {
            padding: 23px;
            // border-bottom: 1px solid #ccc;
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
            width: 100%;
            height: 100%;
            padding: 0px 20px;
            padding-bottom: 60px;
            overflow: auto;
            // overflow: hidden;
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
            border-top: 1px solid #ccc;
            text-align: right;
            z-index: 999;
            background-color: #fff;
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

