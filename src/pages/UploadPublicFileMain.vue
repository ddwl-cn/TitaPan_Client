<template>
  <el-container style="height: 96%;width: 99%" class="is-vertical">
    <el-header height="40px" style="text-align: right; font-size: 12px;width: 100%">
      <el-button @click="dialogFormVisible=true" type="primary" size="small" style="margin-top: 10px;float: left;">
        <i style="margin-left: -5px;" class="el-icon-plus"></i>新建任务
      </el-button>


      <el-dialog title="填写文件信息" :visible.sync="dialogFormVisible">
        <el-card class="box-card" style="height: 99%;overflow: auto">
          <div slot="header" class="clearfix">
            <el-button style="float: right; margin-top: 10px;"
                       v-if="!isUploading"
                       type="success"
                       size="small"
                       @click="handleUploadFile"
            >提交</el-button>
            <el-button style="float: right; margin-top: 10px;"
                       v-else
                       type="success"
                       size="size"
                       @click="handleUploadFile"
                       :loading="isUploading"
            >提交</el-button>
            <el-progress
                v-if="percentage"
                style="float: right;margin-right: 20px"
                type="circle"
                :width="60"
                :percentage="parseFloat(percentage).toFixed(1)"
            ></el-progress>
          </div>
          <el-form
              :model="publicFileTask.publicFileInfo"
              ref="ruleForm"
              label-width="100px"
              style="height: 100%; overflow: auto"
              class="demo-ruleForm"
          >
            <el-form-item label="文件名称：" prop="n_name" style="width: 60%">
              <el-input
                  v-model="publicFileTask.publicFileInfo.n_name"
                  :maxlength="50"
                  show-word-limit
              ></el-input>
            </el-form-item>

            <el-form-item label="文件描述：" prop="f_description">
              <el-input
                  type="textarea"
                  v-model="publicFileTask.publicFileInfo.f_description"
                  :maxlength="2500"
                  show-word-limit
              ></el-input>
            </el-form-item>

            <el-form-item label="文件封面：" prop="local_preview_url">
              <el-upload
                  class="avatar-uploader"
                  action=""
                  :show-file-list="false"
                  :on-change="handlePreviewImage"
                  :http-request="httpRequest"
              >
                <img
                    v-if="publicFileTask.publicFileInfo.local_preview_url"
                    :src="publicFileTask.publicFileInfo.local_preview_url"
                    class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>

            <el-form-item label="上传文件：" prop="mFile">
              <el-upload
                  action=""
                  :on-change="handleFile"
                  :file-list="publicFileTask.publicFileInfo.mFile"
                  :auto-upload="false"
              >
                <div>
                  <el-button slot="trigger" size="mini" type="primary"
                  >选取文件</el-button
                  >
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-card>
<!--        <div slot="footer" class="dialog-footer">-->
<!--          <el-button @click="dialogFormVisible = false">取 消</el-button>-->
<!--          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>-->
<!--        </div>-->
      </el-dialog>


      <el-radio-group style="float:right;margin-top: 15px;" v-model="radio">
        <el-radio border size="small" :label="0"><strong>只看审核中</strong></el-radio>
        <el-radio border size="small" :label="1"><strong>只看审核已通过</strong></el-radio>
        <el-radio border size="small" :label="2"><strong>只看审核未通过</strong></el-radio>
        <el-radio border size="small" :label="3"><strong>默认</strong></el-radio>
      </el-radio-group>

    </el-header>
    <el-main style="line-height: 15px; padding: 0; height: 100%;overflow:hidden;width: 100%">

      <el-table
          :data="taskList.filter(item=>{ return ((radio === 3)||(item.state === radio))
          && (!search || item.publicFile.f_name.toLowerCase().includes(search.toLowerCase()))})"
          style="width: 100%; margin-top: 10px;border-radius: 15px;text-align: center"
          height="99%"
          :default-sort="{ prop: 'tid' }"
          :cell-style="{'text-align':'center'}"
          :header-cell-style="{'text-align':'center'}"
          :row-class-name="tableRowClassName">
        <el-table-column type="selection" width="80"> </el-table-column>
        <el-table-column
            prop="tid"
            sortable
            label="任务编号"
            width="100">
        </el-table-column>
        <el-table-column width="80" prop="publicFile.preview_url">
          <template slot-scope="scope">
            <div class="image-container">
              <img :src="scope.row.publicFile.preview_url" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
            prop="publicFile.f_name"
            label="文件名"
            sortable
            :show-overflow-tooltip="true"
            width="280">
        </el-table-column>

        <el-table-column
            prop="suggestion"
            label="建议"
            width="450">
          <template slot-scope="scope">
            <span v-if="scope.row.suggestion === null">---</span>
            <span v-else>{{scope.row.suggestion}}</span>
          </template>

        </el-table-column>
        <el-table-column
            prop="state"
            label="审核状态"
            width="100">
          <template slot-scope="scope">
            <div>
              <div>
                <svg v-if="scope.row.state === 2" t="1683728743894" class="icon" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7598" width="30" height="30"><path d="M513.202819 976.047612a464.1278 464.1278 0 1 1 465.090055-463.967424 465.090055 465.090055 0 0 1-465.090055 463.967424zM513.202819 112.263117a400.137823 400.137823 0 1 0 400.939703 400.939702A400.939702 400.939702 0 0 0 513.202819 112.263117z" p-id="7599" fill="#d81e06"></path><path d="M481.288019 608.786844v-320.751762H545.277995v320.751762zM481.127643 673.5787h64.150352v64.150352h-64.150352z" p-id="7600" fill="#d81e06"></path></svg>
                <svg v-if="scope.row.state === 0" t="1683729029330" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8698" width="30" height="30"><path d="M469.2 350.1C414 376.4 370.3 421.7 346 477.8c-7 16.2 0.5 35.1 16.7 42.1 4.1 1.8 8.4 2.6 12.7 2.6 12.4 0 24.2-7.2 29.4-19.3 18.1-41.9 50.8-75.7 92-95.4 16-7.6 22.7-26.7 15.1-42.6C504.3 349.3 485.2 342.5 469.2 350.1z" p-id="8699" fill="#1296db"></path><path d="M797.6 545.8c-17.7 0-32 14.3-32 32 0 103.7-84.4 188.1-188.1 188.1-17.7 0-32 14.3-32 32s14.3 32 32 32c67.3 0 130.6-26.2 178.2-73.8 47.6-47.6 73.8-110.9 73.8-178.2C829.6 560.1 815.3 545.8 797.6 545.8z" p-id="8700" fill="#1296db"></path><path d="M1014.6 968.4 869.4 823.2c24.9-29.5 45.1-62.3 60.2-97.9 20-47.3 30.2-97.6 30.2-149.4s-10.2-102.1-30.2-149.4c-19.3-45.7-47-86.8-82.3-122-35.2-35.2-76.3-62.9-122-82.3-47.3-20-97.6-30.2-149.4-30.2s-102.1 10.2-149.4 30.2c-45.7 19.3-86.8 47-122 82.3-35.2 35.2-62.9 76.3-82.3 122-20 47.3-30.2 97.6-30.2 149.4s10.2 102.1 30.2 149.4c19.3 45.7 47 86.8 82.3 122 35.2 35.2 76.3 62.9 122 82.3 47.3 20 97.6 30.2 149.4 30.2s102.1-10.2 149.4-30.2c36.1-15.3 69.2-35.7 98.9-61l145.2 145.2c6.2 6.2 14.4 9.4 22.6 9.4s16.4-3.1 22.6-9.4C1027.1 1001.2 1027.1 980.9 1014.6 968.4zM575.9 895.7C399.5 895.7 256 752.2 256 575.8s143.5-319.9 319.9-319.9 319.9 143.5 319.9 319.9S752.2 895.7 575.9 895.7z" p-id="8701" fill="#1296db"></path><path d="M319 960 140 960c-41.9 0-76-34.1-76-76l0-744c0-41.9 34.1-76 76-76l680 0c41.9 0 76 34.1 76 76l0 92.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-92.7c0-77.2-62.8-140-140-140L140 0c-77.2 0-140 62.8-140 140l0 744c0 77.2 62.8 140 140 140l179 0c17.7 0 32-14.3 32-32S336.7 960 319 960z" p-id="8702" fill="#1296db"></path></svg>

                <svg v-if="scope.row.state === 1" t="1683728662357" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5768" width="30" height="30"><path d="M848.213333 938.666667H170.666667c-22.186667 0-39.253333-17.066667-39.253334-39.253334V129.706667c0-22.186667 17.066667-39.253333 39.253334-39.253334h88.746666V114.346667c0 18.773333 15.36 34.133333 34.133334 34.133333h431.786666c18.773333 0 34.133333-15.36 34.133334-34.133333V90.453333h88.746666c22.186667 0 39.253333 17.066667 39.253334 39.253334v769.706666c0 22.186667-17.066667 39.253333-39.253334 39.253334z m-672.426666-44.373334h667.306666V134.826667H802.133333c-8.533333 32.426667-39.253333 58.026667-75.093333 58.026666H293.546667c-35.84 0-66.56-23.893333-75.093334-58.026666h-42.666666v759.466666z" p-id="5769" fill="#05ac2d"></path><path d="M718.506667 129.706667H300.373333c-11.946667 0-22.186667-10.24-22.186666-22.186667 0-11.946667 10.24-22.186667 22.186666-22.186667h418.133334c11.946667 0 22.186667 10.24 22.186666 22.186667 0 11.946667-10.24 22.186667-22.186666 22.186667z" p-id="5770" fill="#05ac2d"></path><path d="M778.24 382.293333L481.28 677.546667c-8.533333 8.533333-22.186667 8.533333-30.72 0s-8.533333-22.186667 0-30.72l295.253333-295.253334c8.533333-8.533333 22.186667-8.533333 30.72 0 10.24 8.533333 10.24 22.186667 1.706667 30.72z" fill="#05ac2d" p-id="5771"></path><path d="M450.56 677.546667l-158.72-158.72c-8.533333-8.533333-8.533333-22.186667 0-30.72s22.186667-8.533333 30.72 0l158.72 158.72c8.533333 8.533333 8.533333 22.186667 0 30.72s-22.186667 8.533333-30.72 0z" fill="#05ac2d" p-id="5772"></path></svg>
              </div>
              <span v-if="scope.row.state === 2">审核未通过</span>
              <span v-if="scope.row.state === 0">审核中</span>
              <span v-if="scope.row.state === 1">审核通过</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="right" style="height: 15px">
          <template slot="header" slot-scope="scope">
            <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"
            >
            </el-input>
          </template>
          <template slot-scope="scope">
            <el-button @click="deleteTask(scope.row)" icon="el-icon-delete-solid" style="border-radius: 10px" type="warning" size="small">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

    </el-main>
  </el-container>
</template>

<script>
import SparkMD5 from "spark-md5";
export default {
  name: "UploadPublicFileMain",
  data(){
    return{
      radio: 3,
      search: '',
      taskList: [],
      dialogFormVisible: false,
      publicFileTask: {
        // 公共文件部分重要字段信息
        publicFileInfo: {
          // 文件名
          n_name: "",
          // 文件描述
          f_description: "",
          // 文件实体(elementui组件中的file类)
          mFile: [],
          // 文件封面blob实体
          mPreview: [],
          // 为图片生成本地url用于预览
          local_preview_url: "",
          // 文件md5
          md5_val: "",
        },
        fileChunk: {},
        remark: '',
      },

      percentage: 0,
      isUploading: false,
    }
  },
  methods: {
    test(){
      const publicFileTask = {

      }
      publicFileTask['fileChunk.id'] = 0
      publicFileTask['fileChunk.md5_val'] = 0
      publicFileTask['fileChunk.chunk_size'] = 0
      publicFileTask['fileChunk.number'] = 0
      publicFileTask['fileChunk.total'] = 0
      publicFileTask['fileChunk.f_description'] = 0
      publicFileTask['fileChunk.mFile'] = null
      publicFileTask['fileChunk.mPreview'] = null
      publicFileTask['fileChunk.original_file_name'] = 0
      publicFileTask['fileChunk.n_name'] = 0
      publicFileTask['fileChunk.std_chunk_size'] = 0
      publicFileTask['fileChunk.suffix'] = '.zip'
      publicFileTask['fileChunk.public_file'] = true
      this.$http({
        method: 'POST',
        url: '/test',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: publicFileTask,
      }).then(res=>{
        if(res.status === 200) {

        }
      })
    },
    tableRowClassName({row, rowIndex}) {
      if (row.state === 0) {
        return 'warning-row';
      } else if (row.state === 2) {
        return 'error-row';
      }
      else{
        return 'success-row';
      }
    },
    getPublicFileTaskList() {

      this.$http({
        method: 'GET',
        url: '/task/getPublicFileTask',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then(res=>{
        if(res.status === 200) {
          this.taskList = res.data.data;
        }
      })
    },
    handleFile(file, fileList) {
      this.publicFileTask.publicFileInfo.mFile[0] = file;
    },
    httpRequest() {
      // 没有任何作用 就是用来覆盖默认上传
    },
    handlePreviewImage(file, fileList) {

      if (file.size > 1024 * 1024 * 2) {
        this.$message.warning("封面大小应限制在2MB以内！");
        return false;
      }

      if (file.raw.type !== "image/jpeg" && file.raw.type !== "image/png") {
        this.$message.warning("封面只应该为jpg或png格式！");
        return false;
      }
      this.publicFileTask.publicFileInfo.local_preview_url = window.URL.createObjectURL(
          file.raw
      );
      this.publicFileTask.publicFileInfo.mPreview[0] = file;
    },
    handleUploadFile() {
      this.isUploading = true;
      let file_chunk_arr = [];
      let md5_val = "";
      let chunk_md5_arr = [];
      const std_chunk_size = 1024 * 1024 * 5;
      const fileSize = this.publicFileTask.publicFileInfo.mFile[0].size;
      const fileName = this.publicFileTask.publicFileInfo.mFile[0].name;
      const file = this.publicFileTask.publicFileInfo.mFile[0].raw;

      const total = Math.ceil(fileSize / std_chunk_size);

      const fr = new FileReader();
      // 文件分片
      let start = 0;
      let end = 0;
      const loadFile = () => {
        end = start + std_chunk_size;
        if (end > fileSize) end = fileSize;
        const chunk = file.slice(start, end);
        start = end;
        file_chunk_arr.push(chunk);
        fr.readAsArrayBuffer(chunk);
        if (start >= fileSize) return;
      };
      loadFile();
      let spark = new SparkMD5.ArrayBuffer();
      // 计算MD5
      fr.onload = (e) => {
        if (chunk_md5_arr.length < total) {
          spark.append(e.target.result);
          chunk_md5_arr.push(SparkMD5.ArrayBuffer.hash(e.target.result));
          loadFile();
        } else {
          fr.abort();
          // 开始上传
          md5_val = spark.end();
          const upload = (i) => {
            if (i >= total) return;
            // 表单模板
            // 填写表单数据
            /*
                          fileChunk: {
                id: md5_val,
                md5_val: chunk_md5_arr[i],
                chunk_size: file_chunk_arr[i].size,
                number: i,
                total: total,
                f_description: this.publicFileTask.publicFileInfo.f_description,
                mFile: null,
                mPreview: null,
                original_file_name: fileName,
                n_name: this.publicFileTask.publicFileInfo.n_name,
                std_chunk_size: std_chunk_size,
                suffix: fileName.substr(fileName.lastIndexOf(".")),
                public_file: true,
              }
            * */
            const publicFileTask = {}
            // 离谱！！非得这样写
            publicFileTask['fileChunk.id'] = md5_val
            publicFileTask['fileChunk.md5_val'] = chunk_md5_arr[i]
            publicFileTask['fileChunk.chunk_size'] = file_chunk_arr[i].size
            publicFileTask['fileChunk.number'] = i
            publicFileTask['fileChunk.total'] = total
            publicFileTask['fileChunk.f_description'] = this.publicFileTask.publicFileInfo.f_description
            publicFileTask['fileChunk.mFile'] = null
            publicFileTask['fileChunk.mPreview'] = null
            publicFileTask['fileChunk.original_file_name'] = fileName
            publicFileTask['fileChunk.n_name'] = this.publicFileTask.publicFileInfo.n_name
            publicFileTask['fileChunk.std_chunk_size'] = std_chunk_size
            publicFileTask['fileChunk.suffix'] = fileName.substr(fileName.lastIndexOf("."))
            publicFileTask['fileChunk.public_file'] = true
            this.$http({
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              method: "POST",
              url: "/task/checkFile",
              data: publicFileTask,
            }).then((res) => {
              if (res.status === 200) {
                if (res.data.msg === "commonUpload") {
                  publicFileTask['fileChunk.mFile'] = file_chunk_arr[i];
                  if (i === total - 1)
                    publicFileTask['fileChunk.mPreview'] = this.publicFileTask.publicFileInfo.mPreview[0].raw;
                  this.$http({
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                    method: "POST",
                    url: "/task/commonUpload",
                    onUploadProgress: (progressEvent) => {
                      // 表单数据大小
                      let formSize =
                          progressEvent.total - file_chunk_arr[i].size;
                      // 先前已上传的总大小
                      let loaded = std_chunk_size * i + progressEvent.loaded;
                      // 总共的大小
                      let totalSize = file.size + formSize * total;
                      // 剩余的大小
                      // let last = totalSize - loaded;
                      this.percentage = (loaded / totalSize) * 100;
                    },
                    data: publicFileTask,
                  }).then((res) => {
                    if (res.data.msg === "uploadComplete") {
                      this.$refs.ruleForm.resetFields();
                      this.percentage = 0;
                      this.isUploading = false;
                      this.$message({
                        type: "success",
                        message: "上传完成!",
                      });
                      this.getPublicFileTaskList();
                    } else if (res.data.msg === "uploadChunkComplete") {
                      upload(i + 1);
                    } else {
                      this.$message({
                        type: "error",
                        message: "未知错误!",
                      });
                      this.isUploading = false;
                    }
                  });
                } else if (res.data.msg === "quickUpload") {
                  if (i === total - 1)
                    publicFileTask['fileChunk.mPreview'] = this.publicFileTask.publicFileInfo.mPreview[0].raw;
                  this.$http({
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                    method: "POST",
                    url: "/task/quickUpload",
                    onUploadProgress: () => {
                      this.percentage = (i / total) * 100;
                    },
                    data: publicFileTask,
                  }).then((res) => {
                    // 全部上传完成
                    if (res.data.msg === "uploadComplete") {
                      // 清空表单
                      this.$refs.ruleForm.resetFields();
                      this.percentage = 0;
                      this.isUploading = false;
                      this.$message({
                        type: "success",
                        message: "上传完成!",
                      });
                      this.getPublicFileTaskList();
                    } else if (res.data.msg === "uploadChunkComplete") {
                      upload(i + 1);
                    } else {
                      this.$message({
                        type: "error",
                        message: "未知错误!",
                      });
                      this.$forceUpdate();
                      this.isUploading = false;
                    }
                  });
                }
              } else if (res.data.msg === "fileNameRepetitive") {
                this.$message({
                  type: "warning",
                  message: "当前目录下有重名文件!",
                });
                this.isUploading = false;

              } else {
                this.$message({
                  type: "error",
                  message: "未知错误!",
                });
                this.isUploading = false;
                return;
              }
            });
          };
          upload(0);
        }
      };
    },
    deleteTask(rowData){
      this.$http({
        method: 'POST',
        url: '/task/deleteTask',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {tid: rowData.tid},
      }).then(res=>{
        if(res.status === 200) {
          this.$message.success("删除成功！")
          this.getPublicFileTaskList();
        }
      })
    }
  },
  mounted() {
    this.getPublicFileTaskList();
  }
}
</script>

<style scoped>
.el-main {
  text-align: center;
  line-height: 150px;
}
.el-container {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  margin-bottom: 40px;
  margin-top: 5px;
}
/deep/ .el-table .warning-row {
  background: #e6f8fd;
}

/deep/ .el-table .success-row {
  background: #f0f9eb;
}

/deep/ .el-table .error-row {
  background: #fde7e7;
}
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  /*overflow: hidden;*/
}
i.el-icon-plus.avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
  border-radius: 6px;
  border: 2px dashed;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.box-card {
  margin-left: 5px;
  width: 99%;
}
.image-container {
  width: 35px;
  height: 35px;
  overflow: hidden;
  margin-left: 35px;
  border-radius: 5px;
}
.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>