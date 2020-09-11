<template>
  <div class="header">

    <el-tabs :editable='true' v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @edit="handleTabsEdit">
      <el-tab-pane
        v-for="(item) in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      ><DataDevContent/></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DataDevContent from './content'
export default {
  name: "HeaderTabs",
  components:{
      DataDevContent
  },
  data() {
    return {
      editableTabsValue: "2",
      editableTabs: [
        // {
        //   title: "Tab 1",
        //   name: "1",
        // //   content: "Tab 1 content",
        // }
      ],
      tabIndex: 2,
    };
  },
  methods: {
    addTab(targetName) {
      let newTabName = ++this.tabIndex + "";
      this.editableTabs.push({
        title: "New Tab",
        name: newTabName,
        // content: "New Tab content",
      });
      this.editableTabsValue = newTabName;
    },
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
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
          let newTabName = ++this.tabIndex + '';
          this.editableTabs.push({
            title: 'New Tab',
            name: newTabName,
            content: 'New Tab content'
          });
          this.editableTabsValue = newTabName;
        }
        if (action === 'remove') {
          let tabs = this.editableTabs;
          let activeName = this.editableTabsValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }
          
          this.editableTabsValue = activeName;
          this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        }
      }
  },
  mounted(){
      this.editableTabs.push({
        title: "New Tab",
        name: '未命名的查询',
        // content: "New Tab content",
      });
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
</style>
