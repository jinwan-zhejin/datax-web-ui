<template>
  <div class="Management">
    <div class="lt">
      <div class="top">
        <el-row>
          <el-col :span="12">
            <el-select v-model="selectValue" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-col>
          <el-col :span="12">
            <i class="el-icon-location-outline" />
            <i class="el-icon-coin" />
            <i class="el-icon-folder-add" />
          </el-col>
        </el-row>
      </div>
      <div class="bottom">
        <div class="title">
          任务
        </div>
        <div class="body">
          <el-input v-model="search" prefix-icon="el-icon-search" placeholder="请输入内容">
            <template slot="append">我的</template>
          </el-input>
          <div class="list">
            <ul>
              <li v-for="item in List" :key="item.name" @click="getList(item)">
                <a>{{ item.name }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="rg">
      <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit" @tab-click="changeTab">
        <el-tab-pane
          v-for="(item) in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
          :closable="editableTabsValue !== '1'"
        >
          <Flow :is-save="item" @fromChild="getChild" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Flow from './components/flow.vue'
import * as jobProjectApi from '@/api/datax-job-project'
export default {
  name: '',
  components: {
    // HelloWorld,
    Flow
  },
  data() {
    return {
      editableTabsValue: '1',
      editableTabsName: '123',
      editableTabs: [{
        title: 'Untitled',
        name: '1'
      }],
      tabIndex: 1,
      options: [
        {
          value: '开水白菜',
          label: '开水白菜'
        },
        {
          value: '广式早茶',
          label: '广式早茶'
        },
        {
          value: '煲仔饭',
          label: '煲仔饭'
        },
        {
          value: '胡辣汤',
          label: '胡辣汤'
        },
        {
          value: '三不沾',
          label: '三不沾'
        }
      ],
      selectValue: '',
      search: '',
      List: [
        {
          name: 'demo01',
          data: 'Json'
        }
      ],
      listQuery: {
        pageNo: 1,
        pageSize: 100,
        searchVal: ''
      }
    }
  },
  created() {
    this.getItem()
  },
  mounted() {
  },
  methods: {
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        const newTabName = ++this.tabIndex + ''
        this.editableTabs.push({
          title: 'Untitled',
          name: newTabName,
          content: 'New Tab content'
        });
        this.editableTabsValue = newTabName
      }
      if (action === 'remove') {
        const tabs = this.editableTabs
        let activeName = this.editableTabsValue
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        this.editableTabsValue = activeName
        this.editableTabs = tabs.filter(tab => tab.name !== targetName)
      }
    },
    changeTab(e) {
      this.editableTabsName = e.label
      console.log(this.editableTabsValue)
    },
    getChild(v) {
      console.log(v)
      for (let i = 0; i < this.editableTabs.length; i++) {
        if (this.editableTabs[i].name === v.index) {
          this.editableTabs[i].title = v.name
          this.pushList(v)
        }
      }
    },
    pushList(val) {
      this.List.push({
        name: val.name,
        data: val.data
      })
    },
    getList(data) {
      console.log(data)
      for (let i = 0; i < this.editableTabs.length; i++) {
        if (this.editableTabs[i].title === data.name) {
          this.editableTabsValue = this.editableTabs[i].name
        } else {
          this.editableTabs.push({
            title: data.name,
            name: toString(this.editableTabs.length + 1)
          })
        }
      }
    },
    getItem() {
      jobProjectApi.list(this.listQuery).then(response => {
        const { records } = response
        const { total } = response
        this.total = total
        this.options = records
        this.selectValue = this.options[0].name
      })
    }
  }
}
</script>

<style lang="scss">
.Management {
  display: flex;
  height: 100%;
  .lt {
    width: 280px;
    height: 100%;
    .top {
      height: 60px;
      line-height: 60px;
      .el-row {
        .el-col {
          i {
            cursor: pointer;
            margin-left: 20px;
          }
          .el-select {
            .el-input__inner {
              border: none;
            }
          }
        }
      }
    }
    .bottom {
      height: 100%;
      .title {
        border-top: 1px solid #f8f8f8;
        height: 35px;
        line-height: 35px;
        text-align: center;
      }
      .body {
        border-top: 1px solid #f8f8f8;
        padding: 20px;
        .list {
          ul {
            padding: 0px;
            li {
              height: 40px;
              line-height: 40px;
              background-color: rgb(218, 243, 253);
              text-align: left;
              list-style: none;
              text-indent: 2rem;
              margin: 5px 0px;
              cursor: pointer;
              a {
                color: rgb(199, 199, 199);
              }
            }
          }
        }
      }
    }
  }
  .rg {
    width: 100%;
    height: 100%;
    flex: 1;
    .el-tabs {
      .el-tab-pane {
        padding: 10px;
      }
    }
  }
}
</style>
