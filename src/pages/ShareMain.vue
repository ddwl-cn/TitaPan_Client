<template>
  <el-container>
    <el-main style="line-height: 15px; padding: 0; height: 500px">
      <ShareContent></ShareContent>
    </el-main>
  </el-container>
</template>

<script>
import ShareContent from "./ShareContent"
export default {
  name: "ShareMain",
  components: {
    ShareContent
  },
}
</script>

<style scoped>
.el-main {
  text-align: center;
  line-height: 160px;
}
.el-container {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  margin-bottom: 40px;
  height: 540px;
}
</style>