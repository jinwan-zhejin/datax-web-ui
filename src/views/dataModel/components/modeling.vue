<template>
  <div class="board">
    <div
      id="myPaletteDiv"
      style="width: 100px;height:660px; margin-right: 2px; position: relative; -webkit-tap-highlight-color: rgba(255, 255, 255, 0); cursor: auto;"
    >
      <canvas
        tabindex="0"
        width="200"
        height="1500"
        style="position: absolute; top: 0px; left: 0px; z-index: 2; user-select: none; width: 100px; height: 750px; cursor: auto;"
      >
        This
        text is displayed if your browser does not support the Canvas HTML element.
      </canvas>
      <div style="position: absolute; overflow: auto; width: 100px; height: 750px; z-index: 1;">
        <div style="position: absolute; width: 1px; height: 1px;"></div>
      </div>
    </div>
    <div
      id="myDiagramDiv"
      style="border: 1px solid black; width: 100%; height: 660px; position: relative; -webkit-tap-highlight-color: rgba(255, 255, 255, 0); cursor: auto;"
    >
      <canvas
        tabindex="0"
        width="1808"
        height="796"
        style="position: absolute; top: 0px; left: 0px; z-index: 2; user-select: none; width: 904px; height: 398px; cursor: auto;"
      >This text is displayed if your browser does not support the Canvas HTML element.</canvas>
      <div style="position: absolute; overflow: auto; width: 904px; height: 398px; z-index: 1;">
        <div style="position: absolute; width: 1px; height: 1px;"></div>
      </div>
    </div>
    <el-dialog title="编辑字段" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="name" label="字段名" width="150"></el-table-column>
        <el-table-column property="info" label="字段值" width="200"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, gridData)"
              type="text"
              size="small"
            >移除</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import init from "./initBoard";
export default {
  name: "Modeling",
  data() {
    return {
      dialogTableVisible: false,
      gridData: [],
    };
  },
  mounted() {
    let _this = this;
    this.init(_this);
  },
  methods: {
    init,
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
  },
};
</script>

<style>
.board {
  display: flex;
}
</style>