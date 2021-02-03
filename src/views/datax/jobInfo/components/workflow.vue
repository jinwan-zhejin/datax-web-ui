<template>
  <div id="sample">
    <div class="header">
      <div class="header_action" style="margin-left:17px;" @click="DataSave">
        <i :class="[isNewTask?'el-icon-plus':'el-icon-edit']" />
        <span>{{ isNewTask?'新建':'编辑' }}</span>
      </div>
      <div v-if="!isNewTask" class="header_action" style="margin-left:17px;" @click="runVirtualOnce">
        <i class="el-icon-video-play" />
        <span>执行一次</span>
      </div>
      <div v-if="!isNewTask" class="header_action" @click="handlerViewLog">
        <i class="el-icon-s-order" />
        <span>查询日志</span>
      </div>
      <div class="header_action" @click="handlerDelete">
        <i class="el-icon-delete-solid" />
        <span>删除</span>
      </div>
      <div v-if="!isNewTask" class="header_switch" style="margin-right:10px;">
        <el-switch v-model="taskTrigger" active-color="#00A854" active-text="启动" inactive-color="#F04134" inactive-text="停止" @change="changeSwitch" />
      </div>
    </div>
    <!-- <div class="header-second">
      <div class="header_action" style="margin-left:17px;">
        <el-tooltip content="撤回" placement="top">
          <svg-icon class="svgIcon" icon-class="undo" />
        </el-tooltip>
      </div>
      <div class="header_action" style="margin-left:17px;">
        <el-tooltip content="还原" placement="top">
          <svg-icon class="svgIcon" icon-class="redo" />
        </el-tooltip>
      </div>
      <div class="header_action" style="margin-left:17px;">
        <el-tooltip content="删除" placement="top">
          <svg-icon class="svgIcon" icon-class="delete" />
        </el-tooltip>
      </div>
      <div class="header_action" style="margin-left:17px;">
        <el-tooltip content="放大" placement="top">
          <svg-icon class="svgIcon" icon-class="zoomin" />
        </el-tooltip>
      </div>
      <div class="header_action" style="margin-left:17px;">
        <el-tooltip content="缩小" placement="top">
          <svg-icon class="svgIcon" icon-class="zoomout" />
        </el-tooltip>
      </div>
      <div class="header_action" style="margin-left:17px;">
        <el-tooltip content="置顶" placement="top">
          <svg-icon class="svgIcon" icon-class="top" />
        </el-tooltip>
      </div>
      <div class="header_action" style="margin-left:17px;">
        <el-tooltip content="置底" placement="top">
          <svg-icon class="svgIcon" icon-class="bottom" />
        </el-tooltip>
      </div>
    </div> -->
    <!-- isSave   {{ isSave }} -->
    <div style="width: 100%; display: flex; border: solid 1px lightgray;">
      <div :id="'myPaletteDiv' + myId" style="width: 100px; margin-right: 2px; " />
      <div :id="'myDiagramDiv' + myId" style="flex-grow: 1; height: 589px;" />
    </div>
    <!-- 选择任务面板 -->
    <el-dialog id="taskDialog" title="选择任务" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form">
        <el-form-item label="任务名称" label-width="120px">
          <el-select v-model="form.objIndex" placeholder="请选择任务名称" style="width: 100%;">
            <el-option
              v-for="(item, index) in taskList"
              :key="index"
              :label="item.jobDesc + ' @' + item.glueType.replace('GLUE_', '').toLowerCase()"
              :value="index"
            />
            <!-- <el-option label="task_02" value="task_02" /> -->
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="sure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 设置调度时间 -->
    <el-dialog
      title="提示"
      :visible.sync="showCronBox"
      width="60%"
      append-to-body
    >
      <cron v-model="jobCron" />
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showCronBox = false;">关闭</el-button>
        <el-button size="small" type="primary" @click="sureCron">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 保存虚任务 -->
    <el-dialog
      :title="'保存'.concat(isNewTask?'新建':'编辑').concat('虚任务')"
      :visible.sync="showSaveBox"
      width="40%"
    >
      <el-row>
        <el-col :span="18" :offset="3">
          <el-form ref="virtualProjectInfo" :model="virtualProjectInfo" label-width="100px" label-position="right">
            <el-form-item label="类型id">
              <span>{{ projId }}</span>
            </el-form-item>
            <el-form-item v-if="!isNewTask" label="虚任务id">
              <span>{{ id }}</span>
            </el-form-item>
            <!-- <el-form-item label="虚任务id">
              <span>{{ infoId }}</span>
            </el-form-item> -->
            <el-form-item label="调度时间">
              <!-- <span>{{ jobCron }}</span> -->
              <el-input v-model="jobCron" placeholder="Cron表达式" readonly>
                <el-button slot="append" icon="el-icon-edit" @click="setCron">设置</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="虚任务名称" prop="virtualProjectName" :rules="[{ required: true, message: '请输入虚任务名称', trigger: 'blur' }]">
              <el-input v-model="virtualProjectInfo.virtualProjectName" disabled placeholder="虚任务名称" clearable />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showSaveBox = false;">关闭</el-button>
        <el-button size="small" type="primary" @click="sureSave('virtualProjectInfo')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 日志信息 -->
    <el-dialog width="75%" class="log_detail_window" title="日志信息" :visible.sync="logview">
      <jobLog :id="jobId" ref="jobLog" />
    </el-dialog>
    <!-- <p>
      The FlowChart sample demonstrates several key features of GoJS,
      namely <a href="../intro/palette.html">Palette</a>s,
      <a href="../intro/links.html">Linkable nodes</a>, Drag/Drop behavior,
      <a href="../intro/textBlocks.html">Text Editing</a>, and the use of
      <a href="../intro/templateMaps.html">Node Template Maps</a> in Diagrams.
    </p>
    <p>
      Mouse-over a Node to view its ports.
      Drag from these ports to create new Links.
      Selecting Links allows you to re-shape and re-link them.
      Selecting a Node and then clicking its TextBlock will allow
      you to edit text (except on the Start and End Nodes).
    </p> -->

    <!-- <button @click="load">Load</button> -->
    <!-- Diagram Model saved in JSON format:
    <textarea id="mySavedModel" style="width:100%;height:300px">
{ "class": "go.GraphLinksModel",
  "linkFromPortIdProperty": "fromPort",
  "linkToPortIdProperty": "toPort",
  "nodeDataArray": [
{"category":"Comment", "loc":"360 -10", "text":"Kookie Brittle", "key":-13},
{"key":-1, "category":"Start", "loc":"175 0", "text":"Start"},
{"key":0, "loc":"-5 75", "text":"Preheat oven to 375 F"},
{"key":1, "loc":"175 100", "text":"In a bowl, blend: 1 cup margarine, 1.5 teaspoon vanilla, 1 teaspoon salt"},
{"key":2, "loc":"175 200", "text":"Gradually beat in 1 cup sugar and 2 cups sifted flour"},
{"key":3, "loc":"175 290", "text":"Mix in 6 oz (1 cup) Nestle's Semi-Sweet Chocolate Morsels"},
{"key":4, "loc":"175 380", "text":"Press evenly into ungreased 15x10x1 pan"},
{"key":5, "loc":"355 85", "text":"Finely chop 1/2 cup of your choice of nuts"},
{"key":6, "loc":"175 450", "text":"Sprinkle nuts on top"},
{"key":7, "loc":"175 515", "text":"Bake for 25 minutes and let cool"},
{"key":8, "loc":"175 585", "text":"Cut into rectangular grid"},
{"key":-2, "category":"End", "loc":"175 660", "text":"Enjoy!"}
 ],
  "linkDataArray": [
{"from":1, "to":2, "fromPort":"B", "toPort":"T"},
{"from":2, "to":3, "fromPort":"B", "toPort":"T"},
{"from":3, "to":4, "fromPort":"B", "toPort":"T"},
{"from":4, "to":6, "fromPort":"B", "toPort":"T"},
{"from":6, "to":7, "fromPort":"B", "toPort":"T"},
{"from":7, "to":8, "fromPort":"B", "toPort":"T"},
{"from":8, "to":-2, "fromPort":"B", "toPort":"T"},
{"from":-1, "to":0, "fromPort":"B", "toPort":"T"},
{"from":-1, "to":1, "fromPort":"B", "toPort":"T"},
{"from":-1, "to":5, "fromPort":"B", "toPort":"T"},
{"from":5, "to":4, "fromPort":"B", "toPort":"T"},
{"from":0, "to":4, "fromPort":"B", "toPort":"T"}
 ]}
    </textarea> -->
    <!-- <button @click="printDiagram">Print Diagram Using SVG</button> -->
  </div>
</template>
<script id="code">
import go from 'gojs';
import cron from '@/components/Cron'
import * as wfApi from '@/api/datax-job-info-workflow'
import { handlerStart, handlerStop, handlerDelete } from '../method'
import jobLog from './jobLog';
import * as job from '@/api/datax-job-info';

export default {
  name: 'Flow',
  components: {
    cron,
    jobLog
  },
  props: {
    isSave: { type: Object, default: () => ({}) },
    /**
     * @description: 任务列表
     */
    taskList: { type: Array, default: () => ([]) },
    jobType: { type: String, default: '' }
  },
  data() {
    return {
      myDiagram: '',
      /** 虚任务Id */
      myId: '',
      SaveName: '',
      SaveData: '',
      /** 选择任务面板 */
      dialogFormVisible: false,
      /** form */
      form: {},
      selectedNodeKey: 9999,
      /** 设置调度时间 */
      showCronBox: false,
      /** 调度时间字符串 */
      jobCron: '* * * ? * * *',
      /** 显示保存面板 */
      showSaveBox: false,
      /** 虚任务名称 */
      virtualProjectInfo: {
        virtualProjectName: ''
      },
      taskTrigger: false,
      logview: false,
      jobId: '',
      listLoading: false,
      listQuery: {
        current: 1,
        size: 10000,
        jobGroup: 0,
        projectIds: '',
        triggerStatus: -1,
        jobDesc: '',
        glueType: ''
      },
      total: 0,
      list: null
    }
  },
  computed: {
    /** 记录id */
    id() {
      if (this.isSave.hasOwnProperty('content')) {
        return this.isSave.content.id
      } else {
        return 0
      }
    },
    /** 虚任务Id */
    infoId() {
      if (this.isSave.hasOwnProperty('content')) {
        var temp = JSON.parse(this.isSave.content.jobJson);
        var ret = ''
        // console.log(temp);
        for (var i = 0; i < temp.nodeDataArray.length; i++) {
          if (temp.nodeDataArray[i].hasOwnProperty('infoId')) {
            ret = temp.nodeDataArray[i].infoId
            break
          }
          if (i === temp.nodeDataArray.length - 1) {
            ret = '-'
            break
          }
        }
        return ret
      } else {
        return this.myId
      }
    },
    /** 类型id */
    projId() {
      if (this.isSave.hasOwnProperty('content')) {
        return this.isSave.content.projectId
      } else {
        return this.$store.state.taskAdmin.projectId
      }
    },
    /** 是否为新建虚任务 */
    isNewTask() {
      return !this.isSave.hasOwnProperty('content')
    }
  },
  watch: {
    isSave: {
      handler(val) {
        // 从列表选择进入编辑时载入
        if (this.isSave.hasOwnProperty('content')) {
          this.virtualProjectInfo.virtualProjectName = this.isSave.content.jobDesc
          this.$nextTick(() => {
            this.myDiagram.model = go.Model.fromJson(this.isSave.content.jobJson)
            this.jobCron = this.isSave.content.jobCron
            this.taskTrigger = this.isSave.content.triggerStatus === 1
          })
        }
      },
      deep: true,
      immediate: true
    },
    'form.objIndex'(val) {
      this.form.name = this.taskList[val].jobDesc
      this.form.id = this.taskList[val].id
    }
  },
  created() {
    // console.log(this.isSave)
    this.myId = this.guid()
    // console.log(this.taskList)
    this.virtualProjectInfo.virtualProjectName = this.$store.state.taskAdmin.GroupName
  },
  mounted() {
    this.init()
  },

  methods: {
    init() {
      // var myDiagramDiv = document.getElementById('myDiagramDiv')
      // var parentDiv = document.getElementById('parent')
      // parentDiv.removeChild(myDiagramDiv)
      // var div = document.createElement('div')
      // div.setAttribute('id', 'myDiagramDiv')
      // parentDiv.appendChild(div)
      // if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
      var $ = go.GraphObject.make // 为在定义模板的简洁

      this.myDiagram =
        $(go.Diagram, 'myDiagramDiv' + this.myId, // 必须命名或引用DIV HTML元素
          {
            padding: 20, // extra space when scrolled all the way
            grid: $(go.Panel, 'Grid', // a simple 10x10 grid
              $(go.Shape, 'LineH', { stroke: 'lightgray', strokeWidth: 0.5 }),
              $(go.Shape, 'LineV', { stroke: 'lightgray', strokeWidth: 0.5 })
            ),
            'draggingTool.isGridSnapEnabled': true,
            handlesDragDropForTopLevelParts: true,
            'clickCreatingTool.archetypeNodeData': { text: 'NEW NODE' }, // create a new node by double-clicking in background
            'PartCreated': function(e) {
              var node = e.subject; // the newly inserted Node -- now need to snap its location to the grid
              node.location = node.location.copy().snapToGridPoint(e.diagram.grid.gridOrigin, e.diagram.grid.gridCellSize);
              setTimeout(function() { // and have the user start editing its text
                e.diagram.commandHandler.editTextBlock();
              }, 20);
            },
            'commandHandler.archetypeGroupData': { isGroup: true, text: 'NEW GROUP' },
            'undoManager.isEnabled': true
          })

      // 当文档被修改时，在标题中添加一个“*”，并启用“保存”按钮
      // this.myDiagram.addDiagramListener('Modified', function(e) {
      //   console.log(e)
      //   var button = document.getElementById('SaveButton')
      //   if (button) button.disabled = !e.isModified
      //   var idx = document.title.indexOf('*')
      //   if (e.isModified) {
      //     if (idx < 0) document.title += '*'
      //   } else {
      //     if (idx >= 0) document.title = document.title.substr(0, idx)
      //   }
      // })

      // this.myDiagram.addDiagramListener('Modified', function(e) {
      //   console.log(e)
      // })
      // console.log(this.myDiagram)

      // 节点模板的帮助器定义

      function nodeStyle() {
        return [
          // 这个节点位置来自节点数据的“loc”属性,
          // 由点解析静态方法.
          // 如果节点位置如果更改，则更新节点数据的“loc”属性,
          // 使用点解析stringify静态法.
          new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
          {
            // 这个节点位置位于每个节点的中心
            locationSpot: go.Spot.Center
          }
        ]
      }

      // 定义用于创建通常透明的“端口”的函数.
      // 所选对象“名称”用作图形对象的端口ID,
      // align”用于确定端口相对于节点主体的位置,
      // 点”用于控制链路如何与端口连接以及端口是否连接
      // 沿着节点的侧面拉伸,
      // 布尔“output”和“input”参数控制用户是否可以从端口或到端口绘制链接.
      function makePort(name, align, spot, output, input) {
        var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom)
        // 端口基本上只是一个透明的矩形，它沿着节点的侧面延伸，当鼠标经过它时，它就会变成彩色的
        return $(go.Shape,
          {
            fill: 'transparent', // 在回车键事件触发时更改颜色
            strokeWidth: 0, // 不轻触
            width: horizontal ? NaN : 8, // 如果不是水平拉伸，只有8宽
            height: !horizontal ? NaN : 8, // 如果不是垂直伸展，只有8高
            alignment: align, // 在主要形状上对齐端口
            stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
            portId: name, // 将此对象声明为一个“端口”
            fromSpot: spot, // 声明链接可以在此端口连接的位置
            fromLinkable: output, // 声明用户是否可以从这里绘制链接
            toSpot: spot, // 声明链接可以在此端口连接的位置
            toLinkable: input, // 声明用户是否可以绘制到这里的链接
            cursor: 'pointer', // 显示不同的光标以指示潜在的链接点
            mouseEnter: function(e, port) { // 端口参数将是这个形状
              if (!e.diagram.isReadOnly) port.fill = 'rgba(255,0,255,0.5)'
            },
            mouseLeave: function(e, port) {
              port.fill = 'transparent'
            }
          })
      }

      function textStyle() {
        return {
          font: '10pt Lato, Helvetica, Arial, sans-serif',
          stroke: '#333333'
        }
      }

      // 为常规节点定义节点模板
      this.myDiagram.addDiagramListener('ObjectDoubleClicked', (e) => {
        console.log('------------')
        console.log(e)
        // console.log(e.subject.part.data.category)
        if (e.subject.part.data.category === undefined) {
          this.dialogFormVisible = true
          this.selectedNodeKey = e.subject.part.data.key
          console.log(this.selectedNodeKey)
          console.log(this.form.name)
        }
      })

      // 开始节点图表
      this.myDiagram.nodeTemplateMap.add('Start',
        $(go.Node, 'Table', nodeStyle(),
          $(go.Panel, 'Spot',
            $(go.Shape, 'Circle',
              { desiredSize: new go.Size(64, 64), fill: '#F9F3E0', stroke: '#F8BE00', strokeWidth: 1.5 }),
            $(go.TextBlock, 'Start', textStyle(),
              new go.Binding('text'))
          ),
          // 三个指定端口(除顶部外，每一边都有一个端口)都是输出端口:
          makePort('L', go.Spot.Left, go.Spot.Left, true, false),
          makePort('R', go.Spot.Right, go.Spot.Right, true, false),
          makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
        ))

      // 步骤节点图表
      this.myDiagram.nodeTemplateMap.add('', // 默认类别
        $(go.Node, 'Table', nodeStyle(),
          // {doubleClick: function(e, node) {
          //   console.log('__+++++++++++++__')
          //   console.log(e)
          //   console.log(node)
          //   // console.log(this.dialogFormVisible)
          // }},
          // 主要对象是一个用矩形形状包围文本块的面板
          $(go.Panel, 'Auto',
            $(go.Shape, 'RoundedRectangle',
              { desiredSize: new go.Size(74, 56), fill: '#E0F2E0', stroke: '#00B600', strokeWidth: 1.5 },
              new go.Binding('figure', 'figure')),
            $(go.TextBlock, textStyle(),
              {
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit
              },
              new go.Binding('text', this.form.name).makeTwoWay())
          ),
          // 四个指定的端口，每边一个:
          makePort('T', go.Spot.Top, go.Spot.TopSide, false, true),
          makePort('L', go.Spot.Left, go.Spot.LeftSide, true, true),
          makePort('R', go.Spot.Right, go.Spot.RightSide, true, true),
          makePort('B', go.Spot.Bottom, go.Spot.BottomSide, true, false)
        ))

      // 判断节点图表
      this.myDiagram.nodeTemplateMap.add('Conditional',
        $(go.Node, 'Table', nodeStyle(),
          // 主要对象是一个用矩形形状包围文本块的面板
          $(go.Panel, 'Auto',
            $(go.Shape, 'Diamond',
              { desiredSize: new go.Size(70, 70), fill: '#E2ECFA', stroke: '#1774FF', strokeWidth: 1.5 },
              new go.Binding('figure', 'figure')),
            $(go.TextBlock, textStyle(),
              {
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true
              },
              new go.Binding('text').makeTwoWay())
          ),
          // 四个指定的端口，每边一个:
          makePort('T', go.Spot.Top, go.Spot.Top, false, true),
          makePort('L', go.Spot.Left, go.Spot.Left, true, true),
          makePort('R', go.Spot.Right, go.Spot.Right, true, true),
          makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
        ))

      // 结束节点图表
      this.myDiagram.nodeTemplateMap.add('End',
        $(go.Node, 'Table', nodeStyle(),
          $(go.Panel, 'Spot',
            $(go.Shape, 'Circle',
              { desiredSize: new go.Size(64, 64), fill: '#FAE8E8', stroke: '#FF4D4D', strokeWidth: 1.5 }),
            $(go.TextBlock, 'End', textStyle(),
              new go.Binding('text'))
          ),
          // 三个指定的端口，除底部外，每一边都有一个端口，都是输入端口:
          makePort('T', go.Spot.Top, go.Spot.Top, false, true),
          makePort('L', go.Spot.Left, go.Spot.Left, false, true),
          makePort('R', go.Spot.Right, go.Spot.Right, false, true)
        ))

      // taken from ../extensions/Figures.js:
      go.Shape.defineFigureGenerator('File', function(shape, w, h) {
        var geo = new go.Geometry()
        var fig = new go.PathFigure(0, 0, true) // 起点
        geo.add(fig)
        fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0))
        fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h))
        fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
        fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
        var fig2 = new go.PathFigure(0.75 * w, 0, false)
        geo.add(fig2)
        // 折叠
        fig2.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.25 * h))
        fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h))
        geo.spot1 = new go.Spot(0, 0.25)
        geo.spot2 = go.Spot.BottomRight
        return geo
      })
      // 文本节点图表
      // this.myDiagram.nodeTemplateMap.add('Comment',
      //   $(go.Node, 'Auto', nodeStyle(),
      //     $(go.Shape, 'File',
      //       { fill: '#282c34', stroke: '#DEE0A3', strokeWidth: 3 }),
      //     $(go.TextBlock, textStyle(),
      //       {
      //         margin: 8,
      //         maxSize: new go.Size(200, NaN),
      //         wrap: go.TextBlock.WrapFit,
      //         textAlign: 'center',
      //         editable: true
      //       },
      //       new go.Binding('text').makeTwoWay())
      //     // 没有端口，因为没有链接被允许与注释连接
      //   ))

      // 替换linkTemplateMap中的默认链接样板
      this.myDiagram.linkTemplate =
        $(go.Link, // 整个连接面板
          {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 5, toShortLength: 4,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            resegmentable: true,
            // 鼠标悬停巧妙地突出显示链接:
            mouseEnter: function(e, link) { link.findObject('HIGHLIGHT').stroke = 'rgba(30,144,255,0.2)' },
            mouseLeave: function(e, link) { link.findObject('HIGHLIGHT').stroke = 'transparent' },
            selectionAdorned: false
          },
          new go.Binding('points').makeTwoWay(),
          $(go.Shape, // 高光形状，通常是透明的
            { isPanelMain: true, strokeWidth: 8, stroke: 'transparent', name: 'HIGHLIGHT' }),
          $(go.Shape, // 链接路径形状
            { isPanelMain: true, stroke: 'gray', strokeWidth: 2 },
            new go.Binding('stroke', 'isSelected', function(sel) { return sel ? 'dodgerblue' : 'gray' }).ofObject()),
          $(go.Shape, // 箭头
            { toArrow: 'standard', strokeWidth: 0, fill: 'gray' }),
          $(go.Panel, 'Auto', // 链接标签，通常不可见
            { visible: false, name: 'LABEL', segmentIndex: 2, segmentFraction: 0.5 },
            new go.Binding('visible', 'visible').makeTwoWay(),
            $(go.Shape, 'RoundedRectangle', // 标签形状
              { fill: '#F8F8F8', strokeWidth: 0 }),
            $(go.TextBlock, 'Yes', // 标签
              {
                textAlign: 'center',
                font: '10pt helvetica, arial, sans-serif',
                stroke: '#333333',
                editable: true
              },
              new go.Binding('text').makeTwoWay())
          )
        )

      // 使链接标签在从“条件”节点出来时可见。
      // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
      // 这个侦听器由LinkDrawn和LinkRelinked图表事件调用
      // eslint-disable-next-line no-unused-vars
      function showLinkLabel(e) {
        var label = e.subject.findObject('LABEL')
        if (label !== null) label.visible = (e.subject.fromNode.data.category === 'Conditional')
      }

      // 链接工具和重连工具使用的临时链接也是正交的:
      this.myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal
      this.myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal

      this.load() // 从一些JSON文本加载一个初始图
      // 初始化页面左侧的面板
      // myPalette =
      $(go.Palette, 'myPaletteDiv' + this.myId, // 必须命名或引用DIV HTML元素
        {
          // 使用自定义渐变代替默认的动画
          'animationManager.initialAnimationStyle': go.AnimationManager.None,
          'InitialAnimationStarting': animateFadeDown, // 相反，动画使用此函数

          nodeTemplateMap: this.myDiagram.nodeTemplateMap, // 共享myDiagram使用的模板
          model: new go.GraphLinksModel([ // 指定调色板的内容
            { category: 'Start', text: '开始' },
            { text: '子任务', id: '' },
            { category: 'Conditional', text: '判断' },
            { category: 'End', text: '结束' }
            // { category: 'Comment', text: '注释' }
          ])
        })

      // 这是默认动画的重新实现，只是它从下而不是向上淡入。
      function animateFadeDown(e) {
        var diagram = e.diagram
        var animation = new go.Animation()
        animation.isViewportUnconstrained = true // 所以图表定位规则让动画从屏幕开始
        animation.easing = go.Animation.EaseOutExpo
        animation.duration = 900
        // 淡出“向下”，换句话说，从上面淡入
        animation.add(diagram, 'position', diagram.position.copy().offset(0, 200), diagram.position)
        animation.add(diagram, 'opacity', 0, 1)
        animation.start()
      }
    }, // 结束初始化
    /**
     * @description: 保存新建/修改虚任务
     */
    DataSave() {
      console.log('________________')
      console.log(this.isSave)
      console.log(this.isSave.title)
      if (this.isSave.title === 'Untitled') {
        this.open()
      } else {
        this.save()
        this.toParent()
      }
      this.showSaveBox = true
      // this.myDiagram.model = go.Model.fromJson(this.isSave.content.jobJson)
      console.log(JSON.parse(this.myDiagram.model.toJson()));
    },
    sure() {
      console.log('---------')
      const key = this.selectedNodeKey
      var selectNode = this.myDiagram.nodes.filter(function(e) {
        return e.data.key === key
      })
      console.log(selectNode)
      selectNode.pb.j[0].data.text = this.form.name
      selectNode.pb.j[0].data.id = this.form.id.toString()
      selectNode.pb.j[0].data.infoId = this.guid()
      // console.log(selectNode)
      this.myDiagram.model.updateTargetBindings(selectNode.pb.j[0].data);
      // this.myDiagram.model = go.Model.fromJson(this.myDiagram.model.toJson())
      // console.log('++++++++++' + selectNode.data.key)
      // this.load()
      this.dialogFormVisible = false
    },
    // 命名传到父级
    toParent() {
      if (this.SaveName) {
        const obj = {
          name: this.SaveName,
          index: this.isSave.name,
          data: this.SaveData
        }
        console.log(obj)
        this.$emit('fromChild', obj)
      } else {
        const obj1 = {
          name: this.isSave.title,
          index: this.isSave.name,
          data: this.SaveData
        }
        console.log(obj1)
        this.$emit('fromChild', obj1)
      }
    },
    // 无法打开用户可以编辑的JSON格式的图表模型
    // 可以获取到流程图的数据
    save() {
      // document.getElementById('mySavedModel').value = this.myDiagram.model.toJson() // 流程图中的值
      this.myDiagram.isModified = false
      // console.log(this.myDiagram.model.toJson(), '流程图数据')
      this.SaveData = JSON.stringify(this.myDiagram.model.toJson())
      // console.log(this.myDiagram.isModified)
      // var button = document.getElementById("SaveButton")
      // if (button) button.disabled = true
    },
    // 可以通过流程图数据刷新页面显示效果
    load() {
      this.myDiagram.model = go.Model.fromJson(this.myDiagram.model.toJson())
    },
    // 新建文件保存前输入文件名
    open() {
      this.$prompt('请为当前任务命名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '当前任务名为: ' + value
        })
        this.SaveName = value
        this.save()
        this.toParent()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    // 通过打开一个新窗口来打印图表，其中包含每个页面的图表内容的SVG图像
    printDiagram() {
      var svgWindow = window.open()
      if (!svgWindow) return // 未能打开新窗口
      var printSize = new go.Size(700, 960)
      var bnds = this.myDiagram.documentBounds
      var x = bnds.x
      var y = bnds.y
      while (y < bnds.bottom) {
        while (x < bnds.right) {
          var svg = this.myDiagram.makeSvg({ scale: 1.0, position: new go.Point(x, y), size: printSize })
          svgWindow.document.body.appendChild(svg)
          x += printSize.width
        }
        x = bnds.x
        y += printSize.height
      }
      setTimeout(function() { svgWindow.print() }, 1)
    },
    setCron() {
      this.showCronBox = true
    },
    /**
     * @description: 关闭设置调度时间面板
     */
    sureCron() {
      console.log(this.jobCron);
      this.showCronBox = false
    },
    /**
     * @description: 关闭保存面板
     */
    sureSave(dataForm) {
      this.$refs.virtualProjectInfo.validate((valid) => {
        if (valid) {
          /** 添加虚任务 */
          wfApi.addVirtualTask(
            {
              id: this.id, // 类型id
              projectId: this.projId,
              jobDesc: this.virtualProjectInfo.virtualProjectName,
              jobCron: this.jobCron,
              jobJson: this.myDiagram.model.toJson(),
              jobType: this.jobType,
              triggerStatus: this.taskTrigger ? 1 : 0,
              projectGroupId: this.$store.state.taskAdmin.GroupId
              // triggerNextTime: 0
            }
          ).then(response => {
            if (response.code === 200) {
              this.$store.commit('changeWatch', 1)
              this.$notify.success({
                title: '成功',
                message: response.msg
              })
              this.$emit('refreshList', this.isSave)
            } else {
              this.$notify.error({
                title: '错误',
                message: response.msg
              })
            }
          }).catch(err => {
            this.$notify.error({
              title: '错误',
              message: err.response
            })
          })
          this.showSaveBox = false
        } else {
          return false
        }
      })
    },
    /**
     * @description: 执行一次
     */
    runVirtualOnce() {
      wfApi.triggerVirtualTask({
        id: this.id
      }).then(response => {
        console.log(response);
        if (response.code === 200) {
          this.$notify.success({
            title: '成功',
            message: '执行完成'
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '执行发生错误'
          })
        }
      }).catch(err => {
        this.$notify.error({
          title: '错误',
          message: err.response
        })
      })
    },
    /**
     * @description: 任务启停
     */
    changeSwitch() {
      if (this.isSave.hasOwnProperty('content')) {
        this.taskTrigger
          ? handlerStart.call(this, this.isSave.content)
          : handlerStop.call(this, this.isSave.content)
        this.$emit('refreshList', this.isSave)
      }
    },
    guid() {
      return ('xxxxxxxxxxxxxxxxxxx'.concat((new Date()).valueOf().toString())).replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0;
        var v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16);
      })
    },
    // 查看日志
    handlerViewLog() {
      // handlerViewLog.call(this, temp);
      this.$store.commit('SET_LOGVIEW_TYPE', 1)
      this.logview = true;
      this.jobId = this.isSave.content.id;
      this.$refs.jobLog?.fetchData();
    },
    fetchData() {
      this.listLoading = true;
      this.listQuery.projectIds = this.$store.state.taskAdmin.projectId;
      job.getList(this.listQuery).then((response) => {
        const {
          content
        } = response;
        this.total = content.recordsTotal;
        this.list = content.data;
        this.listLoading = false;

        this.$store.commit('SET_TASKLIST', this.list)
      });
    },
    // 删除
    handlerDelete() {
      handlerDelete
        .call(this, this.isSave.content)
        .then(() => {
          this.$emit('deleteDetailTab', this.isSave.content.id);
          this.$emit('deleteJob', true);
          this.$emit('refreshList', this.isSave)
        })
        .then(() => {});
    }
  }
}
</script>

<style lang="scss">
.sample {
  .tit {
    height: 30px;
    line-height: 30px;
    background-color: skyblue;
    margin: 10px;
    .el-button {
      margin: 0px 24px;
    }
  }
}
</style>
<style lang="scss" scoped>
.el-input {
  .el-input__inner {
    text-overflow: ellipsis;
  }
}
.svg-icon {
  font-size: 16px;
}
.svg-icon:hover {
  color: #3d5eff;
}
</style>
<style scoped>
.header {
  overflow: hidden;
  padding: 8px 0;
  border-bottom: 1px solid rgba(235, 235, 235, 1);
}
.header_action {
    font-size: 14px;
    font-family: PingFangHK-Regular, PingFangHK;
    font-weight: 400;
    line-height: 20px;
    float: left;
    cursor: pointer;
}
.svgIcon {
  font-size: 18px;
}
.header_action:not(:first-child) {
    margin-left: 32px;
}
.header_action span {
    margin-left: 4px;
}
.header_switch {
    float: right;
}
.header-second {
  overflow: hidden;
  padding: 8px 0;
  border-bottom: 1px solid rgba(235, 235, 235, 1);
  background: #f8f8fa;
}

</style>
