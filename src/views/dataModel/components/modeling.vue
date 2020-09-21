<template>
  <div id="myDiagramDiv" style="width:100%; height:700px; background-color: #DAE4E4;"></div>
</template>

<script>
import go from "gojs";
const $ = go.GraphObject.make;
export default {
  name: "Modeling",

  mounted() {
    var myDiagram = $(go.Diagram, "myDiagramDiv", {
      "undoManager.isEnabled": true, // enable Ctrl-Z to undo and Ctrl-Y to redo
    });

    var myModel = $(go.Model);
    // in the model data, each node is represented by a JavaScript object:
    myModel.nodeDataArray = [
      { key: "Alpha" },
      { key: "Beta" },
      { key: "Gamma" },
    ];
    myDiagram.model = myModel;
  },
};
</script>

<style>
</style>