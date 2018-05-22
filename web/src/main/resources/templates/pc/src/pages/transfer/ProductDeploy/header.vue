<template>
    <el-row class="jdy-content-inner-trip pt10 eltabs">
    <el-tabs v-model="activeNameInner" @tab-click="handleClick">
        <el-tab-pane label="线路信息" name="ProductDeployLine"></el-tab-pane>
        <el-tab-pane label="行程信息" name="ProductDeployTrip" v-if="showTrip"></el-tab-pane>
        <el-tab-pane label="预算成本信息" name="ProductDeployCostList"></el-tab-pane>
        <el-tab-pane label="出厂价信息" name="ProductDeployExfactoryPrice"></el-tab-pane>
        <el-tab-pane label="票价信息" name="ProductDeployTicketprice"></el-tab-pane>
        <el-tab-pane label="班期信息" name="ProductDeploySchedule"></el-tab-pane>
        <el-tab-pane label="库存信息" name="ProductDeployInventory"></el-tab-pane>
    </el-tabs>  
    <el-button class="eltabbtn btnInTab" @click="goback">返回</el-button>   
    <el-button class="eltabbtnsave btnInTab" type="primary" @click="savedata" v-show="saveBtnInner">{{title}}</el-button>
    <!-- <el-button class="eltabbtnsave btnInTab" type="primary" @click="savedata" v-show="saveBtnInner">添加成本</el-button> -->
    </el-row>
</template>
<script>
  import api_prefix from '@/assets/js/apiUrl'

  export default {
    data(){
        return {
        //   新参数
        saveBtnInner:this.savebtn,
        activeNameInner:this.activename,
        showTrip:this.showTripTab
        }
    },
    props:{
        activename:String,
        savebtn:Boolean,
        title:String,
        showTripTab:Boolean,
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
            this.$router.push({ name: value.name,query:{id:this.$route.query.id,c_id:this.$route.query.c_id,tripFlag:this.showTrip}})          
        },
        savedata(){
            this.$emit('savedata');
        },
        goback(){
            this.$confirm('即将离开本页面，请确定数据是否已经保存？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$router.push({ name: "ProductDeployList"})
            }).catch(() => {

            });
        },
    },
    mounted(){
        console.log("activeNameInner",this.activeNameInner);
        console.log("saveBtnInner",this.saveBtnInner)
    },
    watch:{
        showTripTab(newValue, oldValue){
            console.log(newValue,'newValue')
            console.log(oldValue,'oldValue')
            this.showTrip = newValue;
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
</style>
