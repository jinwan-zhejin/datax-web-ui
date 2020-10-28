<template>
  <div class="header">
    <el-tabs
      v-model="editableTabsValue"
      :editable="true"
      type="card"
      closable
      @tab-remove="removeTab"
      @edit="handleTabsEdit"
    >
      <el-tab-pane
        v-for="(item) in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <DataDevContent />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DataDevContent from './content';
export default {
  // name: "HeaderTabs",
  components: {
    DataDevContent
  },
  data() {
    return {
      editableTabsValue: '2',
      editableTabs: [],
      tabIndex: 2
    };
  },
  mounted() {
    this.handleTabsEdit('', 'add');
  },
  methods: {
    addTab(targetName) {
      const newTabName = ++this.tabIndex + '';
      this.editableTabs.push({
        title: '未命名的查询',
        name: newTabName
        // content: "New Tab content",
      });
      this.editableTabsValue = newTabName;
    },
    removeTab(targetName) {
      const tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
    },
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        const newTabName = ++this.tabIndex + '';
        this.editableTabs.push({
          title: '未命名的查询',
          name: newTabName,
          content: 'New Tab content'
        });
        this.editableTabsValue = newTabName;
      }
      if (action === 'remove') {
        const tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
      }
    }
  }
};
</script>

<style scoped>
/* .header >>> .el-tabs__nav-scroll{
    border: 1px solid;
} */
.header >>> .el-tabs__new-tab {
  float: left;
  margin-right: 10px;
}
.header >>> .el-tabs__header {
  background-color: #F8F8fA;
}
.header >>> .el-tabs__new-tab {
  background-color: #ffffff;
}
.header >>> .is-active {
  background-color: #ffffff;
}
</style>
