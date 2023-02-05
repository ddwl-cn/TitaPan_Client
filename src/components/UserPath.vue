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
          :disabled="userPath[position] === '/'"
          >返回根目录</el-button
        >
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-arrow-left"
          @click="back"
          :disabled="userPath[position] === '/'"
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
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "UserPath",
  data() {
    return {
      // 用户当前所在路径 默认在根路径
      userPath: JSON.parse(sessionStorage.getItem("userPath")) || ["/"],
      position: sessionStorage.getItem("position") || 0,
    };
  },
  methods: {
    // 返回根目录
    root() {
      this.position = 0;
      this.requestChangePath(this.userPath[this.position]);
      this.userPath.length = this.position + 1;
      sessionStorage.setItem("position", this.position);
      sessionStorage.setItem("userPath", JSON.stringify(this.userPath));
    },
    // 返回上一级
    back() {
      if (this.position <= 0) {
        return;
      }
      this.position--;
      console.log(this.position, this.userPath[this.position])
      this.requestChangePath(this.userPath[this.position]);
      this.userPath.length = this.position + 1;
      sessionStorage.setItem("position", this.position);
      sessionStorage.setItem("userPath", JSON.stringify(this.userPath));
    },
    // 弃用
    next() {
      if (this.position >= this.userPath.length) {
        return;
      }
      this.position++;
      this.requestChangePath(this.userPath[this.position]);
      sessionStorage.setItem("position", this.position);
      sessionStorage.setItem("userPath", JSON.stringify(this.userPath));
    },
    // 传来下一级的文件名称
    toPath(nextPath) {
      this.userPath.push(this.userPath[this.position] + nextPath + "/");
      this.position += 1;
      // 保存路径到本地session存储 确保刷新后任然在当前目录下
      sessionStorage.setItem("position", this.position);
      sessionStorage.setItem("userPath", JSON.stringify(this.userPath));
      this.requestChangePath(this.userPath[this.position]);
    },
    getUserPath() {
      return this.userPath[this.position];
    },
    // 向后端发送更改路径请求 同时重新更新文件列表
    requestChangePath(path) {

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
          } else {
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
