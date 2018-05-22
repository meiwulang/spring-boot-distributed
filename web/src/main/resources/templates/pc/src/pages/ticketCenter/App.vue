<template>
  <div id="app" class="jdy-wrap">
    <jdy-nav></jdy-nav>
    <div id="jdyMain" class="jdy-main fleft" v-loading.fullscreen.lock="fullscreenLoading">
      <div class="jdy-main-scroll">
      <jdy-header></jdy-header>
      <transition>
        <router-view></router-view>
      </transition>
      </div>
    </div>
  </div>
</template>

<script>
import jdyHeader from '@/components/Header'
import jdyNav from '@/components/Nav'
export default {
  name: 'app',
  components: {
    jdyHeader,
    jdyNav
  },
  data(){
    return{
      fullscreenLoading:false,
    }
  },
  created(){
    const vm = this;
    // eventHub.$on('isLoading',function (flage) {
    //   if(flage === 'open'){
    //     vm.fullscreenLoading = true;
    //   }
    //   else if(flage === 'close'){
    //     setTimeout(function () {
    //       vm.fullscreenLoading = false;
    //     },500);
    //   }
    // })
  }
}
</script>

