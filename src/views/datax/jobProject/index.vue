<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <div class="text item">
          <div class="left">项目管理</div>
          <el-col class="left-description">
            管理项目的增、删、改、查，管理项目数据源配置以及成员配置。
          </el-col>
        </div>
      </el-card>
    </div>

    <div class="main">
      <el-form class="search-bar" label-position="right" label-width="auto" :inline="true">
        <el-form-item label="项目名称：">
          <el-input
            v-model="listQuery.searchVal"
            clearable
            size="small"
            placeholder="项目名称"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            @click="fetchData"
          >搜 索</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="20">
        <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="6" style="margin-bottom: 20px;">
          <el-card
            shadow="hover"
            class="box-card new-project"
            :body-style="{ padding: '0px', height: '163px' }"
            @click.native="handleCreate"
          >
            <span>
              <i class="el-icon-plus" /> 添加
            </span>
          </el-card>
        </el-col>
        <el-col
          v-for="(item, index) in list"
          :key="index"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="6"
          :xl="6"
          style="margin-bottom: 20px;"
        >
          <project-card :content="item" style="cursor: pointer;">
            <div slot="top">
              <el-tooltip placement="left" content="操作" @click.native.stop>
                <el-dropdown trigger="click" @click.native.stop>
                  <span class="el-dropdown-link">
                    <el-button type="text" icon="el-icon-more" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native.stop="handleUpdate(item)">
                      <el-button type="text" icon="el-icon-edit" />编辑
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="item.status !== 'deleted'"
                      @click.native.stop="handleDelete(item)"
                    >
                      <el-button
                        type="text"
                        icon="el-icon-delete"
                        style="color: #fe4646"
                      />删除
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click.native.stop="handleShowMember(item)"
                    >
                      <el-button type="text" icon="el-icon-user" />成员管理
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click.native.stop="handleDataSource(item)"
                    >
                      <el-button type="text" icon="el-icon-coin" />数据源管理
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-tooltip>
            </div>
          </project-card>
        </el-col>
      </el-row>
      <!-- <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" :header-cell-style="{ background: '#FAFAFC' }" fit highlight-current-row>
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope"><span>{{ scope.$index + 1 }}</span></template>
        </el-table-column>
        <el-table-column label="项目名称" align="left">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="项目描述" align="left">
          <template slot-scope="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="所属用户" width="160" align="left">
          <template slot-scope="scope">{{ scope.row.userName }} </template>
        </el-table-column>
        <el-table-column label="创建时间" width="160" align="left">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width=" 230" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
            <a style="color: #3d5fff; margin: 0px 6px" @click="handleUpdate(row)">编辑</a>
            <el-divider direction="vertical" />
            <a v-if="row.status !== 'deleted'" style="color: #fe4646; margin: 0px 6px" @click="handleDelete(row)">删除</a>
            <el-divider direction="vertical" />
            <a style="color: #3d5fff; margin: 0px 6px" @click="handleDataSource(row)">数据源管理</a>
          </template>
        </el-table-column>
      </el-table> -->
      <el-row>
        <el-col style="background: #ffffff;">
          <pagination
            v-show="total > 0"
            :total="total"
            style="float: right; margin-top: 0;"
            :page.sync="listQuery.pageNo"
            :limit.sync="listQuery.pageSize"
            layout="total, prev, pager, next, sizes"
            @pagination="fetchData"
          />
        </el-col>
      </el-row>
    </div>
    <!-- 添加/编辑 -->
    <el-dialog :visible.sync="dialogFormVisible" width="500px">
      <p slot="title" class="dialog_title">
        {{ textMap[dialogStatus] }}项目管理
      </p>
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="项目名称" prop="name">
          <el-input
            v-model="temp.name"
            placeholder="项目名称"
            style="width: 99%"
          />
        </el-form-item>
        <el-form-item label="项目描述" prop="description">
          <el-input
            v-model="temp.description"
            placeholder="项目描述"
            style="width: 99%"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          size="small"
          class="dialog_ok_btn"
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          完成
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogPluginVisible"
      title="Reading statistics"
      width="624px"
    >
      <el-table
        :data="pluginData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogPvVisible = false"
        >Confirm</el-button>
      </span>
    </el-dialog>
    <!-- 数据源管理对话框 -->
    <el-dialog
      :visible.sync="dialogDataSource"
      title="数据源管理"
      width="500px"
    >
      <el-form :model="sourceForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="数据源:">
          <el-select
            v-model="sourceForm.region"
            style="width: 100%;"
            placeholder="请选择数据源"
          >
            <el-option label="数据源一" value="data1" />
            <el-option label="数据源二" value="data2" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          @click="dialogDataSource = false"
        >取 消</el-button>
        <el-button
          type="goon"
          size="small"
          @click="dialogDataSource = false"
        >完 成</el-button>
      </span>
    </el-dialog>
    <!-- 成员 -->
    <member
      :show="memberShow"
      :project-id="temp.id"
      @close="memberShow = false"
    />
  </div>
</template>

<script>
import * as jobProjectApi from '@/api/datax-job-project';
import waves from '@/directive/waves';
import Pagination from '@/components/Pagination';
// import * as datasourceApi from '@/api/datax-jdbcDatasource';
import { translaterMaster } from '@/utils/dictionary';
import { getAllUser, getAllUserProject } from '@/api/datax-user';
import ProjectCard from './components/projectCard';
import Member from './components/member';

export default {
  name: 'JobProject',
  components: {
    Pagination,
    ProjectCard,
    Member
  },
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        searchVal: ''
      },
      pluginTypeOptions: ['reader', 'writer'],
      dialogPluginVisible: false,
      pluginData: [],
      dialogFormVisible: false,
      dialogDataSource: false,
      sourceForm: {},
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rules: {
        name: [
          {
            required: true,
            message: translaterMaster('this is require'),
            trigger: 'blur'
          }
        ],
        description: [
          {
            required: true,
            message: translaterMaster('this is require'),
            trigger: 'blur'
          }
        ]
      },
      temp: {
        id: undefined,
        name: '',
        description: '',
        userIds: []
      },
      visible: true,
      users: [], // 用户列表
      memberShow: false
    };
  },
  computed: {
    // 在用户列表通过id找username
    getNameById() {
      return id => {
        const temp = this.users.filter(item => item.id === id);
        return temp[0]?.username;
      };
    }
  },
  created() {
    getAllUser().then(response => {
      this.users = response;
    });
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      jobProjectApi.list(this.listQuery).then(response => {
        const { records } = response;
        const { total } = response;
        this.total = total;
        this.list = records;
        this.list = this.list.sort((a, b) => {
          return (a.name > b.name) - (a.name < b.name)
        })
        this.listLoading = false;
      });
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        description: '',
        userIds: []
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          jobProjectApi.created(this.temp).then(response => {
            this.fetchData();
            this.dialogFormVisible = false;
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            });
          });
        }
      });
    },
    handleUpdate(row) {
      jobProjectApi.getInfoById(row.id).then(response => {
        // console.log(response);
        this.temp = Object.assign({}, response);
      });
      // console.log(row)
      // this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    handleDataSource(row) {
      console.log(row);
      sessionStorage.setItem('JobName', row.name);
      sessionStorage.setItem('projectId', row.id);
      this.$router.push('/datax/datasource/jdbcDatasource');
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          jobProjectApi.updated(tempData).then(() => {
            this.fetchData();
            this.dialogFormVisible = false;
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            });
          });
        }
      });
    },
    handleDelete(row) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const idList = [];
        idList.push(row.id);
        jobProjectApi
          .deleted({
            idList: row.id
          })
          .then(response => {
            this.fetchData();
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      });
    },
    handleShowMember(item) {
      this.temp = item;
      this.memberShow = true;
    }
  }
};
</script>

<style lang="scss">
.app-container {
  padding: 5px 0;
  .filter-container {
    overflow: hidden;
    // line-height: 56px;
    background-color: #ffffff;
    padding: 0px;

    // border-radius: 5px 5px 0px 0px;
    // box-shadow:0 2px 12px 0 rgba(0,0,0,.3);
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

  .main {
    padding: 0 20px;
    // background-color: #fff;
    background-color: transparent;
    overflow: hidden;
    margin-top: 20px;
  }

  .topSelect {
    overflow: hidden;
    height: 40px;
    line-height: 40px;

    .el-input {
      .el-input__inner {
        height: 32px;
      }

      .el-button {
        .el-button--default {
          color: #ffffff;
        }
      }
    }
  }

  .el-tabs {
    margin-top: 20px;

    .el-tab-pane {
      ul {
        overflow: hidden;

        li {
          list-style: none;
          float: left;
          width: 12.5%;

          a {
            text-align: center;

            img {
              display: block;
              margin: 0 auto;
              margin-top: 10px;
              width: 64px;
            }

            p {
              height: 40px;
              font-size: 14px;
              font-family: PingFangHK-Regular, PingFangHK;
              font-weight: 400;
              color: #333333;
              line-height: 20px;
              margin-top: 10px;
            }
          }

          p {
            font-size: 16px;
            margin-top: 20px;
          }
        }

        li:hover {
          background-color: #e9e9f5 !important;
        }

        li:active {
          background-color: #c4cfff;
        }

        li:visited {
          background-color: #c4cfff;
        }
      }
    }
  }

  .set {
    p {
      font-size: 18px;
      margin: 20px 0px 16px 0;
      font-family: PingFangHK-Medium, PingFangHK;
    }

    .bgcForm {
      background-color: #f5f6fa;
      padding: 24px 16px;
      overflow: hidden;
    }
  }

  .el-dialog {
    border-radius: 8px;

    .el-dialog__header {
      font-size: 24px;

      .p_tit {
        font-size: 16px;
        color: #cccccc;
        margin-top: 20px;
      }
    }

    .el-dialog__body {
      padding: 10px 20px;

      .el-form {
        overflow: hidden;
        border-radius: 6px;
        padding-right: 25px;
      }
    }

    .el-dialog__footer {
      border-top: 1px solid #f3f3f3;
      padding: 20px;
    }
  }
}

.dialog_title {
  font-size: 24px;
  font-family: PingFangHK-Medium, PingFangHK;
  font-weight: 500;
  color: #333333;
  line-height: 33px;
}

.dialog_ok_btn {
  background: #3d5fff;
}

.left-description {
  float: left;
  font-size: 14px;
  font-family: PingFangHK-Medium, PingFangHK;
  color: #000000A6;
  margin: 15px 24px;
}

.new-project {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  text-align: center;
  span {
    color: #c9c9c9;
    line-height: 163px;
  }
}
.new-project:hover {
  border: 1px dashed #3d5eff;
  span {
    color: #3d5eff;
  }
}
.search-bar {
  margin-bottom: 20px;
  padding: 24px 24px 0;
  background: #ffffff;
  .el-form-item__label {
    font-weight: normal;
    font-size: 14px;
    line-height: 42px;
  }
}
</style>
