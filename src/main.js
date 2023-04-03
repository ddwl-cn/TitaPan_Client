import Vue from "vue";
import App from "./App.vue";
import ElementUi from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import FileType from "./js/FileType.js";
import axios from "axios";
import VueRouter from "vue-router";
import router from "./router/index";
import global from "@/js/global";

// 应用elemeent ui插件
Vue.use(ElementUi);
Vue.use(VueRouter);
Vue.config.productionTip = false;

Vue.prototype.$FileType = FileType;
Vue.prototype.$global = global;

// 添加全局axios
Vue.prototype.$http = axios;
axios.defaults.baseURL = `${global.host}:${global.serverport}`;
axios.defaults.withCredentials = true;
// 配置axios拦截器
axios.interceptors.request.use((config) => {
  // 取出放在浏览器存储中的token
  let token = localStorage.getItem("token");
  if (token) {
    // 每次请求都在请求头携带token
    config.headers["token"] = token;
  }
  // 返回配置项
  return config;
});

new Vue({
  render: (h) => h(App),
  router: router,
  beforeCreate() {
    Vue.prototype.$bus = this;
  },
  created() {
    axios.interceptors.response.use(
      (response) => {
        // 响应成功该做的事儿
        // 将后端返回的信息转对象
        if (response.headers.data) {
          let data = JSON.parse(response.headers.data);
          if (data.msg === "invalidToken") {
            console.log("token验证失败");
            this.$router.push("/login");
            this.$message({
              type: "error",
              message: "登录失效!",
            });
          }
        }
        return response;
      },
      (error) => {
        console.log(error.response);
        // 响应失败该做的事儿
        return Promise.reject(error);
      }
    );
  },
}).$mount("#app");
