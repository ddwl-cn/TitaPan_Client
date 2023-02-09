<template>
  <div style="width: 100%">
    <el-empty
      v-if="fileList.length === 0"
      description="当前文件夹为空快去上传文件吧！"
      style="width: 100%; height: 500px; padding: 0px"
    ></el-empty>
    <el-table
      v-else
      height:500
      :data="fileList"
      :default-sort="{ prop: 'f_size' }"
      @select="handleSelect"
      @select-all="handleSelectAll"
      style="width: 100%;margin-top: 10px;border-radius: 15px;"
      @row-dblclick="preview"
      v-loading="loadingData"
      element-loading-text="数据加载中，请稍等......"
    >
      <el-table-column type="selection" width="55"> </el-table-column>

      <el-table-column width="55">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.isFolder"
            style="width: 30px; height: 30px; margin-top: 8px"
            :src="require('../assets/icon/folder.png')"
            :title="'文件夹'"
          >
          </el-image>
          <el-image
            v-else-if="$FileType.isApk(scope.row.f_name)"
            :src="require('../assets/icon/apk.png')"
            :title="'apk文件'"
          ></el-image>
          <el-image
              v-else-if="$FileType.isPPT(scope.row.f_name)"
              :src="require('../assets/icon/ppt.png')"
              :title="'ppt文档(双击可预览)'"
          ></el-image>
          <el-image
            v-else-if="$FileType.isCode(scope.row.f_name)"
            :src="require('../assets/icon/code.png')"
            :title="'代码文件(双击可预览)'"
          ></el-image>
          <el-image
            v-else-if="$FileType.isImg(scope.row.f_name)"
            fit:cover
            :src="scope.row.preview_url"
            :title="'图片文件(双击可预览)'"
          ></el-image>
          <el-image
            v-else-if="$FileType.isPdf(scope.row.f_name)"
            :src="require('../assets/icon/pdf.png')"
            :title="'pdf文档(双击可预览)'"
          ></el-image>
          <el-image
            v-else-if="$FileType.isWord(scope.row.f_name)"
            :src="require('../assets/icon/word.png')"
            :title="'word文档(双击可预览)'"
          ></el-image>
          <el-image
            v-else-if="$FileType.isExcel(scope.row.f_name)"
            :src="require('../assets/icon/excel.png')"
            :title="'excel文档(双击可预览)'"
          ></el-image>
          <el-image
            v-else-if="$FileType.isCompress(scope.row.f_name)"
            :src="require('../assets/icon/compress.png')"
            :title="'压缩文件(双击可预览)'"
          ></el-image>
          <el-image
              v-else-if="$FileType.isMusic(scope.row.f_name)"
              :src="require('../assets/icon/music.png')"
              :title="'音频文件(双击可预览)'"
          ></el-image>
          <el-image
              v-else-if="$FileType.isVideo(scope.row.f_name)"
              fit:cover
              :src="scope.row.preview_url"
              :title="'视频文件(双击可预览)'"
          ></el-image>
          <el-image
              v-else-if="$FileType.isExe(scope.row.f_name)"
              :src="require('../assets/icon/exe.png')"
              :title="'可执行文件'"
          ></el-image>
          <el-image
            v-else
            :src="require('../assets/icon/other.png')"
            :title="'其他文件'"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="文件名"
        prop="f_name"
        style="height: 15px"
        sortable
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-input
            v-show="scope.row.isEdit"
            size="mini"
            v-model="scope.row.f_name"
            required
            sortable
          />
          <span v-show="!scope.row.isEdit">
            <span v-if="!scope.row.isFolder">{{ scope.row.f_name }}</span>
            <el-link
              type="primary"
              v-if="scope.row.isFolder"
              @click="to(scope.row)"
              >{{ scope.row.f_name }}</el-link
            >
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="最后修改日期"
        prop="upload_date"
        style="height: 15px"
        sortable
        :show-overflow-tooltip="true"
      >
      </el-table-column>

      <el-table-column
        prop="f_size"
        label="文件大小"
        style="height: 15px"
        sortable
      >
        <template slot-scope="scope">
          {{changeFileSize(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column align="right" style="height: 15px">

          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索"
            />
          </template>
        <template slot-scope="scope">
          <div style="float: left">
          <el-button
            type="success"
            size="mini"
            
            @click="
              dialogFormVisible = true;
              temp = scope.row;
            "
            style="margin-right: 10px"
            v-show="!scope.row.isEdit"
          >
            分享
          </el-button>
          <!-- dialog传值有问题 使用中间变量传值 -->
          <el-dialog
            :title="'分享文件：' + temp.f_name"
            :visible.sync="dialogFormVisible"
            align="left"
            width="450px"
          >
            <el-form>
              <el-form-item label="有效期" prop="valid">
                <el-radio-group v-model="shareForm.valid">
                  <el-radio label="1天"></el-radio>
                  <el-radio label="7天"></el-radio>
                  <el-radio label="30天"></el-radio>
                  <el-radio label="永久"></el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="分享码" prop="share_code">
                <el-input
                  type="text"
                  v-model="shareForm.share_code"
                  style="width: 180px; margin-left: 50px"
                  maxlength="6"
                  placeholder="请输入6位分享码"
                />&ensp;仅包含数字和字母
              </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false"
                >取消</el-button
              >
              <el-button type="primary" @click="handleShare(temp)"
                >创建分享链接</el-button
              >
            </div>
          </el-dialog>
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            @click="saveChange(scope.row)"
            v-show="scope.row.isEdit"
            size="mini"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-close"
            circle
            @click="cancelChange(scope.row)"
            v-show="scope.row.isEdit"
            size="mini"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="editFileName(scope.row)"
            v-show="!scope.row.isEdit"
            size="mini"
          ></el-button>
          <!-- 修改名字的时候删除键也得消失 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="deleteFile(scope.row)"
            v-show="!scope.row.isEdit"
            size="mini"
          ></el-button>
          <el-button
            circle
            type="warning"
            icon="el-icon-download"
            size="mini"
            v-show="!scope.row.isEdit"
            @click="downloadFile(scope.row)"
          ></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import streamSaver from "../js/streamSaver.js";
import { v4 as UUID } from "uuid";
export default {
  name: "FileMainContent",
  data() {
    return {
      // 加载中
      loadingData: false,
      /* 表单内嵌dialog会出现scope传值一直为列表最后一个元素的bug 暂时不知道怎么解决 引入额外的变量进行传值*/
      temp: "",
      rowsSelected: [],
      search: "",
      realFiles: [],
      userFiles: [],

      // 分享相关
      dialogFormVisible: false,
      shareForm: {
        uid: 0,
        fid: 0,
        f_name: "",
        folder: false,
        share_code: "",
        share_uuid: "",
        share_date: 0, // 这里不需要获取时间 后端统一获取时间
        expire_date: 0,
        valid: "",
      },
    };
  },
  methods: {
    getUserFileList() {
      this.loadingData = true;
      this.$http({
        method: "GET",
        url: "/user/getUserFileList",
      }).then((res) => {
            if (res.status === 200 && res.data.data) {
              this.userFiles = this.handleFileData(res.data.data);
              this.loadingData = false;
            }
            else if(!res.headers.data){
              this.$message({
                type: "error",
                message: "未知错误!",
              });
              this.loadingData = false;
            }
          }).catch((e) => {
                this.$message({
                  type: "error",
                  message: e,
                  });
                this.loadingData = false;
          })

    },
    changeFileSize(file) {
      var fileSizeByte = file.f_size;
      var fileSizeMsg = "";
      if (fileSizeByte > 0 && fileSizeByte < 1048576)
        fileSizeMsg = (fileSizeByte / 1024).toFixed(1) + "KB";
      else if (fileSizeByte == 1048576) fileSizeMsg = "1MB";
      else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824)
        fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(1) + "MB";
      else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824)
        fileSizeMsg = "1GB";
      else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776)
        fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(1) + "GB";
      else fileSizeMsg = "-";
      return fileSizeMsg;
    },
    handleFileData(fileArr) {
      let resArr = [];
      // 处理后端发来的数据
      fileArr.forEach((e) => {
        let res = {
          uid: 0,
          fid: 0,
          upload_date: "",
          f_name: "",
          old_f_name: "",
          f_size: "",
          isFolder: false,
          isEdit: false,
          preview_url: '',
        };
        res.uid = e.uid;
        res.fid = e.fid;
        res.upload_date = e.upload_date;
        res.f_name = e.f_name;
        res.old_f_name = e.f_name;
        res.f_size = e.f_size;
        res.isFolder = e.folder;
        res.isEdit = false;
        res.preview_url = e.preview_url
        resArr.push(res);
      });

      return resArr;
    },
    editFileName(rowData) {
      this.$set(rowData, "isEdit", true);
    },
    getFileSuffix(fileName) {
      return fileName.substr(fileName.lastIndexOf("."));
    },
    // 该方法用来判定是新建文件夹时的命名还是文件/文件夹的重命名
    saveChange(rowData) {
      if (rowData.isFolder) {
        // 为空说明是新建文件夹
        if (rowData.old_f_name === "") {
          this.createNewFolder(rowData);
          return;
        }
      }
      this.saveFileName(rowData);
    },
    cancelChange(rowData) {
      rowData.isEdit = false;
      // 新建目录取消后过滤掉该目录
      this.userFiles = this.userFiles.filter((item) => {
        return item.old_f_name !== "";
      });
      // 修改文件名取消后 保留原有文件名
      this.userFiles.forEach((item)=>{
        item.f_name = item.old_f_name;
      })
    },
    saveFileName(rowData) {
      if (rowData.f_name === "") {
        this.$message({
          type: "warning",
          message: "文件名不能为空!",
        });
        return;
      }
      if (rowData.f_name === rowData.old_f_name) {
        this.$set(rowData, "isEdit", false);
        return;
      }

      if (
        this.getFileSuffix(rowData.f_name) !==
          this.getFileSuffix(rowData.old_f_name) &&
        !rowData.isFolder
      ) {
        this.$confirm("修改文件后缀可能会导致文件损坏，确定要修改？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$http({
              method: "post",
              url: "/user/updateFileName",
              params: {
                oldName: rowData.old_f_name,
                newName: rowData.f_name,
                isFolder: false,
              },
            }).then((res) => {
              // 修改成功
              if (res.data.msg === "updateFileNameSuccess") {
                // 更新成功
                rowData.old_f_name = rowData.f_name;
                this.$set(rowData, "isEdit", false);
                this.getUserFileList();
              } else if (res.data.msg === "fileNameRepetitive") {
                // 重名不能修改
                rowData.f_name = rowData.old_f_name;
                this.$message({
                  type: "warning",
                  message: "文件名重复!",
                });
              } else {
                this.$message({
                  type: "error",
                  message: "未知错误!",
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "success",
              message: "已取消!",
            });
          });
      } else {
        this.$http({
          method: "post",
          url: "/user/updateFileName",
          params: {
            oldName: rowData.old_f_name,
            newName: rowData.f_name,
            isFolder: true,
          },
        }).then((res) => {
          // 修改成功
          if (res.data.msg === "updateFileNameSuccess") {
            // 更新成功
            rowData.old_f_name = rowData.f_name;
            this.$set(rowData, "isEdit", false);
            this.getUserFileList();
          } else if (res.data.msg === "fileNameRepetitive") {
            // 重名不能修改
            rowData.f_name = rowData.old_f_name;
            this.$message({
              type: "warning",
              message: "文件名重复!",
            });
          } else {
            this.$message({
              type: "error",
              message: "未知错误!",
            });
          }
        });
      }
    },
    deleteFile(rowData) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http({
          method: "post",
          url: "/user/" + (rowData.isFolder ? "deleteFolder" : "deleteFile"),
          params: {
            fileName: rowData.f_name,
          },
        }).then((res) => {
          if (res.data.msg === "deleteFileSuccess") {
            this.getUserFileList();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          } else {
            this.$message({
              type: "error",
              message: "删除失败，请重试!",
            });
          }
        });
      });
    },
    deleteSelected(rows) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let flag = 1;
        let cnt = 0;
        rows.forEach((item) => {
          this.$http({
            method: "post",
            url: "/user/" + (item.isFolder ? "deleteFolder" : "deleteFile"),
            params: {
              fileName: item.f_name,
            },
          }).then((res) => {
            if (res.data.msg !== "deleteFileSuccess") {
              flag = 0;
            }
            cnt++;
            // 最后一个异步请求执行完毕
            if (cnt === rows.length) {
              if (flag) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
              } else {
                this.$message({
                  type: "error",
                  message: "删除失败，请重试!",
                });
              }
              // 更新文件列表
              this.getUserFileList();
            }
          });
        });
      });
    },
    downloadFile(rowData) {
      fetch("http://127.0.0.1:8999/download/single?f_name=" + rowData.old_f_name, { // 使用old_f_name 防止在修改名字的过程中下载该文件
        method: "GET",
        mode: "cors", // 跨域
        credentials: "include",
        headers: {
          token: localStorage.getItem("token"),
        },
      })
        .then((res) => {
          // 创建写入流 filename为下载的文件名
          const fileStream = streamSaver.createWriteStream((rowData.old_f_name + (rowData.isFolder ? ".zip" : "")), {
            size: res.headers.get("content-length"),
          });
          const readableStream = res.body;
          if (window.WritableStream && readableStream.pipeTo) {
            return readableStream.pipeTo(fileStream).then(() => {});
          }
          window.writer = fileStream.getWriter();
          const reader = res.body.getReader();
          const pump = () => reader.read().then((res) =>
                                                  res.done
                                                      ? window.writer.close()
                                                      : window.writer.write(res.value).then(pump)
                                              );
          pump();

        })
        .then((error) => {
          this.$message({
            type: "error",
            message: error.toString(),
          })
        });
    },
    downloadSelected(rows) {
      var flag = false;
      rows.forEach((item) => {
        if(item.isFolder) flag = true;
      });
      if(flag) {
        this.$confirm("所选下载文件包含文件夹，文件夹将以压缩包(.zip)格式返回, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          rows.forEach((item) => {
            this.downloadFile(item);
          });
        })
      }
      else{
        rows.forEach((item) => {
          this.downloadFile(item);
        });
      }

    },
    createFolder() {
      let res = {
        uid: 0,
        fid: 0,
        upload_date: "",
        f_name: "",
        old_f_name: "",
        f_size: "",
        isFolder: true,
        isEdit: true,
      };
      // 插入新建的文件夹
      this.userFiles.unshift(res);
    },
    // 上传操作
    createNewFolder(rowData) {
      this.$http({
        method: "post",
        url: "/user/createFolder",
        params: {
          folderName: rowData.f_name,
        },
      }).then((res) => {
        if (res.status === 200) {
          if (res.data.msg === "createFolderSuccess") {
            rowData.isEdit = false;
            this.getUserFileList();
            return;
          } else if (res.data.msg === "fileNameRepetitive") {
            this.$message({
              type: "warning",
              message: "重复的文件夹名称!",
            });
          } else {
            this.$message({
              type: "warning",
              message: "请确保文件夹命名不为空！!",
            });
          }
        } else {
          this.$message({
            type: "error",
            message: res.statusText,
          });
        }
      });
    },
    to(rowData) {
      // 前端真不会写了....中间有element_ui的组件所以有好几个父组件....直接parent套娃....
      this.$parent.$parent.$parent.toPath(rowData.f_name);
    },
    handleSelect(selections) {
      // 传入已选 和 当前选
      this.rowsSelected = [];
      selections.forEach((item) => {
        this.rowsSelected.push(item);
      });
    },
    handleSelectAll(selections) {
      this.rowsSelected = [];
      selections.forEach((item) => {
        this.rowsSelected.push(item);
      });
    },
    getRowsSelected() {
      return this.rowsSelected;
    },
    handleShare(rowData) {
      this.dialogFormVisible = false;
      this.shareForm.fid = rowData.fid;
      this.shareForm.f_name = rowData.f_name;
      this.shareForm.folder = rowData.isFolder;
      this.shareForm.share_uuid = UUID();
      if(!this.shareForm.valid || (this.shareForm.valid !== '1天' && this.shareForm.valid !== '7天' && this.shareForm.valid !== '30天' && this.shareForm.valid !== '永久')){
        this.$message({
          type: "warning",
          message: "请勾选分享有效时长！"
        })
        return;
      }
      // 正则表达式验证分享码
      var zg =  /^[0-9a-zA-Z]*$/;
      if (!zg.test(this.shareForm.share_code))  {
        this.$message({
          type: "warning",
          message: "必须是长度为6的，且仅包含数字、字母！"
        })
        return;
      }

      this.$http({
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        url: "/share",
        data: this.shareForm,
      }).then((response) => {
        if (response.data.msg === "createShareLinkSuccess") {
          var aux = document.createElement("input");
          let content =
            "访问链接：" + 'http://127.0.0.1:8081/#/user/extract/'+
            this.shareForm.share_uuid +
            ", 提取文件。分享码：" +
            this.shareForm.share_code;
          aux.setAttribute("value", content);
          document.body.appendChild(aux);
          aux.select();
          document.execCommand("copy");
          document.body.removeChild(aux);

          this.$message({
            type: "success",
            message: "创建成功，链接已复制到粘贴板!",
          });
        }
      });
    },
    preview(rowData){
      // 全局加载
      const loading = this.$loading({
        lock: true,
        text: '加载中...如果文件较大这可能需要一段时间......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      this.$http({
        method: 'POST',
        headers: {
          "Content-Type": "multipart/form-data",
        },
        url: '/user/preview',
        data:{
          f_name: rowData.f_name
        }
      }).then((res)=>{
        if(res.status === 200){
          if(res.data.status === 200){
            loading.close();

            window.open("http://127.0.0.1:8012/onlinePreview?url=" + encodeURIComponent(btoa("http://127.0.0.1:8012/" + res.data.data)))
          }
          else{
            loading.close();
            this.$message({
              type: "error",
              message: "未知错误！"
            })
          }
        }
        else{
          loading.close();
          this.$message({
            type: "error",
            message: "未知错误！"
          })
        }
      })
    },
    beforeunloadHandler(){
      this._beforeUnload_time=new Date().getTime();
    },
    unloadHandler(e){
      this._gap_time = new Date().getTime() - this._beforeUnload_time;
      // debugger
      //判断是窗口关闭还是刷新
      if(this._gap_time<=5){
          this.$http({
            url: '/user/resetUserPath',
            method: 'get',
          })
        }
      }
  },
  mounted() {
    // 等待页面渲染完毕 发送请求
    this.$nextTick(() => {
      // 发送请求获取用户文件列表
      this.getUserFileList();
    });

    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    window.addEventListener('unload', e => this.unloadHandler(e))

  },
  destroyed() {
    window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
    window.removeEventListener('unload', e => this.unloadHandler(e))
  },
  computed: {
    fileList() {
      // 返回筛选过过关键词后的文件列表
      return this.userFiles.filter(
        (data) =>
          !this.search ||
          data.f_name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
};
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: center; /*垂直居中*/
  align-items: center;
}
.el-image{
  width: 35px;
  height: 35px;
  margin-top: 8px;
  border-radius: 5px;
}
</style>
