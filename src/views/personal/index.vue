<template>
  <div class="main">
    <div class="left">
      <div class="img">
        <img src="../../../public/avatar.jpg" class="user-avatar">
      </div>
      <div class="userName">
        <p>
          {{ '尊敬的' + userName + ',您好' }}
        </p>
        <div class="desc">
          您拥有的项目共有<span>{{ total }}</span>个
        </div>
      </div>
    </div>
    <div class="right">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="'项目(' + total + ')'" name="first">
          <el-row :gutter="10">
            <el-col v-for="i in item" :key="i.id" :span="12" @click.native="handleLink">
              <div class="box">
                <div class="title">
                  <div class="radius">
                    {{ i.name ? i.name.split('')[0] : '' }}
                  </div>
                  <span>{{ i.name }}</span>
                </div>
                <div class="body">
                  <p>项目描述：{{ i.description }}</p>
                  <div class="time">
                    {{ i.note }}时间：{{ i.createTime }}
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import * as jobProjectApi from '@/api/datax-job-project';

export default {
  data() {
    return {
      userName: '',
      listQuery: {
        pageNo: 1,
        pageSize: 99999,
        searchVal: '',
        userId: ''
      },
      total: '',
      activeName: 'first',
      item: {},
      res: {}
    }
  },
  created() {
    this.userName = localStorage.getItem('userName').split('"')[1]
    console.log(this.userName)
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listQuery.userId = JSON.parse(localStorage.getItem('userId'))
      this.listLoading = true;
      jobProjectApi.list(this.listQuery).then(response => {
        console.log(response, 'response')
        const { total } = response;
        const { records } = response;
        this.res = response;
        this.total = total;
        this.item = records;
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleLink() {
      console.log(JSON.parse(localStorage.getItem('permission')))
      const myLeft = JSON.parse(localStorage.getItem('permission'))
      const arr = []
      for (let i = 0; i < myLeft.length; i++) {
        if (myLeft[i].menuId !== 2 && myLeft[i].menuId !== 4 && myLeft[i].menuId !== 61) {
          arr.push(myLeft[i])
        }
      }
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].path) {
          window.open('#' + arr[0].path + '?level=2')
        } else {
          window.open('#' + arr[0].children[0].path + '?level=2')
        }
      }
      console.log('#' + arr[0].path + '');
      console.log(arr);
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  padding-bottom: 24px;
  .left {
    width: 30%;
    min-height: 800px;
    max-height: 100%;
    margin: 24px 12px 0px 24px;
    background-color: #fff;
    padding: 20px;
    .img {
      text-align: center;
      margin-top: 20px;
      img {
        width: 160px;
        height: 160px;
        border-radius: 50%;
      }
    }
    .userName {
      p {
        font-size: 24px;
        text-align: center;
        margin-top: 40px;
        font-weight: 700;
      }
    }
    .desc {
      font-size: 20px;
      text-align: center;
      margin-top: 30px;
    }
  }
  .right {
    flex: 1;
    min-height: 800px;
    max-height: 100%;
    margin: 24px 24px 0px 12px;
    background-color: #fff;
    padding: 24px;
    .el-tabs {
      .el-tab-pane {
        font-size: 24px;
        .el-row {
          .el-col {
            .box {
              height: 240px;
              padding: 16px 5px 5px 16px;
              margin: 20px;
              border: 1px solid #eee;
              // background-color: rgb(255, 244, 219);
              .title {
                height: 60px;
                line-height: 60px;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                .radius {
                  width: 60px;
                  height: 60px;
                  float: left;
                  text-align: center;
                  background-color: rgb(25, 125, 172);
                  border-radius: 50%;
                  color: #fff;
                }
                span {
                  color: rgb(104, 189, 223);
                  margin-left: 10px;
                  font-size: 24px;
                }
              }
              .body {
                margin-top: 60px;
                overflow: hidden;
                text-overflow:ellipsis;
                // white-space: nowrap;
                p {
                  font-size: 20px;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                  margin-top: 20px;
                }
                .time {
                  font-size: 14px;
                  color: rgb(196, 196, 196);
                  margin-top: 20px;
                }
              }
            }
            .box:hover {
              box-shadow: 0px 0px 20px skyblue;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
