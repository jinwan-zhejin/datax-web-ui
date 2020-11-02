<template>
  <el-dialog
    :title="isEditCombin.id===''? '新增':'编辑'"
    :visible.sync="SetCombinVisible"
    :before-close="closeDialog"
    class="set-combin"
    width="760px"
  >
    <el-row class="set-combin-inner">
      <el-col :span="8" class="set-combin-l">
        <el-row style="line-height: 32px">
          <el-col :span="7">数据源： </el-col>
          <el-col :span="17">
            <el-select
              v-model="dataOrigin"
              placeholder="请选择数据源"
              style="width: 100%"
              size="small"
              filterable
              :disabled="!dataOriginList.length"
              @change="changeDataOriginBase"
            >
              <el-option
                v-for="item in dataOriginList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row class="mt10">
          <el-input v-model="tableName" placeholder="请输入表名查询" size="small" class="input-with-select" @keyup.enter.native="searchTable">
            <el-button slot="append" size="small" icon="el-icon-search" @click="searchTable" />
          </el-input>
        </el-row>
        <el-row class="set-combin-l-b mt10">
          <vue-scroll>
            <el-tree
              v-if="changeSelect"
              :render-content="renderContent"
              :props="defaultProps"
              ref="tree"
              highlight-current
              empty-text=""
              :load="loadNodeTree"
              node-key="id"
              lazy
              @node-click="handleNodeClick"
            />
          </vue-scroll>
        </el-row>
      </el-col>
      <el-col :span="16" class="set-combin-r">
        <vue-scroll>
          <el-table
            :data="tableData"
            stripe
            style="width: 100%"
          >
            <el-table-column
              prop="sourceName"
              :show-overflow-tooltip="true"
              label="对应数据源"
            />
            <el-table-column
              prop="tablename"
              :show-overflow-tooltip="true"
              label="表名"
            />
            <el-table-column
              prop="fildname"
              :show-overflow-tooltip="true"
              label="字段名"
            />
            <el-table-column
              label="操作"
              width="80"
            >
              <template slot-scope="scope">
                <i class="table-icon-menu" @click="deleteRow(scope.$index,scope)"><svg-icon icon-class="删除" /></i>
              </template>
            </el-table-column>
          </el-table>
        </vue-scroll>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button type="info" size="small" @click="resetForm">取 消</el-button>
      <el-button type="danger" size="small" :loading="buttonLoading" @click="submitForm">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/jsx">
export default {
  name: '',
  components: {},
  props: ['setCombinVisible', 'isEditCombin'],
  data() {
    return {
      dataOriginList: [],
      dataOrigin: '',

      buttonLoading: false,
      tableData: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'typename',
        isLeaf: 'leaf',
        id: 'id'
      },
      tmpResolvephoto: '',
      tableName: '',
      changeSelect: false,
      currBaseId: '',
      crrrTableName: ''
    }
  },
  watch: {
    isEditCombin: {// 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        this.getAllDataSource();
        this.getData()
      },
      deep: true
    }
  },
  mounted: function() {

  },
  methods: {
    searchTable() {
      this.changeSelect = false;
      setTimeout(() => {
        this.changeSelect = true;
      }, 500);
    },
    getData() {
      this.$urlApi.dataStandard.getRelationShip({ dataElementId: this.isEditCombin.id }).then((res) => {
        this.tableData = res.data
      })
    },
    loadNodeTree(node, resolve) {
      let param = {};
      if (this.dataOrigin === '') {
        return
      }
      if (node.level === 0) {
        param = { id: this.currBaseId, pid: -2, searchName: this.tableName };
      } else {
        param = {
          pid: node.data.pid,
          id: node.data.id,
          name: node.data.name
        };
      }
      this.$urlApi.dataStandard.getDataTreeById(param).then((res) => {
        if (res.code === '200') {
          res.data.forEach(et => {
            et.children = [];
            if (et.isParent === 'true') {
              et.leaf = false;
            } else {
              et.leaf = true;
            }
          });
          resolve(res.data);
          this.tmpResolvephoto = resolve;
        } else {
          this.$message({
            'message': res.message,
            'type': 'warning'
          })
        }
      })
    },
    getAllDataSource() {
      this.$urlApi.dataStandard.getDataTreeById({ pid: -1 }).then((res) => {
        this.dataOriginList = res.data
      })
    },
    changeDataOriginBase(cb) {
      this.currBaseId = cb;
      this.changeSelect = false;
      setTimeout(() => {
        this.changeSelect = true;
      }, 500);
    },
    handleNodeClick(data, node) {
      let check = true;
      if (!data.bind && node.level === 2) {
        this.tableData.forEach((item) => {
          if (item.fildname === data.name) {
            if (item.tablename === data.pname) {
              if (item.sourceName === data.sourceName) {
                check = false;
              }
            }
          }
        });
        if (check) {
          this.tableData.push({
            sourceId: data.sourceId,
            sourceName: data.sourceName,
            tablename: data.pname,
            fildname: data.name
          })
        }
      }
    },
    deleteRow(num, scope) {
      this.$urlApi.dataStandard.checkDelete({ elementId: this.isEditCombin.id, sourceId: scope.row.sourceId, tableName: scope.row.tablename, column: scope.row.fildname }).then((res) => {
        this.tableData.splice(num, 1)
      })
    },
    renderContent(h, { node, data, store }) {
      const nodeItem = // 第一级
                    <span class='nodeItem'>
                      <span>
                        <span class='node-label' title={ node.label }>{ node.label }</span>
                      </span>
                    </span>;
      const nodeItemContent = // 第二级
                    <span class='nodeItem'>
                      <span>
                        <span class='node-label' title={ node.label }>{ node.label }</span>
                        <span class='nodeOptDetail'>
                          <el-tooltip class='item' effect='dark' content='解除绑定' placement='top'>
                            <el-button type='text' size='mini' on-click={ () => this.removeRelation(data, node, h) }><svg-icon iconClass='分享'></svg-icon></el-button>
                          </el-tooltip>
                        </span>
                      </span>
                    </span>;
      if (node.level === 1) {
        return nodeItem;
      } else {
        if (data.bind) {
          return nodeItemContent;
        } else {
          return nodeItem;
        }
      }
    },
    submitForm() {
      this.$urlApi.dataStandard.saveRelation({ dataElementId: this.isEditCombin.id, relationJson: JSON.stringify(this.tableData) }).then((res) => {
        this.$emit('SetCombinBack', 0);
        this.tableData = [];
        this.changeSelect = false;
        this.dataOrigin = '';
      })
    },
    removeRelation(data, node, h) {
      const grandnode = this.$refs.tree.getNode(data.pid);
      const param = {
        dataSoureId: data.sourceId,
        tableName: data.pname,
        column: data.name
      };
      this.$urlApi.dataStandard.checkDelete({ elementId: this.isEditCombin.id, sourceId: data.sourceId, tableName: data.pname, column: data.name }).then((res) => {
        this.$urlApi.dataStandard.unbindRelation(param).then((res) => {
          this.loadNodeTree(grandnode, this.tmpResolvephoto)
          this.$message({
            message: '解除绑定成功',
            type: 'success'
          })
        })
      })
    },
    resetForm() {
      this.$emit('SetCombinBack', 0);
      this.tableData = [];
      this.changeSelect = false;
      this.dataOrigin = '';
    },
    closeDialog() {
      this.tableData = [];
      this.changeSelect = false;
      this.dataOrigin = '';
      this.$emit('SetCombinBack', 0);
    }
  }
}
</script>

<style lang="scss">
    .set-combin{
        .el-dialog__body{
            padding: 13px 20px;
            .set-combin-inner{
                height: 440px;
                .set-combin-l{
                    height: 100%;
                    border-right: 1px solid #eee;
                    padding: 10px;
                    .set-combin-l-b{
                        height:-moz-calc(100% - 88px);
                        height:-webkit-calc(100% - 88px);
                        height: calc(100% - 88px);
                        .nodeItem {
                            font-size: 12px;
                            width: 100%;
                            position: relative;
                            .node-label {
                                display: inline-block;
                                width: 160px;
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                .node-icon{
                                    margin-right: 5px;
                                    font-size: 14px;
                                }
                            }
                            .node-label:hover {
                                display: inline-block;
                            }
                            .nodeOpt {
                                display: none!important;
                                float: right;
                                position: relative;
                                top: -2px;
                                font-size: 14px;
                                font-weight: bold;
                            }
                            .nodeOptDetail {
                                display: none;
                                position: absolute;
                                right: 0;
                                top: -4px;
                                height: 26px;
                                line-height: 26px;
                                font-size: 14px;
                                background:rgba(51,55,67,.7);
                                border-radius: 2px;
                                cursor: default;
                                padding: 0 8px;
                                .el-button{
                                    color: #ffffff;
                                }
                            }
                        }
                        .nodeItem:hover .nodeOptDetail {
                            display: inline-block!important;
                            text-align: right;
                        }
                    }
                }
                .set-combin-r{
                    height: 100%;
                    padding: 10px;
                }
            }
        }

    }
</style>
