<template>
  <el-card :body-style="{ padding: '0px' }">
    <div slot="header" class="clearfix">
      <img :src="publicFileInfo.preview_url" class="image">
      <el-button style="float: right; padding-top: 20px" type="text">保存到网盘</el-button>
    </div>
    <div style="padding: 10px;">
      <span><el-link :underline="false" type="info"><p>{{publicFileInfo.f_name}}</p></el-link></span>
      <div class="bottom clearfix">
        <p class="p-info">{{publicFileInfo.f_description}}</p>
<!--        <span class="mini-font">下载量:{{publicFileInfo.downloads}}</span> <span class="mini-font">软件评分:{{publicFileInfo.score}}</span>-->
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "FileInfoBox",
  props: ['publicFileInfo']
}
</script>

<style scoped>
.el-card{
  min-width: 100%;
  height: 100%;
  margin-top: 10px;
  margin-right: 10px;
  margin-left: 10px;
  transition: all .5s;
  border-radius: 15px;
}
img{
  width: 50px;
  height: 50px;
  border-radius: 10px;
  margin-left: 5px;
  margin-top: 5px;
}
/deep/ .el-card__header {
  padding: 5px 10px;
}
.p-info{
  font-size: 12px;
  text-indent: 2.6em;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.el-link{
  text-decoration: none;
  font-size: 12px;
  font-weight: 900;
  margin: -15px 0;
}
.mini-font{
  font-size: 12px;
  -webkit-transform: scale(0.2);
}
</style>