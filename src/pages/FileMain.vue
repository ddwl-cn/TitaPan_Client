<template>
  <el-container class="is-vertical">
    <el-header height="40px" style="text-align: right; font-size: 12px">
      <FileMainHeader :sentCommend="sentCreateFolder" ref="FileMainHeader"></FileMainHeader>
    </el-header>
    <el-main style="line-height: 15px; padding: 0; height: 500px">
    <!-- <router-view ref="child"></router-view> -->
      <FileMainContent ref="FileMainContent"></FileMainContent>
    </el-main>
  </el-container>
</template>

<script>
import FileMainHeader from "../pages/FileMainHeader";
import FileMainContent from "../pages/FileMainContent";
export default {
  name: "FileMain",
  methods:{
    // 向FileMainContent组件发送添加文件夹的命令
    sentCreateFolder(){
        this.$refs.FileMainContent.createFolder()
    },
    getUserFileList(){
      this.$refs.FileMainContent.getUserFileList()
    },
    // 从组件userpath中获得当前用户路径
    getUserPath(){
      return this.$refs.FileMainHeader.getUserPath()
    },
    toPath(nextPath){
      this.$refs.FileMainHeader.toPath(nextPath)
    },
    getRowsSelected(){
      return this.$refs.FileMainContent.getRowsSelected()
    },
    deleteSelected(rows){
      this.$refs.FileMainContent.deleteSelected(rows)
    },
    downloadSelected(rows){
      this.$refs.FileMainContent.downloadSelected(rows)
    }
  },
  components: {
    FileMainHeader,
    FileMainContent,
  },
};
</script>

<style scoped>
.el-main {
  text-align: center;
  line-height: 160px;
}
.el-container {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}
</style>
