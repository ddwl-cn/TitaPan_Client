<template>
  <el-container
      style="margin-bottom: 0"
      class="is-vertical total"
  >
    <!-- 头部 -->
    <el-header height="100px" style="text-align: right; font-size: 12px">
      <Header></Header>
    </el-header>
    <el-container>
      <!-- 内容：包含侧导航栏和内容区域 -->
      <el-aside width="200px" style="height: 540px">
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

<style scoped>
.el-container{
  border-radius: 10px;

}
.el-aside{
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  background-color: #f8f8f8;
  border-radius: 10px;
  margin-top: 5px;
}

</style>