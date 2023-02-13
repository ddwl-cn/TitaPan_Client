<template>
  <el-container class="is-horizontal shadow-container">
    <el-header style="height: 10px"><el-input style="height: 30px;width: 200px" v-model="search"/></el-header>
    <el-main>
        <el-row type="flex" justify="space-around" :gutter="20" v-for="i in Math.ceil(data.showNumber/4)" :key="getUUID()">
          <el-col :span="6" v-for="j in (data.showNumber-(i-1)*4)>4?4:(data.showNumber-(i-1)*4)" :key="getUUID()">
            <FileInfoBox :publicFileInfo="data.publicFileList[(i-1)*4+j-1]"></FileInfoBox>
          </el-col>
        </el-row>
    </el-main>
    <el-footer style="margin-top: -10px">
      <el-pagination
          background
          @current-change="getPublicFileList"
          style="text-align: center;"
          layout="prev, pager, next"
          :total="data.totalPages*10"
          :current-page.sync="data.currentPage">
      </el-pagination>
    </el-footer>
  </el-container>
</template>

<script>
import FileInfoBox from "@/pages/FileInfoBox";
import { v4 as UUID } from "uuid";
export default {
  name: "FileSquareContent",
  components:{
    FileInfoBox
  },
  data(){
    return{
      search: '',
      data: {
        // 公共当前页面文件信息列表
        publicFileList: [],
        // 分页数目
        totalPages: null,
        // 当前页面
        currentPage: 1,
        // 展示数量
        showNumber: null
      },
      // 先写在这里 文件信息对象
      publicFileInfo: {
        // 封面url
        previewUrl: '',
        // 文件id
        fid: 0,
        // 文件名
        f_name: '',
        // 文件大小
        f_size: '',
        // 下载量
        downloads: 0,
        // 软件评分
        score: 0.0
      }
    }
  },
  methods:{
    getUUID(){
      return UUID();
    },
    getPublicFileList(currentIndex){
      console.log(currentIndex)
      this.$http({
        method: 'POST',
        url: '/public/getPublicFileList',
        params:{
          index: currentIndex,
          count: 8
        }
      }).then((res)=>{
        if(res.status===200){
          if(res.data.msg === "getPublicFileListSuccess"){
            this.data.publicFileList = res.data.data.publicFileList;
            this.data.totalPages = res.data.data.totalPages;
            this.data.currentPage = res.data.data.currentPage;
            this.data.showNumber = res.data.data.showNumber;
            this.data.f_description = res.data.data.f_description;
            this.$forceUpdate();
            console.log(this.data.publicFileList[0].preview_url)
          }
          else{
            this.$message({
              type: 'error',
              message: '分页错误！',
            })
          }
        }
      })
    }
  },
  mounted() {
    setTimeout(()=> {
      this.getPublicFileList(1);
    }, 50)
  }

}
</script>

<style scoped>
.shadow-container {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  height: 540px;
  display: flex;
  flex-wrap: wrap;
}
/deep/ .el-input .el-input__inner {
  height: 25px;
  line-height: 25px;
}
.el-row{
  width: 100%;
  margin-bottom: 20px;
  height: 200px;
}
.el-col {
  border-radius: 4px;
}
</style>