<template>
  <div id="jdyNav" class="jdy-nav fleft">
    <div class="logo">
      <img src="../assets/images/logo-sp.png" v-if="showBig" style="width:100%">
      <img src="../assets/images/logo.png" v-else-if="showSmall" style="width:100%">
    </div>
    <!-- <ul>
      <li v-for="(item,index) in htmlData" class="navli">
        <div>
          <div class="jdy-nav-title clearfix noMouse" :class="item.mEnName" >
            <a class="inlineblock navicon " :href="item.mUrl + item.children[0].mUrl.substr(1)" style="width:196px" v-loading.fullscreen.lock="fullscreenLoading">{{item.mName}}</a>
          </div>
          <ul class="jdy-nav-childul">
            <div class="jdy-nav-title2">{{item.mName}}</div>
            <li v-for="citem in item.children">
                <a title="" class="inlineblock" :class="item.mEnName" :href="item.mUrl+citem.mUrl.substr(1)" v-loading.fullscreen.lock="fullscreenLoading">{{citem.mName}}</a>
            </li>
          </ul>
        </div>
      </li>
    </ul> -->
    <!-- <el-radio-group v-model="isCollapse" @click="changeBtn" style="margin-bottom: 20px;" class="header-nav-icon inlineblock absolute navicon">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group> -->
    <div class="changeBtn">
      <!-- <span class="header-nav-icon inlineblock navicon" @click="changeBtn"></span> -->
      <a href="javascript:;"><img src="../assets/images/smallNav.png" v-if="showSmall" @click="changeBtn"></a>
      <a href="javascript:;"><img src="../assets/images/bigNav.png" v-if="showBig" @click="changeBtn"></a>
    </div>
    <el-menu :default-active="activeDataF" :default-openeds="activeArry" class="el-menu-vertical-demo" @select="select" :router="true" @open="handleOpen" @close="handleClose" :collapse="isCollapse" unique-opened theme="dark">
      <el-submenu :index="item.mUrl" :key="index" v-for="(item,index) in htmlData">
        <template slot="title">
          <i :class="item.mEnName"></i>
          <div :class="item.mEnName">
            <span slot="title" class="navicon inlineblock" style="padding-left:35px;font-size:12px;">{{item.mName}}</span>
            <div slot="title" class="navicon inlineblock smallNav" style="padding-left:35px" v-if="showSmall == true"></div>
            <!-- <span slot="title">导航一</span> -->
          </div>
        </template>
        <el-menu-item-group :key="cindex" v-for="(citem,cindex) in item.children">
          <el-menu-item :index="citem.mUrl.substr(1)" style="font-size:12px;" :class="{'is-active': citem.mUrl.substr(1) == activeDataTwo}">{{citem.mName}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import '@/assets/js/Global'
export default {
  name: "nav",
  props: {
    navArr: Array
  },
  data() {
    return {
      activeDataF:'',
      activeArry:[],
      activeData:'',
      activeDataTwo:'',
      isCollapse:false,
      showBig:true,
      showSmall:false,
      showBigLogo:true,
      showSmallLogo:false,
      fullscreenLoading:false,
      companyType: JSON.parse(sessionStorage.loginData).cType,
      msg: "nav",
      flag: false,
      htmlData: [
        {
          mName: "",
          mEnName: "",
          mUrl: "",
          children: [
            {
              mName: "",
              mUrl: ""
            }
          ]
        }
      ],
    };
  },
  methods: {
    select(key, keyPath){
      console.log(keyPath);
      this.activeDataTwo = ''
      if( keyPath[0] != (location.pathname + '#/')){
        location.href = location.origin + keyPath[0] + keyPath[1];
      }else{
        this.$router.push({name:keyPath[1]})
      } 
      console.log($(this))
      console.log(location.href,'aaaaa')
    },
    handleClose(key, keyPath){
      let logindata = JSON.parse(sessionStorage.loginData);
      if( keyPath[0] == '/buyerCenter.html#/'){
        let inner_host=location.host=="b2b.fingercrm.cn"?"http://sopin.fingercrm.cn/":"http://sp.test.fingercrm.cn/";
        window.open(inner_host+"auth/login?source=erp&uid="+logindata.userId)
      }
    },
    handleOpen(key, keyPath){
      let logindata = JSON.parse(sessionStorage.loginData);
      if( keyPath[0] == '/buyerCenter.html#/'){
        let inner_host=location.host=="b2b.fingercrm.cn"?"http://sopin.fingercrm.cn/":"http://sp.test.fingercrm.cn/";
        window.open(inner_host+"auth/login?source=erp&uid="+logindata.userId)
      }
    },
    changeBtn(){
      var w = $(window).width(),
          h = $(window).height();
        if (w <= 1200) {
            w = 1200;
        }
        if (h <= 600) {
            h = 600
        }
        if((h - 163) < 500){
          $(".el-menu").css({'max-height':'400px','overflow-y':'scroll','overflow-x':'hidden'})
        }
      if(this.isCollapse == false){
        $("#jdyNav").stop().animate({width:'64px'},300,function(){
          this.showBigLogo = false;
          this.showSmallLogo = true;
        });
        $(".jdy-main").stop().animate({width:(w-64)+'px'},300);
        $(".jdy-header").stop().animate({width:(w-64)+'px',left:'64px'},300);
        $(".el-submenu__icon-arrow").hide()
          this.showBig = false;
          this.showSmall = true;
        this.isCollapse = !this.isCollapse;
      }else{
        $("#jdyNav").stop().animate({width:'200px'},300,function(){
          this.showBigLogo = true;
          this.showSmallLogo = false;
        });
        $(".jdy-main").stop().animate({width:(w-200)+'px'},300);
        $(".jdy-header").stop().animate({width:(w-200)+'px',left:'200px'},300);
        $(".el-submenu__icon-arrow").hide()
          this.showBig = true;
          this.showSmall = false;
        this.isCollapse = !this.isCollapse;
      }
    },
    getHtml() {
      this.$http.post(api_prefix + "/user/authorization").then(
        response => {
          let data = response.data.body;
          this.htmlData = data.menus;
          window.menuData = data.buttonClassNames;
        },
        response => {
          console.log("出错了");
        }
      );
    },
    
  },
  mounted() {
    this.activeData = location.pathname + '#/'
    this.activeDataTwo = location.hash.substr(2)
    this.activeDataF = this.activeDataTwo
    this.activeArry = [this.activeData,this.activeDataTwo]
    jdyFn.setNavActive();
    this.fullscreenLoading = true;
    this.getHtml();
    jdyFn.setStyle();
  }
};
</script>
<style scoped>
  /* .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  } */
  @media screen and (max-height:650px){
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
      max-height: 455px;
      overflow-y: scroll;
      overflow-x: hidden;
    }
  }
  @media screen and (min-height:650px) and (max-height:730px){
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
      max-height: 530px;
      overflow-y: scroll;
      overflow-x: hidden;
    }
  }
</style>


