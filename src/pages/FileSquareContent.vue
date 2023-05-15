<template>
  <el-container class="is-vertical shadow-container" style="height: 96%;width: 99%">
    <el-header style="height: 20px">
      <div>

<!--      <el-radio-group style="float:left;margin-top: 15px;display: inline-block" v-model="radio">-->
<!--        <el-radio border size="small" :label="0"><strong>按热度排序</strong></el-radio>-->
<!--        <el-radio border size="small" :label="1"><strong>按大小排序</strong></el-radio>-->
<!--        <el-radio border size="small" :label="2"><strong>按时间排序</strong></el-radio>-->
<!--        <el-radio border size="small" :label="3"><strong>默认</strong></el-radio>-->
<!--      </el-radio-group>-->

        <el-input style="margin-top: 15px;margin-left: 20px; float: left;width: 300px"
                  v-model="search"
                  @keyup.enter.native="getPublicFileList(1)"
                  size="medium"
                  placeholder="输入关键字搜索">
          <el-button
              type="primary"
              slot="append"
              icon="el-icon-search"
              @click="getPublicFileList(1)"
          ></el-button>
        </el-input>
        <div style="float:right; margin-top: 15px;display: inline-block;">
          <div style="display: inline-block">
              <svg style="vertical-align: middle;" v-if="order1 === 0" t="1684131746631" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5100" width="16" height="16"><path d="M304.192 480a64 64 0 0 1-55.04-96.512l207.744-288A63.488 63.488 0 0 1 512 64c21.312 0 42.688 10.496 55.04 31.488l207.872 287.936A64 64 0 0 1 719.808 480H304.192z m470.72 160.512l-207.808 288A63.488 63.488 0 0 1 512 960a63.488 63.488 0 0 1-55.04-31.488l-207.872-288A64 64 0 0 1 304.192 544h415.616a64 64 0 0 1 55.04 96.512z" p-id="5101" fill="#515151"></path></svg>
              <!--降序-->
              <svg style="vertical-align: middle;" v-if="order1 === 1" t="1684125105404" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3201" width="16" height="16"><path d="M774.9 640.5l-207.8 352c-12.4 21-33.8 31.5-55.1 31.5s-42.7-10.5-55.1-31.5l-207.8-352c-25.2-42.7 5.6-96.5 55.1-96.5h415.6c49.6 0 80.3 53.9 55.1 96.5z" p-id="3202" fill="#11bdfd"></path></svg>
              <!--升序-->
              <svg style="vertical-align: middle;" v-if="order1 === 2" t="1684131639647" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3708" width="16" height="16"><path d="M719.8 480H304.2c-49.5 0-80.3-53.9-55.1-96.5l207.8-352C469.3 10.5 490.7 0 512 0s42.7 10.5 55.1 31.5l207.8 351.9c25.2 42.7-5.5 96.6-55.1 96.6z" p-id="3709" fill="#11bdfd"></path></svg>
            <div style="display: inline-block;vertical-align: middle;">
              <el-button size="small" style="border-style: none;padding: 0" @click="order(1)">
                <span>{{col1[order1]}}</span>
              </el-button>
            </div>
          </div>

          <div style="display: inline-block;margin-left: 20px">
            <svg style="vertical-align: middle;" v-if="order2 === 0" t="1684131746631" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5100" width="16" height="16"><path d="M304.192 480a64 64 0 0 1-55.04-96.512l207.744-288A63.488 63.488 0 0 1 512 64c21.312 0 42.688 10.496 55.04 31.488l207.872 287.936A64 64 0 0 1 719.808 480H304.192z m470.72 160.512l-207.808 288A63.488 63.488 0 0 1 512 960a63.488 63.488 0 0 1-55.04-31.488l-207.872-288A64 64 0 0 1 304.192 544h415.616a64 64 0 0 1 55.04 96.512z" p-id="5101" fill="#515151"></path></svg>
            <!--降序-->
            <svg style="vertical-align: middle;" v-if="order2 === 1" t="1684125105404" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3201" width="16" height="16"><path d="M774.9 640.5l-207.8 352c-12.4 21-33.8 31.5-55.1 31.5s-42.7-10.5-55.1-31.5l-207.8-352c-25.2-42.7 5.6-96.5 55.1-96.5h415.6c49.6 0 80.3 53.9 55.1 96.5z" p-id="3202" fill="#11bdfd"></path></svg>
            <!--升序-->
            <svg style="vertical-align: middle;" v-if="order2 === 2" t="1684131639647" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3708" width="16" height="16"><path d="M719.8 480H304.2c-49.5 0-80.3-53.9-55.1-96.5l207.8-352C469.3 10.5 490.7 0 512 0s42.7 10.5 55.1 31.5l207.8 351.9c25.2 42.7-5.5 96.6-55.1 96.6z" p-id="3709" fill="#11bdfd"></path></svg>
            <div style="display: inline-block;vertical-align: middle;">
              <el-button size="small" style="border-style: none;padding: 0" @click="order(2)">
                <span>{{col2[order2]}}</span>
              </el-button>
            </div>
          </div>

<!--          <el-button size="small" style="border-style: none" @click="order(2)">-->
<!--            <svg t="1684125105404" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3201" width="16" height="16"><path d="M774.9 640.5l-207.8 352c-12.4 21-33.8 31.5-55.1 31.5s-42.7-10.5-55.1-31.5l-207.8-352c-25.2-42.7 5.6-96.5 55.1-96.5h415.6c49.6 0 80.3 53.9 55.1 96.5z" p-id="3202" fill="#11bdfd"></path></svg>-->
<!--            <span>{{col2[order2]}}</span>-->
<!--          </el-button>-->
        </div>

      </div>
    </el-header>
    <el-main style="margin-top: 30px">
      <el-row style="height: 40%" type="flex" justify="space-around" :gutter="20" v-for="i in Math.ceil(data.showNumber/4)" :key="getUUID()">
        <el-col :span="6" v-for="j in (data.showNumber-(i-1)*4)>4?4:(data.showNumber-(i-1)*4)" :key="getUUID()" >
          <FileInfoBox :publicFileInfo="data.publicFileList[(i-1)*4+j-1]"></FileInfoBox>
        </el-col>
      </el-row>
    </el-main>
    <el-footer style="margin-top: -40px">
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
      orderBy: 0,
      order1: 0,
      order2: 0,
      col1: ['评分默认','评分降序' ,'评分升序'],
      col2: ['热度默认','热度降序' ,'热度升序'],
      colName: '',
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
    order(type){

      if(type === 1){
        // 按热度排序
        this.order1 = (this.order1 + 1) % 3;
        this.orderBy = this.order1;
        this.order2 = 0;
        this.col = 'hot';
      }
      else{
        // 按评分排序
        this.order2 = (this.order2 + 1) % 3;
        this.orderBy = this.order2;
        this.order1 = 0;
        this.col = 'score';
      }
      this.getPublicFileList(1);
    },
    getPublicFileList(currentIndex){
      this.$http({
        method: 'POST',
        url: '/public/getPublicFileList',
        params:{
          index: currentIndex,
          count: 8,
          search: this.search,
          orderBy: this.orderBy,
          col: this.col,
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
  created() {
    // setTimeout(()=> {
    this.getPublicFileList(1);
    // }, 50)
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
  margin-top: 5px;
}
/*/deep/ .el-input .el-input__inner {*/
/*  !*height: 40px;*!*/
/*  width: 30%;*/
/*  !*line-height: 25px;*!*/
/*  float: right;*/
/*}*/
.el-row{
  width: 100%;
  margin-bottom: 20px;
  height: 200px;
}
.el-col {
  border-radius: 4px;
}
.el-pagination{
  padding-top: 15px;
}


</style>