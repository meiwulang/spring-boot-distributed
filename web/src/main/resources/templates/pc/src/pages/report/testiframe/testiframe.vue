<template>
  <div class="jdy-content fleft">
    <div class="jdy-content-inner">
        <iframe id="show-iframe"  frameborder=0 name="showHere" scrolling=auto src="https://baidu.com"></iframe>
    </div>
  </div>
  <!--jdy-content end-->
</template>

<script>
  import reportApi from './../api/index';
  import {validateTime} from '@/assets/js/validate.js';
  export default {
    name: 'agentReturnReport',
    data() {
      return {

      }
    },
    mounted() {

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



