<template>
  <div>
    <div class="btnContent">
      <!-- <el-button size="mini" type="goon" :loading="$store.state.graphQL.sqlBtnLoading" @click="fromChild">
        <i class="el-icon-refresh" /> 运行查询
      </el-button>
      <el-button size="mini" @click="saveQuery">
        <i class="el-icon-copy-document" /> 保存查询
      </el-button>

      <el-button size="mini" @click="sqlJobBuild">
        <i class="el-icon-copy-document" /> 构建sql任务
      </el-button> -->
      <ul>
        <li>
          <a :loading="$store.state.graphQL.sqlBtnLoading" @click="fromChild">
            <i class="el-icon-video-play" />运行查询
          </a>
        </li>
        <li>
          <a @click="saveQuery">
            <i class="el-icon-video-play" />保存查询
          </a>
        </li>
        <li>
          <a @click="sqlJobBuild">
            <i class="el-icon-video-play" />构建sql任务
          </a>
        </li>
      </ul>
    </div>
    <div :style="{height:`400px !important`}" class="sqlArea">
      <textarea ref="mycode" v-model="code" class="codesql" @onCursorActivity="SelectSQL" @click.native="chooseSql" />
    </div>
    <!-- <div class="btnContent">
        <el-button size="mini" type="goon" :loading="$store.state.graphQL.sqlBtnLoading" @click="fromChild">
            <i class="el-icon-refresh" /> 运行查询
        </el-button>
        <el-button size="mini" @click="saveQuery">
            <i class="el-icon-copy-document" /> 保存查询
        </el-button>

        <el-button size="mini" @click="sqlJobBuild">
            <i class="el-icon-copy-document" /> 构建sql任务
        </el-button>
    </div> -->
  </div>
</template>

<script>
import 'codemirror/theme/ambiance.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/hint/show-hint.css';
import sqlFormatter from 'sql-formatter';

const CodeMirror = require('codemirror/lib/codemirror');
require('codemirror/addon/edit/matchbrackets');
require('codemirror/addon/selection/active-line');
require('codemirror/mode/sql/sql');
require('codemirror/addon/hint/show-hint');
require('codemirror/addon/hint/sql-hint');
export default {
  name: 'CodeMirror',
  props: ['sqlHeight', 'columnList', 'tableList', 'sqlparams'],
  data() {
    return {
      code: '',
      sqlLoading: false,
      tips: {},
      lastVal: '',
      leftShow: false,
      rightShow: true,
      infoMsg: 0,
      editor: {}
    };
  },
  watch: {
    code(val) {
      console.log(this.code, 'code1');
      this.infoMsg++
    },
    sqlparams(val) {
      if (val.level === 3) {
        this.code = 'SELECT * FROM ' + val.data.schema + '.' + val.data.tableName + ';'
        console.log(this.code, 'code')
        this.leftShow = true;
        this.rightShow = false;
      }
    },
    columnList(val) {
      // this.tips = {}
      const columeObj = {};
      val.forEach((ele) => {
        columeObj[ele.name] = [];
      });
      // for (let i = 0; i < val.length; i++) {
      //   columeObj[val[i].name] = [];
      // }
      this.tips = Object.assign(this.tips, columeObj);
      console.log(this.tips, 'tips1');
      // this.mountCodeMirror();
    },
    tableList(val) {
      // this.tips = {}
      const tableObj = {};
      val.forEach((ele) => {
        tableObj[ele.name] = [];
      });
      // this.mountCodeMirror();
      // for (let i = 0; i < val.length; i++) {
      //   tableObj[val[i].name] = [];
      // }
      this.tips = Object.assign(this.tips, tableObj);
      console.log(this.tips, 'tips2');
    }
  },
  beforeMount() {
    // const columeObj = {};
    // this.columnList.forEach((ele) => {
    //   columeObj[ele.name] = [];
    // });
    // const tableObj = {};
    // this.tableList.forEach((ele) => {
    //   tableObj[ele.name] = [];
    // });
    // this.tips = Object.assign(this.tips, columeObj, tableObj);
    // console.log(this.tips, 'tips');
  },
  mounted() {
    this.mountCodeMirror();
  },
  methods: {
    chooseSql() {
      console.log(window.getSelection());
    },
    SelectSQL(instance) {
      console.log(instance, '.....................');
    },
    fromChild() {
      this.$emit('querysql', {
        msg: this.infoMsg,
        code: this.code
      })
    },
    saveQuery() {
      console.log('保存查询')
    },
    sqlJobBuild() {
      // this.$route.push('/datax/job/JobInfo')
      this.$router.push({
        path: '/datax/job/JobInfo'
      });
      console.log('=================')
      // window.location.href = '/datax/job/JobInfo'
    },

    mountCodeMirror(code) {
      const mime = 'text/x-sql';
      const theme = 'ambiance'; // 设置主题，不设置的会使用默认主题
      const _this = this;
      const editor = CodeMirror.fromTextArea(this.$refs.mycode, {
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
          tables: _this.tips
        },
        extraKeys: {
          'Ctrl-F': function(editor) {
            let sqlContent = '';
            sqlContent = editor.getValue();
            /* 将sql内容进行格式后放入编辑器中*/
            editor.setValue(sqlFormatter.format(sqlContent));
          }
        }
        // configureMouse() {
        //     console.log(window.getSelection());
        //     return {
        //         unit: 'word'
        //     };
        // }
      });

      _this.editor = editor
      editor.setSize('auto', '400px');

      // 代码自动提示功能，记住使用cursorActivity事件不要使用change事件，这是一个坑，那样页面直接会卡死
      editor.on('cursorActivity', function(ins) {
        _this.code = editor.getSelection();
        if (_this.code.trim() != '') {
          return
        }
        var cursor = editor.getCursor()
        var curCh = cursor.ch
        var curLineNo = cursor.line
        var curLineContent = editor.getLine(curLineNo)
        var sqlScript = ''
        var endPos = {}
        var startPos = {}

        // 当前行
        if (curLineContent.indexOf(';') == -1) {
          // 当前行无分号
          // 往前找;
          let i = curLineNo - 1
          for (; i >= 0; i--) {
            var tempLine = editor.getLine(i)
            if (tempLine.indexOf(';') != -1) {
              startPos.line = i
              startPos.ch = tempLine.indexOf(';') + 1
              break;
            }
          }
          if (i == -1) {
            startPos.line = 0
            startPos.ch = 0
          }
          // 往后找;
          let j = curLineNo + 1
          for (; j <= editor.lastLine(); j++) {
            var tempLine = editor.getLine(j)
            if (tempLine.indexOf(';') != -1) {
              endPos.line = j
              endPos.ch = tempLine.indexOf(';')
              break;
            }
          }
          if (j == editor.lastLine() + 1) {
            endPos.line = editor.lastLine() + 1
            endPos.ch = 0
          }
        } else if ((curLineContent.indexOf(';') + 1) >= curCh) {
          // 当前行分号在当前鼠标后
          endPos.line = curLineNo
          endPos.ch = curLineContent.indexOf(';')
          // 往前找;
          let i = curLineNo - 1
          for (; i >= 0; i--) {
            var tempLine = editor.getLine(i)
            if (tempLine.indexOf(';') != -1) {
              startPos.line = i
              startPos.ch = tempLine.indexOf(';') + 1
              break;
            }
          }
          if (i == -1) {
            startPos.line = 0
            startPos.ch = 0
          }
        } else {
          // 当前行分号在当前鼠标前
          startPos.line = curLineNo
          startPos.ch = curLineContent.indexOf(';') + 1
          // 往后找;
          let j = curLineNo + 1
          for (; j <= editor.lastLine(); j++) {
            var tempLine = editor.getLine(j)
            if (tempLine.indexOf(';') != -1) {
              endPos.line = j
              endPos.ch = tempLine.indexOf(';')
              break;
            }
          }
          if (j == (editor.lastLine() + 1)) {
            endPos.line = editor.lastLine() + 1
            endPos.ch = 0
          }
        }

        _this.code = editor.getRange(startPos, endPos)
        console.log(_this.code, ' -- SQL')
      });

      editor.on('change', function(editor, change) { // 触发autocomplete
        console.log(change);
        if (change.origin == '+input') {
          var text = change.text;
          if ((text != ' ') && (text != ';') && (text.length != 2) && (text != '*') && (text != '  ')) { // 不提示
            editor.execCommand('autocomplete');
          }
        }
        // _this.code = editor.getValue();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.codesql {
    font-size: 11pt;
    /* font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono,
    DejaVu Sans Mono,
    Bitstream Vera Sans Mono, Courier New, monospace, serif; */
}

.btnContent {
    padding-left: 15px;
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    ul {
        overflow: hidden;
        li {
            float: left;
            margin-right: 30px;
            a {
                i {
                    margin-right: 10px;
                }
            }
            a:hover {
                color: skyblue;
            }
        }
    }
}

.sqlArea {
    overflow: scroll;

}

.sqlArea::-webkit-scrollbar {
    display: none;
}

>>> .CodeMirror-gutters {
    background-color: #fff;
    border-right: none;
}
</style>
