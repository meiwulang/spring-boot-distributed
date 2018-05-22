<template>
    <div class="jdy-content">
        <div class="showtfcityaa">
            <div class="showtfcityaa-scroll">
                <div class="showtfcityaa-i">
                    <div class="showtfcityaaa" v-for="(value,key) in proviceArr">
                        <div class="showtfcityaaa-head plr10 clearfix">
                            <span>{{key}}</span>
                            <el-button  class="hsbtnbg2 fright mt15 allSelect" size="small">全选</el-button>
                            <el-button  class="hsbtnbg2 fright mt15 mr10 allCancel" size="small">取消全选</el-button>
                        </div>
                        <div class="showtfcityaaa-content plr10 clearfix">
                            <span v-for="ccitem in value" :dataId="ccitem.id" v-bind:class="{'showtfcityaaa-span':true,'active':selectCityArr.name.indexOf(ccitem.name)!=-1}">{{ccitem.name}}</span>                            
                        </div>
                        <!--<div class="hide">
                            <span v-for="ccitem in value" class="taCountry" v-show="false">{{ccitem.type}}</span>
                            <span v-for="ccitem in value" class="taProvince" v-show="false">{{ccitem.pName}}</span>    
                        </div>-->
                    </div>
                </div>
            </div>
        </div>
        <div class="alertfoot1 clearfix">
            <el-button type="primary" class="ml10 mt10 mr10" @click="saveCC">保存</el-button>
            <el-button type="primary" class="mt10 mr10" @click="selectAllAll" id="selectAll">全选</el-button>
            <el-button type="primary" class="mt10 mr10" @click="removeAll">取消全选</el-button>        
        </div>        
    </div>
</template>

<script>
import jdyAlert from '@/components/Alert';
export default {
    name: 'putcity',
    data() {
        return{
            /*投放城市相关*/
            selectCityArr:{id:[],name:[]},
            proviceArr:{},
            submitArr:[], //用于表单提交
        }
    },
    methods:{
        saveCC(){ // 保存投放城市
            this.selectCityArr = jdyFn.selectCity2(); //数据不是时时更新，只有保存的时候才赋值
            this.selectCityArr.id.forEach((data)=>{
                this.submitArr.push({id:data,isopen:true})
            });
            // 获取未选中元素
            let unselect=$('.showtfcityaaa-content span:not(.active)'),unselid=[];
            unselect.each(function(){
                var id = $(this).attr('dataId');
                unselid.push(Number.parseInt(id));
            });
            unselid.forEach((data)=>{
                this.submitArr.push({id:data,isopen:false})
            });            
            this.$http.post(api_prefix + 'City/openCities',this.submitArr).then(response => {
                if(response.data.code==0){
                    this.$message.success("投放城市设置成功");                   
                }else{
                    this.$message.error("投放城市设置失败");
                    $(".showtfcityaaa-span.active").removeClass("active");
                };
            });            
        },
        removeAll(){ //投放城市弹出框刷新
            $(".showtfcityaaa-span.active").removeClass("active");
        },
        selectAllAll(){ //投放城市全选按钮
            $('.showtfcityaaa-content span').addClass('active');
        },
        defaultProviceArr(){ //获取所有城市列表
            this.$http.post(api_prefix + 'City/selectCityPutList',{}).then(response => {
                this.proviceArr=response.body.body;                                   
                this.$nextTick(()=>{
                    jdyFn.selectCity2();                    
                    // 如果isopen为true，则修改背景色
                    for(var key in this.proviceArr){
                        let tempArr=this.proviceArr[key].filter(data=>{
                            return data.isopen==true
                        })
                        if(tempArr.length!=0){
                            tempArr.forEach((data)=>{
                                this.selectCityArr.id.push(data.id);
                                this.selectCityArr.name.push(data.name);
                            })
                        }
                    };                    
                });                  
            });
        },  
    },
    mounted() {
        this.defaultProviceArr()
    },    
    components: {
        jdyAlert
    }
}
</script>
<style scoped>
.showtfcityaa{
    max-height: 5000px;
}
.showtfcityaa-scroll{
    height: auto;
    overflow-y:hidden
}
.showtfcityaaa{
    width:95%;
}
.showtfcityaa-i{
    height: auto;
}
.alertfoot1{
    margin-top: 15px;
}
</style>

