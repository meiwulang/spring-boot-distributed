<template>
    <el-row class="jdy-content-inner-trip p15 eltabs">
    <el-tabs v-model="activeNameInner" @tab-click="handleClick">
        <el-tab-pane label="线路信息" name="declareConfigLine"></el-tab-pane>
        <el-tab-pane label="行程信息" name="declareConfigTrip" v-if="showTrip"></el-tab-pane>
        <el-tab-pane label="预算成本信息" name="declareConfigAddCostList"></el-tab-pane>
        <el-tab-pane label="出厂价信息" name="declareConfigTicketPrice"></el-tab-pane>
        <el-tab-pane label="班期信息" name="declareConfigSchedule"></el-tab-pane>
    </el-tabs>  
    <el-button class="eltabbtn btnInTab" @click="goback">返回</el-button>   
    <el-button class="eltabbtnsave btnInTab" type="primary" @click="savedata" v-show="saveBtnInner">{{title}}</el-button>
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
        showTripTab:Boolean,
        title:{
            type: String,
            default: "保存"            
        }
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
        handleClick(value,event){
            if(this.$route.query.copyId){
                this.$router.push({ name: value.name,query:{id: this.$route.query.copyId,c_id:this.$route.query.c_id,tripFlag:this.showTrip}}) 
            }else{
                this.$router.push({ name: value.name,query:{id: this.$route.query.id,c_id:this.$route.query.c_id,tripFlag:this.showTrip}}) 
            }
                      
        },
        savedata(){
            this.$emit('savedata');
        },
        goback(){
            this.$router.push({ name: "declareConfig"})
            // this.$confirm('数据未保存，是否返回？', '温馨提示', {
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     type: 'warning'
            // }).then(() => {
                
            // }).catch(() => {

            // });
        },
    },
    mounted(){
        // console.log("activeNameInner",this.activeNameInner);
        // console.log("saveBtnInner",this.saveBtnInner)
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

<style scoped>
.eltabs{
  position: relative;
}
.eltabbtn{
  position: absolute;
  right: 25px;
  bottom: 45px;
}
.eltabbtnsave{
  position: absolute;
  right: 125px;
  bottom: 45px;  
}
</style>
