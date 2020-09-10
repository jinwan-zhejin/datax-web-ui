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
                <h5>{{ item.title }}</h5>
                <p>
                  <span><i class="el-icon-user-solid" />userName</span>
                  <span><i class="el-icon-link" />Link</span>
                </p>
                <p>
                  <span><i class="el-icon-present" />myLife</span>
                  <span><i class="el-icon-coin" />item</span>
                  <span><i class="el-icon-suitcase" />{{ item.number }}</span>
                  <span><i class="el-icon-tickets" />task</span>
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
          <i class="el-icon-upload" />
          <i class="el-icon-link" />
          <svg-icon icon-class="github" />
          <i class="el-icon-s-help" />
          <svg-icon style="marginTop:150px;" icon-class="shezhi" />
        </div>
        <div class="dia_rg">
          <i class="el-icon-close" @click="closeDialog" />
          <div class="top">
            <el-input v-model="dia_search" />
          </div>
          <div class="action">
            <el-upload
              drag
              action="https://jsonplaceholder.typicode.com/posts/"
              multiple
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </div>
          <div class="footer">
            <el-button style="border:none"><i class="el-icon-lock" />private</el-button>
            <el-button><i class="el-icon-success" />Create</el-button>
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
          title: '清华大学',
          text: '老尖子生了',
          number: 234
        },
        {
          id: 235345,
          title: '北京大学',
          text: '北京大学老二次元了',
          number: 2354
        },
        {
          id: 457653,
          title: '航天航空大学',
          text: '老宇宙爱好者了',
          number: 12414
        },
        {
          id: 235235,
          title: '首都财经大学',
          text: '老金融人才培训中心了',
          number: 2355
        },
        {
          id: 434253,
          title: '中国石油大学',
          text: '老能源人培训中心了',
          number: 2124
        }
      ],
      dia_search: ''
    }
  },
  created() {
    this.fetchData()
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
            padding: 10px;
            border-bottom: 1px solid #ccc;
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
            border: none;
            .el-upload {
              margin: 10px auto;
              border: none;
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

