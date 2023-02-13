<template>
  <el-container>
    <el-menu @select="menuSelected">
<!--      <el-container class="is-vertical shadow-container">-->
        <el-card shadow="hover">
      <router-link to="/user/home" >
        <template slot="title">我的文件</template>
        <el-menu-item index="1">
          <el-image
              style="width: 30px; height: 30px; margin-right: 5px;margin-bottom: 2px"
              :src="require('../assets/icon/'+selected_icon[0][switches[index][0]])"></el-image>我的文件</el-menu-item>
      </router-link>
        </el-card>

        <el-card shadow="hover">
      <router-link to="/user/share">
        <template slot="title">我的分享</template>
        <el-menu-item index="2" >
          <el-image
            style="width: 30px; height: 30px; margin-right: 5px;margin-bottom: 2px"
            :src="require('../assets/icon/'+selected_icon[1][switches[index][1]])"></el-image>我的分享</el-menu-item>
      </router-link>
        </el-card>
        <el-card shadow="hover">
        <router-link to="/user/fileSquare">
      <template slot="title">文件广场</template>
      <el-menu-item index="3">
        <el-image
          style="width: 30px; height: 30px; margin-right: 5px;margin-bottom: 2px"
          :src="require('../assets/icon/'+selected_icon[2][switches[index][2]])"></el-image>文件广场</el-menu-item>
        </router-link>
        </el-card>
<!--  </el-container>-->
    </el-menu>
<!--    <el-container class="is-vertical shadow-container" style="margin-top: 50px;height: 50px">-->
    <el-footer>
    <el-upload
          class="upload-demo shadow-container"
          drag
          style="width: 200px;margin-top: 159px;margin-left: -20px"
          action=""
          :on-change="onChange"
          :auto-upload="false"
          :show-file-list="false"
          v-if="isHome()"
          multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>

      <el-upload
          class="upload-demo shadow-container"
          drag
          style="width: 200px;margin-top: 159px;margin-left: -20px"
          action=""
          :on-change="uploadPublicFileList"
          :auto-upload="false"
          :show-file-list="false"
          v-if="isFileSquare()">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处<em>分享给所有人</em></div>
      </el-upload>
    </el-footer>
    <!--    </el-container>-->
  </el-container>
</template>

<script>
import SparkMD5 from "spark-md5";
export default {
  name: "Navigation",
  data(){
    return {
      index: 0,
      selected_icon: [
        ["home.png", "home-selected.png"],
        ["share.png", "share-selected.png"],
        ["fileSquare.png", "fileSquare-selected.png"]
      ],
      // 四种状态
      switches:[[0,0,0],[1,0,0],[0,1,0],[0,0,1]],
    }
  },
  components: {},
  methods: {
    isHome(){
      return this.$route.path.endsWith('home') || this.$route.path.endsWith('/');
    },
    isFileSquare(){
      return this.$route.path.endsWith('fileSquare');
    },
    onChange(file, fileList){
      var vc = this.$parent.$parent.$parent.$children[1].$children[1].$children[0].$children[0].$children[0].$children[0].$children[0]
      // 借用FileMainHeader中的上传方法即可
      vc.handleSelect(file, fileList);
      // 将el-upload中的文件列表 fileList 重置
      this.$children[1].clearFiles();
    },
    uploadPublicFileList(file, fileList){
      console.log(file)
      const chunkSize = 1024*1024*2;  // 2 MB
      const chunks = Math.ceil(file.size / chunkSize);
      const spark = new SparkMD5.ArrayBuffer();
      let loadedChunks = 0;

      for (let i = 0; i < chunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.raw.slice(start, end);

        const chunkReader = new FileReader();
        chunkReader.onload = (e)=> {
          spark.append(e.target.result);
          loadedChunks++;
          if (loadedChunks === chunks) {
            const result = spark.end();
            let fileChunkInfo = {
              original_file_name: file.name,
              id: result,
              md5_val: result,
              chunk_size: file.size,
              number: 0,
              total: 1,
              std_chunk_size: chunkSize,
              mFile: file.raw,
            }
            console.log(this)
            this.$http({
              method: "POST",
              url: "/public/uploadPublicFile",
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              data:{
                original_file_name: file.name,
                id: result,
                md5_val: result,
                chunk_size: file.size,
                number: 0,
                total: 1,
                std_chunk_size: chunkSize,
                mFile: file.raw,
                suffix: file.name.substr(file.name.lastIndexOf(".")),
                f_description: "精美图片欣赏",
              }
            }).then((res)=>{
              if(res.status === 200){
                console.log(res.data.msg)
                const vm = this.$parent.$parent.$children[1].$children[0].$children[0].$children[0];
                vm.getPublicFileList(vm.data.currentPage)
              }
            })
          }
        };
        chunkReader.readAsArrayBuffer(chunk);
      }
    },
    // 菜单被激活
    menuSelected(index){
      this.index = index;
    }
  },
};
</script>

<style scoped>
.router-link-active {
  text-decoration: none;
}
.shadow-container {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}
.el-menu-item{
  width: 100%;
  margin-top: -25px;
}
/*浏览器中寻找 修改一级导航栏浮动颜色*/
.el-submenu__title:hover, .el-menu-item:focus, .el-menu-item:hover{
  background-color: white;
}
.el-menu{
  border-style: none;
  border-radius: 15px;
  background-color: #f8f8f8;
}
/deep/ .el-upload{
  width: 100%;

}
/deep/ .el-upload .el-upload-dragger{
  width: 100%;
  border-style: none;
}
.el-card{
  width: 99%;
  height: 45px;
  margin-bottom: 20px;
}
/*.el-card :hover{*/
/*  background-color: RGB(237,245,254);*/
/*}*/
a {
  text-decoration: none;
  color: black;
}
</style>
