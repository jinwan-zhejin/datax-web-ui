<template>
  <div>
    <div :style="{height:`${sqlHeight}px !important`}" class="sqlArea">
      <textarea ref="mycode" class="codesql" v-model="code"></textarea>
    </div>
    <div class="btnContent">
      <el-button size="mini" type="success">
        <i class="el-icon-refresh"></i> 运行查询
      </el-button>
      <el-button size="mini">
        <i class="el-icon-document-copy"></i>保存查询
      </el-button>
      <el-button size="mini">
        <i class="el-icon-copy-document"></i> 分享查询
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
  props: ['sqlHeight'],
  data() {
    return {
      code:
        "-- 注意: 除非您保存了查询，否则如果您清空了cookie或者更换了浏览器，这些查询不会保留.",
    };
  },
  mounted() {
    let mime = "text/x-sql";
    let theme = "ambiance"; //设置主题，不设置的会使用默认主题
    let editor = CodeMirror.fromTextArea(this.$refs.mycode, {
      mode: mime, // 选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
      indentWithTabs: true,
      smartIndent: true,
      lineNumbers: true,
      matchBrackets: true,
      // theme: theme,
      // autofocus: true,
      // extraKeys: { Ctrl: 'autocomplete' }, // 自定义快捷键
      hintOptions: {
        // 自定义提示选项
        tables: {
          //   users: ['name', 'score', 'birthDate'],
          //   countries: ['name', 'population', 'size']
        },
      },
    });
    // 代码自动提示功能，记住使用cursorActivity事件不要使用change事件，这是一个坑，那样页面直接会卡死
    editor.on("cursorActivity", function () {
      editor.showHint();
    });
  },
  watch: {
    code(val) {
      console.log(this.code);
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