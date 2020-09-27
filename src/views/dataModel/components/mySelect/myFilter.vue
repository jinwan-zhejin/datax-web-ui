<template>
  <div class="container" @mouseleave="leaveList">
    <div class="inputContent" @click="listShow">
      <div class="tag" v-for="(item, index) in btnList" :key="index">
        <el-popover placement="right" width="400" trigger="click">
          <el-tabs type="border-card">
            <el-tab-pane label="简单">
              <el-form
                :inline="true"
                :model="formFilter"
                class="demo-form-inline"
              >
                <el-form-item label="" class="customize">
                  <el-select v-model="formFilter.field" placeholder="">
                    <el-option label="FLIGHT" value="FLIGHT"></el-option>
                    <el-option label="AIRLINE" value="AIRLINE"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="" class="customize">
                  <el-select v-model="formFilter.type" placeholder="">
                    <el-option label="equals" value="equals"></el-option>
                    <el-option
                      label="not equal to"
                      value="not equal to"
                    ></el-option>
                    <el-option label=">" value=">"></el-option>
                    <el-option label="<" value="<"></el-option>
                    <el-option label=">=" value=">="></el-option>
                    <el-option label="<=" value="<="></el-option>
                    <el-option label="in" value="in"></el-option>
                    <el-option label="not in" value="not in"></el-option>
                    <el-option label="like" value="like"></el-option>
                    <el-option
                      label="IS NOT NULL"
                      value="IS NOT NULL"
                    ></el-option>
                    <el-option label="IS NULL" value="IS NULL"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="">
                  <el-input
                    v-model="formFilter.filterVal"
                    placeholder="过滤值"
                  ></el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="自定义sql">
                <div class="filterMethod">
                    <el-select v-model="filterMethod" placeholder="请选择">
                        <el-option label="HAVING" value="HAVING"></el-option>
                        <el-option label="WHERE" value="WHERE"></el-option>
                    </el-select>
                </div>
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="请输入sql"
                v-model="sql"
              >
              </el-input>
            </el-tab-pane>
          </el-tabs>
          <div class="save">
            <el-button type="primary">保存</el-button>
          </div>
          <el-tag type="info" slot="reference"
            ><i @click.stop="popTag(index)" class="el-icon-delete"></i>
            {{ item }}
            <i class="el-icon-caret-right"></i>
          </el-tag>
        </el-popover>
      </div>
    </div>
    <div class="list" v-show="isShowList" @mouseleave="leaveList">
      <div
        class="list-item"
        v-for="(item, index) in dataList"
        :key="index"
        @click="listItemClick(item)"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyFilter",
  data() {
    return {
      isShowList: false,
      btnList: [],
      formFilter: {
        field: "",
        type: "equals",
        filterVal: "",
      },
      sql: "",
      filterMethod: "WHERE"
    };
  },

  methods: {
    listShow() {
      this.isShowList = true;
    },
    leaveList() {
      this.isShowList = false;
    },
    listItemClick(item) {
      this.btnList.push(item);
    },
    popTag(index) {
      this.btnList.splice(index, 1);
    },
  },

  computed: {
      dataList(){
          return this.$store.getters.allNodeFields
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

.filterMethod {
    margin-bottom: 10px;
}
</style>