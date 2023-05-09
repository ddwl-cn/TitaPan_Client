<template>
  <el-card :body-style="{ padding: '0px' }">
    <div slot="header" class="clearfix">
      <router-link :underline="false" type="info" :to="'/user/fileInfoPage/' + publicFileInfo.fid">
        <img :src="publicFileInfo.preview_url" class="image">
      </router-link>
      <el-button style="float: right; padding-top: 20px" type="text" @click="dialogTableVisible = true;userPath = '/';getUserFolderList()">保存到网盘</el-button>
    </div>
    <div style="padding: 10px;">
      <span><router-link :underline="false" type="info" :to="'/user/fileInfoPage/' + publicFileInfo.fid"><p>{{publicFileInfo.n_name}}</p></router-link></span>
      <div class="bottom clearfix">
        <p class="p-info">{{publicFileInfo.f_description}}</p>
<!--        <span class="mini-font">下载量:{{publicFileInfo.downloads}}</span> <span class="mini-font">软件评分:{{publicFileInfo.score}}</span>-->
      </div>
      <el-dialog
          style="border-radius: 10px"
          title="保存到："
          :visible.sync="dialogTableVisible"
          width="40%"
          height="350"
          top="50px"
      >
        <el-container>
          <el-header>
            <el-button
                type="primary"
                size="mini"
                icon="el-icon-arrow-left"
                @click="last"
                style="float: left; margin-top: 10px;"
                :disabled="userPath[index] === '/'"
            >上一级</el-button
            >
          </el-header>
          <el-main>
            <el-table
                :data="userFolderList"
                height="300"
                @row-click="savePath"
                style="margin-top: -35px;overflow-x: hidden;"
            >

              <el-table-column
                  property="fileName"
                  label="文件夹"
                  width="475%"
                  style="height: 15px"
                  align="left"
                  :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <!--阻止事件冒泡-->
                  <el-link
                      type="primary"
                      :underline="false"
                      @click.stop="savePath(scope.row)"
                  >
                    <el-image
                        style="width: 30px; height: 30px;position:absolute; bottom: -2px"
                        :src="require('../assets/icon/folder.png')"
                    >
                    </el-image>
                    <span>
                      &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;{{ scope.row.f_name }}
                    </span>
                  </el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <el-button type="warning" @click="dialogTableVisible = false;handleSave(publicFileInfo);">确定</el-button>
          </el-footer>
        </el-container>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "FileInfoBox",
  props: ['publicFileInfo'],
  data(){
    return{
      dialogTableVisible: false,
      // 用户当前要保存到的路径
      userPath: '/',
      userPathStack: ['/'],
      index: 0,
      userFolderList: [],
    }
  },
  methods:{
    handleSave(publicFileInfo){
      this.$http({
        method: "POST",
        headers:{
          "Content-Type": "multipart/form-data"
        },
        url: "/public/savePublicFile",
        data:{
          savePath: this.userPath,
          fid: publicFileInfo.fid,
          publicFileInfo: publicFileInfo,
        },
      }).then((res)=>{
        if(res.status === 200 && res.data.status === 200){
          this.$message.success('已保存！');
        }
        else if(res.data.msg === "fileNameRepetitive"){
          this.$message.warning('已有重名文件！')
        }
        else{
          this.$message({
            type: "error",
            message: "未知错误！",
          })
        }
      })
    },
    getUserFolderList(){
      this.$http({
        method: "POST",
        headers:{
          "Content-Type": "multipart/form-data"
        },
        url: "/user/getUserFolderList",
        data:{ savePath: this.userPath },
      }).then((res)=>{
        if(res.status === 200 && res.data.data){
          this.userFolderList = res.data.data;
        }
        else{
          this.$message({
            type: "error",
            message: "未知错误！",
          })
        }
      })
    },
    // 选择提取路径
    savePath(rowData){
      this.$http({
        method: "POST",
        headers:{
          "Content-Type": "multipart/form-data"
        },
        url: "/user/toFolder",
        data:{ savePath: this.userPath + rowData.f_name + "/" },
      }).then((res)=>{
        if(res.data.status === 200){
          // 更新用戶路徑
          this.userPath = this.userPath + rowData.f_name + "/";
          this.userPathStack.push(this.userPath);
          this.index += 1;
          // 更新文件夹列表
          this.getUserFolderList();
        }
        else{
          this.$message({
            type: "error",
            message: "未知错误！",
          })
        }
      })
    },
    last(){
      this.userPath = this.userPathStack[this.index - 1];
      this.index -= 1;
      this.userPathStack.pop();
      this.getUserFolderList();
    },
  }
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
.router-link{
  text-decoration: none;
  font-size: 12px;
  font-weight: 900;
  margin: -15px 0;
}
.mini-font{
  font-size: 12px;
  -webkit-transform: scale(0.2);
}
a {
  text-decoration: none;
  font-size: 14px;
  font-weight: 900;
  margin: -15px 0;
  color: darkgray;

}

.router-link-active {
  text-decoration: none;
}
</style>