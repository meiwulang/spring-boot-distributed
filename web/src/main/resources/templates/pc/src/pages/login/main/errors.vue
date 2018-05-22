<template>
    <div class="main">
        <div id="bgimg"></div>
        <div>
            <el-button class="erbtn" id="refresh" @click="refresh">刷新</el-button>
        </div>
        <div>
            <el-button class="erbtn" @click="backindex">返回首页</el-button>
        </div>
    </div>
</template>

<script>

export default {
    name:"error",
    data() {
        return {

        }
    },
    methods:{
        // 返回首页
        backindex(){
            location.href=index_url
        },
        // 刷新
        refresh(){

        }
    },
    mounted(){

    }
}
</script>

<style>

</style>
