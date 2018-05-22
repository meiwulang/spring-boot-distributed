<template>
  <div id="app" class="jdy-wrap">
    <jdy-nav></jdy-nav>
    <div id="jdyMain" class="jdy-main fleft">
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
  }
}
</script>