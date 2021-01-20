<template>
  <div class="app-container">
    <div class="head-container">
      <el-card class="box-card">
        <div class="text item">
          <div class="left">个人信息</div>
          <el-col class="left-description">
            <!-- 管理项目的增、删、改、查，管理项目数据源配置以及成员配置。 -->
          </el-col>
        </div>
      </el-card>
    </div>
    <div class="userInfo">
      <el-card class="box-card">
        <div class="text item">
          <div class="workplace">
            <div class="left">
              <img src="../../../public/avatar.jpg" class="user-avatar">
            </div>
            <div class="right">
              <p>
                {{ '尊敬的' + userName + ',您好' }}
              </p>
              <div class="project">
                <div class="title">
                  您的项目数
                  <br>
                  <span>{{ total }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- <el-col class="left-description">
            下午好，天野远子，准备吃什么呢?
          </el-col> -->
        </div>
      </el-card>
    </div>
    <div class="userBody" />
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
      total: ''
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
        const { total } = response;
        this.total = total;
      });
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
      box-shadow: inset 0px 5px 10px -8px rgba(0,0,0,0.1);
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
        color: #000000A6;
        margin: 15px 24px;
      }
    }
  }

  .userInfo {
    overflow: hidden;
    background-color: #ffffff;
    padding: 0px;

    .el-card {
      box-shadow: inset 0px 5px 10px -8px rgba(0,0,0,0.1);
      border: 0 !important;
      border-radius: 0;

      .workplace {
        padding: 20px;
        overflow: hidden;
        .left {
          float: left;
          img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
          }
        }
        .right {
          line-height:100px;
          overflow: hidden;
          p {
            width: 50%;
            font-size: 30px;
            text-indent: 2rem;
            float: left;
          }
          .project {
            float: right;
            width: 200px;
            height: 100px;
            text-align: center;
            // background-color: skyblue;
            .title {
              height: 50px;
              line-height: 50px;
              font-size: 24px;
            }
            span {
              font-size: 40px;
            }
          }
        }
      }

      .left-description {
        float: left;
        font-size: 14px;
        font-family: PingFangHK-Medium, PingFangHK;
        color: #000000A6;
        margin: 15px 24px;
      }
    }

  }
  .userBody {
    overflow: hidden;
    padding: 0px;
    height: 400px;
    margin: 20px 20px 0px 20px;
    background-color: #fff;
  }
}
</style>
