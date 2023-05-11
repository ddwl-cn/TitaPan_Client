import Login from "@/components/Login.vue";
import VueRouter from "vue-router";
import FileMain from "../pages/FileMain.vue";
import Main from "../components/Main.vue"
import Registry from "../components/Registry.vue"
import ShareMain from "../pages/ShareMain.vue"
import ExtractMain from "../pages/ExtractMain.vue"
import FileSquareMain from "../pages/FileSquareMain.vue"
import FileInfoPage from "@/pages/FileInfoPage";
import userInfoMain from "@/pages/UserInfoMain";
import UploadPublicFileMain from "@/pages/UploadPublicFileMain";

export default new VueRouter({
  routes: [
    // 配置路由项
    {
      name:"login",
      path: "/login",
      component: Login,
    },
    {
      name:"registry",
      path: "/registry",
      component: Registry,
    },
    {
      path: "/",
      component: Main,
      children: [
        {
          path: "",
          component: FileMain,
          // meta: {
          //     keepAlive: true // 需要被缓存
          // }
        },
      ]
    },
    {
      name:"/",
      path: "/user",
      component: Main,
      children: [
        {
          path: "home",
          component: FileMain,
          // meta: {
          //     keepAlive: true // 需要被缓存
          // }
        },
        {
          path: "extract/:share_uuid",
          component: ExtractMain,
          // meta: {
          //     keepAlive: true // 需要被缓存
          // }
        },
        {
          path: "share",
          component: ShareMain,
        },
        {
          path: "fileSquare",
          component: FileSquareMain,
        },
        {
          path: "uploadPublicFileMain",
          component: UploadPublicFileMain,
        },
        {
          path: "userInfo",
          component: userInfoMain,
        },
        {
          path: "fileInfoPage/:fid",
          component: FileInfoPage,
        },
      ],
    },
  ],
});
