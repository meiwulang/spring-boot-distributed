<template>
  <div id="app" class="jdy-wrap">
    <jdy-nav></jdy-nav>
    <div id="jdyMain" class="jdy-main fleft">
      <div class="jdy-main-scroll">
      <jdy-header></jdy-header>
      <transition>
        <!--<keep-alive include="agentReturnReport">
          <router-view></router-view> 保存缓存
        </keep-alive>-->
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
  }
}
</script>
<style>
.table-alignC table th .cell,.table-alignC table td .cell{
  text-align: center;
}
</style>
