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
<style>
  .dialog-lv .el-select{
    position: absolute;
    height: 37px;
  }
  .dialog-lv .el-form-item__content{
  }
  .dialog-lv .jdyalert-title{
    margin-top: -1px;
  }
  .alertDeparturePlace .el-input{

  }
  .alertDeparturePlace .jdyalert-title{
    margin-top: -1px;
  }
  .alertDeparturePlace .el-select{
    height: 37px;
  }
  .alertTag .scroll-cont{
    min-height:180px;
    max-height: 580px;
    overflow-y: auto;
  }
  .dialog-upload-pic .jdyalert-title{
    margin-top: -1px;
  }
  .dialog-upload-pic .inlineblock{
    line-height: 36px;
    height: 38px;
  }
  .dialog-upload-pic .el-select{
    height: 37px;
  }
</style>
