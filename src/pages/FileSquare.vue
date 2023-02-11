<template>
    <div>
      <el-table :data="apps">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="rating" label="评分"></el-table-column>
      </el-table>
      <el-card v-for="app in apps" :key="app.id">
        <div slot="header">
          {{ app.name }}
        </div>
        <p>{{ app.description }}</p>
        <p>评分：{{ app.rating }}</p>
      </el-card>
    </div>
</template>

  <script>
    export default {
      name: "FileSquare",
      data() {
        return {
          apps: [
            {
              id: 1,
              name: 'App 1',
              description: 'This is a sample app.',
              rating: 4.5
            },
            {
              id: 2,
              name: 'App 2',
              description: 'This is another sample app.',
              rating: 3.5
            },
            // ...
          ]
        }
      }
    }
  </script>

<style scoped>

</style>