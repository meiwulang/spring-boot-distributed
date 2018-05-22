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
import jdyHeader from '@/components/Header';
import jdyNav from '@/components/Nav';

export default {
  name: 'app',
  components: {
    jdyHeader,
    jdyNav
  }
}
</script>

<style lang="less">
  .lab label{
    background-color: #edf4f8;
  }
  .table-custom tr td .sele .el-input__inner{
    width: 350px;
    height: 30px;
  }
  .jdy-tab h2{
    padding-left: 10px;
    font-size: 16px;
    line-height: 60px;
  }
  .orgTree{
    overflow: hidden;
    margin-top: 30px;
    /* border:0;*/
    *{
      box-sizing: border-box;
    }
    .el-tree-node__expand-icon{
      position: relative;
      z-index: 3;
    }
    .el-tree-node__content{
      height: auto;
      line-height: 40px;
      .greyFont{
        color: #666;
      }
    }
    .level{
      display: inline-block;
      width:100%;
      margin-left: -25px;
      padding-left: 25px;
      position: relative;
      .bg1{
        position: absolute;
        left: -50%;
        top:0;
        width: 150%;
        height: 100%;
        z-index: 1;
      }
      .bgColor1{
        background-color: #f9fafc;
      }
      .txtCont1{
        position: relative;
        z-index: 3;
      }
    }
    .level0{
      background-color: #f9fafc;
      border-bottom: 1px solid #d7dfe3;
    }
    .is-current{
      .level{
        .bgColor{
          background-color: #edf7ff;
        }
      }
      .level0{
        background-color: #edf7ff;
      }
    }
    .btnWrap{
      float: right;
      .el-button{
        padding: 4px 6px;
        margin-top: 5px;
        margin-right: 10px;
        display: none;
      }
    }
    .showBtn{
      .el-button{
        display: inline-block;
      }
    }
  }
  .dialogOrg {
    .el-form{
      .el-form-item__content{
        line-height: normal;
      }
      .el-input {
        width: 100%;
        height: 36px;
      }
      .el-select{
        height: 37px;
      }
    }
  }
  .yjk-orderList table th,.yjk-orderList table td{
    text-align: center;
  }

</style>
