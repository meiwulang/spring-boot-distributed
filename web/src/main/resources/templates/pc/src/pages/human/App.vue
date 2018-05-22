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
   /* margin-top: 20px;*/
    /* border:0;*/
    *{
      box-sizing: border-box;
    }
    .el-tree-node__expand-icon{
      position: relative;
      z-index: 3;
      width: 10px;
      height: 10px;
    }
    .el-tree-node__content{
      height: auto;
      line-height: 40px;
      position: relative;
      .txtCont{
        // position: relative;
        z-index:2;
        span{
          vertical-align: top;
        }
        span.labelName{
          width:300px;
          display: inline-block;
          height: 40px;
        }
        span.greyFont{
          color: #666;
          position: absolute;
          top: 0;
          left: 485px;
        }
        span.greyFontTwo{
          color: #666;
          position: absolute;
          top: 0;
          left: 685px;
        }
        .iconClass{
          margin-top: 10px;
          margin-right: 5px;
          height: 20px;
          width:20px;
          display: inline-block;
          background-size: 100% 100%;
        }
        .departmentIcon{
           width: 24px;
           background:url("./../../assets/images/department.png") no-repeat 0 0;
        }
        .companyIcon{

          background:url("./../../assets/images/company.png") no-repeat 0 0;
        }
      }
    }
    .level{
      display: inline-block;
      width:100%;
      margin-left: -30px;
      padding-left: 30px;
      .bg{
        position: absolute;
        width: 3000px;
        height: 40px;
        left: -500px;
        top:0;
        border-bottom: 1px solid #f9f9f9;
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
      // float: right;
      position: absolute;
      right: 0;
      top: 0;
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
    .showLeader{
        display: none;
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
