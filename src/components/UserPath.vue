<template>
  <div>
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      style="margin-top: 5px; margin-left: -15px"
    >
      <el-button-group style="float: left">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-s-home"
          @click="root"
          :disabled="nowPath === '/'"
          >返回根目录</el-button
        >
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-arrow-left"
          @click="back"
          :disabled="nowPath === '/'"
          >上一级</el-button
        >

<!--        <el-button-->
<!--          type="primary"-->
<!--          size="mini"-->
<!--          @click="next"-->
<!--          :disabled="position >= userPath.length - 1"-->
<!--          >下一级<i class="el-icon-arrow-right el-icon&#45;&#45;right"></i-->
<!--        ></el-button>-->
      </el-button-group>

      <el-input v-model="tempPath"
                size="mini"
                @keyup.enter.native="requestChangePath(tempPath)"
                style="margin-top: 0;margin-left: 20px; float: left;width: 300px">
        <el-button
            type="primary"
            slot="append"
            icon="el-icon-right"
            @click="requestChangePath(tempPath)"
            title="前往"
        ></el-button>
        <hr/>
        <el-button
            type="primary"
            slot="prepend"
            icon="el-icon-refresh"
            @click="requestChangePath(nowPath)"
            title="重新加载当前目录"
        ></el-button>

      </el-input>
    </el-breadcrumb>

  </div>
</template>

<script>
export default {
  name: "UserPath",
  data() {
    return {
      // 用户当前所在路径 默认在根路径
      nowPath: sessionStorage.getItem('nowPath')?sessionStorage.getItem('nowPath'):'/',
      tempPath: sessionStorage.getItem('nowPath')?sessionStorage.getItem('nowPath'):'/',
    }
  },
  methods: {
    // 返回根目录
    root() {
      this.nowPath = '/';
      this.requestChangePath(this.nowPath);
      sessionStorage.setItem("nowPath", this.nowPath);
    },
    // 返回上一级
    back() {
      let t = this.nowPath.substring(0, this.nowPath.lastIndexOf('/'));
      this.nowPath = t.substring(0, t.lastIndexOf('/') + 1);
      this.requestChangePath(this.nowPath)
      sessionStorage.setItem("nowPath", this.nowPath);
    },
    // 传来下一级的文件名称
    toPath(folderName) {
      var destPath = this.nowPath + folderName + "/";
      this.requestChangePath(destPath);
    },
    getUserPath() {
      return this.nowPath;
    },
    checkPath(path){
      if(!path.endsWith('/')){
        this.$message({
          type: "error",
          message: "路径错误!",
        });
        return;
      }
      this.requestChangePath(path);
    },
    // 向后端发送更改路径请求 同时重新更新文件列表
    requestChangePath(path) {
      if(!path.endsWith('/')){
        this.$message({
          type: "error",
          message: "路径错误!",
        });
        return;
      }
      this.$http({
        method: "post",
        url: "/user/toPath",
        params: {
          toPath: path,
        },
      }).then((res) => {
        if (res.status === 200) {
          if (res.data.msg === "changePathSuccess") {
            // 重新获取当前目录下的文件列表
            this.$parent.$parent.$parent.$parent.getUserFileList();
            sessionStorage.setItem("nowPath", path);
            this.nowPath = path;
            this.tempPath = path;
          }
          else {
            this.$message({
              type: "error",
              message: "路径错误!",
            });
          }
        } else {
          this.$message({
            type: "error",
            message: "未知错误!",
          });
        }
      });
    },
  },
  components: {},
};
</script>

<style></style>
