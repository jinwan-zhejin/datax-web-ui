el-input<!--
 * @Date: 2020-09-24 10:38:26
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-09-25 16:17:27
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\index.vue
 * @Description: 元数据管理-apache atlas
-->

<template>
  <div ref="container" class="container">
    <el-container style="height: 100%;">
      <el-aside width="30%" class="left-container">
        <!-- <div class="leftBtn">
          <el-button type="warning" icon="el-icon-plus" circle size="mini" @click="openWin = true" />
          <el-button type="warning" icon="el-icon-folder" circle size="mini" />
        </div> -->
        <label class="searchLabel">搜索</label>
        <el-input v-model="tableSearchForm" style="padding: 5px 0;" prefix-icon="el-icon-search" placeholder="输入表名搜索" clearable />
        <!-- <el-tree :props="props" :load="loadNode" lazy :render-content="renderContent" /> -->
        <el-collapse v-model="collapseActiveName">
          <div v-for="(item, index) in collapseList" :key="index">
            <el-collapse-item :name="index+1">
              <div slot="title" class="collapse-title">
                <div>
                  {{ item.collapseName }}
                  <el-tooltip content="刷新" placement="top">
                    <el-button type="text" plain size="medium" @click="test(item.collapseName)">
                      <i class="el-icon-refresh" style="font-size:18px;" />
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="显示空服务类型" placement="top">
                    <el-button type="text" plain size="medium" @click="test(item.collapseName)">
                      <i class="el-icon-turn-off" style="font-size:20px;" />
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="更多" placement="top">
                    <el-button type="text" plain size="medium">
                      <el-dropdown trigger="click" placement="bottom-start" :hide-on-click="false" @click.stop.native>
                        <span class="el-dropdown-link">
                          <i class="el-icon-more" style="font-size:18px;-moz-transform:rotate(-90deg);-webkit-transform:rotate(-90deg);" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="item.showFlat = !item.showFlat">
                            <i :class="{'el-icon-s-operation':item.showFlat, 'el-icon-s-grid':!item.showFlat}" style="color:#409EFF;font-weight:bold;" />{{ item.showFlat?'Show flat tree':'Show group tree' }}
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <i class="el-icon-download" style="color:#409EFF;font-weight:bold;" />Download Import template
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <i class="el-icon-upload2" style="color:#409EFF;font-weight:bold;" />Import Business Metadata
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-button>
                  </el-tooltip>
                </div>
              </div>
              <el-tree :data="item.collapseData" :props="defaultProps" @node-click="handleNodeClick" />
            </el-collapse-item>
          </div>
        </el-collapse>
      </el-aside>
      <el-container>
        <!-- <el-header>Header</el-header> -->
        <!-- <el-main>Main</el-main> -->
        <el-main class="right-container">
          <div id="create">
            <el-button type="success" plain size="medium" icon="el-icon-circle-plus" @click="createDialogShow = true">新建实体</el-button>
          </div>
          <div id="searchBar">
            <el-input size="medium" prefix-icon="el-icon-search" placeholder="搜索实体" clearable>
              <i slot="suffix" class="el-input__icon el-icon-caret-bottom" style="cursor: pointer;" @click="showSearchCard = !showSearchCard" />
            </el-input>
          </div>
          <transition name="el-zoom-in-top">
            <div id="searchBarCard">
              <el-card v-show="showSearchCard" shadow="always" class="card-text">
                <el-row style="margin-bottom: 15px;">
                  <span style="line-height: 32px;">
                    Advanced<i class="el-icon-question" style="cursor: pointer;" @click="test" />
                  </span>
                  <el-button style="float:right; position:relative;" size="mini" type="success" plain @click="test">
                    <i class="el-icon-refresh" />
                  </el-button>
                </el-row>
                <el-row>
                  Search By Type
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-select v-model="dataBaseType" size="small" filterable placeholder="请选择">
                      <el-option
                        v-for="item in dataBaseTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-col>
                </el-row>
                <el-row>
                  Search By Query
                </el-row>
                <el-row :span="24">
                  <el-input v-model="searchByQuery" placeholder="Search By Query eg.where name=&quot;sales_fact&quot;" />
                </el-row>
                <el-row style="margin-top: 15px;">
                  <el-button type="success">Clear</el-button>
                  <el-button style="float:right; position:relative;" type="success">Search</el-button>
                </el-row>
              </el-card>
            </div>
          </transition>
        </el-main>
      </el-container>
    </el-container>
    <CreateNewLink :open-win="openWin" @close="openWin = false" />
    <el-dialog width="60%" :visible.sync="createDialogShow" :show-close="true">
      <div slot="title" class="dialog-title">
        新建实体
      </div>
      <el-row>
        <el-col :span="24">
          <el-select v-model="dataBaseType" size="small" filterable placeholder="请选择实体">
            <el-option
              v-for="item in dataBaseTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col v-if="dataBaseType !== ''" :span="24" style="margin-top:15px;">
          <el-switch
            v-model="chooseRequire"
            style="position: relative;float:right;"
            active-text="所有选项"
            inactive-text="所需选项"
          />
        </el-col>
      </el-row>
      <el-row style="margin-top:15px;">
        属性
        <el-col :span="24">
          <div id="attributes" class="form-ring">
            <el-form>
              <el-form-item label="集群名称(string)">
                <el-input placeholder="集群名称"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px;">
        关系
        <el-col :span="24">
          <div id="relationships" class="form-ring">
            123
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createDialogOnClose">取消</el-button>
        <el-button type="primary" @click="createDialogOnSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import CreateNewLink from './components/createLink';
export default {
  name: 'Dbeaver',
  components: {
    CreateNewLink
  },
  data() {
    return {
      tableSearchForm: '', // 根据表名搜索表
      collapseActiveName: [], // collapse手风琴
      createDialogShow: false, // 创建实体dialog显示
      createEntityAttributes: {
        clusterName: '',
        createTime: '',
        description: '',
        DisplayName: '',
        extendedAttributes: '',
        fileSize: '',
        group: '',
        isFile: '', // boolean
        isSymlink: '', // boolean
        modifiedTime: '',
        name: '',
        nameServiceId: '',
        numberOfReplicas: '',
        owner: '',
        path: '',
        posixPermission: '',
        qualifiedName: '',
        replicatedFrom: '',
        replicatedTo: '',
        userDescription: ''
      },
      createEntityRelationships: {
        inputToProcesses: '',
        meanings: '',
        model: '',
        outputFromProcesses: '',
        pipline: '',
        schema: ''
      },
      chooseRequire: false,
      searchByQuery: '', // card查找
      showSearchCard: false, // 搜索Card
      dataBaseType: '', // 搜索Card -select
      dataBaseTypeOptions: [{ // 搜索Card -select options
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      collapseList: [ // 折叠面板
        {
          collapseName: 'Entities',
          collapseData: [
            {
              label: '11',
              children: [
                {
                  label: '12'
                }
              ]
            },
            {
              label: '11',
              children: [
                {
                  label: '12'
                }
              ]
            }
          ],
          showFlat: true,
          collapseButtons: {
            refresh: true,
            switch: true,
            more: true,
            openTab: false,
            showAll: false
          },
          dropdownButtons: {
            showTree: true,
            download: true,
            import: true
          }
        },
        {
          collapseName: 'Classifications',
          collapseData: [
            {
              label: '21',
              children: [
                {
                  label: '22'
                }
              ]
            },
            {
              label: '11',
              children: [
                {
                  label: '12'
                }
              ]
            }
          ],
          showFlat: true
        },
        {
          collapseName: 'Business Metadata',
          collapseData: [
            {
              label: '31',
              children: [
                {
                  label: '32'
                }
              ]
            },
            {
              label: '11',
              children: [
                {
                  label: '12'
                }
              ]
            }
          ],
          showFlat: true
        },
        {
          collapseName: 'Glossaries',
          collapseData: [
            {
              label: '41',
              children: [
                {
                  label: '42'
                }
              ]
            },
            {
              label: '11',
              children: [
                {
                  label: '12'
                }
              ]
            }
          ],
          showFlat: true
        },
        {
          collapseName: 'Custom Filters',
          collapseData: [
            {
              label: '51',
              children: [
                {
                  label: '52'
                }
              ]
            },
            {
              label: '11',
              children: [
                {
                  label: '12'
                }
              ]
            }
          ],
          showFlat: true
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      openWin: false,
      props: {
        label: 'datasourceName',
        children: 'zones',
        isLeaf: 'leaf'
      }
    };
  },
  mounted() {
    // 设置容器高度
    this.containerHeight = this.$refs.container.parentElement.offsetHeight - 10;
  },
  created() {
    for (var i = 0; i < this.collapseList.length; i++) {
      this.collapseActiveName.push(i + 1)
    }
  },
  methods: {
    test(info) {
      console.log(info)
    },
    handleNodeClick() {
      console.log(123)
    },
    /**
     * @description: 创建实体dialog关闭/取消
     */
    createDialogOnClose() {
      this.dataBaseType = ''
      this.createDialogShow = false
    },
    /**
     * @description: 创建实体dialog提交
     */
    createDialogOnSubmit() {
      // do something
      this.dataBaseType = ''
      this.createDialogShow = false
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  padding: 15px;
}
.left-container {
  background-color: transparent;
  border-right: 1px solid rgb(209, 204, 204);
  // border-radius: 5px;
  padding: 5px;
  /* min-height: 705px; */
  text-align: left;
  font-family: Arial, Helvetica, sans-serif;
  >>>.el-collapse-item__header {
    color: #409EFF;
    font-size: 15px;
    font-weight: bold;
    flex: 1 0 auto;
    order: -1;
  }
  .el-button {
    color: #409EFF;
    right: 5px;
  }
  .collapse-title {
    flex: 1 0 100%;
    order: 1;
  }
  .searchLabel {
    font-size: 18px;
    font-weight: normal;
    color: dimgray;
  }
}
.right-container {
  #create {
    .el-button {
      z-index: 999;
      position: absolute;
      top: 10px;
      right: 10px;
    }
    ::v-deep .el-button--success {
      color:  #409EFF;
      background-color:#fff;
      border-color: #409EFF;
    }
    ::v-deep .el-button--success:hover {
      color:  #fff;
      background-color:#409EFF;
      border-color: #409EFF;
    }
  }
  #searchBar {
    position: relative;
    top: 40%;
    transform: translateY(-40%);
    .el-input {
      ::v-deep .el-input__inner {
        height: 52px;
        line-height:52px;
      }
    }
  }
  #searchBarCard {
    position: relative;
    top: 55%;
    transform: translateY(-55%);
    .el-card {
      .el-row {
        ::v-deep .el-button--success {
          font-size: 16px;
          font-weight: bold;
          color:  #409EFF;
          background-color:#fff;
          border-color: #409EFF;
        }
        ::v-deep .el-button--success:hover {
          color:  #fff;
          background-color:#409EFF;
          border-color: #409EFF;
        }
        .el-col {
          ::v-deep .el-select {
            width: 100%;
          }
        }
      }
    }
    .card-text {
      font-size: 14px;
    }
  }
}
.leftBtn {
  text-align: right;
  padding-bottom: 2px;
  padding-right: 10px;
}
.el-dialog {
  .el-row {
    .el-col {
      ::v-deep .el-select {
        width: 100%;
      }
    }
  }
}
.form-ring {
  margin-top: 5px;
  width: 100%;
  padding: 15px;
  border-style: dashed;
  border-radius: 20px;
  // border:3px solid rgba(201, 201, 201, 0.7);
  border-color: rgba(201, 201, 201, 0.7);
}
</style>
