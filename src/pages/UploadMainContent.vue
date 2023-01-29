<template>
  <div style="width: 100%">
    <!-- <el-empty
      v-if="file_show.length === 0"
      description="当前还没有要上传的文件！"
      style="width: 100%; height: 500px; padding: 0px"
      
    ></el-empty> -->
    <el-table
      :data="
        file_show.filter((item) => {
          return item.isUploading !== 3;
        })
      "
      style="width: 100%; height: 500px"
    >
      <!-- 文件类型icon图标展示 -->
      <el-table-column width="55">
        <template slot-scope="scope">
          <el-image
            v-if="$FileType.isApk(scope.row.fileName)"
            style="width: 35px; height: 35px; margin-top: 8px"
            :src="require('../assets/icon/apk.png')"
          ></el-image>
          <el-image
            v-else-if="$FileType.isCode(scope.row.fileName)"
            :src="require('../assets/icon/code.png')"
          ></el-image>
          <el-image
            v-else-if="$FileType.isImg(scope.row.fileName)"
            :src="require('../assets/icon/image.png')"
          ></el-image>
          <el-image
            v-else-if="$FileType.isPdf(scope.row.fileName)"
            :src="require('../assets/icon/pdf.png')"
          ></el-image>
          <el-image
            v-else-if="$FileType.isWord(scope.row.fileName)"
            :src="require('../assets/icon/word.png')"
          ></el-image>
          <el-image
            v-else-if="$FileType.isExcel(scope.row.fileName)"
            :src="require('../assets/icon/excel.png')"
          ></el-image>
          <el-image
            v-else-if="$FileType.isCompress(scope.row.fileName)"
            :src="require('../assets/icon/compress.png')"
          ></el-image>
          <el-image
            v-else
            :src="require('../assets/icon/other.png')"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="文件名"
        prop="fileName"
        style="height: 15px"
        :show-overflow-tooltip="true"
        align="center"
      >
      </el-table-column>

      <el-table-column
        label="上传进度"
        prop="upload_progress"
        style="height: 15px"
        align="center"
      >
        <template slot-scope="scope">
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="parseFloat(scope.row.percentage.toFixed(2))"
          ></el-progress>
        </template>
      </el-table-column>

      <el-table-column align="right" style="height: 15px">
        <template slot-scope="scope">
          <el-button
            type="warning"
            round
            v-if="scope.row.isUploading === 1"
            size="medium"
            @click="pauseUpload(scope.row)"
            >暂停
          </el-button>
          <el-button
            type="primary"
            round
            v-else-if="
              scope.row.isUploading === 0 ||
              scope.row.isUploading === 2 ||
              scope.row.isUploading === 4
            "
            size="medium"
            :loading="scope.row.isUploading === 4"
            @click="continueUpload(scope.row)"
            ><span
              v-if="scope.row.isUploading === 0 || scope.row.isUploading === 0"
              >上传</span
            ><span v-if="scope.row.isUploading === 4"
              >加载中...</span
            ></el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "UploadMainContent",
  data() {
    return {
      uuid: 0,
      // 文件数组
      file_arr: [],
      // 是否正在在上传 0:未在上传 1: 正在上传 2: 暂停中 3: 完成
      isUploading: [],
      // 每个文件的上传进度
      percentage: [],
      // 请求控制器 用于终止请求
      requestController: [],
      // 上传进度保存 存放的是本次上传任务中文件分块已上传的个数
      uploadTag: [],
      // 文件的md5 数组中存放的是一个对象
      /*
        {
            file_md5: xxx
            chunk_md5: [] // 是个数组
        }
      */
      md5_arr: [],
      // 文件分块数组 数组中存放也是数组file_chunk_arr[i][j]表示第i个文件的第j个分块
      file_chunk_arr: [],
    };
  },
  methods: {
    getUploadList() {
      return this.$parent.$parent.$parent.sentUploadList();
    },
    continueUpload(rowData) {
      let id = rowData.id;
      let i = 0;
      for (; i < this.file_show.length; ) {
        if (this.file_show[i].id === id) break;
        i++;
      }
      this.$parent.$parent.$parent.continueUpload(i);
    },
    pauseUpload(rowData) {
      let id = rowData.id;
      let i = 0;
      for (; i < this.file_show.length; ) {
        if (this.file_show[i].id === id) break;
        i++;
      }
      this.$parent.$parent.$parent.pauseUpload(i);
    },
  },
  computed: {
    file_show() {
      const g = this.getUploadList();
      if (g.file_arr.length === 0) return [];
      let res = [];
      // 将g中的对象数组转换为res数组对象
      let i = 0
      g.file_arr.forEach((item, index) => {
        res.push({
          index: i++,
          id: item !== null ? item.id : null, // id
          file: item !== null ? item.blob : null, // 文件
          fileName: g.fileName_arr[index],
          isUploading: g.isUploading[index], // 上传状态
          percentage: g.percentage[index], // 上传进度
          requestController: g.requestController[index], // 请求控制器
        });
      });
      // table使用前过滤 掉已经上传完成的文件
      return res;
    },
  },
  mounted(){
  }
};
</script>

<style scoped>
.el-image {
  width: 45px;
  height: 45px;
  margin-top: 8px;
}
</style>
