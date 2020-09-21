<template>
  <div class="content">
    <div class="left">
      <LeftBar />
    </div>
    <div class="right">
        <Modeling />
    </div>
  </div>
</template>

<script>
import LeftBar from "./components/leftBar";
import Modeling from "./components/modeling"
export default {
  components: {
    LeftBar,
    Modeling
  },
};
</script>

<style scoped>
.content {
    display: flex;
    background-color:rgb(247, 249, 251) ;
}
.left {
    width: 300px;
    padding: 10px;
}
.right{
  width: calc(100% - 300px);
}
</style>