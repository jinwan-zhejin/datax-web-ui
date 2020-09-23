<template>
  <div class="board">
    <div
      :id="'myPaletteDiv' + timestamp"
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
      :id="'myDiagramDiv' + timestamp"
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
      <EditField :tableData='fieldsData' 
      @createFields='createFields()' 
      @deleteFidlds='deleteFidlds()'
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button @click="updateFields()" type="primary" >确 定</el-button>
         <el-button type="primary" >应 用</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import init from "./initBoard";
import EditField from "./editField";
export default {
  name: "Modeling",
  components: {
    EditField,
  },
  data() {
    return {
      dialogTableVisible: false,
      gridData: [],
      timestamp: "",
      fieldsData:[],
      myDiagram:null,
      node:null
    };
  },
  created() {
    this.timestamp = new Date().getTime();
  },
  mounted() {
    let _this = this;
    this.myDiagram = this.init(_this, this.timestamp);
  },
  methods: {
    init,
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    createFields(){
      this.fieldsData.push({})
    },
    deleteFidlds(index){
      this.fieldsData.splice(index, 1)
    },
    updateFields(){
      this.myDiagram.model.updateTargetBindings(this.node);
      this.dialogTableVisible = false;
      this.$message.success('更新成功')
    }
  },
};
</script>

<style>
.board {
  display: flex;
}
</style>