<template>
  <div>
    <UserPath ref="UserPath" />
    <div style="margin-top: -35px">
      <el-upload
        ref="upload"
        action=""
        multiple
        :http-request="handleUploadFile"
        :on-change="handleSelect"
        :auto-upload="false"
        :limit="30"
        :show-file-list="false"
      >
        <el-button
          slot="trigger"
          size="small"
          type="success"
          round
          style="margin-right: 10px;margin-top: 10px"
          >在当前目录上传文件</el-button>

        <el-button
          type="success"
          size="small"
          round
          @click="dialogTableVisible = true"
          style="margin-right: 10px"
          ><el-badge
            :value="total - finished"
            :max="10"
            class="item"
            :hidden="total - finished === 0"
            ><div style="margin-right: 8px">查看上传列表</div>
          </el-badge></el-button
        >

        <el-dialog
          :title="'上传完成(' + finished + '/' + total + ')'"
          :visible.sync="dialogTableVisible"
          width="70%"
          align="left"
        >
          <el-table
            :data="
              file_show.filter((item) => {
                return item.isUploading !== 3 && item.isUploading !== 5;
              })
            "
            height="300"
          >
            <el-table-column
              property="fileName"
              label="文件名"
              width="100"
              style="height: 15px"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              property="percentage"
              label="上传进度"
              width="500"
              style="height: 15px"
              align="center"
            >
              <template slot-scope="scope">
                <el-progress
                  :text-inside="true"
                  :stroke-width="15"
                  :percentage="parseFloat(scope.row.percentage.toFixed(2))"
                ></el-progress>
              </template>
            </el-table-column>
            <el-table-column
              property=""
              label="操作"
              width="200"
              style="height: 15px"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="warning"
                  round
                  v-if="scope.row.isUploading === 1"
                  size="mini"
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
                  size="mini"
                  :loading="scope.row.isUploading === 4"
                  @click="continueUpload(scope.row)"
                  ><span
                    v-if="
                      scope.row.isUploading === 0 || scope.row.isUploading === 2
                    "
                    >继续上传</span
                  ><span v-if="scope.row.isUploading === 4"
                    >大文件请耐心等待...</span
                  ></el-button>
                <el-button
                  type="warning"
                  round
                  v-if="scope.row.isUploading === 1"
                  size="mini"
                  icon="el-icon-error"
                  @click="cancelUpload(scope.row)"
                  >取消
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>

        <el-button type="primary" round size="small" @click="handleCreateFolder"
          >新建文件夹</el-button
        >
        <el-button
          type="warning"
          round
          size="small"
          @click="handleDownloadSelected"
          >下载已选</el-button
        >
        <el-button
          type="danger"
          round
          size="small"
          @click="handleDeleteSelected"
          >删除已选</el-button
        >
      </el-upload>
    </div>
  </div>
</template>

<script>
import UserPath from "../components/UserPath";
import SparkMD5 from "spark-md5";
export default {
  name: "FileMainHeader",
  data() {
    return {
      // 文件上传列表对话框
      dialogTableVisible: false,
      // 已选择行
      rowSelected: [],
      uuid: 0,
      fileName_arr: [],
      // 文件数组
      file_arr: [],
      // 是否正在在上传 0:未在上传 1: 正在上传 2: 暂停中 3: 完成 4: 加载状态 5: 取消该文件的上传
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
  props: {
    sentCommend: {
      type: Function,
    },
  },
  methods: {
    getRowsSelected() {
      return this.$parent.$parent.$parent.getRowsSelected();
    },
    deleteSelected() {
      let rows = this.getRowsSelected();
      this.$parent.$parent.$parent.deleteSelected(rows);
    },
    downloadSelected() {
      let rows = this.getRowsSelected();
      this.$parent.$parent.$parent.downloadSelected(rows);
    },
    cancelRequest(i) {
      this.requestController[i].abort();
      this.isUploading.splice(i, 1, 2);
      // 延迟后执行
      setTimeout(() => {
        this.requestController[i] = new AbortController();
      }, 50);
    },
    // 获取已选中的文件(上传中的选择)
    handleSelect(file, fileList) {
      let s = this.file_arr.length;
      const regExp = /[\:\<\>\|\\\*\?\"\%]/g;
      let flag = true; // 明明是否合法
      fileList.forEach((item) => {
        if(regExp.test(item.raw.name)){

          flag = false;
        }
      });
      if(!flag){
        this.$message.warning("上传的文件名中不能包含：%、\\、/、:、*、?、\"、<、>、| 等特殊字符");
        this.$refs.upload.clearFiles();
        return;
      }
      fileList.forEach((item) => {
        this.file_arr.push({
          id: item.uid,
          blob: item.raw,
        });
        this.fileName_arr.push(item.raw.name);
      });
      let e = this.file_arr.length;
      for (let i = 0; i < e - s; i++) {
        this.isUploading.push(0);
        this.percentage.push(0);
        this.uploadTag.push(0);
        this.requestController.push(new AbortController());
        this.md5_arr.push({
          file_md5: "0",
          chunk_md5: [],
        });
        this.file_chunk_arr.push([]);
      }
      // 选择后自动开始上传
      for(let i = 0; i < this.file_arr.length; i++)
        this.handleUploadFile(i)
      this.$refs.upload.clearFiles();
    },
    // 上传下标为i的文件
    handleUploadFile(i) {
      if (this.isUploading[i] === 1 || this.isUploading[i] === 3) return;

      const std_chunk_size = 1024 * 1024 * 5; // 5MB 文件块

      let file = this.file_arr[i].blob;
      // 总共要分几块
      const total = Math.ceil(file.size / std_chunk_size);

      // 拿到文件名和后缀
      let original_file_name = file.name;
      let suffix = file.name.substr(file.name.lastIndexOf("."));

      let flag = 0;
      if (this.isUploading[i] === 0 || this.isUploading[i] === 2) {
        if (this.isUploading[i] === 2) flag = 1;
        this.isUploading[i] = 1; // 正在上传
        // 用于计算文件和分块的md5
        let c_file_md5 = new SparkMD5.ArrayBuffer();

        let fr = new FileReader();

        let start = 0;
        let end = 0;
        const loadFile = () => {
          end = start + std_chunk_size;
          if (end > file.size) end = file.size;
          const chunk = file.slice(start, end);
          start = end;
          if (flag === 0) this.file_chunk_arr[i].push(chunk);
          fr.readAsArrayBuffer(chunk);
          if (start >= file.size) return;
        };
        loadFile();

        fr.onload = (e) => {
          if (this.md5_arr[i].chunk_md5.length === total) {
            fr.abort();
            if (flag === 0) this.md5_arr[i].file_md5 = c_file_md5.end();

            // 递归上传所有分块
            const upload = (j) => {
              if (j >= total) return;
              // 进入加载状态
              if(j === total - 1) this.isUploading.splice(i, 1, 4);
              let form = {
                id: this.md5_arr[i].file_md5,
                md5_val: "0",
                chunk_size: 0,
                number: 0,
                mFile: null,
                std_chunk_size: std_chunk_size,
                original_file_name: original_file_name,
                total: total,
                suffix: suffix,
              };
              form.md5_val = this.md5_arr[i].chunk_md5[j];
              form.number = j;
              form.chunk_size = this.file_chunk_arr[i][j].size;

              this.$http({
                signal: this.requestController[i].signal,
                headers: {
                  // springboot后端使用form表单的形式提交
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                method: "POST",
                url: "/upload/checkFile",
                data: form,
              }).then((res) => {
                if(res.status === 200) {
                  if (res.data.msg === "commonUpload") {
                    // 传入文件数据
                    form.mFile = this.file_chunk_arr[i][j];
                    this.$http({
                      signal: this.requestController[i].signal,
                      headers: {
                        // springboot后端使用multipart/form-data的形式提交
                        "Content-Type": "multipart/form-data",
                      },
                      method: "POST",
                      url: "/upload/commonUpload",
                      onUploadProgress: (progressEvent) => {
                        // 表单数据大小
                        let formSize =
                            progressEvent.total - this.file_chunk_arr[i][j].size;
                        // 先前已上传的总大小
                        let loaded = std_chunk_size * j + progressEvent.loaded;
                        // 总共的大小
                        let totalSize = file.size + formSize * total;
                        // 剩余的大小
                        let last = totalSize - loaded;
                        this.percentage.splice(
                            i,
                            1,
                            (loaded / totalSize) * 100
                        );
                      },
                      data: form,
                    }).then((res) => {

                      // 全部上传完成
                      if (res.data.msg === "uploadComplete") {
                        // 使用数组内置方法Vue才能实时检测到数组内数据的变化
                        this.percentage.splice(i, 1, 100);
                        this.isUploading.splice(i, 1, 3);
                        this.uploadTag.splice(i, 1, total);
                        this.file_arr.splice(i, 1, null);
                        this.file_chunk_arr.splice(i, 1, null);
                        this.md5_arr.splice(i, 1, null);
                        this.requestController.splice(i, 1, null);
                        this.getUserFileList()
                      }
                      // 当前块上传完成
                      else if (res.data.msg === "uploadChunkComplete") {

                        this.uploadTag.splice(i, 1, this.uploadTag[i] + 1);
                        upload(++j);
                      }
                      else {
                        this.$message({
                          type: "error",
                          message: "未知错误!",
                        });
                      }
                    });
                  }
                  else if (res.data.msg === "quickUpload") {
                    this.$http({
                      signal: this.requestController[i].signal,
                      headers: {
                        // springboot后端使用multipart/form-data的形式提交
                        "Content-Type": "multipart/form-data",
                      },
                      method: "POST",
                      url: "/upload/quickUpload",
                      onUploadProgress: () => {
                        this.percentage.splice(i, 1, (j / total) * 100);

                      },
                      data: form,
                    }).then((res) => {

                      // 全部上传完成
                      if (res.data.msg === "uploadComplete") {
                        this.percentage.splice(i, 1, 100);
                        this.isUploading.splice(i, 1, 3);
                        this.uploadTag.splice(i, 1, total);
                        this.file_arr.splice(i, 1, null);
                        this.file_chunk_arr.splice(i, 1, null);
                        this.md5_arr.splice(i, 1, null);
                        this.requestController.splice(i, 1, null);
                        this.getUserFileList()
                      }
                      // 当前块上传完成
                      else if (res.data.msg === "uploadChunkComplete") {

                        this.uploadTag.splice(i, 1, this.uploadTag[i] + 1);
                        upload(++j);
                      }
                      else {
                        this.$message({
                          type: "error",
                          message: "未知错误!",
                        });
                      }
                    });
                  }
                  else if (res.data.msg === "fileNameRepetitive") {
                    this.$message({
                      type: "warning",
                      message: "当前目录下有重名文件!",
                    });
                    this.isUploading.splice(i, 1, 5)
                  }
                  else {
                    this.$message({
                      type: "error",
                      message: "未知错误!",
                    });
                    return;
                  }
                }
                else {
                  this.$message({
                    type: "error",
                    message: "未知错误!",
                  });
                  return;
                }
              });
            };
            // 变为正在上传的状态
            this.isUploading.splice(i, 1, 1);
            // 略过已上传的分块
            upload(this.uploadTag[i]);
          } else {
            // 变为正在计算md5的状态
            this.isUploading.splice(i, 1, 4);
            c_file_md5.append(e.target.result);
            this.md5_arr[i].chunk_md5.push(SparkMD5.ArrayBuffer.hash(e.target.result));
            loadFile();
          }
        };
      }
    },
    uploadAll() {
      for (let i = 0; i < this.file_arr.length; i++) {
        if (this.isUploading[i] === 0 || this.isUploading[i] === 2) {
          this.handleUploadFile(i);
        }
      }
    },
    cancelAllRequest() {
      for (let i = 0; i < this.file_arr.length; i++) {
        if (this.isUploading[i] === 1) {
          this.cancelRequest(i);
        }
      }
    },
    continueUpload(rowData) {
      let id = rowData.id;
      let i = 0;
      for (; i < this.file_show.length; ) {
        if (this.file_show[i].id === id) break;
        i++;
      }
      this.handleUploadFile(i);
    },
    pauseUpload(rowData) {
      let id = rowData.id;
      let i = 0;
      for (; i < this.file_show.length; ) {
        if (this.file_show[i].id === id) break;
        i++;
      }
      this.cancelRequest(i);
    },
    cancelUpload(rowData){
      let id = rowData.id;
      let i = 0;
      for (; i < this.file_show.length; ) {
        if (this.file_show[i].id === id) break;
        i++;
      }
      // 修改为 5 不再上传
      this.cancelRequest(i);
      this.isUploading.splice(i, 1, 5);
    },
    handleCreateFolder() {
      this.sentCommend();
    },
    handleDownloadSelected() {
      this.downloadSelected()
    },
    handleDeleteSelected() {
      this.deleteSelected()
    },
    getUploadList() {
      return {
        fileName_arr: this.fileName_arr,
        file_arr: this.file_arr,
        isUploading: this.isUploading,
        percentage: this.percentage,
        requestController: this.requestController,
      };
    },
    getUserFileList(){
      this.$parent.$parent.$parent.getUserFileList()
    },
    toPath(nextPath) {
      this.$refs.UserPath.toPath(nextPath);
    },
    getUserPath() {
      return this.$refs.UserPath.getUserPath();
    },
  },
  components: {
    UserPath,
  },
  computed: {
    file_show() {
      const g = this.getUploadList();
      if (g.file_arr.length === 0) return [];
      let res = [];
      // 将g中的对象数组转换为res数组对象
      let i = 0;
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
    total() {
      let num = 0;
      this.isUploading.forEach((item) => {
        if (item !== 5) num++;
      });
      return num;
    },
    finished() {
      let num = 0;
      this.isUploading.forEach((item) => {
        if (item === 3) num++;
      });
      return num;
    },
  },
  mounted() {
  },
};
</script>

<style scoped>
.el-header {
  text-align: center;
  line-height: 20px;
}
</style>
