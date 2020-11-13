<template>
<div>
    <div :style="{height:`400px !important`}" class="sqlArea">
        <textarea ref="mycode" v-model="code" class="codesql" @onCursorActivity="SelectSQL" @click.native="chooseSql" />
    </div>
    <div class="btnContent">
        <el-button size="mini" type="goon" :loading="$store.state.graphQL.sqlBtnLoading" @click="fromChild">
            <i class="el-icon-refresh" /> 运行查询
        </el-button>
        <el-button size="mini" @click="saveQuery">
            <i class="el-icon-copy-document" /> 保存查询
        </el-button>

        <el-button size="mini" @click="sqlJobBuild">
            <i class="el-icon-copy-document" /> 构建sql任务
        </el-button>
    </div>
</div>
</template>

<script>
import 'codemirror/theme/ambiance.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/hint/show-hint.css';
import sqlFormatter from "sql-formatter";

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
                    'Ctrl-F': function (editor) {
                        let sqlContent = "";
                        sqlContent = editor.getValue();
                        /*将sql内容进行格式后放入编辑器中*/
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
            editor.on('cursorActivity', function (ins) {
                _this.code = editor.getSelection();
            });

            editor.on('change', function (editor, change) { // 任意键触发autocomplete
                console.log(change);
                if (change.origin == '+input') {
                    var text = change.text;
                    if ((text != ' ') && (text != ';') && (text.length != 2) && (text != '*') && (text != '  ')) { // 不提示
                        editor.execCommand('autocomplete');
                    }
                }
                _this.code = editor.getValue();
                console.log(editor.getLineNumber(), 'line number')
            });
        }
    }
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
}

.sqlArea {
    overflow: scroll;

}

.sqlArea::-webkit-scrollbar {
    display: none;
}
</style>
