<template>
  <div class="jdy-content fleft">
    <div class="jdy-content-inner">
        <iframe id="show-iframe"  frameborder=0 name="showHere" scrolling="auto" :src="srczj"></iframe>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    data() {
      return {
        srczj:''
      }
    },
    mounted() {
      let logindata = JSON.parse(sessionStorage.loginData);
      console.log('status',process.env.NODE_ENV);
      this.srczj=inner_host+"auth/login?source=erp&uid="+logindata.userId
      console.log(this.srczj,'this.srczj')
      // if(process.env.NODE_ENV==='realproduction'){
      //   this.srczj="http://sp.fingercrm.cn/dypc/shp/index?redirect=/zpam/view&uid="+logindata.userId;
      // }else{
      //   this.srczj="http://zjdev.fingercrm.cn/dypc/shp/index?redirect=/zpam/view&uid="+logindata.userId;
      // }   
    },
    methods: {

    }

  }


</script>
<style scoped>
#show-iframe{
    width: 100%;
    height: 850px;
}
</style>



