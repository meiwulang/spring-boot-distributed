<template>
    <div class="whereboxwrap relative">
        <div class="el-input">
            <input autocomplete="off" v-model="dwhere" placeholder="请选择城市" type="text" class="el-input__inner" @click="showWhere" readonly="readonly">
        </div>
        <i class="el-input__icon el-icon-caret-top f14" style="transform: rotateZ(180deg)" @click="showWhere"></i>
        <div class="wherebox absolute" v-if="whereboxFlag">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="热门" name="whnav0">
                    <ul class="paneul">
                        <li @click="setActive(item,index,0)" :wid="item.id" v-for="(item,index) in whnavData0" >{{item.name}}</li>
                    </ul>
                </el-tab-pane>
                <el-tab-pane label="ABC" name="whnav1">
                    <ul class="paneul">
                        <li @click="setActive(item,index,1)" :wid="item.id" v-for="(item,index) in whnavData1">{{item.name}}</li>
                    </ul>
                </el-tab-pane>
                <el-tab-pane label="DEF" name="whnav2">
                    <ul class="paneul">
                        <li @click="setActive(item,index,2)" :wid="item.id" v-for="(item,index) in whnavData2">{{item.name}}</li>
                    </ul>
                </el-tab-pane>
                <el-tab-pane label="GHJ" name="whnav3">
                    <ul class="paneul">
                        <li @click="setActive(item,index,3)" :wid="item.id" v-for="(item,index) in whnavData3" >{{item.name}}</li>
                    </ul>
                </el-tab-pane>
                <el-tab-pane label="KLM" name="whnav4">
                    <ul class="paneul">
                        <li @click="setActive(item,index,4)" :wid="item.id" v-for="(item,index) in whnavData4" >{{item.name}}</li>
                    </ul>
                </el-tab-pane>
                <el-tab-pane label="NPQ" name="whnav5">
                    <ul class="paneul">
                        <li @click="setActive(item,index,5)" :wid="item.id" v-for="(item,index) in whnavData5" >{{item.name}}</li>
                    </ul>
                </el-tab-pane>
                <el-tab-pane label="RST" name="whnav6">
                    <ul class="paneul">
                        <li @click="setActive(item,index,6)" :wid="item.id" v-for="(item,index) in whnavData6" >{{item.name}}</li>
                    </ul>
                </el-tab-pane>
                <el-tab-pane label="WXYZ" name="whnav7">
                    <ul class="paneul">
                        <li @click="setActive(item,index,7)" :wid="item.id" v-for="(item,index) in whnavData7" >{{item.name}}</li>
                    </ul>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeName: 'whnav0',
            whereboxFlag: false,
            whnavData0:[
                {
                    "name":"上海",
                    "id":"1"
                },
                {
                    "name":"北京",
                    "id":"2"
                }
            ],
            whnavData1:[
                {
                    "name":"上海",
                    "id":"1"
                },
                {
                    "name":"北京",
                    "id":"2"
                }
            ],
            whnavData2:[],
            whnavData3:[],
            whnavData4:[],
            whnavData5:[],
            whnavData6:[],
            whnavData7:[],
            dwhere:this.where
        }
    },
    props: {
        where:String    
    },
    methods: {
        showWhere() {
            this.whereboxFlag = !this.whereboxFlag;
        },
        handleClick(tab, event) {
            this.getWhereData()
        },
        getWhereData() {
            console.log(this.activeName)
        },
        setActive(item,index,num) {
            var that = this;
            $('.paneul li').removeClass('active');
            $('.paneul').eq(num).find('li').eq(index).addClass('active');
            this.dwhere = item.name;
            this.$emit('input',item.name);
            this.$nextTick(function(){
                 //this.whereboxFlag = false;   
                
            })
            setTimeout(function(){
                 that.whereboxFlag = false;   
            },50)
        }
    }
}
</script>

<style>

</style>
