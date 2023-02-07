<template>
  <div>
    <el-menu>
      <el-container class="is-vertical">
      <router-link to="/user/home">
        <template slot="title">主页</template>
        <el-menu-item index="1">主页</el-menu-item>
      </router-link>

      <!-- <router-link to="/user/extract/:share_uuid/:share_code">
        <template slot="title">提取文件</template>

        <el-menu-item index="2">提取文件</el-menu-item>
      </router-link> -->

      <router-link to="/user/share">
        <template slot="title">分享链接管理</template>
        <el-menu-item index="3">分享链接管理</el-menu-item>
      </router-link>

      <template slot="title">文件广场</template>
      <el-menu-item index="4">文件广场</el-menu-item>
  </el-container>
    </el-menu>
    <el-container class="is-vertical" >
      <div v-if="isHome()">
      <el-upload
          class="upload-demo"
          drag
          style="width: 200px;margin-top: 50px"
          action=""
          :on-change="onChange"
          :auto-upload="false"
          :show-file-list="false"
          multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      </div>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Navigation",
  components: {},
  methods: {
    isHome(){
      return this.$route.path.endsWith('home') || this.$route.path.endsWith('/');
    },
    onChange(file, fileList){
      var vc = this.$parent.$parent.$parent.$children[1].$children[1].$children[0].$children[0].$children[0].$children[0].$children[0]
      // 借用FileMainHeader中的上传方法即可
      vc.handleSelect(file, fileList);
      // 将el-upload中的文件列表 fileList 重置
      this.$children[1].$children[0].clearFiles();
    },
  },
};
</script>

<style scoped>
.router-link-active {
  text-decoration: none;
}
.el-container{

}
.el-menu-item{

}
.el-menu{
  border-radius: 10px;
}
/deep/ .el-upload{
  width: 100%;
}
/deep/ .el-upload .el-upload-dragger{
  width: 100%;
}
a {
  text-decoration: none;
  color: black;
}
</style>
