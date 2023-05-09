<template>
  <el-container class="login login-wrap shadow-container">
      <el-row type="flex" justify="center">
        <el-form
          ref="form"
          :rules="rules"
          :model="userInfo"
          status-icon
          label-width="80px"
        >
          <h3>注册</h3>
          <hr />
          <el-form-item id="u_name" prop="u_name" label="用户名">
            <el-input
              v-model="userInfo.u_name"
              placeholder="请输入用户名"
              prefix-icon
            ></el-input>

          </el-form-item>
          <el-form-item id="nike_name" prop="nike_name" label="昵称">
          <el-input
              v-model="userInfo.nike_name"
              placeholder="请输入用户昵称"
              prefix-icon
          ></el-input>
          </el-form-item>

          <el-form-item id="u_password" prop="u_password" label="密码">
            <el-input
              v-model="userInfo.u_password"
              show-password
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item
            id="r_password"
            prop="r_password"
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
              >注 册</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-container>
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
        nike_name: "",
      },
      rules:{
        u_name:[
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { pattern: /^[a-zA-Z0-9_-]{4,20}$/, message: '用户名只应包含字母、数字、下划线和短横线，长度为4到20个字符', trigger: 'blur' }
        ],
        nike_name:[
          { required: true, message: "昵称不能为空", trigger: "blur" },
          { pattern: /^[\w\u4e00-\u9fa5-]{4,20}$/, message: '昵称只应包含汉字、字母、数字、下划线和短横线，长度为4到20个字符', trigger: 'blur' }
        ],
        u_password:[
          { required: true, message: "密码不能为空", trigger: "blur" },
          { pattern: /^(?=.*[\d|a-zA-Z])[\dA-Za-z@_.*-+]{4,20}$/, message: '密码只应包含字母、数字、@ _ . * - +这些特殊符号，且长度为4到20个字符', trigger: 'blur' }
        ],
        // r_password: [
        //   {pattern: /^(\w{6,20})$/.test(this.userInfo.u_password) && this.userInfo.u_password === this.userInfo.r_password, message: '两次密码不一致', trigger: 'blur' }
        // ]
      }
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
      this.$refs.form.validate(valid => {
        if (valid) {
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
            } else if (response.data.msg === "userExist") {
              this.$message({
                type: "warning",
                message: "用户已存在！",
              });
            } else {
              this.$message({
                type: "error",
                message: "未知错误！",
              });
            }
          });
        }

      })
    },
  },
};
</script>

<style scoped>
.login {
  width: 100%;
  height: 750px;
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
  margin-top: 100px;
  overflow: hidden;
  padding-top: 10px;
  line-height: 40px;
}
.shadow-container {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}
.el-row{
  margin-left: 40px;
}
#u_password {
  margin-bottom: 35px;
}
#u_name{
  margin-bottom: 35px;
}
#nike_name{
  margin-bottom: 35px;
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
  margin-top: 10px;
}
</style>
