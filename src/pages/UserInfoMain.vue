<template>
  <el-container class="is-vertical shadow-container" style="height: 96%;width: 99%">
    <div style="height: 100%">
      <el-card style="height: 100%">
        <el-descriptions class="margin-top" title="个人信息" :column="2" border>
          <template slot="extra">
            <el-button type="primary" size="small" @click="open()">修改</el-button>
          </template>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-picture-outline"></i>
              头像
            </template>
            <el-image class="avatar-img" :src="userInfo.avatar_url?userInfo.avatar_url:require('../assets/default_avatar.jpg')" alt="" />
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              账户uid
            </template>
            {{ userInfo.uid }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-s-custom"></i>
              昵称
            </template>
            {{ userInfo.nike_name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-odometer"></i>
              年龄
            </template>
            {{ userInfo.age }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-male"></i>
              <i class="el-icon-female"></i>
              性别
            </template>
            <el-tag size="small">{{ userInfo.sex }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-message"></i>
              邮箱Email
            </template>
            <el-tag size="small">{{ userInfo.email }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              手机号码
            </template>
            <el-tag size="small">{{ userInfo.mobilePhoneNumber }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location-outline"></i>
              地区
            </template>
            {{ userInfo.area }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              职业
            </template>
            {{ userInfo.work }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-basketball"></i>
              兴趣爱好
            </template>
            {{ userInfo.hobby }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-magic-stick"></i>
              个性签名
            </template>
            {{ userInfo.design }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-dialog
          title="修改个人信息"
          :visible.sync="dialogVisible"
          width="60%"
          :before-close="handleClose">
        <el-form :model="form" :rules="rules" ref="form" label-width="150px">
          <div class="updateinfo">
            <div class="left">
              <el-form-item label="头像" prop="avatar">
                <el-upload
                    class="avatar-uploader"
                    action=""
                    :show-file-list="false"
                    :on-change="select_avatar">
                  <img style="width:110px;height:110px;border-radius: 50%" :src="form.avatar_url?form.avatar_url:require('../assets/default_avatar.jpg')"/>
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="昵称" prop="nike_name">
                <el-input v-model="form.nike_name"></el-input>
              </el-form-item>
              <el-form-item label="年龄" prop="age">
                <el-input v-model="form.age"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="form.sex">
                  <el-radio label="女"></el-radio>
                  <el-radio label="男"></el-radio>
                  <el-radio label="保密"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email"></el-input>
              </el-form-item>

            </div>
            <div class="right">
              <el-form-item label="用户uid" prop="id">
                <el-input v-model="form.uid" disabled></el-input>
              </el-form-item>
              <el-form-item label="地区" prop="area">
                <el-input v-model="form.area"></el-input>
              </el-form-item>
              <el-form-item label="兴趣爱好" prop="hobby">
                <el-input v-model="form.hobby"></el-input>
              </el-form-item>
              <el-form-item label="职业" prop="work">
                <el-input v-model="form.work"></el-input>
              </el-form-item>
              <el-form-item label="个性签名" prop="design">
                <el-input v-model="form.design"></el-input>
              </el-form-item>
              <el-form-item label="手机号码" prop="mobilePhoneNumber">
                <el-input v-model="form.mobilePhoneNumber"></el-input>
              </el-form-item>
            </div>
          </div>
          <el-form-item style="float: right">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="submit">提 交</el-button>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
  </span>
      </el-dialog>
    </div>
  </el-container>
</template>

<script>
export default {
  name: "UserInfo",
  data(){
    return {
      userInfo: {

      },
      dialogVisible: false,
      form: {
      },
      rules: {
        nike_name: [
          { required: true, message: "昵称不能为空", trigger: "blur" },
          { min: 4, max: 20, message: "用户名长度应为6-20个字符", trigger: "blur" }
        ],
        email: [
          { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱', trigger: 'blur' }
        ],
        mobilePhoneNumber: [
          { pattern: /^1[345678]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        design: [
          { max: 200, message: "长度不应超过200个字符", trigger: "blur" }
        ],
        hobby: [
          { max: 50, message: "长度不应超过50个字符", trigger: "blur" }
        ],
        age: [
          { pattern: /^(?:\d|[1-9]\d|1\d{2}|200)$/, message: '请输入正确的年龄', trigger: 'blur' }
        ],
        work: [
          { max: 30, message: "长度不应超过30个字符", trigger: "blur" }
        ]
      },
    }
  },
  mounted() {
    this.getUserInfo();
  },
  methods:{
    getUserInfo() {
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
    open() {
      this.form = JSON.parse(JSON.stringify(this.userInfo));
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
      this.form = {}
      // this.$emit("flesh");
    },
    submit(){
      this.$refs.form.validate(valid => {
        if (valid) {
          // 表单验证通过，提交表单
          this.$http({
            method: 'POST',
            url: "/user/updateUserInfo",
            headers: {
              "Content-Type": "multipart/form-data",
            },
            data: this.form
          }).then(res => {
            if(res.status === 200){
              if(res.data.msg === 'updateUserInfoSuccess'){
                this.handleClose();
                this.getUserInfo();
                this.$message({type:'success', message:'更新成功！'});
                this.$parent.$parent.$parent.$parent.$children[0].$children[0].getUserInfo()
              }
              else{
                this.$message({type:'warning', message:'更新失败，请重试！'});
              }
            }
          })
        } else {
          // 表单验证不通过，阻止表单提交
          // console.log("表单验证不通过");
        }
      });
    },
    select_avatar(file, fileList){
      this.form.avatar_url = URL.createObjectURL(file.raw);
      this.form['avatar'] = file.raw;
    }
  }
}
</script>

<style scoped>
.shadow-container {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  margin-top: 5px;
}
.avatar-img {
  width: 60px;
  height: 60px;
  border-radius: 50%
}
.updateinfo {
  height: 450px;
  overflow: auto;
}
.left {
  /* width: 330px; */
  float: left;
}
.right {
  overflow: hidden;
}

</style>