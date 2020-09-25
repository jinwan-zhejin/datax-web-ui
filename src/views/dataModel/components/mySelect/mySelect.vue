<template>
  <div class="container" @mouseleave="leaveList">
    <div class="inputContent" @click="listShow">
      <div class="tag" v-for="(item, index) in btnList" :key="index">
        <el-popover placement="right" width="400" trigger="click">
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
                    <el-option label="FLIGHT" value="FLIGHT"></el-option>
                    <el-option label="AIRLINE" value="AIRLINE"></el-option>
                  </el-select>
                </el-form-item>
                <h4>聚合方法</h4>
                <el-form-item label="" class="customize">
                  <el-select v-model="formInline.method" placeholder="">
                    <el-option label="AVG" value="AVG"></el-option>
                    <el-option label="COUNT" value="COUNT"></el-option>
                    <el-option
                      label="COUNT_DISTINCT"
                      value="COUNT_DISTINCT"
                    ></el-option>
                    <el-option label="MAX" value="MAX"></el-option>
                    <el-option label="MIN" value="MIN"></el-option>
                    <el-option label="SUM" value="SUM"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="自定义sql">
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
  name: "Myselect",
  data() {
    return {
      dataList: [
        "测试测试1",
        "测试测试2",
        "测试测试3",
        "测试测试4",
        "测试测试5",
      ],
      isShowList: false,
      btnList: [],
      formInline: {
        cloumn: "AIRLINE",
        method: "SUM",
      },
      sql:''
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