<template>
  <div style="width: 100%;height: 100%" @contextmenu="rightClick_" @mousedown="mouseClick($event)">
    <div id="contextmenu"
         v-show="menuVisible"
         class="menu">
      <div class="contextmenu__item"
           v-if="CurrentRow"
           @click="editFileName(CurrentRow)"><i class="el-icon-edit" style="margin-right: 10px;"></i>重命名</div>
      <div class="contextmenu__item"
           v-if="CurrentRow"
           @click="downloadFile(CurrentRow)"><i class="el-icon-download" style="margin-right: 10px;"></i>下载</div>
      <div class="contextmenu__item"
           v-if="!CurrentRow"
           @click="createFolder()"><i class="el-icon-folder-add" style="margin-right: 10px;"></i>新建文件夹</div>
      <div class="contextmenu__item"
           v-if="CurrentRow"
           @click="copyFile(CurrentRow)"><i class="el-icon-document-copy" style="margin-right: 10px;"></i>复制</div>
      <div class="contextmenu__item"
           v-if="CurrentRow"
           @click="cutFile(CurrentRow)"><i class="el-icon-document-remove" style="margin-right: 10px;"></i>剪切</div>
      <div class="contextmenu__item"
           @click="pasteFile(CurrentRow)"><i class="el-icon-tickets" style="margin-right: 10px;"></i>粘贴</div>
      <div class="contextmenu__item"
           v-if="CurrentRow"
           @click="deleteFile(CurrentRow)"><i class="el-icon-document-delete" style="margin-right: 10px;"></i>删除</div>
    </div>

<!--    <el-empty-->
<!--        v-if="fileList.length === 0"-->
<!--        description="当前文件夹为空快去上传文件吧！"-->
<!--        style="width: 100%; height: 500px; padding: 0"-->
<!--    ></el-empty>-->
    <el-table
        height="99%"
        :data="fileList"
        :default-sort="{ prop: 'f_size' }"
        @select="handleSelect"
        @select-all="handleSelectAll"
        style=" margin-top: 10px;border-radius: 15px;"
        @row-contextmenu="rightClick"
        v-loading="loadingData"
        element-loading-text="数据加载中，请稍等......"
    >
      <el-table-column type="selection" width="55"> </el-table-column>

      <el-table-column width="55">
        <template slot-scope="scope">
          <div class="image-container">
            <img
                v-if="scope.row.isFolder"
                :src="require('../assets/icon/folder.png')"
                :title="'文件夹'"
            />
            <img
                v-else-if="$FileType.isApk(scope.row.f_name)"
                :src="scope.row.preview_url?scope.row.preview_url:require('../assets/icon/apk.png')"
                :title="'apk文件'"
            />
            <img
                v-else-if="$FileType.isPPT(scope.row.f_name)"
                :src="scope.row.preview_url?scope.row.preview_url:require('../assets/icon/ppt.png')"
                :title="'ppt文档(点击可预览)'"
            >
            <img
                v-else-if="$FileType.isCode(scope.row.f_name)"
                :src="scope.row.preview_url?scope.row.preview_url:require('../assets/icon/code.png')"
                :title="'代码文件(点击可预览)'"
            >
            <img
                v-else-if="$FileType.isImg(scope.row.f_name)"
                fit:cover
                :src="scope.row.preview_url"
                :title="'图片文件(点击可预览)'"
            >
            <img
                v-else-if="$FileType.isPdf(scope.row.f_name)"
                :src="scope.row.preview_url?scope.row.preview_url:require('../assets/icon/pdf.png')"
                :title="'pdf文档(点击可预览)'"
            >
            <img
                v-else-if="$FileType.isWord(scope.row.f_name)"
                :src="scope.row.preview_url?scope.row.preview_url:require('../assets/icon/word.png')"
                :title="'word文档(点击可预览)'"
            >
            <img
                v-else-if="$FileType.isExcel(scope.row.f_name)"
                :src="scope.row.preview_url?scope.row.preview_url:require('../assets/icon/excel.png')"
                :title="'excel文档(点击可预览)'"
            >
            <img
                v-else-if="$FileType.isCompress(scope.row.f_name)"
                :src="scope.row.preview_url?scope.row.preview_url:require('../assets/icon/compress.png')"
                :title="'压缩文件(点击可预览)'"
            >
            <img
                v-else-if="$FileType.isMusic(scope.row.f_name)"
                :src="scope.row.preview_url?scope.row.preview_url:require('../assets/icon/music.png')"
                :title="'音频文件(点击可预览)'"
            >
            <img
                v-else-if="$FileType.isVideo(scope.row.f_name)"
                fit:cover
                :src="scope.row.preview_url"
                :title="'视频文件(点击可预览)'"
            >
            <img
                v-else-if="$FileType.isExe(scope.row.f_name)"
                :src="scope.row.preview_url?scope.row.preview_url:require('../assets/icon/exe.png')"
                :title="'可执行文件'"
            >
            <img
                v-else
                :src="scope.row.preview_url?scope.row.preview_url:require('../assets/icon/other.png')"
                :title="'其他文件'"
            >
          </div>
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
              @keyup.enter.native="saveChange(scope.row)"
              required
              sortable
          />
          <span v-show="!scope.row.isEdit">
            <span v-if="!scope.row.isFolder">
              <el-link type="info" :underline="false" @click="preview(scope.row)">
              {{ scope.row.f_name }}
              </el-link>
            </span>
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
      <el-table-column align="right" style="height: 15px" width="350">

        <template slot="header" slot-scope="scope">
          <el-input
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索"
              class="input-with-select"
          >
            <el-select v-model="fileType" @change="getUserFileList" collapse-tags slot="prepend" placeholder="请选择" style="width: 100px">
              <el-option label="全部" value="0"></el-option>
              <el-option label="文件夹" value="1"></el-option>
              <el-option label="图片" value="2"></el-option>
              <el-option label="视频" value="3"></el-option>
              <el-option label="文档" value="4"></el-option>
              <el-option label="压缩文件" value="5"></el-option>
              <el-option label="其他" value="6"></el-option>
            </el-select>
          </el-input>
        </template>
        <template slot-scope="scope">
          <div style="float: left">
            <el-button
                type="success"
                size="mini"
                icon="el-icon-share"
                @click="
              dialogFormVisible = true;
              temp = scope.row;
            "
                style="margin-right: 10px;"
                v-show="!scope.row.isEdit"
            >
              分享
            </el-button>
            <!-- dialog传值有问题 使用中间变量传值 -->
            <el-dialog
                :title="'分享文件：' + temp.f_name"
                :visible.sync="dialogFormVisible"
                align="left"
                width="500px"
            >
              <el-card>
                <el-form>
                  <el-form-item label="有效期" prop="valid">
                    <el-radio-group v-model="shareForm.valid">
                      <el-radio label="1天"></el-radio>
                      <el-radio label="7天"></el-radio>
                      <el-radio label="30天"></el-radio>
                      <el-radio label="永久"></el-radio>
                    </el-radio-group>
                  </el-form-item>

                  <el-form-item label="" prop="share_code">
                    分享码：
                    <el-input
                        type="text"
                        v-model="shareForm.share_code"
                        style="width: 180px; padding-bottom: 10px"
                        maxlength="6"
                        placeholder="请输入6位分享码"
                    />&ensp;仅包含数字和字母
                  </el-form-item>
                </el-form>
              </el-card>
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
                @click="handleDownloadFile(scope.row)"
            ></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import streamSaver from '../js/streamSaver.js'

import { v4 as UUID } from "uuid";
export default {
  name: "FileMainContent",
  data() {
    return {
      downloadList: {},

      fileType: '全部',
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

      // 右键菜单
      menuVisible:false,
      CurrentRow: null,
      flag: 0,
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
        else{
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
      console.log(rowData)
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
    handleDownloadFile(rowData) {
      if(rowData.isFolder) {
        this.$confirm("所选下载文件包含文件夹，文件夹将以压缩包(.zip)格式返回, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
            this.downloadFile(rowData);
        })
      }
      else{
          this.downloadFile(rowData);
      }
    },
    downloadFile(rowData) {
      // // 加入下载列表
      // this.downloadList[rowData.fid] = rowData;
      // this.downloadList[rowData.fid]['percentage'] = 0.0;
      // // axios 请求下载要等下载完成后浏览器才会弹出列表
      // this.$http({
      //   responseType: 'blob',
      //   url:`/download/single?f_name=` + rowData.old_f_name,
      //   onDownloadProgress: progressEvent => {
      //     // 更新百分比
      //     this.downloadList[rowData.fid]['percentage'] = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      //     // 下载完成提示
      //     if(progressEvent.loaded >= progressEvent.total){
      //       this.$notify({
      //         title: '文件：' + rowData.old_f_name,
      //         message: this.$createElement('i', {style: 'color: teal'}, '下载完成！'),
      //         duration: 5000
      //       });
      //     }
      //   },
      // }).then(response => {
      //   const url = window.URL.createObjectURL(new Blob([response.data]))
      //   const link = document.createElement('a')
      //   link.href = url
      //   link.setAttribute('download', rowData.old_f_name + (rowData.isFolder ? ".zip" : ""))
      //   document.body.appendChild(link)
      //   link.click()
      // }).catch(error => {
      //   this.$message.error("网络错误：" + error.message);
      // })

      fetch(`${this.$global.host}:${this.$global.serverport}/download/single?f_name=` + rowData.old_f_name, { // 使用old_f_name 防止在修改名字的过程中下载该文件
        method: "POST",
        mode: "cors", // 跨域
        credentials: "include",
        headers: {
          token: localStorage.getItem("token"),
        },
      }).then((res) => {
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
            const pump = () => reader.read().then((res) => {
              res.done
                  ? window.writer.close()
                  : window.writer.write(res.value).then(pump)
              }
            );
            pump();
          })
          .then(() => {
            this.$notify({
              title: '文件：' + rowData.old_f_name,
              message: this.$createElement('i', {style: 'color: teal'}, '下载完成！'),
              duration: 5000
            });
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
      let flag = false;
      this.userFiles.forEach((item) => {
        if(item.fid === 0) flag = true;
      });
      if(flag) return;
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
      var zg =  /^[a-zA-Z0-9]{6}$/;
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
              "访问链接：" + `${this.$global.host}:${this.$global.clientport}/#/user/extract/`+
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
      if(rowData.isFolder) return;
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

            window.open(`${this.$global.host}:${this.$global.previewport}/onlinePreview?url=` + encodeURIComponent(btoa(`${this.$global.host}:${this.$global.previewport}/` + res.data.data)))
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
    },
    copyFile(rowData){
      this.$http({
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        url: "/user/copy",
        data: {f_name: rowData.f_name},
      }).then(res=>{
        if(res.status === 200){
          if(res.data.msg === "copyFileSuccess"){
            this.$message.success("已复制到粘贴板！");
          }
          else{
            this.$message.error("复制出错！");
          }
        }
        else{
          this.$message.error("未知错误！");
        }
      })
    },
    cutFile(rowData){
      this.$http({
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        url: "/user/cut",
        data: {f_name: rowData.f_name},
      }).then(res=>{
        if(res.status === 200){
          if(res.data.msg === "cutFileSuccess"){
            this.$message.success("已剪切到粘贴板");
          }
          else{
            this.$message.error("剪切出错！");
          }
        }
        else{
          this.$message.error("未知错误！");

        }
      })
    },
    pasteFile(rowData){
      this.$http({
        method: "GET",
        url: "/user/paste",
      }).then(res=>{
        if(res.status === 200){
          if(res.data.msg === "pasteFileSuccess"){
            this.$message.success("粘贴成功");
            this.getUserFileList();
          }
          else if(res.data.msg === "fileNameRepetitive"){
            this.$message.warning("有重名文件！");
          }
          else if(res.data.msg === "pasteRecursive"){
            this.$message.warning("剪切位置不能为被剪切文件的子路径！");
          }
        }
        else{
          this.$message.error("未知错误！");
        }
      })
    },
    rightClick_(event) {
      // 如果菜单已被激活说明点击的是表格行 直接退出
      if(this.flag !== 0) return;
      this.CurrentRow = null;
      this.menuVisible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
      this.menuVisible = true // 显示模态窗口，跳出自定义菜单栏
      event.preventDefault() //关闭浏览器右键默认事件
      var menu = document.querySelector('.menu')
      this.styleMenu(event, menu)
    },
    rightClick(row, column, event) {
      this.flag = 1;// 激活菜单
      this.testModeCode = row?row.testModeCode:row;
      this.menuVisible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
      this.menuVisible = true // 显示模态窗口，跳出自定义菜单栏
      event.preventDefault() //关闭浏览器右键默认事件
      this.CurrentRow = row
      var menu = document.querySelector('.menu')
      this.styleMenu(event, menu)
    },
    foo() {
      // 取消鼠标监听事件 菜单栏
      this.menuVisible = false;
      this.CurrentRow = null;
      this.flag = 0;
      document.removeEventListener('click', this.foo) // 关掉监听，
    },
    styleMenu(event, menu) {
      if (event.clientX > 1200) {
        menu.style.left = event.clientX - 100 + 'px'
      } else {
        menu.style.left = event.clientX + 1 + 'px'
      }
      document.addEventListener('click', this.foo) // 给整个document新增监听鼠标事件，点击任何位置执行foo方法
      if (event.clientY > 550) {
        menu.style.top = event.clientY - 60 + 'px'
      } else {
        menu.style.top = event.clientY - 10 + 'px'
      }
    },
    fileTypeValue(file){
      if(file.isFolder) return '1';
      if(this.$FileType.isImg(file.f_name))
        return '2';
      if(this.$FileType.isVideo(file.f_name))
        return '3';
      if(this.$FileType.isPPT(file.f_name) || this.$FileType.isWord(file.f_name)
          || this.$FileType.isExcel(file.f_name) || this.$FileType.isPdf(file.f_name))
        return '4'
      if(this.$FileType.isCompress(file.f_name))
        return '5';

      return '6';
    },
    mouseClick(event){

      if(event.button === 0) {
        // console.log(event)
        // this.flag = 0;
        // this.CurrentRow = null;
        // this.menuVisible = false;
      }
      else if(event.button === 2) {
        this.flag = 0;
        this.CurrentRow = null;
        this.menuVisible = false;
      }
    }
  },
  mounted() {
    // 等待页面渲染完毕 发送请求
    this.$nextTick(() => {
      // 发送请求获取用户文件列表
      this.getUserFileList();
    });

    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e));
    window.addEventListener('unload', e => this.unloadHandler(e));

  },
  destroyed() {
    window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
    window.removeEventListener('unload', e => this.unloadHandler(e))
  },
  computed: {
    fileList() {
      // 返回筛选过过关键词后的文件列表

      return this.userFiles.filter((data) =>
          !this.search || data.f_name.toLowerCase().includes(this.search.toLowerCase()))
      .filter((data) =>(this.fileType==="全部" || this.fileType==="0") || this.fileTypeValue(data) === this.fileType);
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
  width: 25px;
  height: 25px;
  margin-top: 8px;
  border-radius: 5px;
}
.image-container {
  width: 35px;
  height: 35px;
  overflow: hidden;
  border-radius: 5px;
}
.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


.contextmenu__item {
  display: block;
  line-height: 34px;
  text-align: center;
}
.contextmenu__item:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.menu {
  position: absolute;
  background-color: #fff;
  width: 100px;
  /*height: 106px;*/
  font-size: 12px;
  color: #444040;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  white-space: nowrap;
  z-index: 1000;
}
.contextmenu__item:hover {
  cursor: pointer;
  background: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}

.el-select .el-input {
  margin-top: 15px;
  width: 130px;
}
.input-with-select {
  background-color: white;
}
</style>