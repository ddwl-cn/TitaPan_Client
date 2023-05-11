<template>
  <el-container style="height: 100%;overflow:hidden;background-color: #f8f8f8;" class="shadow-container">
    <el-menu @select="menuSelected" style="height: 100%">
      <el-card shadow="hover">
        <router-link to="/user/home" >
          <template slot="title">我的文件</template>
          <el-menu-item index="1">
<!--            <el-image-->
<!--                style="width: 30px; height: 30px; margin-right: 5px;margin-bottom: 2px"-->
<!--                :src="require('../assets/icon/'+selected_icon[0][switches[index][0]])"></el-image>-->
            <svg v-if="!switches[index][0]" t="1683788150252" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8121" width="30" height="30"><path d="M1023.8 604.7c0 160.9-129 291.3-287.9 291.3H256.1C113.3 888.5 0.2 781.3 0.2 650.7c0-99.4 65.6-185 159.9-223.5 19.7-8 33.8-25.5 38.2-46.3C224.9 254.9 340.8 160 480 160c102.6 0 192.4 51.5 243.4 129 10 15.3 26.1 25.5 44.2 28.2 145.2 22 256.2 142.1 256.2 287.5z" p-id="8122" fill="#8a8a8a"></path></svg>
            <svg v-else t="1683788150252" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8121" width="30" height="30"><path d="M1023.8 604.7c0 160.9-129 291.3-287.9 291.3H256.1C113.3 888.5 0.2 781.3 0.2 650.7c0-99.4 65.6-185 159.9-223.5 19.7-8 33.8-25.5 38.2-46.3C224.9 254.9 340.8 160 480 160c102.6 0 192.4 51.5 243.4 129 10 15.3 26.1 25.5 44.2 28.2 145.2 22 256.2 142.1 256.2 287.5z" p-id="8122" fill="#11bdfd"></path></svg>
            我的文件</el-menu-item>
        </router-link>
      </el-card>

      <el-card shadow="hover">
        <router-link to="/user/share">
          <template slot="title">我的分享</template>
          <el-menu-item index="2" >
<!--            <el-image-->
<!--                style="width: 30px; height: 30px; margin-right: 5px;margin-bottom: 2px"-->
<!--                :src="require('../assets/icon/'+selected_icon[1][switches[index][1]])"></el-image>-->
            <svg v-if="!switches[index][1]" t="1683787897373" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2441" width="35" height="35"><path d="M456.170667 600.405333l79.808 46.08a42.666667 42.666667 0 1 0 12.266666-17.557333l-81.514666-47.061333a53.290667 53.290667 0 0 0 0-33.066667l77.504-44.736a32 32 0 1 0-10.453334-18.602667l-77.610666 44.8a53.333333 53.333333 0 1 0 0 70.144zM277.333333 213.333333h101.696a85.333333 85.333333 0 0 1 62.250667 26.965334l109.44 116.736A85.333333 85.333333 0 0 0 612.970667 384H746.666667a85.333333 85.333333 0 0 1 85.333333 85.333333v256a85.333333 85.333333 0 0 1-85.333333 85.333334H277.333333a85.333333 85.333333 0 0 1-85.333333-85.333334V298.666667a85.333333 85.333333 0 0 1 85.333333-85.333334z m264.832 21.333334H736a53.333333 53.333333 0 0 1 53.333333 53.333333V320a21.333333 21.333333 0 0 1-21.333333 21.333333h-144.149333a64 64 0 0 1-45.269334-18.752l-51.498666-51.498666A21.333333 21.333333 0 0 1 542.165333 234.666667z" fill="#8a8a8a" p-id="2442"></path></svg>
            <svg v-else t="1683788016587" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2836" width="35" height="35"><path d="M456.170667 600.405333l79.808 46.08a42.666667 42.666667 0 1 0 12.266666-17.557333l-81.514666-47.061333a53.290667 53.290667 0 0 0 0-33.066667l77.504-44.736a32 32 0 1 0-10.453334-18.602667l-77.610666 44.8a53.333333 53.333333 0 1 0 0 70.144zM277.333333 213.333333h101.696a85.333333 85.333333 0 0 1 62.250667 26.965334l109.44 116.736A85.333333 85.333333 0 0 0 612.970667 384H746.666667a85.333333 85.333333 0 0 1 85.333333 85.333333v256a85.333333 85.333333 0 0 1-85.333333 85.333334H277.333333a85.333333 85.333333 0 0 1-85.333333-85.333334V298.666667a85.333333 85.333333 0 0 1 85.333333-85.333334z m264.832 21.333334H736a53.333333 53.333333 0 0 1 53.333333 53.333333V320a21.333333 21.333333 0 0 1-21.333333 21.333333h-144.149333a64 64 0 0 1-45.269334-18.752l-51.498666-51.498666A21.333333 21.333333 0 0 1 542.165333 234.666667z" fill="#11bdfd" p-id="2837"></path></svg>
            我的分享</el-menu-item>
        </router-link>
      </el-card>
      <el-card shadow="hover">
        <router-link to="/user/fileSquare">
          <template slot="title">文件广场</template>
          <el-menu-item index="3">
<!--            <el-image-->
<!--                style="width: 30px; height: 30px; margin-right: 5px;margin-bottom: 2px"-->
<!--                :src="require('../assets/icon/'+selected_icon[2][switches[index][2]])"></el-image>-->
            <svg v-if="!switches[index][2]" t="1683788278044" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11708" width="30" height="30"><path d="M272.60928 122.88H296.96a170.20928 170.20928 0 0 1 170.27072 170.20928v194.56h-194.56A170.20928 170.20928 0 0 1 102.4 317.44v-24.35072A170.20928 170.20928 0 0 1 272.60928 122.88z m0 413.40928h194.56v194.56A170.20928 170.20928 0 0 1 296.98048 901.12h-24.3712A170.20928 170.20928 0 0 1 102.4 730.91072V706.56a170.20928 170.20928 0 0 1 170.20928-170.27072zM686.08 122.88h24.35072A170.20928 170.20928 0 0 1 880.64 293.08928V317.44a170.20928 170.20928 0 0 1-170.20928 170.27072h-194.56v-194.56A170.20928 170.20928 0 0 1 686.05952 122.88h0.02048z m-170.27072 413.40928h194.56A170.20928 170.20928 0 0 1 880.64 706.56v24.35072A170.20928 170.20928 0 0 1 710.43072 901.12H686.08a170.20928 170.20928 0 0 1-170.27072-170.20928v-194.62144z" fill="#8a8a8a" p-id="11709"></path></svg>
            <svg v-else t="1683788278044" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11708" width="30" height="30"><path d="M272.60928 122.88H296.96a170.20928 170.20928 0 0 1 170.27072 170.20928v194.56h-194.56A170.20928 170.20928 0 0 1 102.4 317.44v-24.35072A170.20928 170.20928 0 0 1 272.60928 122.88z m0 413.40928h194.56v194.56A170.20928 170.20928 0 0 1 296.98048 901.12h-24.3712A170.20928 170.20928 0 0 1 102.4 730.91072V706.56a170.20928 170.20928 0 0 1 170.20928-170.27072zM686.08 122.88h24.35072A170.20928 170.20928 0 0 1 880.64 293.08928V317.44a170.20928 170.20928 0 0 1-170.20928 170.27072h-194.56v-194.56A170.20928 170.20928 0 0 1 686.05952 122.88h0.02048z m-170.27072 413.40928h194.56A170.20928 170.20928 0 0 1 880.64 706.56v24.35072A170.20928 170.20928 0 0 1 710.43072 901.12H686.08a170.20928 170.20928 0 0 1-170.27072-170.20928v-194.62144z" fill="#11bdfd" p-id="11709"></path></svg>
            文件广场
          </el-menu-item>
        </router-link>
      </el-card>

      <el-card shadow="hover">
        <router-link to="/user/userInfo">
          <template slot="title">个人中心</template>
          <el-menu-item index="4">
<!--            <el-image-->
<!--                style="width: 30px; height: 30px; margin-right: 5px;margin-bottom: 2px"-->
<!--                :src="require('../assets/icon/'+selected_icon[3][switches[index][3]])"></el-image>-->
            <svg v-if="!switches[index][3]" t="1683788365824" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14437" width="30" height="30"><path d="M665.629952 976.896L54.301952 975.1552A460.9536 460.9536 0 0 1 337.949952 494.848 255.0784 255.0784 0 0 0 512.029952 563.2a254.8736 254.8736 0 0 0 153.6-51.2v464.896zM512.029952 512A256 256 0 1 1 512.029952 0a256 256 0 0 1 0 512z m204.8 0h102.4v51.2h-102.4v-51.2z m0 136.5504h153.6v51.2h-153.6v-51.2z m0 136.4992h204.8v51.2h-204.8v-51.2zM716.829952 921.6h256v51.2h-256v-51.2z" fill="#8a8a8a" p-id="14438"></path></svg>
            <svg v-else t="1683788365824" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14437" width="30" height="30"><path d="M665.629952 976.896L54.301952 975.1552A460.9536 460.9536 0 0 1 337.949952 494.848 255.0784 255.0784 0 0 0 512.029952 563.2a254.8736 254.8736 0 0 0 153.6-51.2v464.896zM512.029952 512A256 256 0 1 1 512.029952 0a256 256 0 0 1 0 512z m204.8 0h102.4v51.2h-102.4v-51.2z m0 136.5504h153.6v51.2h-153.6v-51.2z m0 136.4992h204.8v51.2h-204.8v-51.2zM716.829952 921.6h256v51.2h-256v-51.2z" fill="#11bdfd" p-id="14438"></path></svg>
            个人中心
          </el-menu-item>
        </router-link>
      </el-card>

      <el-card shadow="hover">
        <router-link to="/user/uploadPublicFileMain">
          <template slot="title">分享到公共广场</template>
          <el-menu-item index="5">
<!--            <el-image-->
<!--                style="width: 30px; height: 30px; margin-right: 5px;margin-bottom: 2px"-->
<!--                :src="require('../assets/icon/'+selected_icon[4][switches[index][4]])"></el-image>-->
            <svg v-if="!switches[index][4]" t="1683788502297" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16876" width="30" height="30"><path d="M160 224 240 128 784 128 864 224 160 224ZM640 672 640 800 384 800 384 672 192 672 490.016 361.408C502.144 348.736 521.92 348.768 533.984 361.344L832 672 640 672ZM942.208 229.312 849.792 90.688C840 76 817.792 64 800.256 64L223.744 64C206.56 64 184.032 75.968 174.208 90.688L81.792 229.312C72 244 64 270.368 64 288.064L64 896.288C64 931.52 92.544 960 127.712 960L896.288 960C931.2 960 960 931.488 960 896.288L960 288.064C960 270.048 952.032 244.032 942.208 229.312" p-id="16877" fill="#8a8a8a"></path></svg>
            <svg v-else t="1683788502297" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16876" width="30" height="30"><path d="M160 224 240 128 784 128 864 224 160 224ZM640 672 640 800 384 800 384 672 192 672 490.016 361.408C502.144 348.736 521.92 348.768 533.984 361.344L832 672 640 672ZM942.208 229.312 849.792 90.688C840 76 817.792 64 800.256 64L223.744 64C206.56 64 184.032 75.968 174.208 90.688L81.792 229.312C72 244 64 270.368 64 288.064L64 896.288C64 931.52 92.544 960 127.712 960L896.288 960C931.2 960 960 931.488 960 896.288L960 288.064C960 270.048 952.032 244.032 942.208 229.312" p-id="16877" fill="#11bdfd"></path></svg>
            分享公共文件</el-menu-item>
        </router-link>
      </el-card>
    </el-menu>
    <el-footer style="margin-bottom: 275px;  background-color: #f8f8f8;">
      <el-upload
          class="upload-demo"
          drag
          style="width: 123%;margin-top: 153px;margin-left: -20px"
          action=""
          :on-change="onChange"
          :auto-upload="false"
          :show-file-list="false"
          v-if="isHome()"
          multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: "Navigation",
  data(){
    return {
      index: 0,
      selected_icon: [
        ["home.png", "home-selected.png"],
        ["share.png", "share-selected.png"],
        ["fileSquare.png", "fileSquare-selected.png"],
        ["fileSquare.png", "fileSquare-selected.png"],
        ["fileSquare.png", "fileSquare-selected.png"]
      ],
      // 六种状态
      switches:[[0,0,0,0,0],[1,0,0,0,0],[0,1,0,0,0],[0,0,1,0,0], [0,0,0,1,0],[0,0,0,0,1]],
    }
  },
  components: {},
  methods: {
    isHome(){
      return this.$route.path.endsWith('home') || this.$route.path.endsWith('/');
    },
    onChange(file, fileList){
      var vc = this.$parent.$parent.$parent.$children[1].$children[1].$children[0].$children[0].$children[0].$children[0].$children[0]
      // 借用FileMainHeader中的上传方法即可
      vc.handleSelect(file, fileList);
      // 将el-upload中的文件列表 fileList 重置
      this.$children[1].clearFiles();
    },
    // 菜单被激活
    menuSelected(index){
      this.index = index;
    }
  },
};
</script>

<style scoped>
.router-link-active {
  text-decoration: none;
}
.shadow-container {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  /*background-color: #F3FBFD;*/
}
.el-menu-item{
  width: 100%;
  margin-top: -25px;
}
/*浏览器中寻找 修改一级导航栏浮动颜色*/
.el-submenu__title:hover, .el-menu-item:focus, .el-menu-item:hover{
  background-color: white;
}
.el-menu{
  border-style: none;
  border-radius: 15px;
  /*background-color: #F3FBFD;*/
  background-color: #f8f8f8;
}
/deep/ .el-upload{
  width: 100%;

}
/deep/ .el-upload .el-upload-dragger{
  width: 100%;
  border-style: none;
}
.el-card{
  width: 99%;
  height: 45px;
  margin-bottom: 20px;
}
/*.el-card :hover{*/
/*  background-color: RGB(237,245,254);*/
/*}*/
a {
  text-decoration: none;
  color: black;
}
</style>