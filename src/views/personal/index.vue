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
                下午好，天野远子，准备吃什么呢?
              </p>
            </div>
          </div>
          <el-col class="left-description">
            下午好，天野远子，准备吃什么呢?
          </el-col>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {

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
          p {
            font-size: 30px;
            text-indent: 2rem;
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
}
</style>
