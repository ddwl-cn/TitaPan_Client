<template>
  <div>
    <div style="float: left; margin-top: 8px">
      <strong>已完成{{ finished }}个 / 共{{ total }}个</strong>
    </div>
    <el-upload
      ref="upload"
      action=""
      :http-request="handleUploadFile"
      :on-change="handleSelect"
      :auto-upload="false"
      :limit="10"
      :show-file-list="false"
    >
      <el-button
        slot="trigger"
        size="mini"
        type="success"
        round
        style="margin-right: 10px"
        >在当前目录上传文件</el-button
      >
      <el-button
        style="margin-left: 10px"
        size="small"
        type="success"
        @click="uploadAll"
        >全部上传</el-button
      >
      <el-button
        style="margin-left: 10px"
        size="small"
        type="warning"
        @click="cancelAllRequest"
        >全部暂停</el-button
      >
      <div slot="tip" class="el-upload__tip">单文件不能不超过1GB</div>
    </el-upload>
  </div>
</template>

<script>
import SparkMD5 from "spark-md5";
export default {
  name: "UploadMainHeader",
  data() {
    return {
      fileName_arr: [],
      // 文件数组
      file_arr: [],
      // 是否正在在上传 0:未在上传 1: 正在上传 2: 暂停中 3: 完成 4: 计算md5中(准备中)
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
      // 当前任务数 已完成的
    };
  },
  methods: {
    cancelRequest(i) {
      this.requestController[i].abort();
      this.isUploading.splice(i, 1, 2);
      // 延迟后执行
      setTimeout(() => {
        this.requestController[i] = new AbortController();
      }, 50);
    },
    // 获取已选中的文件
    handleSelect(file, fileList) {
      let s = this.file_arr.length;
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
          chunk_md5: new Array(),
        });
        this.file_chunk_arr.push(new Array());
      }
      this.clearFiles();
    },
    clearFiles(){
      // 触发器用于清除FileMainHeader中upload组件中的文件
      this.$bus.$emit('clearFiles')
    },
    // 上传下标为i的文件
    handleUploadFile(i) {
      if (this.isUploading[i] === 1 || this.isUploading[i] === 3) return;

      const std_chunk_size = 1024 * 1024 * 15; // 1MB 文件块

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
        let c_file_md5 = new SparkMD5();
        let c_chunk_md5 = new SparkMD5();

        let fr = new FileReader();

        let start = 0;
        let end = 0;
        const loadFile = () => {
          end = start + std_chunk_size;
          if (end > file.size) end = file.size;
          const chunk = file.slice(start, end);
          start = end;
          if (flag === 0) this.file_chunk_arr[i].push(chunk);
          fr.readAsBinaryString(chunk);
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
                console.log(res.data);
                if (res.data.msg === "commonUpload") {
                  // 传入文件数据
                  form.mFile = this.file_chunk_arr[i][j];
                  this.$http({
                    headers: {
                      // springboot后端使用multipart/form-data的形式提交
                      "Content-Type": "multipart/form-data",
                    },
                    method: "POST",
                    url: "/upload/commonUpload",
                    onUploadProgress: (progressEvent) => {
                      let formSize =
                        progressEvent.total - this.file_chunk_arr[i][j].size;
                      let loaded = std_chunk_size * j;
                      this.percentage.splice(
                        i,
                        1,
                        ((loaded + progressEvent.loaded) /
                          (file.size + formSize * total)) *
                          100
                      );
                      console.log(
                        "已上传:",
                        ((loaded + progressEvent.loaded) /
                          (file.size + formSize * total)) *
                          100 +
                          "%"
                      );
                    },
                    data: form,
                  }).then((res) => {
                    console.log(res.data);
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
                    }
                    // 当前块上传完成
                    else if (res.data.msg === "uploadChunkComplete") {
                      console.log(res.data);
                      this.uploadTag.splice(i, 1, this.uploadTag[i] + 1);
                      upload(++j);
                    } else {
                      this.$message({
                        type: "error",
                        message: "未知错误!",
                      });
                    }
                  });
                } else if (res.data.msg === "quickUpload") {
                  this.$http({
                    headers: {
                      // springboot后端使用multipart/form-data的形式提交
                      "Content-Type": "multipart/form-data",
                    },
                    method: "POST",
                    url: "/upload/quickUpload",
                    onUploadProgress: () => {
                      this.percentage.splice(i, 1, (j / total) * 100);
                      console.log("已上传:", (j / total) * 100 + "%");
                    },
                    data: form,
                  }).then((res) => {
                    console.log(res.data);
                    // 全部上传完成
                    if (res.data.msg === "uploadComplete") {
                      this.percentage.splice(i, 1, 100);
                      this.isUploading.splice(i, 1, 3);
                      this.uploadTag.splice(i, 1, total);
                      this.file_arr.splice(i, 1, null);
                      this.file_chunk_arr.splice(i, 1, null);
                      this.md5_arr.splice(i, 1, null);
                      this.requestController.splice(i, 1, null);
                      this.$forceUpdate();
                    }
                    // 当前块上传完成
                    else if (res.data.msg === "uploadChunkComplete") {
                      console.log(res.data);
                      this.uploadTag.splice(i, 1, this.uploadTag[i] + 1);
                      upload(++j);
                    } else {
                      alert(res.data.msg);
                    }
                  });
                } else {
                  this.$message({
                    type: "error",
                    message: "未知错误!",
                  });
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
            c_file_md5.appendBinary(e.target.result);
            c_chunk_md5.appendBinary(e.target.result);
            this.md5_arr[i].chunk_md5.push(c_chunk_md5.end());
            c_chunk_md5.reset();
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
    sentUploadList() {
      return {
        fileName_arr: this.fileName_arr,
        file_arr: this.file_arr,
        isUploading: this.isUploading,
        percentage: this.percentage,
        requestController: this.requestController,
      };
    },
    // 从数组中移除已完成的第i个元素
    removeHadCompleted(i) {
      this.file_arr.splice(i, 1);
      this.isUploading.splice(i, 1);
      this.percentage.splice(i, 1);
      this.requestController.splice(i, 1);
      this.uploadTag.splice(i, 1);
      this.md5_arr.splice(i, 1);
      this.file_chunk_arr.splice(i, 1);
    },
  },
  components: {},
  computed: {
    file_show() {
      return this.file_arr.filter(
        (item, index) => this.isUploading[index] !== 3
      );
    },
    total() {
      return this.file_arr.length;
    },
    finished() {
      let num = 0;
      this.isUploading.forEach((item) => {
        if (item === 3) num++;
      });
      return num;
    },
  },
  // mounted(){
  //   this.$bus.$on('handleSelect',(file, fileList)=>{
  //     console.log('收到了传来的文件')
  //     this.handleSelect(file, fileList)
  //   })
  // },
  mounted(){
    console.log('@@')
    this.$bus.$on('handleSelect',(file, fileList)=>{
      console.log('收到了传来的文件', file, fileList)
      this.handleSelect(file, fileList)
    })
  }
};
</script>

<style scoped></style>
