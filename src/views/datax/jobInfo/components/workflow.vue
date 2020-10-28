<template>
  <div id="sample">
    <div style="marginBottom: 20px;" class="tit">
      <el-button size="mini" @click="DataSave">保存</el-button>
      <el-button size="mini" @click="DataSave">执行一次</el-button>
      <el-button size="mini" @click="DataSave">查看日志</el-button>
      <el-button size="mini" @click="setCron">设置调度时间</el-button>
    </div>
    <div style="width: 100%; display: flex; border: solid 1px lightgray;">
      <div :id="'myPaletteDiv' + myId" style="width: 100px; margin-right: 2px; " />
      <div :id="'myDiagramDiv' + myId" style="flex-grow: 1; height: 750px;" />
    </div>
    <el-dialog id="taskDialog" title="选择任务" :visible.sync="dialogFormVisible" style="width: 50%; left: 26%;">
      <el-form :model="form">
        <el-form-item label="任务名称" label-width="120">
          <el-select v-model="form.name" placeholder="请选择任务名称" style="width: 280px;">
            <el-option v-for="(item, index) in this.taskList" :key="index" :label="item.jobDesc + ' @' + item.glueType.replace('GLUE_', '').toLowerCase()" :value="item.jobDesc" />
            <!-- <el-option label="task_02" value="task_02" /> -->
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="showCronBox"
      width="60%"
      append-to-body
    >
      <cron v-model="jobCron" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCronBox = false;">关闭</el-button>
        <el-button type="primary" @click="showCronBox = false">确 定</el-button>
      </span>
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
    </textarea>
    <button @click="printDiagram">Print Diagram Using SVG</button> -->
  </div>
</template>
<script id="code">
import go from 'gojs';
import cron from '@/components/Cron'

export default {
  name: 'Flow',
  components: {
    cron
  },
  props: ['isSave', 'taskList'],
  data() {
    return {
      myDiagram: '',
      myId: '',
      SaveName: '',
      SaveData: '',
      dialogFormVisible: false,
      form: {},
      selectedNodeKey: 9999,
      showCronBox: false,
      jobCron: ''
    }
  },
  watch: {
    'isSave'(val) {
      console.log(val)
    }
  },
  created() {
    console.log(this.isSave)
    var timestamp = (new Date()).valueOf()
    console.log(timestamp)
    this.myId = timestamp
    console.log(this.taskList)
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
            { text: '子任务' },
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
    },
    sure() {
      console.log('---------')
      const key = this.selectedNodeKey
      var selectNode = this.myDiagram.nodes.filter(function(e) {
        return e.data.key === key
      })
      console.log(selectNode)
      selectNode.pb.j[0].data.text = this.form.name
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
    save() {
      // document.getElementById('mySavedModel').value = this.myDiagram.model.toJson() // 流程图中的值
      this.myDiagram.isModified = false
      console.log(this.myDiagram.model.toJson())
      this.SaveData = JSON.stringify(this.myDiagram.model.toJson())
      // console.log(this.myDiagram.isModified)
      // var button = document.getElementById("SaveButton")
      // if (button) button.disabled = true
    },
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
    margin-bottom: 20px;
  }
}
</style>
