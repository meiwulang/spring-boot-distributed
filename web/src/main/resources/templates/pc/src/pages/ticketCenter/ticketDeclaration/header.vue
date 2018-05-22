<template>
    <el-row class="jdy-content-inner-trip pt10 eltabs">
    <el-tabs v-model="activeNameInner" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="ticketDeclarationInformation"></el-tab-pane>
        <el-tab-pane label="出厂价信息" name="ticketDeclarationPrice" v-if="btnInTabFlag"></el-tab-pane>
    </el-tabs>  
    <el-button class="eltabbtn btnInTab" @click="goback">返回</el-button>   
    <el-button class="eltabbtnsave btnInTab" type="primary" @click="savedata" v-show="saveBtnInner">{{title}}</el-button>
    <el-button class="eltabbtnsaveTwo btnInTab" type="primary" @click="savedataTwo" v-show="saveBtnInnerTwo">{{titleTwo}}</el-button>
    </el-row>
</template>
<script>
  import api_prefix from '@/assets/js/apiUrl'

  export default {
    data(){
        return {
        //   新参数
        saveBtnInner:this.savebtn,
        saveBtnInnerTwo:this.savebtnTwo,
        activeNameInner:this.activename,
        btnInTabFlag:this.showBtnInTab
        }
    },
    props:{
        activename:String,
        savebtn:Boolean,
        savebtnTwo:Boolean,
        title:String,
        titleTwo:String,
        showBtnInTab:Boolean
    },      
    methods:{
        /**
         * @description 产品配置通用头组件
         * @todo 
         * 1.切换tab页跳转功能
         * 2.active显示
         * 3.返回
         * 4.保存（部分显示）
        */
        handleClick(value){
            this.$router.push({ name: value.name,query:{id:this.$route.query.id}})          
        },
        savedata(){
            this.$emit('savedata');
        },
        savedataTwo(){
            this.$emit('savedataTwo');
        },
        goback(){
            this.$confirm('即将离开本页面，请确定数据是否已经保存？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$router.push({ name: "ticketDeclarationList"})
            }).catch(() => {

            });
        },
    },
    mounted(){
        console.log("activeNameInner",this.activeNameInner);
        console.log("saveBtnInner",this.saveBtnInner)
    },
    watch:{
        showBtnInTab(newValue, oldValue){
            console.log(newValue,'newValue')
            console.log(oldValue,'oldValue')
            this.btnInTabFlag = newValue;
        }
    }
  }
</script>

<style scope="scope">
.eltabs{
  position: relative;
}
.eltabbtn{
  position: absolute;
  right: 0;
  bottom: 25px;
}
.eltabbtnsave{
  position: absolute;
  right: 100px;
  bottom: 25px;  
}
.eltabbtnsaveTwo{
  position: absolute;
  right: 200px;
  bottom: 25px; 
}
</style>
