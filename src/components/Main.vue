<template>
  <el-container
    style="height: 650px; border: 1px solid #eee; margin-bottom: 0px"
    class="is-vertical total"
  >
    <!-- 头部 -->
    <el-header height="40px" style="text-align: right; font-size: 12px">
      <Header></Header>
    </el-header>
    <el-container>
      <!-- 内容：包含侧导航栏和内容区域 -->
      <el-aside width="200px">
        <Navigation></Navigation>
      </el-aside>
      <el-main style="padding: 5px">
        <!-- 内容区域包含头部和列表区域 -->
        
        <UserMain></UserMain>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Navigation from "./Navigation";
import Header from "./Header";
import UserMain from "./UserMain";
export default {
  name: "Main",
  components: {
    UserMain,
    Navigation,
    Header
  },
};
</script>

<style></style>
