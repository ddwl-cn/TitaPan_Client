<template>
  <div>
    <el-empty
      v-if="shareList.length === 0"
      description="你还没有分享文件，快去分享吧！"
      style="width: 100%; height: 500px; padding: 0px"
    ></el-empty>
    <el-table
        v-else
        height:500
        :data="
        shareList.filter(
          (data) =>
            !this.search ||
            data.f_name.toLowerCase().includes(this.search.toLowerCase())
        )
      "
        :default-sort="{ prop: 'f_name' }"
        style="width: 100%;border-radius: 15px;"
    >
      <el-table-column
          label="文件名"
          prop="f_name"
          style="height: 15px"
          sortable
          :show-overflow-tooltip="true"
      >
      </el-table-column>

      <el-table-column
          label="文件位置"
          prop="storage_path"
          style="height: 15px"
          sortable
          width="320px"
          :show-overflow-tooltip="true"
      >
      </el-table-column>

      <el-table-column
          label="过期时间"
          prop="expire_date"
          style="height: 15px"
          sortable
          :show-overflow-tooltip="true"
          width="200px"
      >
      </el-table-column>

      <el-table-column
          label="状态"
          prop="status"
          style="height: 15px"
          sortable
          width="80px"
          :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
          prop="share_code"
          label="分享码"
          style="height: 15px"
          sortable
          width="120px"
      >
      </el-table-column>
      <el-table-column align="right" style="height: 15px" width="220px">
        <template slot="header">
          <el-input v-model="search" size="mini" placeholder="搜索指定文件"/>
        </template>
        <template slot-scope="scope">
          <el-button
              type="primary"
              icon="el-icon-document-copy"
              @click="copyShareLink(scope.row)"
              size="mini"
          >复制分享链接
          </el-button
          >
          <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteShareLink(scope.row)"
              size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "ShareContent",
  data() {
    return {
      search: "",
      shareList: [],
    };
  },
  methods: {
    judgeDate(formatDate_1, formatDate_2) {
      console.log(formatDate_1, formatDate_2)
      if (
          parseInt(formatDate_1.substr(0, 4)) >
          parseInt(formatDate_2.substr(0, 4))
      )
        return true;
      else if (parseInt(formatDate_1.substr(0, 4)) <
          parseInt(formatDate_2.substr(0, 4)))
        return false;
      if (
          parseInt(formatDate_1.substr(5, 2)) >
          parseInt(formatDate_2.substr(5, 2))
      )
        return true;
      else if (parseInt(formatDate_1.substr(5, 2)) <
          parseInt(formatDate_2.substr(5, 2)))
        return false;
      if (
          parseInt(formatDate_1.substr(8, 2)) >
          parseInt(formatDate_2.substr(8, 2))
      )
        return true;
      else if (parseInt(formatDate_1.substr(8, 2)) <
          parseInt(formatDate_2.substr(8, 2)))
        return false;
      if (
          parseInt(formatDate_1.substr(11, 2)) >
          parseInt(formatDate_2.substr(11, 2))
      )
        return true;
      else if (parseInt(formatDate_1.substr(11, 2)) <
          parseInt(formatDate_2.substr(11, 2)))
        return false;
      if (
          parseInt(formatDate_1.substr(14, 2)) >
          parseInt(formatDate_2.substr(14, 2))
      )
        return true;
      return false;
    },
    formatDateTimeForHMSS(obj) {
      if (obj == null) {
        return null;
      }
      let date = new Date(obj);
      let y = 1900 + date.getYear();
      let m = "0" + (date.getMonth() + 1);
      let d = "0" + date.getDate();
      let h = "0" + date.getHours();
      let mm = "0" + date.getMinutes();
      let s = date.getSeconds();
      if (s.toString().length < 2) {
        s = "0" + s;
      }
      return (
          y +
          "-" +
          m.substring(m.length - 2, m.length) +
          "-" +
          d.substring(d.length - 2, d.length) +
          " " +
          h.substring(h.length - 2, h.length) +
          ":" +
          mm.substring(mm.length - 2, mm.length) +
          ":" +
          s
      );
    },
    getShareList() {

      this.$http({
        method: "GET",
        url: "/getShareList",
      }).then((response) => {
        if (
            response.data.msg === "getShareListSuccess" &&
            response.data.data !== null
        ) {
          this.shareList = response.data.data;
          this.shareList.forEach((item) => {
            if (item.valid === "永久") item.expire_date = "永久有效";

            let date = new Date();
            date = this.formatDateTimeForHMSS(date);

            let isValid =
                (this.judgeDate(item.expire_date, date) === true || item.expire_date === "永久有效")
                    ? "有效"
                    : "已过期";


            this.$set(item, "status", isValid);
          });
        } else {
          this.$message({
            type: "error",
            message: "未知错误！",
          });
        }
      });
    },
    copyShareLink(rowData) {
      var aux = document.createElement("input");
      let content =
          "访问链接：" + "http://127.0.0.1:8081/#/user/extract/" +
          rowData.share_uuid +
          ", 提取文件。分享码：" +
          rowData.share_code;
      aux.setAttribute("value", content);
      document.body.appendChild(aux);
      aux.select();
      document.execCommand("copy");
      document.body.removeChild(aux);

      this.$message({
        type: "success",
        message: "链接已复制到粘贴板!",
      });
    },
    deleteShareLink(rowData) {

      this.$http({
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        url: "/deleteShareLink",
        data: {
          share_id: rowData.share_id,
        },
      }).then((response) => {
        if (response.data.msg === "deleteShareLinkSuccess") {
          this.getShareList();
          this.$message({
            type: "success",
            message: "删除成功！",
          });
        } else {
          this.$message({
            type: "error",
            message: "未知错误！",
          });
        }
      });
    },
  },
  components: {},
  mounted() {
    this.getShareList();
  },
};
</script>

<style scoped></style>
