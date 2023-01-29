<template>
  <div class="login" clearfix>
    <div class="login-wrap">
      <el-row type="flex" justify="center">
        <el-form
          ref="loginForm"
          :model="userInfo"
          status-icon
          label-width="80px"
        >
          <h3>注册</h3>
          <hr />
          <el-form-item prop="username" label="用户名">
            <el-input
              v-model="userInfo.u_name"
              placeholder="请输入用户名"
              prefix-icon
            ></el-input>
          </el-form-item>
          <el-form-item id="password" prop="password" label="密码">
            <el-input
              v-model="userInfo.u_password"
              show-password
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item
            id="repassword"
            prop="repassword"
            label="确认密码"
          >
            <el-input
              v-model="userInfo.r_password"
              show-password
              placeholder="再次输入密码"
            ></el-input>
          </el-form-item>
          <router-link to="/">找回密码</router-link>&ensp;
          <router-link to="/login">登录</router-link>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-upload"
              @click="doRegistry()"
              >注 册</el-button
            >
          </el-form-item>
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<script scoped>
import MD5 from "../js/md5.js";
export default {
  name: "Registry",
  components: {},
  data() {
    return {
      userInfo: {
        u_name: "",
        u_password: "",
        r_password: "",
      },
    };
  },
  methods: {
    doRegistry() {
      if (this.userInfo.u_password !== this.userInfo.r_password) {
        this.$message({
          type: "warning",
          message: "两次输入的密码不一致!",
        });
        return;
      }
      if (
        this.userInfo.u_name.length === 0 ||
        this.userInfo.u_password.length === 0 ||
        this.userInfo.r_password.length === 0
      ) {
        this.$message({
          type: "warning",
          message: "请填写必要信息!",
        });
        return;
      }
      this.userInfo.u_password = MD5(this.userInfo.u_password)
      this.$http({
        method: "POST",
        url: "/registry",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: this.userInfo,
      }).then((response) => {
        if (response.data.msg === "registrySuccess") {
          this.$message({
            type: "success",
            message: "注册成功,前往登录!",
          });
          this.$router.push("/login");
        } else if (response.data.msg === "userExisted") {
          this.$message({
            type: "warring",
            message: "用户已存在！",
          });
        } else {
          this.$message({
            type: "error",
            message: "未知错误！",
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.login {
  width: 100%;
  height: 800px;
  /* background: url("../assets/images/bg1.png") no-repeat; */
  background-size: cover;
  overflow: hidden;
  margin-top: -100px;
}
.login-wrap {
  /*background: url("../assets/images/login_bg.png") no-repeat;*/
  background-size: cover;
  width: 400px;
  height: 500px;
  margin: 215px auto;
  overflow: hidden;
  padding-top: 10px;
  line-height: 40px;
}
#password {
  margin-bottom: 5px;
}
h3 {
  color: #0babeab8;
  font-size: 24px;
}
hr {
  background-color: #444;
  margin: 20px auto;
}
a {
  text-decoration: none;
  color: #aaa;
  font-size: 15px;
}
a:hover {
  color: coral;
}
.el-button {
  width: 80%;
  margin-left: -50px;
}
</style>
