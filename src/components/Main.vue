<template>
  <el-container
      style="margin-bottom: 0;height: 100%;overflow:hidden;display: flex;width: 100%;"
      class="is-vertical total"
  >
    <!-- 头部 -->
    <el-header height="100px" style="text-align: right; font-size: 12px; width: 100%;">
      <Header></Header>
    </el-header>
    <el-container style="height: 100%;overflow:hidden;width: 100%; display: flex;justify-content:center;">
      <!-- 内容：包含侧导航栏和内容区域 -->
      <el-aside width="200px" style="height: 95%;">
        <Navigation></Navigation>
      </el-aside>
      <el-main style="padding: 5px; height: 100%;overflow:hidden;">
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

<style scoped>
.el-container{
  border-radius: 10px;
}
.el-aside{
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  margin-top: 10px;
  margin-left: 20px;
}

</style>