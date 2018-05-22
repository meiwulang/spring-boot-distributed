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
      // let inner_url=location.host=="b2b.fingercrm.cn"?"http://cm.fingercrm.cn/":"http://tuyi.dev.fingercrm.cn/";
      // this.srczj=inner_url+"sn-manage.html#/app/sn-center?uid="+logindata.userId;
      this.srczj=cardHostUrl+"shp-card-web/user/userAuth?uid="+logindata.userId+"&redirect="+cardRedirectUrl+"sn-manage.html#/app/sn-center"
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



