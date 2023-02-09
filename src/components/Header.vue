<template>
  <el-container class="header-main-container">
    <div class="avatar-right">

      <div>

        <el-popover
            placement="left-start"
            title=""
            width="200"
            @show="getUserInfo()"
            trigger="hover">
          <el-avatar  slot="reference" :size="50">
            <el-image :src="require('../assets/default_avatar.jpg')"></el-image>
          </el-avatar>
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <p :title='userInfo.nike_name'>你好！{{userInfo.nike_name}}</p>
              </div>
<!--              <el-link class="text item" style="display: block; text-align: center">-->
<!--                上传头像-->
<!--              </el-link>-->
              <el-button type="danger" style="margin-left: 45px;" icon="el-icon-switch-button" size="mini">登出</el-button>
            </el-card>
        </el-popover>
      </div>
    </div>
  </el-container>
</template>

<script>
export default {
  name: "Header",
  data(){
    return {
      userInfo: {},
    }
  },
  methods:{
    getUserInfo(){
      this.$http({
        method: "GET",
        url: "/user/getUserInfo",
      }).then((res)=>{
        if(res.status === 200){
          if(res.data.msg === 'getUserInfoSuccess'){
            this.userInfo = res.data.data;
          }
        }
      })
    },
    logout(){
      this.$http({
        method: "GET",
        url: "/logout",
      }).then((res)=>{
        if(res.status === 200){
          if(res.data.msg === 'logoutSuccess'){
            this.userInfo = {};
            localStorage.removeItem("token");
            this.$router.go(0);
          }
        }
      })
    }

  },
  mounted() {

  },
  computed:{

  }
};
</script>

<style scoped>
.header-main-container{
  height: 90px;
  width: 103%;
  margin-left: -20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);

}
.avatar-right{
  text-align:right;
  margin:auto 5% auto 95%;

}
.el-avatar{
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.6);
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
.clearfix{
  height: 10px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 480px;
}
p{
  width: 12em;
  display: inline-block;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  margin-top: -5px;
}
/*.avatar-right div{*/
/*  width: 80px;*/
/*  height: 80px;*/
/*  margin-right: 10px;*/
/*  background-color: red;*/
/*  float: right;*/
/*}*/
</style>
