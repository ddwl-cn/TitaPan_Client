<template>
  <el-menu>
    <router-link to="/user/home">
      <template slot="title">主页</template>
      <el-menu-item index="1">主页</el-menu-item>
    </router-link>

    <!-- <router-link to="/user/extract/:share_uuid/:share_code">
      <template slot="title">提取文件</template>

      <el-menu-item index="2">提取文件</el-menu-item>
    </router-link> -->

    <router-link to="/user/share">
      <template slot="title">分享链接管理</template>
      <el-menu-item index="3">分享链接管理</el-menu-item>
    </router-link>

    <template slot="title">文件广场</template>
    <el-menu-item index="4">文件广场</el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "Navigation",
  components: {},
  methods: {
    onChange(e, list) {
      console.log(e, list);
    },
  },
};
</script>

<style scoped>
.router-link-active {
  text-decoration: none;
}
a {
  text-decoration: none;
  color: black;
}
</style>
