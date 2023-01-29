<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="grid-content bg-purple">
            <el-image :src="require('../assets/Pan_Logo.png')" alt="../assets/Pan_Logo.png" style="width: 30px; height: 30px; margin-top: 8px"></el-image>
        </div>
      </el-col>

      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          ></el-avatar>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style>
.el-header {
  text-align: center;
  line-height: 40px;
}
</style>
