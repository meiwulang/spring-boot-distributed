<template>
    <div class="jdy-header clearfix relative">
        <!-- <span class="header-nav-icon inlineblock absolute navicon"></span> -->
        <!--<span class="header-info-icon inlineblock absolute"></span>-->
        <el-dropdown @command="handleCommand" style="right: 20px;top: 23px;" class="inlineblock absolute">
          <span class="el-dropdown-link">
            &nbsp;<span class="header-tx-icon inlineblock absolute" style="right: 44px;top: -7px;"></span>
          </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="personal" style="font-size: 14px; height: 30px;" class="ml10 mr10">个人中心</el-dropdown-item>
          <el-dropdown-item command="exit" style="font-size: 14px; height: 30px;" class="ml10 mr10">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
        <div class="jdy-bread">
            <a :href="indexUrl" title="" class="">首页</a>
            <span v-for="(item,index) in titleList">
              <span class="fgx">/</span>
              <span class="blue" v-if="index+1==titleList.length">{{getTitle(item.meta)}}</span>
              <a title="" @click="getUrl(item)" v-else href="javascript:;"> {{getTitle(item.meta)}}</a>
            </span>
        </div>
    </div>
</template>
<script>
  import api_prefix from '@/assets/js/apiUrl'

  export default {
      data(){
          return {
              isCollapse:true,
              indexUrl:api_prefix.index_url,
            param : this.$route.query,
              titleList:[],      //面包屑list
              titleConditionType:{         //以url中的参数为基础，根据路由中titleTyoe的条件判断获取不同的title
                  "null":(_param)=>{
                      console.log(_param);
                      console.log(this.param);
                      console.log(!this.param.hasOwnProperty(_param));
                         return !this.param.hasOwnProperty(_param);
                  },
                  "notNull":(_param)=>{
                    return this.param.hasOwnProperty(_param);
                  },
                "equal":(_param,value)=>{
                    if(!this.param.hasOwnProperty(_param)){
                        throw new Error("current page's url has no param with name "+_param);
                    }else{
                        return this.param[_param] == value
                    }
                }
              }
          }
      },
    methods:{
          getUrl(item){
            let urlNeedQuery = item.meta.query;
            let query = {};
            if(urlNeedQuery){
                let _query = this.$route.query;
                for(let i = 0 ; i < urlNeedQuery.length; i++){
                    let name = urlNeedQuery[i];
                    if(_query[name]){
                      query[name] = _query[name];
                    }else{
                        throw new Error("child url named "+this.$route.path+" do not  has param ：["+name+"]");
                    }
                }
            }
            this.$router.push({name:item.name,query:query})
          },
      getTitle(meta){
          if(meta.title){
              return meta.title;
          }else if(meta.titles){
              console.log( meta.titles,' meta.titles');
              for(let i = 0 ; i < meta.titles.length; i++){
                  let _title = meta.titles[i];
                  if(this.isConditionsTrue(_title.conditions)){
                    console.log(_title.conditions,' meta.titles');
                      return _title.title
                  }
              }
              return "——"
          }
      },
      isConditionsTrue(conditions){
          for(let i = 0 ; i < conditions.length;i++){
            let condition = conditions[i];
              if(!this.titleConditionType[condition.type](condition.param,condition.value)){
                  return false;
              }
          }
          return true;
      },

      handleCommand(command){
          if(command=='exit'){
            sessionStorage.clear();
            this.$http.get(api_prefix.api_prefix + "user/logout").then(response => {
                console.log(111,response);
                // location.href = "/login.html#/"
                // if(response.body.code==0){
                    location.href = "/login.html#/"
                // }else{
                //     this.$message.info("登出失败")
                // }
            },response => {
                
            });
          }else if(command=='personal'){
            window.location.href = "/personal.html#/"
          }
      },
      modifyRoute(){
        this.param = this.$route.query,
        this.titleList = [];
        let currentUrl=location.href;
        let routers = this.$router.options.routes;
        routers.forEach(router =>{
          if(currentUrl.indexOf(router.path)!=-1){
            this.titleList.push(router);
          }
        });
      }
    },
    mounted(){
        this.modifyRoute();
      },
    watch: {
      // 如果路由有变化，会再次执行该方法
      "$route": "modifyRoute"
    }
  }
</script>
