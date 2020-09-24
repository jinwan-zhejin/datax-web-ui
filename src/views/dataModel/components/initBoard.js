import go from "gojs";
import ColumnResizingTool from "./ColumnResizingTool";
import RowResizingTool from "./RowResizingTool";
function init(_this, timestamp) {
  const $ = go.GraphObject.make; // for conciseness in defining templates
  var myDiagram = $(go.Diagram, "myDiagramDiv" + timestamp, {
    validCycle: go.Diagram.CycleNotDirected, // don't allow loops
    "undoManager.isEnabled": true
  });
  myDiagram.toolManager.mouseDownTools.add(new RowResizingTool());
  myDiagram.toolManager.mouseDownTools.add(new ColumnResizingTool());
  // This template is a Panel that is used to represent each item in a Panel.itemArray.
  // The Panel is data bound to the item object.
  var fieldTemplate = $(
    go.Panel,
    "TableRow", // this Panel is a row in the containing Table
    new go.Binding("portId", "name"), // this Panel is a "port"
    {
      background: "transparent", // so this port's background can be picked by the mouse
      fromSpot: go.Spot.Right, // links only go from the right side to the left side
      toSpot: go.Spot.Left,
      // allow drawing links from or to this port:
      fromLinkable: true,
      toLinkable: true
    },
    $(
      go.Shape,
      {
        column: 0,
        width: 12,
        height: 12,
        margin: 4,
        // but disallow drawing links from or to this shape:
        fromLinkable: false,
        toLinkable: false
      },
      new go.Binding("figure", "figure"),
      new go.Binding("fill", "color")
    ),
    $(
      go.TextBlock,
      {
        column: 1,
        margin: new go.Margin(0, 2),
        stretch: go.GraphObject.Horizontal,
        font: "bold 13px sans-serif",
        wrap: go.TextBlock.None,
        overflow: go.TextBlock.OverflowEllipsis,
        // and disallow drawing links from or to this text:
        fromLinkable: false,
        toLinkable: false
      },
      new go.Binding("text", "name")
    ),
    $(
      go.TextBlock,
      {
        column: 2,
        margin: new go.Margin(0, 2),
        stretch: go.GraphObject.Horizontal,
        font: "13px sans-serif",
        maxLines: 3,
        overflow: go.TextBlock.OverflowEllipsis,
        editable: true
      },
      new go.Binding("text", "info").makeTwoWay()
    ),
    $(
      go.TextBlock,
      {
        column: 3,
        margin: new go.Margin(0, 2),
        stretch: go.GraphObject.Horizontal,
        font: "bold 13px sans-serif",
        wrap: go.TextBlock.None,
        overflow: go.TextBlock.OverflowEllipsis,
        // and disallow drawing links from or to this text:
        fromLinkable: false,
        toLinkable: false
      },
      new go.Binding("text", "type")
    ),
    $(
      go.TextBlock,
      {
        column: 4,
        margin: new go.Margin(0, 2),
        stretch: go.GraphObject.Horizontal,
        font: "bold 13px sans-serif",
        wrap: go.TextBlock.None,
        overflow: go.TextBlock.OverflowEllipsis,
        // and disallow drawing links from or to this text:
        fromLinkable: false,
        toLinkable: false
      },
      new go.Binding("text", "isPrimarykey")
    )
  );
  // Return initialization for a RowColumnDefinition, specifying a particular column
  // and adding a Binding of RowColumnDefinition.width to the IDX'th number in the data.widths Array
  function makeWidthBinding(idx) {
    // These two conversion functions are closed over the IDX variable.
    // This source-to-target conversion extracts a number from the Array at the given index.
    function getColumnWidth(arr) {
      if (Array.isArray(arr) && idx < arr.length) return arr[idx];
      return NaN;
    }
    // This target-to-source conversion sets a number in the Array at the given index.
    function setColumnWidth(w, data) {
      var arr = data.widths;
      if (!arr) arr = [];
      if (idx >= arr.length) {
        for (var i = arr.length; i <= idx; i++) arr[i] = NaN; // default to NaN
      }
      arr[idx] = w;
      return arr; // need to return the Array (as the value of data.widths)
    }
    return [
      { column: idx },
      new go.Binding("width", "widths", getColumnWidth).makeTwoWay(
        setColumnWidth
      )
    ];
  }
  // This template represents a whole "record".
  //节点样式
  myDiagram.nodeTemplate = $(
    go.Node,
    "Auto",
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
      go.Point.stringify
    ),
    // this rectangular shape surrounds the content of the node
    $(go.Shape, { fill: "#EEEEEE" }),
    // the content consists of a header and a list of items
    $(
      go.Panel,
      "Vertical",
      { stretch: go.GraphObject.Horizontal, alignment: go.Spot.TopLeft },
      // this is the header for the whole node
      $(
        go.Panel,
        "Auto",
        { stretch: go.GraphObject.Horizontal }, // as wide as the whole node
        $(go.Shape, { fill: "#1570A6", stroke: null }),
        $(
          go.TextBlock,
          {
            alignment: go.Spot.Center,
            margin: 3,
            stroke: "white",
            textAlign: "center",
            font: "bold 12pt sans-serif"
          },
          new go.Binding("text", "tableName")
        )
      ),
      // this Panel holds a Panel for each item object in the itemArray;
      // each item Panel is defined by the itemTemplate to be a TableRow in this Table
      $(
        go.Panel,
        "Table",
        {
          name: "TABLE",
          stretch: go.GraphObject.Horizontal,
          minSize: new go.Size(100, 10),
          defaultAlignment: go.Spot.Left,
          defaultStretch: go.GraphObject.Horizontal,
          defaultColumnSeparatorStroke: "gray",
          defaultRowSeparatorStroke: "gray",
          itemTemplate: fieldTemplate
        },
        $(go.RowColumnDefinition, makeWidthBinding(0)),
        $(go.RowColumnDefinition, makeWidthBinding(1)),
        $(go.RowColumnDefinition, makeWidthBinding(2)),
        new go.Binding("itemArray", "fields")
      ) // end Table Panel of items
    ), // end Vertical Panel
    {
      // define a context menu for each node
      contextMenu: $(
        "ContextMenu", // that has one button
        $("ContextMenuButton", $(go.TextBlock, "编辑"), { click: editFields })
        // more ContextMenuButtons would go here
      ) // end Adornment
    }
  ); // end Node

  //连线样式
  myDiagram.linkTemplate = $(
    go.Link, // the whole link panel
    {
      routing: go.Link.AvoidsNodes,
      curve: go.Link.JumpOver,
      corner: 5,
      toShortLength: 4,
      relinkableFrom: true,
      relinkableTo: true,
      reshapable: true,
      resegmentable: true,
      // mouse-overs subtly highlight links:
      mouseEnter: function(e, link) {
        link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
      },
      mouseLeave: function(e, link) {
        link.findObject("HIGHLIGHT").stroke = "transparent";
      },
      selectionAdorned: false
    },
    new go.Binding("points").makeTwoWay(),
    $(
      go.Shape, // the highlight shape, normally transparent
      {
        isPanelMain: true,
        strokeWidth: 8,
        stroke: "transparent",
        name: "HIGHLIGHT"
      }
    ),
    $(
      go.Shape, // the link path shape
      { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
      new go.Binding("stroke", "isSelected", function(sel) {
        return sel ? "dodgerblue" : "gray";
      }).ofObject()
    ),
    $(
      go.Shape, // the arrowhead
      { toArrow: "standard", strokeWidth: 0, fill: "gray" }
    ),
    $(
      go.Panel,
      "Auto", // the link label, normally not visible
      { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
      new go.Binding("visible", "visible").makeTwoWay(),
      $(
        go.Shape,
        "RoundedRectangle", // the label shape
        { fill: "#F8F8F8", strokeWidth: 0 }
      ),
      $(
        go.TextBlock,
        "Filter", // the label
        {
          textAlign: "center",
          font: "10pt helvetica, arial, sans-serif",
          stroke: "#333333",
          editable: true
        },
        new go.Binding("text").makeTwoWay()
      )
    ),
    $(
      go.TextBlock,
      "Filter", // the label
      {
        textAlign: "center",
        font: "10pt helvetica, arial, sans-serif",
        stroke: "#333333",
        editable: true
      },
      new go.Binding("text").makeTwoWay()
    )
  );
  myDiagram.model = $(go.GraphLinksModel, {
    copiesArrays: true,
    copiesArrayObjects: true,
    linkFromPortIdProperty: "fromPort",
    linkToPortIdProperty: "toPort",
    // automatically update the model that is shown on this page
    Changed: function(e) {},
    nodeDataArray: [
      // {
      //   key: "Record1",
      //   widths: [NaN, NaN, 60],
      //   fields: [
      //     {
      //       name: "field1",
      //       info: "first field",
      //       color: "#F7B84B",
      //       figure: "Ellipse",
      //       type: "int",
      //       isPrimarykey: "true"
      //     },
      //     {
      //       name: "field2",
      //       info: "the second one",
      //       color: "#F25022",
      //       figure: "Ellipse",
      //       type: "int",
      //       isPrimarykey: "true"
      //     },
      //     { name: "fieldThree", info: "3rd", color: "#00BCF2" }
      //   ],
      //   loc: "0 0"
      // }
    ],
    linkDataArray: [
      // {
      //   from: "Record1",
      //   fromPort: "field1",
      //   to: "Record2",
      //   toPort: "fieldA"
      // }
    ]
  });

  var myPalette = $(go.Palette, "myPaletteDiv" + timestamp);
  myPalette.nodeTemplate = $(
    go.Node,
    "Horizontal",
    $(
      go.Shape,
      { width: 14, height: 14, fill: "white" },
      new go.Binding("fill", "color")
    ),
    $(go.TextBlock, new go.Binding("text", "color"))
  );

  // the list of data to show in the Palette
  myPalette.model.nodeDataArray = [
    {
      key: "id",
      tableName: 'tablename',
      color: "table",
      widths: [NaN, NaN, 60],
      fields: []
    }
  ];

  //编辑字段
  function editFields(e, obj) {
    myDiagram.commit(function(d) {
      // get the context menu that holds the button that was clicked
      var contextmenu = obj.part;
      // get the node data to which the Node is data bound
      var nodedata = contextmenu.data;

      // compute the next color for the node
      console.log(nodedata);
      _this.gridData = nodedata.fields;
      _this.dialogTableVisible = true;

      // d.model.updateTargetBindings(nodeData);
      var newcolor = "lightblue";
      switch (nodedata.color) {
        case "lightblue":
          newcolor = "lightgreen";
          break;
        case "lightgreen":
          newcolor = "lightyellow";
          break;
        case "lightyellow":
          newcolor = "orange";
          break;
        case "orange":
          newcolor = "lightblue";
          break;
      }
      // modify the node data
      // this evaluates data Bindings and records changes in the UndoManager
      d.model.set(nodedata, "color", newcolor);
    }, "changed color");
  }

  //双击事件
  myDiagram.addDiagramListener("ObjectDoubleClicked", function(e) {
    console.log(e.subject.part.data);
    _this.dialogTableVisible = true;
    _this.fieldsData = e.subject.part.data.fields;
    _this.node = e.subject.part.data;
  });

  return myDiagram;
}

export default init;
