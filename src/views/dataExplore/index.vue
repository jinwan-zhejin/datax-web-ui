<template>
  <div class="app-container">
    <div class="head-container">
      <el-card class="box-card">
        <div class="text item">
          <div class="left">数据探查</div>
          <el-col class="left-description">
            为了帮助用户一眼看穿当前数据的质量、结构、分布、统计信息，它支持探查概览、支持探查详情、支持字段取值分布、数据预览等功能。
          </el-col>
        </div>
      </el-card>
    </div>
    <!-- 列表 -->
    <div class="main">
      <el-form class="search-bar" label-position="right" label-width="auto" :inline="true">
        <el-form-item label="数据探查名称：">
          <el-input
            v-model="search"
            clearable
            size="small"
            placeholder="数据探查名称"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="getAllData"
          >搜 索</el-button>
          <el-button
            size="small"
            icon="el-icon-refresh"
            @click="reSet"
          >重 置</el-button>
        </el-form-item>
      </el-form>
      <el-row v-loading="dataLoading" :gutter="20" style="margin-top: 20px;">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="margin-bottom: 20px;">
          <el-card
            shadow="hover"
            class="box-card new-project"
            :body-style="{ padding: '0px', height: '206px' }"
            @click.native="AddList"
          >
            <span>
              <i class="el-icon-plus" /> 添加
            </span>
          </el-card>
        </el-col>
        <el-col v-for="(item, index) in ObjList" :key="index" :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="margin-bottom: 20px;">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <el-avatar style="float: left;">{{ item.taskName[0].toUpperCase() }}</el-avatar>
              <div style="height: 40px; float: left; line-height: 40px; font-size: 18px; font-weight: bold; margin-left: 10px; color: #3d5eff;">{{ item.taskName }}</div>
              <div style="line-height: 40px; float: right;">
                <el-tooltip placement="left" content="操作" @click.native.stop>
                  <el-dropdown trigger="click" placement="bottom-end" @click.native.stop>
                    <span class="el-dropdown-link">
                      <el-button type="text" icon="el-icon-more" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        @click.native.stop="open(item.id)"
                      >
                        <el-button type="text" style="color: #fe4646;" icon="el-icon-delete" />删除
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click.native.stop="gotoDetail(item)"
                      >
                        <el-button type="text" icon="el-icon-search" />开始探查
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-tooltip>
              </div>
            </div>
            <el-form class="forms">
              <el-form-item>
                <el-col :span="24">
                  <a>
                    <span class="texts">
                      <i class="el-icon-user-solid" />
                      {{ userName === "1" ? "管理员" : "普通用户" }}
                    </span>
                  </a>
                </el-col>
              </el-form-item>
              <el-form-item>
                <el-col :span="12">
                  <a><span class="texts"><i class="el-icon-present" />{{ item.tableName }}</span></a>
                </el-col>
                <el-col :span="12">
                  <a><span class="texts"><i class="el-icon-coin" />{{ item.size }}</span></a>
                </el-col>
              </el-form-item>
              <el-form-item>
                <el-col :span="12">
                  <a><span class="texts"><i class="el-icon-reading" />{{ item.rows }}</span></a>
                </el-col>
                <el-col :span="12">
                  <a><span class="texts"><i class="el-icon-s-grid" />{{ item.cols }}</span></a>
                </el-col>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col style="background: #ffffff; padding-bottom: 24px;">
          <el-pagination
            :current-page="pageNum"
            :page-sizes="[10, 20, 30, 40, 50]"
            background
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-col>
      </el-row>
    </div>
    <!-- 添加列表对话框 -->
    <el-dialog title="添加列表" :visible.sync="dialogAddVisible" width="50%">
      <el-row>
        <el-col class="addLists" :span="18" :offset="3">
          <!-- link链接 -->
          <div class="Link">
            <el-form
              ref="form"
              label-position="right"
              :model="form"
              :rules="rules"
              label-width="100px"
            >
              <el-form-item label="探查任务名" prop="taskName">
                <el-input v-model="form.taskName" placeholder="请输入探查任务名" />
              </el-form-item>
              <el-form-item label="数据源" prop="sourceName">
                <el-select
                  v-model="form.sourceName"
                  placeholder="请选择数据源"
                  style="width: 100%;"
                  @change="schemaChange"
                >
                  <el-option
                    v-for="item in sourceList"
                    :key="item.id"
                    :label="item.datasourceName"
                    :value="item.datasourceName"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="数据库表名" prop="tableName">
                <el-select
                  v-model="form.tableName"
                  style="width: 100%;"
                  placeholder="请选择数据库表名"
                  :loading="tableLoading"
                >
                  <el-option
                    v-for="item in tableList"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="简介" prop="content">
                <el-input v-model="form.content" placeholder="简介" />
              </el-form-item>
              <el-form-item label="创建人名字" prop="name">
                <el-input v-model="form.name" disabled />
              </el-form-item>
              <el-form-item label="描述" prop="desc">
                <el-input v-model="form.desc" placeholder="描述" type="textarea" autosize />
              </el-form-item>
            </el-form>
          </div>
          <!-- githubURL -->
          <div v-if="isGitHub" class="Link">
            <h2>Import GitHub repository</h2>
            <p>
              Create a dataset from a GitHub repository archive. Use the repo URL
              or any deep link.
            </p>
            <span>GitHub URL</span><el-input
              v-model="newURL"
              placeholder="Enter a URL to add a new file"
            />
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
            <el-form
              ref="form"
              label-position="left"
              :model="form"
              label-width="120px"
            >
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
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取消</el-button>
        <el-button v-loading="confirmLoading" type="primary" @click="create">创建</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getList } from '@/api/datax-user';
import { list as jdbcDsList } from '@/api/datax-jdbcDatasource';
import { addList, getAllList, deleteData } from '@/api/data-explore';
// import { list } from '@/api/datax-jdbcDatasource'
import * as dsQueryApi from '@/api/metadata-query';

export default {
  name: 'Explore',
  computed: {
    ...mapGetters(['name'])
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
      listLoading: false,
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
      ObjList: [],
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
      rules: {
        taskName: [
          { required: true, message: '请输入任务名', trigger: 'blur' }
        ],
        sourceName: [
          { required: true, message: '请选择数据源', trigger: 'change' }
        ],
        tableName: [
          { required: true, message: '请选择数据库表名', trigger: 'change' }
        ],
        content: [
          { required: false, message: '请输入简介', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入创建人名字', trigger: 'blur' }
        ],
        desc: [
          { required: false, message: '请输入描述', trigger: 'blur' }
        ]
      },
      sourceList: [],
      tableList: [],
      isUpload: false,
      isLink: true,
      isGitHub: false,
      isList: false,
      isSet: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      /** 数据库表select loading */
      tableLoading: false,
      confirmLoading: false,
      dataLoading: false
    };
  },
  created() {
    this.fetchData();
    this.getAllData();
    if (localStorage.getItem('roles') === 'ROLE_ADMIN') {
      this.userName = localStorage
        .getItem('roles')
        .split('_')[1]
        .split('"')[0];
    } else {
      this.userName = JSON.parse(localStorage.getItem('roles'))[0];
    }
    if (localStorage.getItem('newData')) {
      if (JSON.parse(localStorage.getItem('newData')) !== this.ObjList) {
        this.ObjList = JSON.parse(localStorage.getItem('newData'));
      }
    }
    console.log(document.getElementsByClassName('el-pagination__total'));
  },
  watch: {
    dialogAddVisible(val) {
      if (!val) {
        this.$refs.form.resetFields()
      }
    }
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getList()
        .then(response => {
          console.log(response);
          this.list = response.content.data;
          this.listLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.listLoading = false
        });
    },
    // 获取全部数据
    getAllData() {
      this.dataLoading = true
      const obj = {
        keyword: this.search,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      getAllList(obj)
        .then(res => {
          console.log(res);
          if (res.code === 200) {
            this.ObjList = res.content.reverse();
            this.total = res.content.length;
            this.dataLoading = false
          }
        })
        .catch(err => {
          console.log(err);
          this.dataLoading = false
        });
    },
    gotoDetail(item) {
      console.log(this.$router);
      console.log(item);
      this.$router.push({
        path: '/dataExplore/details',
        query: item
      });
    },
    AddList() {
      this.getJdbcDs();
      this.form.name = JSON.parse(localStorage.getItem('roles'))[0]
      // this.form.name = JSON.parse(localStorage.getItem('userName'))
      // .split('_')[1]
      // .split('"')[0];
      this.dialogAddVisible = true;
    },
    closeDialog() {
      this.dialogAddVisible = false;
    },
    like(item) {
      const newValue = item.number;
      if (newValue === item.number) {
        item.number = item.number + 1;
      } else {
        item.number = item.number - 1;
      }
      console.log('124234');
    },
    showUpload() {
      this.isUpload = true;
      this.isLink = false;
      this.isGitHub = false;
    },
    showLink() {
      this.isUpload = false;
      this.isLink = true;
      this.isGitHub = false;
    },
    showGitHub() {
      this.isUpload = false;
      this.isLink = false;
      this.isGitHub = true;
    },
    showList() {
      this.isUpload = false;
      this.isLink = false;
      this.isGitHub = false;
      this.isList = true;
    },
    showSet() {
      this.isUpload = false;
      this.isLink = false;
      this.isGitHub = false;
      this.isList = false;
      this.isSet = true;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getAllData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getAllData();
    },
    // 创建
    create() {
      // const params = new FormData()
      // params.append('taskName', this.form.taskName)
      // params.append('tableName', this.form.tableName)
      // params.append('description', this.form.desc || '')
      // params.append('jdbcDatasourceId', this.sourceId)
      // params.append('intro', this.form.content)
      this.$refs.form.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          const params = {
            taskName: this.form.taskName,
            tableName: this.form.tableName,
            description: this.form.desc || '',
            jdbcDatasourceId: this.sourceId,
            intro: this.form.content
          };
          addList(params)
            .then(res => {
              console.log(res);
              if (res.code === 200) {
                this.dialogAddVisible = false;
                this.form = {};
                this.getAllData();
                this.$message.success('添加成功');
                this.confirmLoading = false
              }
            })
            .catch(error => {
              console.log(error);
              this.$message.error('添加失败');
              this.confirmLoading = false
            });
        } else {
          return false
        }
      })
    },
    // 获取数据源
    async getJdbcDs() {
      jdbcDsList({
        current: 1,
        size: 1000
      }).then(response => {
        const { records } = response;
        console.log(records);
        this.sourceList = records;
      });
      // list().then(res => {
      //   console.log(res)
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    // schema 切换
    schemaChange(e) {
      this.$set(this.form, 'sourceName', e)
      console.log(e);
      // 获取可用表
      this.getTables('rdbmsReader');
    },
    // 获取表名
    getTables(type) {
      if (type === 'rdbmsReader') {
        let obj = {};
        if (
          this.dataSource === 'postgresql' ||
          this.dataSource === 'greenplum' ||
          this.dataSource === 'oracle' ||
          this.dataSource === 'sqlserver'
        ) {
          obj = {
            tableSchema: this.form.sourceName
          };
          console.log(this.sourceList);
          for (let i = 0; i < this.sourceList.length; i++) {
            if (this.form.sourceName === this.sourceList[i].datasourceName) {
              // obj.append('datasourceId', this.sourceList[i].datasourceId)
              console.log();
              obj.datasourceId = this.sourceList[i].id;
            }
          }
        } else {
          obj = {};
          console.log(this.sourceList);
          for (let i = 0; i < this.sourceList.length; i++) {
            if (this.form.sourceName === this.sourceList[i].datasourceName) {
              // obj.append('datasourceId', this.sourceList[i].datasourceId)
              obj.datasourceId = this.sourceList[i].id;
            }
          }
          console.log(obj);
          this.sourceId = obj.datasourceId;
        }
        // 组装
        this.tableLoading = true
        dsQueryApi.getTables(obj).then(response => {
          if (response) {
            this.tableList = response;
            console.log(response);
            this.tableLoading = false
          }
        }).catch(_ => {
          this.tableLoading = false
        })
      }
    },
    // 只要文件上传成功, 都会调用这个函数
    handleSuccess(response, file, fileList) {
      console.log(response);
    },
    handleRemove(file, fileList) {
      this.fileList = [];
    },
    handlePreview(file, fileList) {
      console.log(file);
    },
    uploadFile(file) {
      console.log(file);
      file.name = file.file.name;
      this.fileList.push(file);
    },
    del(id) {
      deleteData(id)
        .then(res => {
          console.log(res);
          if (res.code === 200) {
            this.getAllData();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    open(id) {
      this.$confirm('您确定要删除该条探查任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.del(id);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    /**
     * @description: 重置
     */
    reSet() {
      this.search = ''
      this.getAllData()
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0;
  .head-container {
    overflow: hidden;
    background-color: #ffffff;
    padding: 0px;
    .box-card {
      box-shadow: inset 0px 5px 10px -8px rgba(0, 0, 0, 0.1);
      border: 0 !important;
      border-radius: 0;
      .left {
        float: left;
        width: 120px;
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
    background-color: transparent;
    overflow: hidden;
    margin: 20px 20px 0 20px;
    .search-bar {
      padding: 24px 24px 0 24px;
      background: #ffffff;

      >>> .el-form-item__label {
        font-weight: normal;
        font-size: 15px;
        line-height: 42px;
      }
    }
    .action-bar {
      padding: 0 24px;
      background: #ffffff;
    }
    .el-pagination {
      float: right;
      height: 30px;
      line-height: 30px;
      margin: 25px;
    }
  }

  .el-dialog {
    border-radius: 8px;
    .addLists {
      >>>.el-form-item__label {
        font-size: 15px;
      }
    }
  }
}

text {
  font-size: 30px;
  line-height: 46px;
}
.new-project {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  text-align: center;
  span {
    color: #c9c9c9;
    line-height: 206px;
  }
}
.new-project:hover {
  border: 1px dashed #3d5eff;
  span {
    color: #3d5eff;
  }
}
.forms {
  .el-form-item {
    margin-bottom: 0px !important;
  }
  >>> .el-form-item__label {
    font-weight: normal;
    color: #999999;
    line-height: 30px !important;
  }
  >>> .el-form-item__content {
    line-height: 30px !important;
  }
  .texts {
    color: #666666;
    display:block;
    text-overflow:ellipsis;
    overflow:hidden;
    white-space:nowrap;
    i {
      margin-right: 7px;
    }
  }
  .texts:hover {
    color: steelblue;
  }
}
>>> .el-card__header {
  border: 0 !important;
}
</style>
