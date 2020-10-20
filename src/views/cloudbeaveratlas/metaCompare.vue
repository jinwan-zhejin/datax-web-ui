<!--
 * @Date: 2020-09-24 10:38:26
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-10-19 19:55:04
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\metaCompare.vue
 * @Description: 元数据管理-apache atlas
-->

<template>
  <div>
    <el-tabs v-model="compareType" style="margin-top: 20px; margin-left: 20px" @tab-click="handleClick">
      <el-tab-pane label="时间版本比对" name="time">
        <div class="filter-container">
          <el-input v-model="listQuery.entityName" placeholder="全部" style="width: 200px" />
          <el-select v-model="listQuery.entityType" placeholder="Entity类型">
            <el-option v-for="item in executorList" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
          <el-input v-model="listQuery.entityName" placeholder="任务提交时间From" style="width: 200px" />
          <el-input v-model="listQuery.entityName" placeholder="任务提交时间To" style="width: 200px" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">
            搜索
          </el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handlerDelete">
            清除
          </el-button>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="id" label="任务id" min-width="75" />
          <!-- <el-table-column prop="entityName" label="Entity名称" width="160" />
        <el-table-column prop="entityType" label="Entity类型" width="160" /> -->
          <el-table-column label="基线时间" min-width="160">
            <template v-slot:default="{ row }">
              {{ row.timestamp1 | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="待比较时间" min-width="160">
            <template v-slot:default="{ row }">
              {{ row.timestamp2 | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="任务提交时间" min-width="160" sortable />
          <!-- <el-table-column prop="progress" label="比较进度" width="120" sortable align="center" /> -->
          <el-table-column label="操作" min-width="100">
            <template v-slot:default="{ row }">
              <el-button type="text" size="small" @click="getDetails(row.id)">查看比对结果</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="空间版本比对" name="dimen">空间版本比对</el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="dialogVisible" width="75%">
      <el-row>
        <el-col :span="12">
          <!-- <span v-html="compare.params1" /> -->
          <el-form>
            <el-form-item>
              <span>{{ compare.params1 }}</span>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <span v-html="compare.params2" />
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import * as apiatlas from '@/api/datax-metadata-atlas'

export default {
  name: 'MetaCompare',
  filters: {
    formatDate(val) {
      const date = new Date(val);
      const y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? ('0' + MM) : MM;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let m = date.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      let s = date.getSeconds();
      s = s < 10 ? ('0' + s) : s;
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s + ' (CST)';
    }
  },
  data() {
    return {
      listQuery: {},
      tableData: '', // 所有记录
      dialogVisible: true,
      compare: {
        params1: '{"relationshipAttributes":{"db":{"guid":"f2e53e7b-dc67-4417-85b4-dc89cf3ef7bf"}},"provenanceType":0,"classifications":[{"removePropagationsOnEntityDelete":false,"entityStatus":"ACTIVE","typeName":"MYSQL_FINANCE","entityGuid":"781222c4-be96-4d4f-a3ce-b9a5244ad548","propagate":true,"validityPeriods":[]},{"removePropagationsOnEntityDelete":false,"entityStatus":"ACTIVE","typeName":"MYSQL_CLASSIFIED","entityGuid":"781222c4-be96-4d4f-a3ce-b9a5244ad548","propagate":true,"validityPeriods":[],"attributes":{"tag":"test"}}],"proxy":false,"typeName":"mysql_test3_table","guid":"781222c4-be96-4d4f-a3ce-b9a5244ad548","attributes":{"charset":"{\"displayName\":\"utf8mb4\",\"description\":\"UTF-8 Unicode\"}","maxDataLength":"0","avgRowLength":"0","qualifiedName":"jdbc:mysql://192.168.72.139:3306/gulimall_oms.mq_message","dataLength":"16K","autoIncrement":0,"description":"","dataFree":"0","updateTime":"2020-10-13 11:39:24","indexLength":"0","engine":"{\"displayName\":\"InnoDB\",\"description\":\"Supports transactions, row-level locking, and foreign keys\"}","createTime":"2020-08-23 21:29:23.0","rowFormat":"Dynamic","name":"mq_message","collation":"{\"displayName\":\"utf8mb4_general_ci\"}","rowCount":0},"version":0,"isIncomplete":false}', // json1
        params2: '{"relationshipAttributes":{"db":{"guid":"f2e53e7b-dc67-4417-85b4-dc89cf3ef7bf"}},"provenanceType":0,"classifications":[{"removePropagationsOnEntityDelete":false,"entityStatus":"ACTIVE","typeName":"MYSQL_FINANCE","entityGuid":"781222c4-be96-4d4f-a3ce-b9a5244ad548","propagate":true,"validityPeriods":[]},{"removePropagationsOnEntityDelete":false,"entityStatus":"ACTIVE","typeName":"MYSQL_CLASSIFIED","entityGuid":"781222c4-be96-4d4f-a3ce-b9a5244ad548","propagate":true,"validityPeriods":[],"attributes":{"tag":"test"}}],"proxy":false,"typeName":"mysql_test3_table","guid":"781222c4-be96-4d4f-a3ce-b9a5244ad548","attributes":{"charset":"{\"displayName\":\"utf8mb4\",\"description\":\"UTF-8 Unicode\"}","maxDataLength":"0","avgRowLength":"0","qualifiedName":"jdbc:mysql://192.168.72.139:3306/gulimall_oms.mq_message","dataLength":"16K","autoIncrement":0,"description":"","dataFree":"0","updateTime":"2020-10-13 11:39:24","indexLength":"0","engine":"{\"displayName\":\"InnoDB\",\"description\":\"Supports transactions, row-level locking, and foreign keys\"}","createTime":"2020-08-23 21:29:23.0","rowFormat":"Dynamic","name":"mq_message","collation":"{\"displayName\":\"utf8mb4_general_ci\"}","rowCount":0},"version":0,"isIncomplete":false}', // json1
        // params2: '', // json2
        difference: '' // 不同
      },
      activeNames: 'metaJobs',
      compareType: 'time',
      searchTreeList: '',
      identChar: 0,
      taskList: [{
        label: '浙江省发改委数据仓 (3)',
        children: [{
          label: '人口库比对'
        },
        {
          label: '工商库比对'
        },
        {
          label: '经营信息库比对'
        }
        ]
      },
      {
        label: '快速入门 (2)',
        children: [{
          label: 'DataElit测试库和生产库比对'
        },
        {
          label: 'DataElit开发库和测试库比对'
        }
        ]
      }
      ]
    }
  },
  watch: {

  },
  mounted() {

  },
  created() {
    // 调用接口必须先登录
    this.refreshTable()
  },
  methods: {
    handleChange() {

    },
    handleNodeClick(data) {
      console.log(data);
    },
    handleClick() {

    },
    /**
     * @description: 获取所有比对记录
     */
    async refreshTable() {
      const res = await apiatlas.getAllCompareRecord()
      // console.log(res)
      if (res.code === 200) {
        this.tableData = res.content
        console.log(this.tableData)
      } else {
        this.$message({
          message: '获取所有比对记录失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
    },
    /**
     * @description: 获取比对
     */
    async getDetails(id) {
      const res = await apiatlas.getOneCompareRecord(id)
      if (res.code === 200) {
        // this.compare.params2 = JSON.parse(res.content.substring(res.content.indexOf('{json2=') + '{json2='.length, res.content.indexOf(', json1=')))
        // this.compare.params1 = JSON.parse(res.content.substring(res.content.indexOf(', json1=') + ', json1='.length, res.content.indexOf(', contrast')))
        this.compare.params2 = res.content.substring(res.content.indexOf('{json2=') + '{json2='.length, res.content.indexOf(', json1='))
        this.compare.params1 = res.content.substring(res.content.indexOf(', json1=') + ', json1='.length, res.content.indexOf(', contrast'))
        this.compare.difference = res.content.substring(res.content.indexOf(', contrast=') + ', contrast='.length, res.content.length - 1).replace('null', '')
        console.log(this.compare);
        this.compare.params1 = this.formatJson(this.compare.params1)
        this.dialogVisible = true
      } else {
        this.$message({
          message: '获取该比对记录失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
    },
    // 格式方法
    // 公共方法
    transitionJsonToString(jsonObj, callback) {
    // 转换后的jsonObj受体对象
      var _jsonObj = null;
      // 判断传入的jsonObj对象是不是字符串，如果是字符串需要先转换为对象，再转换为字符串，这样做是为了保证转换后的字符串为双引号
      if (Object.prototype.toString.call(jsonObj) !== '[object String]') {
        try {
          _jsonObj = JSON.stringify(jsonObj);
        } catch (error) {
          // 转换失败错误信息
          console.error('您传递的json数据格式有误，请核对...');
          console.error(error);
          callback(error);
        }
      } else {
        try {
          jsonObj = jsonObj.replace(/(\')/g, '\"');
          _jsonObj = JSON.stringify(JSON.parse(jsonObj));
        } catch (error) {
          // 转换失败错误信息
          console.error('您传递的json数据格式有误，请核对...');
          console.error(error);
          callback(error);
        }
      }
      return _jsonObj;
    },
    // callback为数据格式化错误的时候处理函数
    formatJson(jsonObj, callback) {
    // 正则表达式匹配规则变量
      // eslint-disable-next-line no-unused-vars
      var reg = null;
      // 转换后的字符串变量
      var formatted = '';
      // 换行缩进位数
      var pad = 0;
      // 一个tab对应空格位数
      var PADDING = '    ';
      // json对象转换为字符串变量
      var jsonString = this.transitionJsonToString(jsonObj, callback);
      if (!jsonString) {
        return jsonString;
      }
      // 存储需要特殊处理的字符串段
      var _index = [];
      // 存储需要特殊处理的“再数组中的开始位置变量索引
      var _indexStart = null;
      // 存储需要特殊处理的“再数组中的结束位置变量索引
      var _indexEnd = null;
      // 将jsonString字符串内容通过\r\n符分割成数组
      var jsonArray = [];
      // 正则匹配到{,}符号则在两边添加回车换行
      jsonString = jsonString.replace(/([\{\}])/g, '\r\n$1\r\n');
      // 正则匹配到[,]符号则在两边添加回车换行
      jsonString = jsonString.replace(/([\[\]])/g, '\r\n$1\r\n');
      // 正则匹配到,符号则在两边添加回车换行
      jsonString = jsonString.replace(/(\,)/g, '$1\r\n');
      // 正则匹配到要超过一行的换行需要改为一行
      jsonString = jsonString.replace(/(\r\n\r\n)/g, '\r\n');
      // 正则匹配到单独处于一行的,符号时需要去掉换行，将,置于同行
      jsonString = jsonString.replace(/\r\n\,/g, ',');
      // 特殊处理双引号中的内容
      jsonArray = jsonString.split('\r\n');
      jsonArray.forEach(function(node, index) {
        // 获取当前字符串段中"的数量
        var num = node.match(/\"/g) ? node.match(/\"/g).length : 0;
        // 判断num是否为奇数来确定是否需要特殊处理
        if (num % 2 && !_indexStart) {
          _indexStart = index
        }
        if (num % 2 && _indexStart && _indexStart !== index) {
          _indexEnd = index
        }
        // 将需要特殊处理的字符串段的其实位置和结束位置信息存入，并对应重置开始时和结束变量
        if (_indexStart && _indexEnd) {
          _index.push({
            start: _indexStart,
            end: _indexEnd
          })
          _indexStart = null
          _indexEnd = null
        }
      })
      // 开始处理双引号中的内容，将多余的"去除
      _index.reverse().forEach(function(item, index) {
        var newArray = jsonArray.slice(item.start, item.end + 1)
        jsonArray.splice(item.start, item.end + 1 - item.start, newArray.join(''))
      })
      // 奖处理后的数组通过\r\n连接符重组为字符串
      jsonString = jsonArray.join('\r\n');
      // 将匹配到:后为回车换行加大括号替换为冒号加大括号
      jsonString = jsonString.replace(/\:\r\n\{/g, ':{');
      // 将匹配到:后为回车换行加中括号替换为冒号加中括号
      jsonString = jsonString.replace(/\:\r\n\[/g, ':[');
      // 将上述转换后的字符串再次以\r\n分割成数组
      jsonArray = jsonString.split('\r\n');
      // 将转换完成的字符串根据PADDING值来组合成最终的形态
      jsonArray.forEach(function(item, index) {
        console.log(item)
        var i = 0;
        // 表示缩进的位数，以tab作为计数单位
        var indent = 0;
        // 表示缩进的位数，以空格作为计数单位
        var padding = '';
        if (item.match(/\{$/) || item.match(/\[$/)) {
          // 匹配到以{和[结尾的时候indent加1
          indent += 1
        } else if (item.match(/\}$/) || item.match(/\]$/) || item.match(/\},$/) || item.match(/\],$/)) {
          // 匹配到以}和]结尾的时候indent减1
          if (pad !== 0) {
            pad -= 1
          }
        } else {
          indent = 0
        }
        for (i = 0; i < pad; i++) {
          padding += PADDING
        }
        formatted += padding + item + '\r\n'
        pad += indent
      })
      // 返回的数据需要去除两边的空格
      return formatted.trim();
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
    padding: 15px;
}

.left-container {
    overflow-x: hidden;
    overflow-y: hidden;
    height: 100%;
    background-color: transparent;
    border-right: 1px solid rgb(209, 204, 204);
    padding: 5px;
    text-align: left;
    font-family: Arial, Helvetica, sans-serif;

    .topSearch {
        height: 79px;

        .searchLabel {
            font-size: 18px;
            font-weight: normal;
            color: dimgray;
        }
    }

    .el-collapse {
        height: calc(100vh - 219px);
        overflow-y: auto;

        ::v-deep .el-collapse-item__header {
            color: #409EFF;
            font-size: 15px;
            font-weight: bold;
            flex: 1 0 auto;
            order: -1;

            .collapse-title {
                flex: 1 0 100%;
                order: 1;
            }
        }
    }

    .el-button {
        color: #409EFF;
        right: 5px;
    }

    ::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        background-color: #409EFF;
        color: white;
    }

    ::v-deep .el-tree-node__content:hover {
        background-color: #d9e6fd;
        // color: #fff;
    }
}

.right-container {
    height: calc(100vh - 132px);
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
