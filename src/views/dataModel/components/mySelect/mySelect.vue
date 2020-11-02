<template>
  <div class="container" @mouseleave="leaveList">
    <div class="inputContent" @click="listShow">
      <div v-for="(item, index) in btnList" :key="index" class="tag">
        <el-popover v-model="visible" placement="right" width="400" trigger="click">
          <el-input
            v-model="inputVal"
            placeholder="我的指标"
            suffix-icon="el-icon-edit"
          />
          <el-tabs type="border-card">
            <el-tab-pane label="简单">
              <el-form
                :inline="true"
                :model="formInline"
                class="demo-form-inline"
              >
                <h4>列</h4>
                <el-form-item label="" class="customize">
                  <el-select v-model="formInline.cloumn" placeholder="">
                    <el-option v-for="(ele, index) in $store.getters.allNodeFields" :key="index" :label="ele" :value="ele" />
                  </el-select>
                </el-form-item>
                <h4>聚合方法</h4>
                <el-form-item label="" class="customize">
                  <el-select v-model="formInline.method" placeholder="">
                    <el-option label="AVG" value="AVG" />
                    <el-option label="COUNT" value="COUNT" />
                    <el-option
                      label="COUNT_DISTINCT"
                      value="COUNT_DISTINCT"
                    />
                    <el-option label="MAX" value="MAX" />
                    <el-option label="MIN" value="MIN" />
                    <el-option label="SUM" value="SUM" />
                  </el-select>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="自定义sql">
              <el-input
                v-model="sql"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="请输入sql"
              />
            </el-tab-pane>
          </el-tabs>
          <div class="save">
            <el-button type="primary" @click="saveField(item,index)">保存</el-button>
          </div>
          <el-tag
            slot="reference"
            type="info"
          ><i class="el-icon-delete" @click.stop="popTag(index)" />
            <span @click="tagClick(item)">{{ item.alias }}</span>
            <i class="el-icon-caret-right" />
          </el-tag>
        </el-popover>
      </div>
    </div>
    <div v-show="isShowList" class="list" @mouseleave="leaveList">
      <div
        v-for="(item, index) in dataList"
        :key="index"
        class="list-item"
        @click="listItemClick(item)"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Myselect',
  data() {
    return {
      isShowList: false,
      btnList: [],
      formInline: {
        cloumn: '',
        method: 'SUM'
      },
      sql: '',
      inputVal: '',
      visible: false
    };
  },

  computed: {
    dataList() {
      return this.$store.getters.allNodeFields;
    },

    cloumn() {
      return this.formInline.cloumn;
    },

    method() {
      return this.formInline.method;
    }
  },

  watch: {
    cloumn(val) {
      this.sql = `${this.method}(${val})`;
    },

    method(val) {
      this.sql = `${val}(${this.cloumn})`;
    },

    sql(val) {
      const method = val.split('(')[0];
      this.formInline.method = method;
    },

    btnList: {
      handler: function(val) {
        this.$store.commit('SET_targetList', val);
      },
      deep: true
    }

  },

  methods: {
    listShow() {
      this.isShowList = true;
    },
    leaveList() {
      this.isShowList = false;
    },
    listItemClick(item) {
      this.btnList.push({
        name: `${this.formInline.method}(${item})`,
        alias: `${this.formInline.method}(${item})`
      });
    },
    popTag(index) {
      this.btnList.splice(index, 1);
    },

    tagClick(item) {
      this.formInline.cloumn = item.name.split('(')[1].split(')')[0];
      this.inputVal = item.alias;
    },

    saveField(item, index) {
      if (!this.inputVal) item.alias = item.name;
      item.name = `${this.formInline.method}(${this.formInline.cloumn})`
      item.alias = this.inputVal;
      this.btnList.splice(index, 1, item);
      this.$message.success('已保存')
      this.visible = false;
    }
  }
};
</script>

<style scoped>
.container {
  width: 250px;
}

.inputContent {
  padding: 2px;
  width: 100%;
  min-height: 30px;
  border-radius: 3px;
  border: 1px solid rgb(240, 240, 240);
  display: flex;
  flex-wrap: wrap;
}

.inputContent:hover {
  border: 1px solid gray;
}

.inputContent:active {
  border: 1px solid rgb(85, 207, 255);
}
.list {
  max-height: 100px;
  overflow: scroll;
  border: 1px solid rgb(240, 240, 240);
}

.list-item {
  height: 30px;
  line-height: 30px;
  padding: 0 5px;
}

.list-item:hover {
  background: rgb(9, 177, 243);
  color: white;
}

.el-icon-delete {
  color: black;
}

.tag {
  margin: 2px 5px;
}

.save {
  margin-top: 10px;
}
</style>
