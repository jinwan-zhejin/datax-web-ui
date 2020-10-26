<template>
  <div>
    <div :style="{height:`400px !important`}" class="sqlArea">
      <textarea @click.native="chooseSql" ref="mycode" class="codesql" v-model="code"></textarea>
    </div>
    <div class="btnContent">
      <el-button
        size="mini"
        type="success"
        @click="$emit('querysql')"
        :loading="$store.state.graphQL.sqlBtnLoading"
      >
        <i class="el-icon-refresh"></i> 运行查询
      </el-button>
      <el-button size="mini">
        <i class="el-icon-document-copy"></i>保存查询
      </el-button>
      <el-button size="mini">
        <i class="el-icon-copy-document"></i> 分享查询
      </el-button>
      <el-button size="mini" @click="sqlJobBuild">
        <i class="el-icon-copy-document" ></i> 构建sql任务
      </el-button>
    </div>
  </div>
</template>
<script>
import "codemirror/theme/ambiance.css";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint.css";

let CodeMirror = require("codemirror/lib/codemirror");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/selection/active-line");
require("codemirror/mode/sql/sql");
require("codemirror/addon/hint/show-hint");
require("codemirror/addon/hint/sql-hint");
export default {
  name: "CodeMirror",
  props: ["sqlHeight", "columnList", "tableList"],
  data() {
    return {
      code: "",
      sqlLoading: false,
      tips: {},
    };
  },
  methods: {
    chooseSql() {
      console.log(window.getSelection());
    },
    sqlJobBuild() {
      // this.$route.push('/datax/job/JobInfo')
      this.$router.push({path: '/datax/job/JobInfo'});
      console.log('=================')
      // window.location.href = '/datax/job/JobInfo'
    },
    mountCodeMirror() {
      let mime = "text/x-sql";
      let theme = "ambiance"; //设置主题，不设置的会使用默认主题
      const _this = this;
      let editor = CodeMirror.fromTextArea(this.$refs.mycode, {
        mode: mime, // 选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        // theme: theme,
        // autofocus: true,
        // extraKeys: { Ctrl: 'delCharBefore' }, // 自定义快捷键
        hintOptions: {
          // 自定义提示选项,
          completeSingle: false,
          tables: _this.tips,
        },
        configureMouse() {
          console.log(window.getSelection());
          return {
            unit: "word",
          };
        },
      });

      editor.setSize('auto','400px');

      // 代码自动提示功能，记住使用cursorActivity事件不要使用change事件，这是一个坑，那样页面直接会卡死
      editor.on("cursorActivity", function (ins) {
        editor.showHint();
        _this.code = editor.getValue();
        _this.$store.dispatch("graphQL/changeMirror", _this.code);
      });
    },
  },
  beforeMount() {
    let columeObj = {};
    this.columnList.forEach((ele) => {
      columeObj[ele] = [];
    });
    let tableObj = {};
    this.tableList.forEach((ele) => {
      tableObj[ele] = [];
    });
    this.tips = Object.assign(this.tips, columeObj, tableObj);
  },
  mounted() {
    this.mountCodeMirror();
  },
  watch: {
    code(val) {
      console.log(this.code);
    },
    columnList(val) {
      let columeObj = {};
      val.forEach((ele) => {
        columeObj[ele] = [];
      });
      this.tips = Object.assign(this.tips, columeObj);
      // this.mountCodeMirror();
    },
    tableList(val) {
      let tableObj = {};
      val.forEach((ele) => {
        tableObj[ele] = [];
      });
      this.tips = Object.assign(this.tips, tableObj);
      // this.mountCodeMirror();
    },
  },
};
</script>
<style scoped>
.codesql {
  font-size: 11pt;
  /* font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono,
    DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif; */
}
.btnContent {
  padding: 10px 10px 5px;
  background-color: #f5f5f5;
  border: 1px solid #cfd8dc;
}
.sqlArea {
  overflow: scroll;
}
</style>
