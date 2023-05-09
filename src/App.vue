<template>
  <div id="app" >
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {
  },
};
</script>

<style>
#app{
  height: 100%;
}
/*.page-scroll {*/
/*  height: 100%;*/
/*}*/

/*.page-scroll .el-scrollbar__wrap {*/
/*  overflow-x: hidden;*/
/*}*/
/**修改全局的滚动条*/
/**滚动条的宽度*/
::-webkit-scrollbar {
  width: 8px;

}
::-webkit-scrollbar-thumb {
  background-color: #eaecf1;
  border-radius: 3px;
}
</style>
