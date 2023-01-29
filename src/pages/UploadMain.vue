<template>
  <el-container class="is-vertical">
    <el-header height="40px" style="text-align: right; font-size: 12px">
      <UploadMainHeader ref="UploadMainHeader"></UploadMainHeader>
    </el-header>
    <el-main style="line-height: 15px; padding: 0; height: 500px">
    <!-- <router-view ref="child"></router-view> -->
      <UploadMainContent ref="UploadMainContent"></UploadMainContent>
    </el-main>
  </el-container>
</template>

<script>
import UploadMainContent from "./UploadMainContent"
import UploadMainHeader from "./UploadMainHeader"
   export default {
    name: 'UploadMain',
    methods:{
        // 从header中获取上传文件列表 返回给content
        sentUploadList(){
            return this.$refs.UploadMainHeader.sentUploadList()
        },
        // content回调header中的方法
        continueUpload(i){
            this.$refs.UploadMainHeader.handleUploadFile(i)
        },
        pauseUpload(i){
            this.$refs.UploadMainHeader.cancelRequest(i)
        }
    },
    components:{
        UploadMainContent,
        UploadMainHeader
    }
   }

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